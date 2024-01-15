import { numberOfDaysPerYear } from "@/components/green_house_gaz/energy/computeCO2cost";
import {
  computeKWInstalledWithKwhPerYearPerCountry,
  CountryIrradianceKeys,
  solarInputsProducedPer,
} from "@/components/green_house_gaz/energy/solarInputs";
import {
  AllFuel,
  allFuelsButElectric,
  allFuelsButThermal,
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
  cookstoveIdSolarCooker,
  cookstoveIdsTECHsWithAccess,
  cookstoveIdsTECHsWithBioMass,
  cookstoveIdWithoutAccess,
  CookstoveTech,
  cookstoveTECHs,
} from "@/components/green_house_gaz/energy/CookstoveTech";
import {
  computeDieselPower,
  dieselEstimated,
  dieselInputsProducedPer,
} from "@/components/green_house_gaz/energy/dieselInputs";
import {
  computeThermalKWHPerDayFromPerYear,
  computeThermalKWHPerYearFromPerDay,
} from "@/components/green_house_gaz/energy/thermalInputs";
import {
  ensureSurveyTableHeaders,
  SurveyTableHeader,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";
import { computeCO2costElectric } from "./poweredBy";

export interface EnergyCookingItemInput extends SurveyInput, EnergyItem {
  numberOfCookstove?: number; // computed based on % of HH and stuffs
  cookstove: string; // type fo cookstove
  image?: string; // image of cookstove
  fuelUsage?: number; // [kg/day or L/day]
  fuelType: AllFuel; // key
  fuelTypes?: AllFuel[]; // used only as a reference
  appliance?: string; // type of appliance heating retaining basket for instance
  carbonized?: boolean;
  sustainablySourced?: boolean;
  chcProcessingFactor?: number; // default to 6
  dryWood?: boolean;
  disabledFuelUsage?: boolean; // DEPRECATED: moved to ENERGY ITEM ?
}

export interface EnergyCookingItemResults extends SurveyResult {
  totalCO2Emission: number;
}
export interface EnergyCookingItem extends SurveyItem {
  input: EnergyCookingItemInput;
  computed: EnergyCookingItemResults;
}

export interface EnergyCookingItemResultsBalance extends SurveyResult {
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface EnergyCookingItemResultsWithBalance
  extends EnergyCookingItemResults,
    EnergyCookingItemResultsBalance {}

export type EnergyCookingSurvey = GenericFormSurvey<
  EnergyCookingItem,
  EnergyCookingItemResults,
  EnergyCookingItem,
  EnergyCookingItemResultsWithBalance
>;

export const COOK_APP_Pressure = "Pressure cooker";
export const COOK_APP_Heat_Retaining = "Heat retaining basket";
export const COOK_APP_Default = "None";
export const APPLIANCE_EFFICIENCY = 1;

export const REF_DRY_WOOD = 1;
export const REF_WET_WOOD = 0.15; // 15% less efficient
export const REF_SUSTAINED_WOOD = 0; // fNRB of sustained

export const diffDimension: keyof EnergyCookingItemInput = "numberOfCookstove";

export function resetSurveyInput(
  localInput: EnergyCookingItemInput
): EnergyCookingItemInput {
  localInput.fuelType = "NO_ACCESS";
  delete localInput.numberOfCookstove; // percentage of percentage
  return resetSurveyFuelOption(localInput);
}

export function resetSurveyFuelOption(
  localInput: EnergyCookingItemInput
): EnergyCookingItemInput {
  delete localInput.fuelUsage;
  delete localInput.sustainablySourced;
  delete localInput.dryWood;
  delete localInput.carbonized;
  delete localInput.appliance;

  delete localInput.disableDieselLiters; // do I know the total litres of diesels
  localInput.disabledFuelUsage = false;
  localInput.generatorLoad = 0.6; // default factor of 60%
  delete localInput.generatorSize;
  delete localInput.operatingHours;
  delete localInput.solarInstalled;
  delete localInput.renewablePower;
  delete localInput.gridPower;

  return localInput;
}

export function getDefaultFuel(
  localInput: EnergyCookingItemInput,
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

  let fuelUsage =
    (currentStove.defaults?.[localInput.fuelType] ?? 0) * pp_per_hh;

  // for electric we don't use fuelUsage; fix for gridPower solarPower

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
      text: "Cookstove",
      value: "input.cookstove",
      type: "select",
      image: true,
      style: {
        cols: "12",
      },
      hideFooterContent: false,
      items: cookstoveTECHs,
      tooltipInfoFn: (value: string) => {
        if (value === cookstoveIdWithoutAccess) {
          return cookstoveTECHs.find((x) => x._id === value)?.tooltipInfo;
        }
        if (value === cookstoveIdSolarCooker) {
          return cookstoveTECHs.find((x) => x._id === value)?.tooltipInfo;
        }
      },
      formatter: (_id: string, _: unknown, localItem: EnergyCookingItem) => {
        const cookStove =
          cookstoveTECHs.find((cookstove) => cookstove._id === _id) ??
          ({
            text: "Unknown",
          } as CookstoveTech);
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
      formatterTableComponent: (
        _id: string,
        _: unknown,
        localItem: EnergyCookingItem
      ) => {
        let appIcon;
        const appliance = localItem.input.appliance;
        switch (appliance) {
          case COOK_APP_Pressure:
            appIcon = "$mdiPotOutline";
            break;
          case COOK_APP_Heat_Retaining:
            appIcon = "$mdiBasketOutline";
            break;
          default:
            appIcon = "";
            break;
        }
        return [
          {
            icon: appIcon,
            description: appliance,
            fill: "black",
          },
        ];
      },
      customEventInput: (
        cookstoveId: string,
        localInput: EnergyCookingItemInput
      ) => {
        const currentStove = cookstoveTECHs.find(
          (cookstove) => cookstove._id === cookstoveId
        );

        // // find cooktstove
        if (!currentStove) {
          throw new Error("no cookstove matched");
        }
        localInput.image = currentStove.image;
        localInput.comment = currentStove.comment;
        localInput.fuelTypes = currentStove.fuelTypes as AllFuel[];
        if (currentStove._id === cookstoveIdWithoutAccess) {
          localInput.fuelType = noAccessFuels[0];
        }

        resetSurveyInput(localInput);
        // to force proper fuel type
        if (currentStove._id === cookstoveIdSolarCooker) {
          localInput.cookstove = cookstoveId;
          localInput.fuelType = thermalFuels[0];
          localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
          // compute default according to type
          localInput.renewablePower = computeThermalKWHPerYearFromPerDay(
            localInput.fuelUsage
          );
        }
        return localInput;
      },
    },
    {
      conditional_value: cookstoveIdsTECHsWithAccess,
      conditional: "cookstove",
      items: "input.fuelTypes",
      style: {
        cols: "12",
      },
      text: "Cookstove fuel",
      value: "input.fuelType",
      formatter: (v: AllFuel) => {
        return AllFuelsWithTextById?.[v]?.text;
      },
      formatterTableComponent: (
        fuelType: AllFuel,
        _: unknown,
        localItem: EnergyCookingItem
      ) => {
        const result = [];
        const fuelTypeEnhanced = `${fuelType}${
          localItem?.input?.carbonized ? "_C" : ""
        }`;
        if (fuelTypeEnhanced === "CHC" || fuelTypeEnhanced === "BRQ_C") {
          result.push({
            text: "(S3)",
            description:
              "Exceptionally, Scope 3 emissions relative to the production of charcoal are being considered due to their high impact.",
            fill: "black",
          });
        }
        if (fuelTypeEnhanced === "ETH") {
          result.push({
            text: "(S3)",
            description:
              "Exceptionally, Scope 3 emissions associated with feedstock production and/or processing of the fuel are being considered due to their high impact relative to the total emissions.",
            fill: "black",
          });
        }
        if (
          localItem?.input?.sustainablySourced ||
          ["ETH", "BGS"].includes(fuelTypeEnhanced)
        ) {
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
        localInput: EnergyCookingItemInput,
        ghgMapRef: ItemReferencesMap
      ) => {
        resetSurveyFuelOption(localInput);
        localInput.appliance = COOK_APP_Default;
        // setup default value based on fueltype
        if (fuelType === "FWD") {
          localInput.dryWood = true;
        }
        localInput.fuelType = fuelType;

        const defaultFuel = getDefaultFuel(localInput, pp_per_hh);
        localInput.fuelUsage = defaultFuel;
        localInput.hint = defaultFuel;
        localInput.persistentHint = true;

        // for hybrid mix NO DEFAULT VALUE
        if (localInput.fuelType === "ELE_HYB") {
          localInput.fuelUsage = undefined;
        }
        if (localInput.fuelType === "ELE_GRID") {
          localInput.fuelUsage = undefined;
          localInput.gridPower = defaultFuel;
        }
        if (localInput.fuelType === "ELE_SOLAR") {
          localInput.fuelUsage = undefined;
          localInput.renewablePower = defaultFuel;
          localInput.solarInstalled =
            computeKWInstalledWithKwhPerYearPerCountry(
              localInput.renewablePower,
              countryCode,
              projectSolar
            );
        }

        if (fuelType === "ELE_DIES") {
          // compute default according to type
          localInput.dieselPower = computeDieselPower(
            localInput as EnergyItem,
            ghgMapRef?.REF_EFF_DIES_L
          );
        }
        return localInput;
      },
      type: "select",
      hideFooterContent: false,
    },
    {
      value: "input.disabledFuelUsage",
      text: (localInput: EnergyCookingItemInput) => {
        let result = "Fuel quantity known?";
        const biomassFuelsText = "Biomass quantity known?";
        const liquidFuelsText = "Number of liters known?";
        const gasFuelsText = result;
        const lpgFuelsText = result;
        const electricFuelsText = "Energy consumption known?";
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
        localInput: EnergyCookingItemInput
      ) => {
        if (!localInput.fuelType) {
          return localInput;
        }
        if (!disabledFuelUsage) {
          localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
        } else {
          if (localInput.disableDieselLiters) {
            localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
          }
        }
        localInput.appliance = COOK_APP_Default;

        return localInput;
      },
    },
    ...dieselInputsProducedPer("Day", "Day", {
      hideFooterContent: true,
      cookingMode: true,
      pp_per_hh: pp_per_hh,
    }),
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
        localInput: EnergyCookingItemInput
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
      text: (localInput: EnergyCookingItemInput) => {
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
      conditional_value: allFuelsButElectric,
      conditional: "fuelType",
      style: {
        cols: "12",
      },
      type: "number",
      persistentHint: true,
      hintFn: (options: {
        localInput: EnergyCookingItemInput;
        surveyItemHeader: SurveyTableHeader;
        intervention: boolean;
      }): string | undefined => {
        // warning since it's a percentage we return 1; because it means 100%
        return `default: ${getDefaultFuel(options?.localInput, pp_per_hh)}`;
      },
      disabledWithConditions: "disabledFuelUsage",
      disabledWithConditions_value: false,
      customEventInput: (
        fuelUsage: number,
        localInput: EnergyCookingItemInput
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
      text: `Solar thermal (kWh/year/HH) estimated`,
      formatter: (v: number) => {
        return formatNumberGhg(v);
      },
      customEventInput: (
        renewablePower: number,
        localInput: EnergyCookingItemInput
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

    {
      text: "Cookstove appliance",
      value: "input.appliance",
      conditional_function: (itemInput: SurveyInput) => {
        // const result = true;
        // rules regarding appliance :
        //   - only some cookstove tech have access
        //   - show if Fuel quantity not known (disabledFuelUsage is true)
        //   - show only if
        //     - cooking is electric diesel generator AND
        //     -  disabledFuelUsage is True AND
        //     -  disableDieselLiters is False (no diesel generator charact )
        // when disabledFuelUsage == TRUE AND disableDieselLiters is False
        // --> automatic number of diesel liters with default value
        // return true;

        if (
          itemInput.fuelType === undefined ||
          itemInput.fuelType === "NO_ACCESS"
        ) {
          return false;
        }
        if (itemInput.disabledFuelUsage) {
          if (itemInput.fuelType === "ELE_DIES") {
            return itemInput.disableDieselLiters;
          }
          if (itemInput.fuelType === "ELE_HYB") {
            return false;
          }
          return true;
        }

        if (
          itemInput.cookstove &&
          !(cookstoveIdsTECHsWithAccess as string[]).includes(
            itemInput.cookstove as string
          )
        ) {
          return false;
        }
        return false;
      },
      items: [COOK_APP_Default, COOK_APP_Pressure, COOK_APP_Heat_Retaining],
      style: {
        cols: "12",
      },
      type: "select",
      customEventInput: (
        appliance: string,
        localInput: EnergyCookingItemInput,
        ghgMapRef: ItemReferencesMap
      ) => {
        if (!localInput.fuelUsage) {
          return localInput;
        }
        localInput.appliance = appliance;
        localInput.fuelUsage = getDefaultFuel(localInput, pp_per_hh);
        // exception
        if (localInput.fuelType === "ELE_DIES") {
          // localInput = dieselEstimated(localInput, true);
          const dieselEstimatedRes = dieselEstimated(true);
          localInput.dieselPowerEstimated =
            dieselEstimatedRes.dieselLitersEstimated;
          localInput.dieselLitersEstimated =
            dieselEstimatedRes.dieselLitersEstimated;
          // TODO check that's okay for number of day.

          localInput.dieselPower = computeDieselPower(
            localInput as EnergyItem,
            ghgMapRef?.REF_EFF_DIES_L
          );
        }
        if (localInput.fuelType === "ELE_GRID") {
          localInput.gridPower = getDefaultFuel(localInput, pp_per_hh);
        }
        if (localInput.fuelType === "ELE_SOLAR") {
          localInput.renewablePower = getDefaultFuel(localInput, pp_per_hh);
          localInput.solarInstalled =
            computeKWInstalledWithKwhPerYearPerCountry(
              localInput.renewablePower,
              countryCode,
              projectSolar
            );
        }
        return localInput;
      },
    },

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
      value: "input.numberOfCookstove",
      conditional_value: "",
      conditional: ["cookstove"],
      style: {
        cols: "12",
      },
      max: 100,
      subtype: "percent",
      type: "number",
      hideFooterContent: false,
      formatter: (v: number) => {
        return formatNumberGhg(v, {
          style: "percent",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
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

// this.project.totalHH
// this.project.countryCode
export function generateComputeItem(
  countryCode: string,
  projectTotalHH: number,
  itemsGHGfNRB: GHGfNRB[],
  project_REF_GRD: ReferenceItemInterface
): (
  localItemInput: EnergyCookingItemInput,
  ghgMapRef: ItemReferencesMap
) => EnergyCookingItemResults {
  return function computeItem(
    localItemInput: EnergyCookingItemInput,
    ghgMapRef: ItemReferencesMap
  ): EnergyCookingItemResults {
    const {
      numberOfCookstove: percentageOfTotalCookstove,
      fuelUsage,
      appliance,
    } = localItemInput;
    const { fuelType } = localItemInput;
    if (percentageOfTotalCookstove === undefined) {
      throw new Error("number of cooktsove not defined");
    }
    if (projectTotalHH === undefined) {
      throw new Error(
        "Total House holds is undefined, please fill assessment information page and click on save"
      );
    }
    const hhUsingTheFuel = percentageOfTotalCookstove * projectTotalHH; // number of cookstoves
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
        totalCO2Emission = computeCO2costElectric(
          localItemInput,
          ghgMapRef,
          project_REF_GRD,
          hhUsingTheFuel * applianceEff * numberOfDaysPerYear
        );
        break;
      case thermalFuels.includes(fuelType as ThermalFuel):
        totalCO2Emission = 0;
        break;
      default:
        if (localItemInput.cookstove !== cookstoveIdWithoutAccess) {
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
