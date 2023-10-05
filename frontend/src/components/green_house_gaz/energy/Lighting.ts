import { numberOfDaysPerYear } from "@/components/green_house_gaz/energy/computeCO2cost";
import {
  CountryIrradianceKeys,
  solarInputsProducedPer,
} from "@/components/green_house_gaz/energy/solarInputs";
import {
  AllFuel,
  allFuelsButThermal,
  allFuelsForLighing,
  AllLightingFuelsWithTextById,
  BioMassFuel,
  biomassFuels,
  ElectricFuel,
  electricFuels,
  GasFuel,
  gasFuels,
  LightingFuel,
  LiquidFuel,
  liquidFuels,
  ThermalFuel,
  thermalFuels,
} from "@/components/green_house_gaz/fuelTypes";

import { GHGfNRB } from "@/store/GHGReferencefNRB";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";

import { formatNumberGhg } from "@/plugins/filters";
import {
  EnergyItem,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

import {
  cookstoveIdsTECHsWithAccess,
  cookstoveIdsTECHsWithBioMass,
} from "@/components/green_house_gaz/energy/CookstoveTech";
import { dieselInputsProducedPer } from "@/components/green_house_gaz/energy/dieselInputs";
import {
  computeThermalKWHPerDayFromPerYear,
  computeThermalKWHPerYearFromPerDay,
} from "@/components/green_house_gaz/energy/thermalInputs";
import {
  ensureSurveyTableHeaders,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";
import { computeCO2costElectric } from "./poweredBy";

export interface EnergyLightingItemInput extends SurveyInput, EnergyItem {
  numberOfLighting?: number; // computed based on % of HH and stuffs
  image?: string; // image of lighting
  fuelType?: AllFuel; // key
  fuelTypes?: AllFuel[]; // used only as a reference
  carbonized?: boolean;
  sustainablySourced?: boolean;
  chcProcessingFactor?: number; // default to 6
  dryWood?: boolean;
  disabledFuelUsage?: boolean;

  fuelUsageFirewood?: number; // special for light_hyb
  fuelUsageParaffin?: number; // special for light_hyb
  fuelUsageKerosene?: number; // special for light_hyb
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
export const APPLIANCE_EFFICIENCY = 1;

export const REF_DRY_WOOD = 1;
export const REF_WET_WOOD = 0.15; // 15% less efficient
export const REF_SUSTAINED_WOOD = 0; // fNRB of sustained

export const diffDimension: keyof EnergyLightingItemInput = "numberOfLighting";

export const conditional_function_for_hyb_lights = (itemInput: SurveyInput) => {
  if (itemInput?.fuelType == undefined || itemInput?.fuelType == "NO_ACCESS") {
    return false;
  }
  if (["LIGHT_HYB"].includes(itemInput?.fuelType as AllFuel) ?? "") {
    return true;
  }
  return false;
};

// Firewood + paraffin + kerosene
export const hybridLightingInputs = [
  {
    text: "Firewood use per HH per day (kg/day)",
    value: "input.fuelUsageFirewood",
    conditional_function: conditional_function_for_hyb_lights,
    style: {
      cols: "12",
    },
    type: "number",
  },
  {
    text: "Paraffin use per HH per day (kg/day)",
    value: "input.fuelUsageParaffin",
    conditional_function: conditional_function_for_hyb_lights,
    style: {
      cols: "12",
    },
    type: "number",
  },
  {
    text: "Kerosene use per HH per day (L/day)",
    value: "input.fuelUsageKerosene",
    conditional_function: conditional_function_for_hyb_lights,
    style: {
      cols: "12",
    },
    type: "number",
  },
];

export function resetSurveyInput(
  localInput: EnergyLightingItemInput
): EnergyLightingItemInput {
  localInput.fuelType = "NO_ACCESS";
  delete localInput.numberOfLighting; // percentage of percentage
  return resetSurveyFuelOption(localInput);
}

export function resetSurveyFuelOption(
  localInput: EnergyLightingItemInput
): EnergyLightingItemInput {
  delete localInput.fuelUsage;
  delete localInput.sustainablySourced;
  delete localInput.dryWood;
  delete localInput.carbonized;

  delete localInput.disableDieselLiters; // do I know the total litres of diesels
  localInput.disabledFuelUsage = false;
  localInput.generatorLoad = 0.6; // default factor of 60%
  delete localInput.generatorSize;
  delete localInput.operatingHours;
  delete localInput.solarInstalled;

  delete localInput.fuelUsageFirewood;
  delete localInput.fuelUsageParaffin;
  delete localInput.fuelUsageKerosene;
  return localInput;
}

export function headers(
  countryCode: CountryIrradianceKeys,
  projectSolar: number | undefined,
  pp_per_hh: number | undefined
) {
  return [
    ...surveyTableHeaderIncrements,
    {
      items: allFuelsForLighing,
      style: {
        cols: "12",
      },
      text: "Lighting powered by",
      value: "input.fuelType",
      formatter: (v: AllFuel) => {
        return AllLightingFuelsWithTextById?.[v]?.text;
      },
      formatterTableComponent: (
        fuelType: AllFuel,
        _: unknown,
        localItem: EnergyLightingItem
      ) => {
        const result = [];
        const fuelTypeEnhanced = `${fuelType}${
          localItem?.input?.carbonized ? "_C" : ""
        }`;
        if (fuelTypeEnhanced === "OIL") {
          result.push({
            text: "(S3)",
            description:
              "Exceptionally, Scope 3 emissions associated with feedstock production and/or processing of the fuel are being considered due to their high impact relative to the total emissions.",
            fill: "black",
          });
        }
        if (localItem?.input?.sustainablySourced || fuelType === "OIL") {
          result.push({
            icon: "$mdiTreeOutline",
            description: "Sustainably sourced biomass",
            fill: "green",
          });
        }
        return result;
      },
      customEventInput: (
        fuelType: AllFuel,
        localInput: EnergyLightingItemInput
      ) => {
        resetSurveyFuelOption(localInput);
        // setup default value based on fueltype
        if (fuelType === "FWD") {
          localInput.dryWood = true;
        }
        return localInput;
      },
      isInput: true,
      type: "select",
      hideFooterContent: false,
    },
    {
      value: "input.disabledFuelUsage",
      text: (localInput: EnergyLightingItemInput) => {
        let result = "Fuel quantity known?";
        const biomassFuelsText = "Biomass quantity known?";
        const liquidFuelsText = "Number of liters known?";
        const gasFuelsText = result;
        const lpgFuelsText = result;
        const electricFuelsText = result;
        const thermalFuelsText = result;

        const refTexts: {
          readonly fuelTypes: readonly AllFuel[];
          text: string;
        }[] = [
          { fuelTypes: biomassFuels, text: biomassFuelsText },
          { fuelTypes: liquidFuels, text: liquidFuelsText },
          { fuelTypes: ["BGS", "PNG"], text: gasFuelsText },
          { fuelTypes: ["LPG"], text: lpgFuelsText },
          {
            fuelTypes: ["ELE_DIES"], // superseed electricFuels
            text: "Number of liters of diesel known?",
          },
          { fuelTypes: electricFuels, text: electricFuelsText },
          { fuelTypes: thermalFuels, text: thermalFuelsText },
        ];
        // Superseed the dieselInputs for dieselLiters

        refTexts.every((refText) => {
          if (
            localInput.fuelType &&
            refText.fuelTypes.includes(localInput.fuelType)
          ) {
            result = refText.text;
            return false;
          }
          return true;
        });
        return result;
      },
      conditional_function: (itemInput: SurveyInput) => {
        // conditional_value: [cookstoveIdsTECHsWithAccess, allFuelsButThermal],
        // conditional: ["cookstove", "fuelType"],
        // conditional_type: "AND",
        // and don't show for ELE_HYB
        // TODO: should be working for lighting and cooking only
        if (
          itemInput.cookstove &&
          (cookstoveIdsTECHsWithAccess as string[]).includes(
            itemInput.cookstove as string
          ) &&
          itemInput.fuelType &&
          (allFuelsButThermal as string[]).includes(
            itemInput.fuelType as string
          ) &&
          itemInput.fuelType !== "ELE_HYB"
        ) {
          return true;
        }

        return false;
      },
      style: {
        cols: "12",
      },
      options: {
        false: "yes",
        true: "no",
      },
      default: true,
      type: "boolean",
      customEventInput: (
        disabledFuelUsage: boolean,
        localInput: EnergyLightingItemInput
      ) => {
        if (!localInput.fuelType) {
          return localInput;
        }
        return localInput;
      },
    },
    {
      conditional_value: [["FWD"], [true]],
      conditional: ["fuelType", "disabledFuelUsage"],
      conditional_type: "AND",
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

        localInput.dryWood = dryWood;
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
        const electricFuelsText = "Estimated kWh/day/HH";
        const thermalFuelsText = "Estimated kWh/day/HH";

        const refTexts: {
          readonly fuelTypes: readonly AllFuel[];
          text: string;
        }[] = [
          { fuelTypes: biomassFuels, text: biomassFuelsText },
          { fuelTypes: liquidFuels, text: liquidFuelsText },
          { fuelTypes: ["BGS", "PNG"], text: gasFuelsText },
          { fuelTypes: ["LPG"], text: lpgFuelsText },
          { fuelTypes: ["CNDL"], text: lpgFuelsText },
          { fuelTypes: ["OIL"], text: liquidFuelsText },
          { fuelTypes: ["LIGHT_SOLAR", "BAT"], text: electricFuelsText },
          { fuelTypes: electricFuels, text: electricFuelsText },
          { fuelTypes: thermalFuels, text: thermalFuelsText },
        ];
        // Superseed the dieselInputs for dieselLiters

        refTexts.every((refText) => {
          if (
            localInput.fuelType &&
            refText.fuelTypes.includes(localInput.fuelType)
          ) {
            result = refText.text;
            return false;
          }
          return true;
        });
        return result;
      },
      value: "input.fuelUsage",
      conditional_function: (itemInput: SurveyInput) => {
        if (
          itemInput?.fuelType == undefined ||
          itemInput?.fuelType == "NO_ACCESS"
        ) {
          return false;
        }
        if (
          [
            "LIGHT_HYB",
            "ELE_GRID",
            "ELE_DIES",
            "ELE_SOLAR",
            "ELE_HYB",
          ].includes(itemInput?.fuelType as AllFuel) ??
          ""
        ) {
          return false;
        }
        return true;
      },
      style: {
        cols: "12",
      },
      type: "number",
      disabledWithConditions: "disabledFuelUsage",
      disabledWithConditions_value: false,
      customEventInput: (
        fuelUsage: number,
        localInput: EnergyLightingItemInput
      ) => {
        if (localInput.fuelType === "THE") {
          localInput.renewablePower =
            computeThermalKWHPerYearFromPerDay(fuelUsage);
          return localInput;
        }
      },
    },
    ...hybridLightingInputs,
    {
      value: "input.renewablePower", // maybe like in DieselGeneratorWithoutLitres
      conditional_value: ["THE"],
      disabled: false,
      text: `Solar thermal (kWh/year/HH) estimated`,
      formatter: (v: number) => {
        return formatNumberGhg(v);
      },
      customEventInput: (
        renewablePower: number,
        localInput: EnergyLightingItemInput
      ) => {
        localInput.fuelUsage =
          computeThermalKWHPerDayFromPerYear(renewablePower);
        return localInput;
      },
      conditional: "fuelType",
      suffix: "kWh/year/HH",
      style: {
        cols: "12",
      },
      type: "number",
      computeResults: true,
      hideFooterContent: true,
    },
    ...dieselInputsProducedPer("Day", "Day", {
      hideFooterContent: true,
      cookingMode: false,
    }),
    {
      value: "input.gridPower", // maybe like in DieselGeneratorWithoutLitres
      conditional_value: ["ELE_GRID", "ELE_HYB"],
      conditional: "fuelType",
      text: "Estimated kWh/day/HH for national grid",
      suffix: "kWh/day/HH",
      style: {
        cols: "12",
      },
      type: "number",
    },
    // end of national grid
    ...solarInputsProducedPer("Year", countryCode, projectSolar, {
      hideFooterContent: true,
    }),
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
      conditional_value: [["BRQ"], cookstoveIdsTECHsWithBioMass],
      conditional: ["fuelType", "cookstove"],
      conditional_type: "AND",
      text: "carbonized or non-carbonized", // toggle button ?
      value: "input.carbonized",
      options: {
        true: "carbonized",
        false: "non-carbonized",
      },
      type: "boolean",
      style: {
        cols: "12",
      },
    },
    {
      text: "Percentage of total households",
      computeResults: true,
      value: "input.numberOfLighting",
      conditional_value: "",
      conditional: ["fuelType"],
      style: {
        cols: "12",
      },
      max: 100,
      subtype: "percent",
      type: "number",
      hideFooterContent: false,
      formatter: (v: number) => {
        return formatNumberGhg(v, {
          style: "percent"
        });
      },
    },
    ...surveyTableHeaderCO2,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ].map(ensureSurveyTableHeaders);
}

function getLocalFNRB(
  countryCode: string,
  default_fNRB: number | undefined,
  sustainablySourced: boolean | undefined,
  items: GHGfNRB[]
): number {
  if (default_fNRB === undefined) {
    const errorMessage = `undefined default fNRB`;
    throw new Error(errorMessage);
  }
  // TODO simplify this
  const countryfNRB = items.find((x) => x._id === countryCode);
  let localFNRB = countryfNRB?.value ?? default_fNRB;

  if (sustainablySourced) {
    localFNRB = REF_SUSTAINED_WOOD;
  }
  return localFNRB;
}

// this.project.totalHH
// this.project.country_code
export function generateComputeItem(
  countryCode: string,
  projectTotalHH: number,
  itemsGHGfNRB: GHGfNRB[],
  project_REF_GRD: ReferenceItemInterface
): (
  localItemInput: EnergyLightingItemInput,
  ghgMapRef: ItemReferencesMap
) => EnergyLightingItemResults {
  return function computeItem(
    localItemInput: EnergyLightingItemInput,
    ghgMapRef: ItemReferencesMap
  ): EnergyLightingItemResults {
    const { numberOfLighting: percentageOfTotalLighting, fuelUsage } =
      localItemInput;
    const { fuelType } = localItemInput;
    if (percentageOfTotalLighting === undefined) {
      throw new Error("number of cooktsove not defined");
    }

    if (fuelType === undefined) {
      return {
        totalCO2Emission: 0,
      };
    }
    if (projectTotalHH === undefined) {
      throw new Error(
        "Total House holds is undefined, please fill assessment information page and click on save"
      );
    }
    const hhUsingTheFuel = percentageOfTotalLighting * projectTotalHH; // number of cookstoves
    let totalCO2Emission = 0;

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
        const localFNRB = getLocalFNRB(
          countryCode,
          ghgMapRef?.REF_FNRB?.value,
          localItemInput.sustainablySourced,
          itemsGHGfNRB
        );

        let efficiencyFactor = 1;
        const fuelTypeEnhanced = `${fuelType}${
          localItemInput.carbonized ? "_C" : ""
        }`;
        if (fuelTypeEnhanced === "CHC" || fuelTypeEnhanced === "BRQ_C") {
          const fuelEfficiencyC =
            ghgMapRef?.[`REF_EFF_${fuelTypeEnhanced}_C`]?.value;
          if (fuelEfficiencyC == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelTypeEnhanced}_C`;
            throw new Error(errorMessage);
          }
          const fuelEfficiencyP =
            ghgMapRef?.[`REF_EFF_${fuelTypeEnhanced}_P`]?.value;
          if (fuelEfficiencyP == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelTypeEnhanced}_P`;
            throw new Error(errorMessage);
          }
          const nonCO2FractionC =
            ghgMapRef?.[`REF_NONCO2_${fuelTypeEnhanced}_C`]?.value;
          if (nonCO2FractionC == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelTypeEnhanced}_C`;
            throw new Error(errorMessage);
          }
          const nonCO2FractionP =
            ghgMapRef?.[`REF_NONCO2_${fuelTypeEnhanced}_P`]?.value;
          if (nonCO2FractionP == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelTypeEnhanced}_P`;
            throw new Error(errorMessage);
          }

          efficiencyFactor =
            (localFNRB + (1 - localFNRB) * nonCO2FractionC) * fuelEfficiencyC +
            (localFNRB + (1 - localFNRB) * nonCO2FractionP) * fuelEfficiencyP;
        } else {
          const fuelEfficiency =
            ghgMapRef?.[`REF_EFF_${fuelTypeEnhanced}`]?.value;
          if (fuelEfficiency == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelTypeEnhanced}`;
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
          drynessFactor * // only for wood but since it's 1 as default it's going to be okay
          0.001 * // 1t/1000kg
          numberOfDaysPerYear * // days/yr
          efficiencyFactor;
        break;
      }
      case liquidFuels.includes(fuelType as LiquidFuel):
      case ["OIL", "CNDL"].includes(fuelType as LightingFuel):
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
          0.001 * // 1t/1000kg
          numberOfDaysPerYear * // days/yr
          fuelEfficiency;
        break;
      }
      case electricFuels.includes(fuelType as ElectricFuel):
        totalCO2Emission = computeCO2costElectric(
          localItemInput,
          ghgMapRef,
          project_REF_GRD,
          hhUsingTheFuel * numberOfDaysPerYear
        );
        break;
      case ["BAT", "LIGHT_SOLAR"].includes(fuelType as LightingFuel):
      case thermalFuels.includes(fuelType as ThermalFuel):
        totalCO2Emission = 0;
        break;
      case fuelType === "LIGHT_HYB": {
        const { fuelUsageFirewood, fuelUsageParaffin, fuelUsageKerosene } =
          localItemInput;
        if (fuelUsageFirewood === undefined) {
          throw new Error("fuel usage not defined");
        }
        const fuelEfficiencyFirewood = ghgMapRef?.[`REF_EFF_FWD`]?.value;
        if (fuelEfficiencyFirewood == undefined) {
          const errorMessage = `there are no emission factor REF_EFF_FWD`;
          throw new Error(errorMessage);
        }
        const totalCO2EmissionFirewood =
          hhUsingTheFuel *
          fuelUsageFirewood * // fuel consumed in kg / day
          0.001 * // 1t/1000kg
          numberOfDaysPerYear * // days/yr
          fuelEfficiencyFirewood;

        // PARAFFIN
        if (fuelUsageParaffin === undefined) {
          throw new Error("fuel usage not defined");
        }
        const fuelEfficiencyParaffin = ghgMapRef?.[`REF_EFF_CNDL`]?.value;
        if (fuelEfficiencyParaffin == undefined) {
          const errorMessage = `there are no emission factor REF_EFF_CNDL`;
          throw new Error(errorMessage);
        }
        const totalCO2EmissionParaffin =
          hhUsingTheFuel *
          fuelUsageParaffin * // fuel consumed in kg / day
          0.001 * // 1t/1000kg
          numberOfDaysPerYear * // days/yr
          fuelEfficiencyParaffin;
        // END PARAFFIN

        // KEROSENE
        if (fuelUsageKerosene === undefined) {
          throw new Error("fuel usage not defined");
        }
        const fuelEfficiencyKerosene = ghgMapRef?.[`REF_EFF_KRS`]?.value;
        if (fuelEfficiencyKerosene == undefined) {
          const errorMessage = `there are no emission factor REF_EFF_KRS`;
          throw new Error(errorMessage);
        }
        const totalCO2EmissionKerosene =
          hhUsingTheFuel *
          fuelUsageKerosene * // fuel consumed in kg / day
          0.001 * // 1t/1000kg
          numberOfDaysPerYear * // days/yr
          fuelEfficiencyKerosene;
        // END KEROSENE
        totalCO2Emission =
          totalCO2EmissionFirewood +
          totalCO2EmissionParaffin +
          totalCO2EmissionKerosene;
        break;
      }
      case ["NO_ACCESS"].includes(fuelType):
        totalCO2Emission = 0;
        break;
      default:
        throw new Error(`unknown fuel type ${fuelType}`);
    }
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is NaN`);
    }
    return {
      totalCO2Emission,
    };
  };
}
