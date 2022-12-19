<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-form
      ref="form"
      v-model="formValid"
      :lazy-validation="false"
      @submit.prevent="() => submitFn()"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  v-model="localItem.facilityType"
                  :items="facilityTypes"
                  label="Facility type"
                  name="type"
                  type="string"
                  item-text="name"
                  item-value="componentName"
                  required
                  :rules="rules"
                  @input="onItemTypeChange"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="localItem.name"
                  label="Facility name"
                  :disabled="!isNewMode"
                  required
                  :rules="rulesName"
                ></v-text-field>
              </v-col>
              <component
                :is="localItem.facilityType"
                v-if="
                  localItem.facilityType !== '' &&
                  localItem.facilityType !== notPoweredName
                "
                :edit-mode="!isNewMode"
                :facilities-name="facilitiesName"
                :facility.sync="localItem"
              />
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              () => {
                isOpen = false;
              }
            "
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            type="submit"
            :disabled="!formValid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import {
  computeCO2Cost,
  computeDieselPower,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import DieselGenerators from "@/components/green_house_gaz/energy/DieselGenerators.vue";
import {
  Facility,
  facilityTypes,
  notPoweredName,
} from "@/components/green_house_gaz/energy/Facility";
import HybridMix from "@/components/green_house_gaz/energy/HybridMix.vue";
import NationalGrid from "@/components/green_house_gaz/energy/NationalGrid.vue";
import RenewableEnergy from "@/components/green_house_gaz/energy/RenewableEnergy.vue";
import { GreenHouseGaz } from "@/store/GhgInterface.vue";
import { IgesItemInterface } from "@/store/GhgReferenceIgesGridModule";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";
import { VForm } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
  },
  methods: {
    ...mapActions("GhgReferenceModule", {
      syncDBGhg: "syncDB",
      closeDBGhg: "closeDB",
      getAllDocsGhg: "getAllDocs",
    }),
    ...mapActions("GhgReferenceIgesGridModule", {
      syncDBGhgIgesGrid: "syncDB",
      closeDBGhgIgesGrid: "closeDB",
      getAllDocsGhgIgesGrid: "getAllDocs",
    }),
  },
  components: {
    DieselGenerators,
    NationalGrid,
    RenewableEnergy,
    HybridMix,
  },
})
export default class FacilityDialog extends Vue {
  @Prop({ required: true, type: Boolean, default: false })
  dialogOpen!: boolean;
  @Prop({ required: false, type: [Number, String], default: -1 })
  itemIndex!: number | string;
  @Prop({ required: false, type: Object, default: () => ({} as Facility) })
  item!: Facility;
  @Prop({ required: true, type: Array, default: () => [] })
  readonly facilitiesName!: string[];

  $refs!: {
    form: VForm;
  };
  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;

  ghgMapRef!: ItemReferencesMap;
  syncDBGhg!: () => null;
  closeDBGhg!: () => Promise<null>;
  getAllDocsGhg!: () => Promise<ReferenceItemInterface[]>;

  syncDBGhgIgesGrid!: () => null;
  closeDBGhgIgesGrid!: () => Promise<null>;
  getAllDocsGhgIgesGrid!: () => Promise<IgesItemInterface[]>;

  references!: ReferenceItemInterface[];

  formValid = false;
  localItem: Facility | null = null;

  @Watch("item", { immediate: true, deep: true })
  onItemChange(value: Facility): void {
    this.localItem = cloneDeep(value);
  }

  notPoweredName = notPoweredName;
  facilityTypes = facilityTypes;

  rules = [(v: string): boolean | string => !!v || `Required`];

  public alreadyExist(name: string): boolean | string {
    return (
      this.facilitiesName.indexOf(name) === -1 || "facility name already exist"
    );
  }
  public get rulesName(): Rule[] {
    const results = [(v: string): boolean | string => !!v || `Required`];
    if (this.isNewMode) {
      // check unicity only if not in edit mode
      results.push(this.alreadyExist);
    }
    return results;
  }

  get isOpen(): boolean {
    return this.dialogOpen;
  }

  set isOpen(value: boolean) {
    this.$emit("update:dialogOpen", value);
  }

  public get isNewMode(): boolean {
    return this.itemIndex === -1;
  }
  public get title(): string {
    return this.isNewMode ? "New facility" : "Edit facility";
  }

  public async submitFn(): Promise<void> {
    if (!this.localItem) {
      return Promise.resolve();
    }

    this.localItem.totalCO2Emission = computeCO2Cost(
      this.localItem,
      this.ghgMapRef?.REF_DIES,
      this.ghgMapRef?.REF_WSH_D_L,
      this.project_REF_GRD
    );
    this.localItem.dieselPower = computeDieselPower(
      this.localItem,
      this.ghgMapRef?.REF_EFF_DIES
    );
    this.$emit("update:item", this.localItem);
    this.isOpen = false;
  }

  public validate(): void {
    this.$refs.form.validate();
  }
  public reset(): void {
    this.$refs.form.reset();
  }
  public resetValidation(): void {
    this.$refs.form.resetValidation();
  }

  onItemTypeChange(): void {
    // set to default
    if (this.localItem) {
      this.localItem.gridPower = 0;
      this.localItem.dieselLiters = 0;
      this.localItem.renewablePower = 0;
      this.localItem.totalCO2Emission = 0;
    }
    this.validate();
  }

  public mounted(): void {
    this.syncDBGhg();
    this.getAllDocsGhg();

    this.syncDBGhgIgesGrid();
    this.getAllDocsGhgIgesGrid();
  }

  public destroyed(): void {
    this.closeDBGhg();
    this.closeDBGhgIgesGrid();
  }
}

export type Rule = (value: string) => boolean | string;
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
