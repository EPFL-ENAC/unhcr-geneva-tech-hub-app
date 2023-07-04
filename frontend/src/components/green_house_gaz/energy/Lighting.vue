<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <baseline-endline-wrapper
      v-if="!disabled"
      v-model="localForm"
      :headers="headers"
      :diff-dimension="diffDimension"
      :compute-item="computeItem"
      :name="name"
    />
  </v-container>
</template>

<script lang="ts">
import { getDefaultFuel } from "@/components/green_house_gaz/energy/Lighting";
import BaselineEndlineWrapper from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import {
  ensureSurveyTableHeaders,
  SurveyTableHeader,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

import {
  computeCO2CostEnergy,
  numberOfDaysPerYear,
} from "@/components/green_house_gaz/energy/computeCO2cost";

import { formatNumber } from "@/plugins/filters";
import {
  DieselItem,
  EnergyItem,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import { GHGfNRB } from "@/store/GHGReferencefNRB";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

import {
  AllFuel,
  allFuels,
  allFuelsButElectric,
  AllFuelsWithTextById,
  BioMassFuel,
  biomassFuels,
  ElectricFuel,
  electricFuels,
  GasFuel,
  gasFuels,
  LiquidFuel,
  liquidFuels,
  thermalFuels,
} from "@/components/green_house_gaz/fuelTypes";

import { lightingIdWithoutAccess } from "@/components/green_house_gaz/energy/LightingTech";
import { dieselInputsProducedPer } from "@/components/green_house_gaz/energy/dieselInputs";
import {
  CountryIrradianceKeys,
  solarInputsProducedPer,
} from "@/components/green_house_gaz/energy/solarInputs";

const LIGHTING_APP_Led = "LED";
const LIGHTING_APP_Default = "None";
const APPLIANCE_EFFICIENCY = 1;

const REF_DRY_WOOD = 1;
const REF_WET_WOOD = 0.15; // 15% less efficient
const REF_SUSTAINED_WOOD = 0; // fNRB of sustained

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
    ...mapGetters("GHGReferencefNRB", ["items"]),
  },
})
export default class Lighting extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: Boolean, required: true, default: false })
  readonly disabled!: boolean;

  @Prop({ type: [Object, Array] })
  readonly form!: EnergyLightingSurvey;

  @Prop([Object, Array])
  readonly survey: Survey | undefined;

  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: CountryIrradianceKeys;

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;
  diffDimension: keyof EnergyLightingItemInput = "numberOfLighting";
  name = "lighting";

  public get title(): string {
    return this.titleKey;
  }
  public get localForm(): EnergyLightingSurvey {
    return this.form;
  }

  public set localForm(value: EnergyLightingSurvey) {
    this.$emit("update:form", value);
  }

  private applianceEfficiency(name?: string): number {
    let app_eff = APPLIANCE_EFFICIENCY;
    switch (name) {
      case LIGHTING_APP_Led:
        app_eff = app_eff - 0.5;
        break;
      default:
        break;
    }
    return app_eff;
  }

  private getLocalFNRB(
    countryCode: string,
    default_fNRB: number | undefined,
    sustainablySourced: boolean | undefined
  ): number {
    if (default_fNRB == undefined) {
      const errorMessage = `there are default fNRB ${default_fNRB}`;
      throw new Error(errorMessage);
    }
    const countryfNRB = this.items.find((x) => x._id === countryCode);
    let localFNRB = countryfNRB?.value ?? default_fNRB;

    if (sustainablySourced) {
      localFNRB = REF_SUSTAINED_WOOD;
    }
    return localFNRB;
  }

  private computeItemElectric(
    localItemInput: EnergyLightingItemInput,
    ghgMapRef: ItemReferencesMap,
    hhUsingTheFuel: number,
    applianceEff: number
  ): number {
    let totalCO2Emission = 0;
    switch (localItemInput.fuelType) {
      case "ELE_HYB":
      case "ELE_GRID":
      case "ELE_DIES":
        totalCO2Emission =
          computeCO2CostEnergy(
            localItemInput,
            ghgMapRef?.REF_EFF_DIES,
            this.project_REF_GRD
          ) *
          hhUsingTheFuel *
          applianceEff *
          numberOfDaysPerYear;
        break;
      case "ELE_SOLAR":
      case "ELE_NONE":
      default:
        break;
    }
    return totalCO2Emission;
  }

  public computeItem(
    localItemInput: EnergyLightingItemInput,
    ghgMapRef: ItemReferencesMap
  ): EnergyLightingItemResults {
    if (this.project === undefined) {
      throw new Error("project undefined");
    }
    const {
      numberOfLighting: percentageOfTotalLighting,
      fuelUsage,
      fuelType,
      appliance,
    } = localItemInput;

    if (percentageOfTotalLighting === undefined) {
      throw new Error("number of lighting not defined");
    }
    if (this.project.totalHH === undefined) {
      throw new Error(
        "Total House holds is undefined, please fill assessment information page and click on save"
      );
    }
    const hhUsingTheFuel = percentageOfTotalLighting * this.project.totalHH; // number of lightings
    let totalCO2Emission = 0;

    const applianceEff = this.applianceEfficiency(appliance);
    switch (true) {
      /* solid fuels "FWD", "CHC", "BRQ", "PLTS" */
      case biomassFuels.includes(fuelType as BioMassFuel): {
        /*
          - Three version for the fnrb factor
            - briket and pellets
            - wood same as bricket + dry factor
            - charcoal same as bricket but fnrb factor is combustion + production
         */
        if (fuelUsage === undefined) {
          throw new Error("fuel usage not defined");
        }

        let drynessFactor = REF_DRY_WOOD;
        if (!localItemInput.dryWood && fuelType === "FWD") {
          drynessFactor = drynessFactor + REF_WET_WOOD;
        }
        const localFNRB = this.getLocalFNRB(
          this.project.country_code,
          ghgMapRef?.REF_FNRB?.value,
          localItemInput.sustainablySourced
        );

        let efficiencyFactor = 1;
        if (fuelType === "CHC") {
          const fuelEfficiencyC = ghgMapRef?.[`REF_EFF_${fuelType}_C`]?.value;
          if (fuelEfficiencyC == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelType}_C`;
            throw new Error(errorMessage);
          }
          const fuelEfficiencyP = ghgMapRef?.[`REF_EFF_${fuelType}_P`]?.value;
          if (fuelEfficiencyP == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelType}_P`;
            throw new Error(errorMessage);
          }
          const nonCO2FractionC =
            ghgMapRef?.[`REF_NONCO2_${fuelType}_C`]?.value;
          if (nonCO2FractionC == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelType}_C`;
            throw new Error(errorMessage);
          }
          const nonCO2FractionP =
            ghgMapRef?.[`REF_NONCO2_${fuelType}_P`]?.value;
          if (nonCO2FractionP == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelType}_P`;
            throw new Error(errorMessage);
          }

          efficiencyFactor =
            (localFNRB + (1 - localFNRB) * nonCO2FractionC) * fuelEfficiencyC +
            (localFNRB + (1 - localFNRB) * nonCO2FractionP) * fuelEfficiencyP;
        } else {
          const fuelEfficiency = ghgMapRef?.[`REF_EFF_${fuelType}`]?.value;
          if (fuelEfficiency == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelType}`;
            throw new Error(errorMessage);
          }
          const nonCO2Fraction = ghgMapRef?.[`REF_NONCO2_${fuelType}`]?.value;
          if (nonCO2Fraction == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelType}`;
            throw new Error(errorMessage);
          }
          // for "FWD", "BRQ", "PLTS"
          efficiencyFactor =
            (localFNRB + (1 - localFNRB) * nonCO2Fraction) * fuelEfficiency;
        }
        totalCO2Emission =
          hhUsingTheFuel *
          fuelUsage * // fuel consumed in kg / day
          applianceEff * // should be 1 for now (1 - 0.7 or 0.3 depending on appliances)
          drynessFactor * // only for wood but since it's 1 as default it's going to be okay
          0.001 * // 1t/1000kg
          numberOfDaysPerYear * // days/yr
          efficiencyFactor;
        break;
      }
      case liquidFuels.includes(fuelType as LiquidFuel):
      case gasFuels.includes(fuelType as GasFuel): {
        if (fuelUsage === undefined) {
          throw new Error("fuel usage not defined");
        }
        const fuelEfficiency = ghgMapRef?.[`REF_EFF_${fuelType}`]?.value;
        if (fuelEfficiency == undefined) {
          const errorMessage = `there are no emission factor REF_EFF_${fuelType}`;
          throw new Error(errorMessage);
        }
        totalCO2Emission =
          hhUsingTheFuel *
          fuelUsage * // fuel consumed in kg / day
          applianceEff * // should be 1 for now (1 - 0.7 or 0.3 depending on appliances)
          0.001 * // 1t/1000kg
          numberOfDaysPerYear * // days/yr
          fuelEfficiency;
        break;
      }
      case electricFuels.includes(fuelType as ElectricFuel):
        totalCO2Emission = this.computeItemElectric(
          localItemInput,
          ghgMapRef,
          hhUsingTheFuel,
          applianceEff
        );
        break;
      default:
        if (localItemInput.lighting !== lightingIdWithoutAccess) {
          throw new Error(`unknown fuel type ${fuelType}`);
        }
    }
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is NaN`);
    }
    return {
      totalCO2Emission,
    };
  }

  resetSurveyInput(localInput: EnergyLightingItemInput): EnergyLightingItemInput {
    localInput.fuelType = "NO_ACCESS";
    delete localInput.numberOfLighting; // percentage of percentage
    return this.resetSurveyFuelOption(localInput);
  }

  resetSurveyFuelOption(
    localInput: EnergyLightingItemInput
  ): EnergyLightingItemInput {
    delete localInput.fuelUsage;
    delete localInput.sustainablySourced;
    delete localInput.dryWood;
    delete localInput.carbonized;
    delete localInput.appliance;

    delete localInput.disableDieselLiters; // do I know the total litres of diesels
    localInput.generatorLoad = 0.6; // default factor of 60%
    delete localInput.generatorSize;
    delete localInput.operatingHours;

    delete localInput.solarInstalled;

    return localInput;
  }
  // should be a getter so it may be reactive for fuelTypes
  public get headers(): SurveyTableHeader[] {
    // public get headers(): any {
    const countryCode = this.countryCode;
    return [
      ...surveyTableHeaderIncrements,
      {
        items: allFuels,
        style: {
          cols: "12",
        },
        text: "Lighting powered by",
        value: "input.fuelType",
        formatter: (v: AllFuel) => {
          return AllFuelsWithTextById?.[v]?.text;
        },
        customEventInput: (
          fuelType: AllFuel,
          localInput: EnergyLightingItemInput
        ) => {
          this.resetSurveyFuelOption(localInput);
          localInput.appliance = LIGHTING_APP_Default;
          // setup default value based on fueltype
          if (fuelType === "FWD") {
            localInput.dryWood = true;
          }
          // todo improve typing
          localInput.fuelUsage = getDefaultFuel(localInput, 5);

          return localInput;
        },
        isInput: true,
        type: "select",
        hideFooterContent: false,
      },
      {
        conditional_value: "",
        conditional: ["fuelType"],
        text: "Lighting type",
        value: "input.appliance",
        items: [LIGHTING_APP_Default, LIGHTING_APP_Led],
        style: {
          cols: "12",
        },
        type: "select",
      },
      {
        conditional_value: "FWD",
        conditional: "fuelType",
        text: "Dry wood",
        style: {
          cols: "12",
        },
        value: "input.dryWood",
        type: "boolean",
        customEventInput: (
          dryWood: boolean,
          localInput: EnergyLightingItemInput
        ) => {
          if (!localInput.fuelUsage) {
            return localInput;
          }
          if (!dryWood) {
            localInput.fuelUsage = localInput.fuelUsage * (1 + REF_WET_WOOD);
          } else {
            localInput.fuelUsage = localInput.fuelUsage / (1 + REF_WET_WOOD);
          }

          return localInput;
        },
      },
      {
        text: (localInput: EnergyLightingItemInput) => {
          let result = "Fuel per day (kg/day for biomass)";
          const biomassFuelsText =
            "Biomass used per HH per day (kg/day for biomass)";
          const liquidFuelsText = "Fuel use per HH per day  (L/day)";
          const gasFuelsText = "Fuel use per HH per day (m3/day)";
          const lpgFuelsText = "Fuel use per HH per day (kg/day)";
          const electricFuelsText = "Estimated Kwh/day/HH";
          const thermalFuelsText = "Estimated Kwh/day/HH";

          const refTexts: {
            readonly fuelTypes: readonly AllFuel[];
            text: string;
          }[] = [
            { fuelTypes: biomassFuels, text: biomassFuelsText },
            { fuelTypes: liquidFuels, text: liquidFuelsText },
            { fuelTypes: ["BGS", "PNG"], text: gasFuelsText },
            { fuelTypes: ["LPG"], text: lpgFuelsText },
            { fuelTypes: electricFuels, text: electricFuelsText },
            { fuelTypes: thermalFuels, text: thermalFuelsText },
          ];

          refTexts.every((refText) => {
            if (refText.fuelTypes.includes(localInput.fuelType)) {
              result = refText.text;
              return false;
            }
            return true;
          });
          return result;
        },
        value: "input.fuelUsage",
        conditional_value: allFuelsButElectric,
        conditional: "fuelType",
        style: {
          cols: "12",
        },
        type: "number",
      },
      {
        text: "Number of hours of lighting per day",
        value: "input.hoursOfLightingPerDay",
        style: {
          cols: "12",
        },
        type: "number",
      },
      ...dieselInputsProducedPer("Day", "Day"),
      {
        value: "input.gridPower", // maybe use like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_GRID", "ELE_HYB"],
        conditional: "fuelType",
        text: "Estimated Kwh/day/HH for national grid",
        suffix: "Kwh/day/HH",
        style: {
          cols: "12",
        },
        type: "number",
      },
      // end of national grid
      ...solarInputsProducedPer("Year", countryCode, this.project.solar),
      {
        conditional_value: biomassFuels,
        conditional: "fuelType",
        text: "Sustainably sourced biomass",
        style: {
          cols: "12",
        },
        value: "input.sustainablySourced",
        type: "boolean",
      },
      {
        conditional_value: "BRQ",
        conditional: "fuelType",
        text: "carbonized or non-carbonized", // toggle button ?
        value: "input.carbonized",
        options: {
          true: "carbonized",
          false: "non-carbonized",
        },
        type: "boolean",
      },
      {
        text: "Percentage of total households",
        computeResults: true,
        value: "input.numberOfLighting",
        conditional_value: ["", lightingIdWithoutAccess],
        conditional: ["appliance", "lighting"],
        style: {
          cols: "12",
        },
        max: 100,
        subtype: "percent",
        type: "number",
        hideFooterContent: false,
        formatter: (v: number) => {
          return formatNumber(v, {
            style: "percent",
            maximumFractionDigits: 0,
          });
        },
      },
      ...surveyTableHeaderCO2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].map(ensureSurveyTableHeaders);
  }

  items!: GHGfNRB[];
}

export interface EnergyLightingItemInput
  extends SurveyInput,
    DieselItem,
    EnergyItem {
  numberOfLighting?: number; // computed based on % of HH
  lighting: string; // type fo lighting/ TODO: remove
  image?: string; // image of lighting
  fuelUsage?: number; // [kg or L/day]
  fuelType: AllFuel; // key
  fuelTypes?: AllFuel[]; // used only as a reference
  appliance?: string; // type of appliance LED, default
  hoursOfLightingPerDay: number; // default is 5 hours
  carbonized?: boolean;
  sustainablySourced?: boolean;
  chcProcessingFactor?: number; // default to 6
  dryWood?: boolean;
}

export interface EnergyLightingItemResults extends SurveyResult {
  totalCO2Emission: number;
}
export interface EnergyLightingItem extends SurveyItem {
  input: EnergyLightingItemInput;
  computed: EnergyLightingItemResults;
}

export interface EnergyLightingItemResultsBalance extends SurveyResult {
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface EnergyLightingItemResultsWithBalance
  extends EnergyLightingItemResults,
    EnergyLightingItemResultsBalance {}

export type EnergyLightingSurvey = GenericFormSurvey<
  EnergyLightingItem,
  EnergyLightingItemResults,
  EnergyLightingItem,
  EnergyLightingItemResultsWithBalance
>;
</script>
