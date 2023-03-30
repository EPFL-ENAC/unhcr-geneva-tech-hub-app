<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <baseline-endline-wrapper
      v-model="localForm"
      :headers="headers"
      :activate-pie="true"
      :diff-dimension="diffDimension"
      :compute-item="computeItem"
      :name="name"
    />
  </v-container>
</template>

<script lang="ts">
import BaselineEndlineWrapper from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";

import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

import { computeCO2CostEnergy } from "@/components/green_house_gaz/energy/computeCO2cost";
import { dieselInputsProducedPer } from "@/components/green_house_gaz/energy/dieselInputs";
import {
  countryIrradianceKeys,
  solarInputsProducedPer,
} from "@/components/green_house_gaz/energy/solarInputs";

import {
  ensureSurveyTableHeaders,
  SurveyTableHeader,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";
import { formatNumber } from "@/plugins/filters";
import {
  DieselItem,
  EnergyItem,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";

import {
  ElectricFuel,
  electricFuels,
  electricFuelWithText,
} from "@/components/green_house_gaz/fuelTypes";

import { GreenHouseGaz, Survey } from "@/store/GhgInterface.vue";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
  },
})
export default class Facilities extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: EnergyFacilitySurvey;

  @Prop([Object, Array])
  readonly survey: Survey | undefined;

  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: countryIrradianceKeys;

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;
  diffDimension: keyof EnergyFacilityItemInput = "totalPower";
  name = "Facility";

  public get title(): string {
    return this.titleKey;
  }
  public get localForm(): EnergyFacilitySurvey {
    return this.form;
  }
  public set localForm(value: EnergyFacilitySurvey) {
    this.$emit("update:form", value);
  }

  private computeItemElectric(
    localItemInput: EnergyFacilityItemInput,
    ghgMapRef: ItemReferencesMap
  ): number {
    let totalCO2Emission = 0;
    switch (localItemInput.fuelType) {
      case "ELE_HYB":
      case "ELE_GRID":
      case "ELE_DIES":
        totalCO2Emission = computeCO2CostEnergy(
          localItemInput,
          ghgMapRef?.REF_DIES_L,
          this.project_REF_GRD
        );
        break;
      case "ELE_SOLAR":
      case "ELE_NONE":
      default:
        break;
    }
    return totalCO2Emission;
  }

  private computeTotalPower(localItemInput: EnergyFacilityItemInput): number {
    let totalPower =
      (localItemInput?.gridPower ?? 0) +
      (localItemInput?.dieselPower ?? 0) +
      (localItemInput?.renewablePower ?? 0);
    totalPower = parseFloat(totalPower.toFixed(0));
    return totalPower;
  }
  public computeItem(
    localItemInput: EnergyFacilityItemInput,
    ghgMapRef: ItemReferencesMap
  ): EnergyFacilityItemResults {
    if (this.project === undefined) {
      throw new Error("project undefined");
    }
    const { fuelType } = localItemInput;
    if (fuelType === undefined) {
      throw new Error("fuel type not defined");
    }
    if (!electricFuels.includes(fuelType)) {
      throw new Error(`unknown fuel type ${fuelType}`);
    }
    const totalCO2Emission = this.computeItemElectric(
      localItemInput,
      ghgMapRef
    );
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is Not a Number`);
    }

    const totalPower = this.computeTotalPower(localItemInput);
    return {
      totalCO2Emission,
      totalPower,
    };
  }

  resetSurveyInput(
    localInput: EnergyFacilityItemInput
  ): EnergyFacilityItemInput {
    delete localInput.fuelUsage;

    delete localInput.disableDieselLiters; // do I know the total litres of diesels
    localInput.generatorLoad = 0.6; // default factor of 60%
    delete localInput.generatorSize;
    delete localInput.operatingHours;
    delete localInput.dieselLiters;

    delete localInput.solarInstalled;

    delete localInput.totalPower;
    delete localInput.dieselPower;
    delete localInput.renewablePower;
    delete localInput.gridPower;

    delete localInput.dieselPowerEstimated;
    delete localInput.dieselLitersEstimated;
    delete localInput.renewablePowerEstimated;
    delete localInput.solarInstalledEstimated;
    return localInput;
  }

  // should be a getter so it may be reactive for fuelTypes
  public get headers(): SurveyTableHeader[] {
    return [
      ...surveyTableHeaderIncrements,
      {
        text: "Name",
        value: "input.name",
        type: "text",
        style: {
          cols: "12",
        },
        hideFooterContent: false,
      },
      {
        text: "Powered by",
        value: "input.fuelType", // facilityType
        type: "select",
        style: {
          cols: "12",
        },
        hideFooterContent: false,
        items: electricFuelWithText,
        formatter: (_id: string) => {
          const electricFuel = electricFuelWithText.find(
            (electricFuel) => electricFuel._id === _id
          );
          const name = electricFuel?.text ?? "Unknown";
          return `${name}`;
        },
        customEventInput: (
          fuelType: ElectricFuel,
          localInput: EnergyFacilityItemInput
        ) => {
          localInput.fuelType = fuelType;
          this.resetSurveyInput(localInput);
          if (
            localInput.fuelType === "ELE_DIES" ||
            localInput.fuelType === "ELE_HYB"
          ) {
            localInput.disableDieselLiters = false;
          }
          return localInput;
        },
      },
      ...dieselInputsProducedPer("Year", "Week"),
      // begingin og national grid
      {
        value: "input.gridPower", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_GRID", "ELE_HYB"],
        computeResults: true,
        hideFooterContent: false,
        conditional: "fuelType",
        // text: "Total kWh used per yr",
        text: "Grid (kWh/yr)",
        suffix: "kWh/yr",
        style: {
          cols: "12",
        },
        formatter: (v: number) => {
          return formatNumber(v);
        },
        type: "number",
      },
      // end of national grid\
      ...solarInputsProducedPer("Year", this.countryCode, this.project.solar),
      {
        text: "Total (kWh/yr)",
        value: "computed.totalPower",
        hideFooterContent: false,
        hideInput: true, // so we can only display diffWarning in endline
        isInput: true,
        formatter: (v: number, { ...args }) => {
          return formatNumber(v, { suffix: args.suffix });
        },
        computeResults: true,
        type: "number",
        disabled: true,
      },
      ...surveyTableHeaderCO2,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].map(ensureSurveyTableHeaders);
  }
}

export interface EnergyFacilityItemInput
  extends DieselItem,
    EnergyItem,
    SurveyInput {
  fuelUsage?: number; // [L/yr] // dieselLiters: 0,
  fuelType?: ElectricFuel; // key
}

export interface EnergyFacilityItemResults extends SurveyResult {
  totalCO2Emission: number;
}
export interface EnergyFacilityItem extends SurveyItem {
  input: EnergyFacilityItemInput;
  computed: EnergyFacilityItemResults;
}

export interface EnergyFacilityItemResultsBalance extends SurveyResult {
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface EnergyFacilityItemResultsWithBalance
  extends EnergyFacilityItemResults,
    EnergyFacilityItemResultsBalance {}

export type EnergyFacilitySurvey = GenericFormSurvey<
  EnergyFacilityItem,
  EnergyFacilityItemResults,
  EnergyFacilityItem,
  EnergyFacilityItemResultsWithBalance
>;
</script>
