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
                  v-model="localItem.name"
                  :items="facilities"
                  label="Facility name"
                  name="type"
                  item-value="name"
                  item-text="name"
                  type="string"
                  required
                  :rules="rules"
                  @change="selectFacility"
                />
              </v-col>
            </v-row>
            <v-row v-if="localItem.itemType !== ''">
              <v-col>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="localItem.description"
                      label="Intervention description"
                    ></v-text-field>
                  </v-col>
                  <diesel-generator-without-litres
                    :facility.sync="localItem"
                    select-text="New generator"
                  />
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model.number="localItem.gridPower"
                      type="number"
                      required
                      :rules="rules"
                      :min="0"
                      label="kWh used per year (national grid)"
                    />
                  </v-col>
                  <renewable-energy
                    :facility.sync="localItem"
                    :country-code="countryCode"
                  />
                </v-row>
              </v-col>
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
import DieselGeneratorWithoutLitres from "@/components/green_house_gaz/energy/DieselGeneratorWithoutLitres.vue";
import RenewableEnergy from "@/components/green_house_gaz/energy/RenewableEnergy.vue";
import { computeChangeInEmission } from "@/components/green_house_gaz/generic/changeInEmission";

import {
  EnergyFacilityInterventionItem,
  EnergyFacilityItem,
  GreenHouseGaz,
} from "@/store/GhgInterface.vue";
import { IgesItemInterface } from "@/store/GhgReferenceIgesGridModule";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";
import { checkRequired, Rule } from "@/utils/rules";
import { VForm } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
    ...mapGetters("GhgReferenceIgesGridModule", ["iges_grid"]),
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
    DieselGeneratorWithoutLitres,
    RenewableEnergy,
  },
})
export default class InterventionDialog extends Vue {
  @Prop({ required: true, type: Boolean, default: false })
  readonly dialogOpen!: boolean;
  @Prop({ required: false, type: [Number, String], default: -1 })
  readonly itemIndex!: number | string;
  @Prop({
    required: false,
    type: Object,
    default: () => ({} as EnergyFacilityInterventionItem),
  })
  readonly item!: EnergyFacilityInterventionItem;

  @Prop({ type: Array, default: () => [] })
  readonly facilities!: EnergyFacilityItem[];
  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: string;

  $refs!: {
    form: VForm;
  };

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;
  syncDBGhg!: () => null;
  closeDBGhg!: () => Promise<null>;
  getAllDocsGhg!: () => Promise<ReferenceItemInterface[]>;

  syncDBGhgIgesGrid!: () => null;
  closeDBGhgIgesGrid!: () => Promise<null>;
  getAllDocsGhgIgesGrid!: () => Promise<IgesItemInterface[]>;

  ghgMapRef!: ItemReferencesMap;
  iges_grid!: IgesItemInterface[];

  formValid = false;
  localItem: EnergyFacilityInterventionItem | null = null;
  selectedFacility: EnergyFacilityItem | null = null;

  @Watch("item", { immediate: true, deep: true })
  onItemChange(value: EnergyFacilityInterventionItem): void {
    this.localItem = cloneDeep(value);
  }

  rules: Rule[] = [checkRequired];

  get isOpen(): boolean {
    return this.dialogOpen;
  }

  set isOpen(value: boolean) {
    this.$emit("update:dialogOpen", value);
  }
  public selectFacility(facilityName: string): void {
    this.selectedFacility =
      this.facilities.find(
        (item: EnergyFacilityItem) => item.name === facilityName
      ) ?? null;
    this.$emit("update:itemIndex", facilityName);
  }

  public get title(): string {
    return this.itemIndex === -1 ? "New Intervention" : "Edit Intervention";
  }
  public updateField(value: string | number, fieldName: string): void {
    console.log(value, fieldName);
  }

  public async submitFn(): Promise<void> {
    if (!this.localItem || !this.localItem.name) {
      return Promise.resolve();
    }

    this.localItem.totalCO2Emission = computeCO2Cost(
      this.localItem,
      this.ghgMapRef?.REF_DIES_L,
      this.project_REF_GRD
    );
    this.localItem.dieselPower = computeDieselPower(
      this.localItem,
      this.ghgMapRef?.REF_EFF_DIES
    );
    // it's all done in parent component Facilities
    this.selectFacility(this.localItem.name);
    if (this.selectedFacility) {
      const endlineCO2 = this.localItem.totalCO2Emission;
      const baselineCO2 = this.selectedFacility.totalCO2Emission;
      this.localItem.changeInEmission = computeChangeInEmission(
        baselineCO2,
        endlineCO2
      );
    }
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
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
