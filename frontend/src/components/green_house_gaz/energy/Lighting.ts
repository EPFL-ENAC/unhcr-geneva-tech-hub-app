import {
  computeCO2CostEnergy,
  numberOfDaysPerYear,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import {
  CountryIrradianceKeys,
  solarInputsProducedPer,
} from "@/components/green_house_gaz/energy/solarInputs";
import {
  AllFuel,
  allFuelsForLighing,
  allFuelsButElectric,
  allFuelsButThermal,
  AllFuelsWithTextById,
  AllLightingFuelsWithTextById,
  BioMassFuel,
  biomassFuels,
  ElectricFuel,
  electricFuels,
  GasFuel,
  gasFuels,
  LiquidFuel,
  liquidFuels,
  ThermalFuel,
  thermalFuels,
  AllFuelForLighting,
} from "@/components/green_house_gaz/fuelTypes";

import { GHGfNRB } from "@/store/GHGReferencefNRB";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";

import { formatNumber } from "@/plugins/filters";
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
  cookstoveTECHs,
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

export interface EnergyLightingItemInput extends SurveyInput, EnergyItem {
  numberOfLighting?: number; // computed based on % of HH and stuffs
  image?: string; // image of lighting
  fuelUsage?: number; // [kg or L/day]
  fuelType: AllFuel; // key
  fuelTypes?: AllFuel[]; // used only as a reference
  carbonized?: boolean;
  sustainablySourced?: boolean;
  chcProcessingFactor?: number; // default to 6
  dryWood?: boolean;
  disabledFuelUsage?: boolean;
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

export const COOK_APP_Pressure = "Pressure cooker";
export const COOK_APP_Heat_Retaining = "Heat retaining basket";
export const COOK_APP_Default = "None";
export const APPLIANCE_EFFICIENCY = 1;

export const REF_DRY_WOOD = 1;
export const REF_WET_WOOD = 0.15; // 15% less efficient
export const REF_SUSTAINED_WOOD = 0; // fNRB of sustained

export const diffDimension: keyof EnergyLightingItemInput = "numberOfLighting";

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

  return localInput;
}

export function getDefaultFuel(
  localInput: EnergyLightingItemInput,
  pp_per_hh: number | undefined
): number {
  const currentStove = cookstoveTECHs.find(
    (cookstove) => cookstove._id === localInput.cookstove
  );
  if (!currentStove) {
    // should be defined, so no error
    return 0;
  }

  if (pp_per_hh === undefined) {
    // should be defined, so no error
    return 0;
  }
  // TODO: for gridPower && solarPower
  let fuelUsage =
    (currentStove.defaults?.[localInput.fuelType] ?? 0) * pp_per_hh;
  if (localInput.fuelType === "FWD" && !localInput.dryWood) {
    fuelUsage = fuelUsage * (1 + REF_WET_WOOD);
  }

  return fuelUsage;
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
      formatter: (v: AllFuelForLighting) => {
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
        if (localItem?.input?.sustainablySourced) {
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
        // todo improve typing
        localInput.fuelUsage = getDefaultFuel(localInput, 5);

        return localInput;
      },
      isInput: true,
      type: "select",
      hideFooterContent: false,
      tooltipInfo: (localInput: EnergyLightingItemInput) => {
        console.log(localInput)
        return 'kikoo';
      }
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
          if (refText.fuelTypes.includes(localInput.fuelType)) {
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
        if (!disabledFuelUsage) {
          localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
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
        localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
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
        // Superseed the dieselInputs for dieselLiters

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
      conditional_value: allFuelsForLighing,
      conditional: "fuelType",
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
    {
      value: "input.renewablePower", // maybe like in DieselGeneratorWithoutLitres
      conditional_value: ["THE"],
      disabled: false,
      text: `Solar thermal (Kwh/year/HH) estimated`,
      formatter: (v: number) => {
        return formatNumber(v);
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
      suffix: "Kwh/year/HH",
      style: {
        cols: "12",
      },
      type: "number",
      computeResults: true,
      hideFooterContent: true,
    },
    ...dieselInputsProducedPer("Day", "Day", {
      hideFooterContent: true,
      cookingMode: true,
    }),
    {
      value: "input.gridPower", // maybe like in DieselGeneratorWithoutLitres
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

function computeItemElectric(
  localItemInput: EnergyLightingItemInput,
  ghgMapRef: ItemReferencesMap,
  hhUsingTheFuel: number,
  project_REF_GRD: ReferenceItemInterface
): number {
  let totalCO2Emission = 0;
  switch (localItemInput.fuelType) {
    case "ELE_HYB":
    case "ELE_GRID":
    case "ELE_DIES":
      totalCO2Emission =
        computeCO2CostEnergy(
          localItemInput as EnergyItem,
          ghgMapRef?.REF_EFF_DIES,
          project_REF_GRD
        ) *
        hhUsingTheFuel *
        numberOfDaysPerYear;
      break;
    case "ELE_SOLAR":
    case "ELE_NONE":
    default:
      break;
  }
  return totalCO2Emission;
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
        totalCO2Emission = computeItemElectric(
          localItemInput,
          ghgMapRef,
          hhUsingTheFuel,
          project_REF_GRD
        );
        break;
      case thermalFuels.includes(fuelType as ThermalFuel):
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
