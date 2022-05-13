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
                      required
                      :rules="rules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model.number="localItem.dieselLiters"
                      type="number"
                      required
                      :rules="rules"
                      :min="0"
                      label="Litres of diesel used"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model.number="localItem.gridPower"
                      type="number"
                      required
                      :rules="rules"
                      :min="0"
                      label="kWh used (national grid)"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model.number="localItem.renewablePower"
                      type="number"
                      required
                      :rules="rules"
                      :min="0"
                      label="kWh used (renewable sources)"
                    />
                  </v-col>
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
import { computeChangeInEmission } from "@/components/green_house_gaz/changeInEmission";
import {
  EnergyFacilityInterventionItem,
  EnergyFacilityItem,
  GreenHouseGaz,
} from "@/store/GhgInterface";
import {
  EnergyReferences,
  ReferenceItemInterface,
} from "@/store/GhgReferenceEnergyModule";
import { IgesItemInterface } from "@/store/GhgReferenceIgesGridModule";
import { checkRequired, Rule } from "@/utils/rules";
import { VForm } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceEnergyModule", ["energy"]),
    ...mapGetters("GhgReferenceIgesGridModule", ["iges_grid_2021"]),
    ...mapGetters("GhgModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgReferenceEnergyModule", {
      syncDBGhgEnergy: "syncDB",
      closeDBGhgEnergy: "closeDB",
      getAllDocsGhgEnergy: "getAllDocs",
    }),
    ...mapActions("GhgReferenceIgesGridModule", {
      syncDBGhgIgesGrid: "syncDB",
      closeDBGhgIgesGrid: "closeDB",
      getAllDocsGhgIgesGrid: "getAllDocs",
    }),
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

  $refs!: {
    form: VForm;
  };

  project!: GreenHouseGaz;
  syncDBGhgEnergy!: () => null;
  closeDBGhgEnergy!: () => Promise<null>;
  getAllDocsGhgEnergy!: () => Promise<EnergyReferences>;

  syncDBGhgIgesGrid!: () => null;
  closeDBGhgIgesGrid!: () => Promise<null>;
  getAllDocsGhgIgesGrid!: () => Promise<IgesItemInterface[]>;

  energy!: ReferenceItemInterface[];
  iges_grid_2021!: IgesItemInterface[];

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

    this.localItem.totalCO2Emission = await this.computeCost();
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

  private get energyMap(): EnergyReferences | undefined {
    if (!this.energy) {
      return undefined;
    }
    return this.energy.reduce(
      (acc: EnergyReferences, item: ReferenceItemInterface) => {
        acc[item._id] = item;
        return acc;
      },
      {} as EnergyReferences
    );
  }

  public async computeCost(): Promise<number> {
    let result = 0;
    if (
      !this.energy ||
      !this.iges_grid_2021 ||
      !this.energyMap ||
      !this.project.country_code
    ) {
      // energy and iges not retrieved yet.
      return Promise.resolve(result);
    }
    const { REF_DIES, REF_GRD, REF_CONF_EFF } = this.energyMap;

    const iges_grid_2021 = this.iges_grid_2021.find(
      (el) => el._id === this.project.country_code
    );
    REF_GRD.value = iges_grid_2021?.value || REF_GRD.value; // find REF_GRD per country

    const { dieselLiters, gridPower } = this.localItem || {};

    if (dieselLiters) {
      result += ((dieselLiters / REF_CONF_EFF.value) * REF_DIES.value) / 1000;
    }
    if (gridPower) {
      result += (gridPower * REF_GRD.value) / 1000;
    }
    return Promise.resolve(result);
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
    this.syncDBGhgEnergy();
    this.getAllDocsGhgEnergy();

    this.syncDBGhgIgesGrid();
    this.getAllDocsGhgIgesGrid();
  }

  public destroyed(): void {
    this.closeDBGhgEnergy();
    this.closeDBGhgIgesGrid();
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
