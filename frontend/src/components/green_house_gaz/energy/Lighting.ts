import {
  CountryIrradianceKeys,
  solarInputsProducedPer,
} from "@/components/green_house_gaz/energy/solarInputs";
import {
  AllFuel,
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
  noAccessFuels,
  ThermalFuel,
  thermalFuels,
} from "@/components/green_house_gaz/fuelTypes";
import { GHGfNRB } from "@/store/GHGReferencefNRB";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

import {
  computeCO2CostEnergy,
  numberOfDaysPerYear,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";

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
  lightingIdsTECHsWithAccess,
  lightingIdsTECHsWithBioMass,
  lightingIdWithoutAccess,
  LightingTech,
  lightingTECHs,
} from "@/components/green_house_gaz/energy/LightingTech";
import { dieselInputsProducedPer } from "@/components/green_house_gaz/energy/dieselInputs";
import {
  ensureSurveyTableHeaders,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";

export interface EnergyLightingItemInput
  extends SurveyInput,
    DieselItem,
    EnergyItem {
  numberOfLighting?: number; // computed based on % of HH and stuffs
  lighting: string; // type fo lighting
  image?: string; // image of lighting
  fuelUsage?: number; // [kg or L/day]
  fuelType: AllFuel; // key
  fuelTypes?: AllFuel[]; // used only as a reference
  appliance?: string; // type of appliance heating retaining basket for instance
  carbonized?: boolean;
  sustainablySourced?: boolean;
  chcProcessingFactor?: number; // default to 6
  dryWood?: boolean;
  disabledfuelUsage?: boolean;
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
  delete localInput.appliance;

  delete localInput.disableDieselLiters; // do I know the total litres of diesels
  localInput.disabledfuelUsage = false;
  localInput.generatorLoad = 0.6; // default factor of 60%
  delete localInput.generatorSize;
  delete localInput.operatingHours;
  delete localInput.dieselLiters;

  delete localInput.solarInstalled;

  return localInput;
}

export function getDefaultFuel(
  localInput: EnergyLightingItemInput,
  pp_per_hh: number | undefined
): number {
  const currentStove = lightingTECHs.find(
    (lighting) => lighting._id === localInput.lighting
  );
  if (!currentStove) {
    // should be defined, so no error
    return 0;
  }

  if (pp_per_hh === undefined) {
    // should be defined, so no error
    return 0;
  }
  let fuelUsage =
    (currentStove.defaults?.[localInput.fuelType] ?? 0) * pp_per_hh;

  const appEff = applianceEfficiency(localInput.appliance);
  fuelUsage = fuelUsage * appEff;
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
      text: "Lighting",
      value: "input.lighting",
      type: "select",
      image: true,
      style: {
        cols: "12",
      },
      hideFooterContent: false,
      items: lightingTECHs,
      formatter: (_id: string, _: unknown, localItem: EnergyLightingItem) => {
        const cookStove =
          lightingTECHs.find((lighting) => lighting._id === _id) ??
          ({
            text: "Unknown",
          } as LightingTech);
        const name = cookStove?.text ?? "Unknown";

        return `
              ${
                cookStove?.image
                  ? `<img width="64px" height="64px" src='${
                      cookStove?.image ?? ""
                    }'/>`
                  : `<span class="ml-16"></span>`
              }
              <span class="ml-4">${name}</span>
            `;
      },
      formatterTableComponent: (_id: string, _: unknown, localItem: EnergyLightingItem) => {
        let defaultAppliance;
        switch (localItem.input.appliance) {
          case COOK_APP_Pressure:
            defaultAppliance = "$mdiPotOutline";
            break;
          case COOK_APP_Heat_Retaining:
            defaultAppliance = "$mdiBasketOutline";
            break;
          default:
            defaultAppliance = "";
            break;
        }
        return [
          {
            icon: defaultAppliance,
            description: localItem.input.appliance,
            fill: "black",
          },
        ];
      },
      customEventInput: (
        lightingId: string,
        localInput: EnergyLightingItemInput
      ) => {
        const currentStove = lightingTECHs.find(
          (lighting) => lighting._id === lightingId
        );

        // // find cooktstove
        if (!currentStove) {
          throw new Error("no lighting matched");
        }
        localInput.image = currentStove.image;
        localInput.fuelTypes = currentStove.fuelTypes as AllFuel[];
        if (currentStove._id === lightingIdWithoutAccess) {
          localInput.fuelType = noAccessFuels[0];
        }
        resetSurveyInput(localInput);
        return localInput;
      },
    },
    {
      conditional_value: lightingIdsTECHsWithAccess,
      conditional: "lighting",
      items: "input.fuelTypes",
      style: {
        cols: "12",
      },
      text: "Lighting fuel",
      value: "input.fuelType",
      formatter: (v: AllFuel) => {
        return AllFuelsWithTextById?.[v]?.text;
      },
      formatterTableComponent: () => {
        return [
          {
            icon: "$mdiTreeOutline",
            description: "Sustainably sourced biomass",
            fill: "green",
          },
        ];
      },
      customEventInput: (
        fuelType: AllFuel,
        localInput: EnergyLightingItemInput
      ) => {
        resetSurveyFuelOption(localInput);
        localInput.appliance = COOK_APP_Default;
        // setup default value based on fueltype
        if (fuelType === "FWD") {
          localInput.dryWood = true;
        }
        localInput.fuelType = fuelType;
        localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
        return localInput;
      },
      isInput: true,
      type: "select",
      hideFooterContent: false,
    },
    {
      value: "input.disabledfuelUsage",
      text: "Fuel quantity known",
      conditional_value: [lightingIdsTECHsWithAccess, ""],
      conditional: ["lighting", "fuelType"],
      conditional_type: "AND",
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
        disabledfuelUsage: boolean,
        localInput: EnergyLightingItemInput
      ) => {
        if (!localInput.fuelType) {
          return localInput;
        }
        if (!disabledfuelUsage) {
          localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
        }

        return localInput;
      },
    },
    {
      conditional_value: [[true], lightingIdsTECHsWithAccess],
      conditional: ["disabledfuelUsage", "lighting"],
      conditional_type: "AND",
      text: "Lighting appliance",
      value: "input.appliance",
      items: [COOK_APP_Default, COOK_APP_Pressure, COOK_APP_Heat_Retaining],
      style: {
        cols: "12",
      },
      type: "select",
      customEventInput: (
        appliance: string,
        localInput: EnergyLightingItemInput
      ) => {
        if (!localInput.fuelUsage) {
          return localInput;
        }
        localInput.appliance = appliance;
        localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
        return localInput;
      },
    },
    {
      conditional_value: [["FWD"], [true]],
      conditional: ["fuelType", "disabledfuelUsage"],
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
      disabledWithConditions: "disabledfuelUsage",
      disabledWithConditions_value: false,
    },
    ...dieselInputsProducedPer("Day", "Day"),
    {
      value: "input.gridPower", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
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
    ...solarInputsProducedPer("Year", countryCode, projectSolar),
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
      conditional_value: [["BRQ"], lightingIdsTECHsWithBioMass],
      conditional: ["fuelType", "lighting"],
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
      conditional: ["lighting"],
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

function applianceEfficiency(name?: string): number {
  let app_eff = APPLIANCE_EFFICIENCY;
  switch (name) {
    case COOK_APP_Pressure:
      app_eff = app_eff - 0.7;
      break;
    case COOK_APP_Heat_Retaining:
      app_eff = app_eff - 0.3;
      break;
    default:
      break;
  }
  return app_eff;
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
  applianceEff: number,
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
    const {
      numberOfLighting: percentageOfTotalLighting,
      fuelUsage,
      appliance,
    } = localItemInput;
    const { fuelType } = localItemInput;
    if (percentageOfTotalLighting === undefined) {
      throw new Error("number of cooktsove not defined");
    }
    if (projectTotalHH === undefined) {
      throw new Error(
        "Total House holds is undefined, please fill assessment information page and click on save"
      );
    }
    const hhUsingTheFuel = percentageOfTotalLighting * projectTotalHH; // number of lightings
    let totalCO2Emission = 0;

    const applianceEff = applianceEfficiency(appliance);
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
          const fuelTypeEnhanced = `${fuelType}${
            localItemInput.carbonized ? "_C" : ""
          }`;
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
        totalCO2Emission = computeItemElectric(
          localItemInput,
          ghgMapRef,
          hhUsingTheFuel,
          applianceEff,
          project_REF_GRD
        );
        break;
      case thermalFuels.includes(fuelType as ThermalFuel):
        totalCO2Emission = 0;
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
  };
}
