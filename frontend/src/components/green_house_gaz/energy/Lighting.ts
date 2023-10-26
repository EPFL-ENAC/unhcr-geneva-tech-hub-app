import { numberOfDaysPerYear } from "@/components/green_house_gaz/energy/computeCO2cost";
import { CountryIrradianceKeys } from "@/components/green_house_gaz/energy/solarInputs";
import {
  AllFuel,
  allFuelsForLighing,
  AllLightingFuelsWithTextById,
  BioMassFuel,
  biomassFuels,
  ElectricDevices,
  electricDevicesWithText,
  ElectricFuel,
  electricFuels,
  electricFuelsWithoutNone,
  GasFuel,
  gasFuels,
  IdTextTypesItem,
  LightingFuel,
  LiquidFuel,
  liquidFuels,
  plugInOrChargeBatteryDevice,
  singleUseBatteryDevice,
  solarLanternDevice,
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

import { SelectOption, SelectValue } from "@/components/commons/FormItem";
import { cookstoveIdsTECHsWithBioMass } from "@/components/green_house_gaz/energy/CookstoveTech";
import { computeThermalKWHPerYearFromPerDay } from "@/components/green_house_gaz/energy/thermalInputs";
import {
  ensureSurveyTableHeaders,
  SurveyTableHeader,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";
import { computeCO2costElectric } from "./poweredBy";

export interface EnergyLightingItemInput extends SurveyInput, EnergyItem {
  percentageOfTotalHouseHolds?: number; // computed based on % of HH and stuffs
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

  numberOfDevices?: number; // special for electric
  electricPower?: number; // special for electric
  deviceType?: string; // special for electric
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

export const diffDimension: keyof EnergyLightingItemInput =
  "percentageOfTotalHouseHolds";

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
  localInput.percentageOfTotalHouseHolds = 0;
  return resetSurveyFuelOption(localInput);
}

export function resetDeviceInput(
  localInput: EnergyLightingItemInput
): EnergyLightingItemInput {
  // delete localInput.electricPower;
  // delete localInput.numberOfDevices;
  // delete localInput.operatingHours;
  // set default value here ?
  delete localInput.deviceType;
  return localInput;
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
  delete localInput.solarInstalled;

  delete localInput.fuelUsageFirewood;
  delete localInput.fuelUsageParaffin;
  delete localInput.fuelUsageKerosene;
  return localInput;
}

export const plugingRecheargeableDevices = [
  "POWER_KNOWN",
  "PLUGIN_LIGHT_BULB",
  "PLUGIN_LAMP_WITH_PLUGS",
  "RECHARGEABLE_BAT_TORCH",
  "RECHARGEABLE_BAT_LANTERN",
] as const;
export type PlugingRecheargeableDevice =
  typeof plugingRecheargeableDevices[number];
export const plugingRecheargeableDevicesWithText: IdTextTypesItem<PlugingRecheargeableDevice>[] =
  [
    { _id: "POWER_KNOWN", text: "Power of device known", default: 10 },
    { _id: "PLUGIN_LIGHT_BULB", text: "Plugin light-bulb", default: 60 },
    {
      _id: "PLUGIN_LAMP_WITH_PLUGS",
      text: "Plugin lamp with plugs",
      default: 10,
    },
    {
      _id: "RECHARGEABLE_BAT_TORCH",
      text: "Rechargeable batteries handheld torch",
      default: 1,
    },
    {
      _id: "RECHARGEABLE_BAT_LANTERN",
      text: "Recheargeable batteries lantern",
      default: 3,
    },
  ];

export const singleUseBatteryDevices = ["TORCH", "LANTERN"] as const;
export type SingleUseBatteryDevices = typeof singleUseBatteryDevices[number];
export const singleUseBatteryDevicesWithText: IdTextTypesItem<SingleUseBatteryDevices>[] =
  [
    { _id: "TORCH", text: "Handheld torch", default: 1 },
    { _id: "LANTERN", text: "Lantern", default: 1 },
  ];
export type AllDevices =
  | SingleUseBatteryDevices
  | PlugingRecheargeableDevice
  | ElectricDevices;
export const AllDevicesWithTextById = [
  ...plugingRecheargeableDevicesWithText,
  ...singleUseBatteryDevicesWithText,
  ...electricDevicesWithText,
].reduce((acc, el: IdTextTypesItem<AllDevices>) => {
  acc[el._id] = el;
  return acc;
}, {} as Record<AllDevices, IdTextTypesItem<AllDevices>>);

export const solidFuelsEnergyType = "Solid fuels";
export const liquidFuelsEnergyType = "Liquid fuels";
export const electricFuelsEnergyType = "Electric / solar devices";

export const energyTypes = [
  solidFuelsEnergyType,
  liquidFuelsEnergyType,
  electricFuelsEnergyType,
] as const;
export type EnergyType = typeof energyTypes[number];

export const energySubTypes = [
  "SOLAR_LANTERN",
  "SINGLE_USE_BAT",
  "PLUG_IN_OR_CHARGE_BAT",
] as const;
export type EnergySubType = typeof energySubTypes[number];

export function conditionalFunctionElectricSolarDevices(
  itemInput: SurveyInput
) {
  if (
    itemInput?.energyType == electricFuelsEnergyType &&
    itemInput?.energySubType != undefined
  ) {
    return true;
  }
  return false;
}

export function commonElectricSolarDevicesHeaders() {
  return [
    {
      style: {
        cols: "12",
      },
      text: "Select device",
      type: "select",
      items: (options: {
        localInput: SurveyInput;
        surveyItemHeader: SurveyTableHeader;
        intervention: boolean;
      }): SelectOption<SelectValue>[] => {
        let result: AllDevices[] = [];
        if (options.localInput.energySubType === singleUseBatteryDevice) {
          result = [...singleUseBatteryDevices];
        }
        if (options.localInput.energySubType === plugInOrChargeBatteryDevice) {
          result = [...plugingRecheargeableDevices];
        }
        return result.map((item: AllDevices) => ({
          text: AllDevicesWithTextById[item]?.text,
          value: item,
        }));
      },
      formatter: (v: AllDevices) => {
        return AllDevicesWithTextById[v]?.text;
      },
      customEventInput: (deviceType: AllDevices, localInput: SurveyInput) => {
        localInput.electricPower =
          AllDevicesWithTextById[deviceType]?.default ?? 0;
        return localInput;
      },
      value: "input.deviceType",
      suffix: "W",
      optional: false,
      required: true,
      hideFooterContent: true,
      conditional_function: (itemInput: SurveyInput) => {
        return (
          itemInput?.energySubType != solarLanternDevice &&
          conditionalFunctionElectricSolarDevices(itemInput)
        );
      },
    },
    {
      style: {
        cols: "4",
      },
      text: "Watts",
      type: "number",
      min: 0,
      max: 9000,
      formatter: (v: number) => {
        return formatNumberGhg(v);
      },
      value: "input.electricPower",
      suffix: "W",
      hideFooterContent: true,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
    {
      style: {
        cols: "4",
      },
      text: "Number of devices",
      min: 0,
      formatter: (v: number) => {
        return formatNumberGhg(v);
      },
      type: "number",
      value: "input.numberOfDevices",
      hideFooterContent: false,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
    {
      style: {
        cols: "4",
      },
      text: "Operating hours per day",
      type: "number",
      value: "input.operatingHours",
      formatter: (v: number) => {
        return formatNumberGhg(v);
      },
      suffix: "h",
      hideFooterContent: false,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
    {
      style: {
        cols: "6",
      },
      text: "Total power",
      min: 0,
      type: "number",
      formatter: (v: number) => {
        return formatNumberGhg(v, { suffix: "W" });
      },
      value: "computed.totalPower",
      suffix: "W",
      isInput: true,
      disabled: true,
      optional: true,
      hideFooterContent: false,
      computeResults: true,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
    {
      style: {
        cols: "6",
      },
      text: "Total energy",
      min: 0,
      type: "number",
      formatter: (v: number) => {
        return formatNumberGhg(v, { suffix: "kWh/year" });
      },
      value: "computed.totalEnergy",
      suffix: "kWh/year",
      isInput: true,
      disabled: true,
      optional: true,
      hideFooterContent: false,
      computeResults: true,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
  ];
}

export function conditionalFunctionElectricHybDevices(itemInput: SurveyInput) {
  if (
    itemInput?.energyType == electricFuelsEnergyType &&
    itemInput?.energySubType === plugInOrChargeBatteryDevice &&
    itemInput.fuelType === "ELE_HYB"
  ) {
    return true;
  }
  return false;
}

export function hybridLightingElectricHeaders() {
  // diesel/ grid / solar
  const hybridPercentagesRuleFn = (localInput: SurveyInput, surveyItem: SurveyTableHeader) => {
    const { dieselPercentage, gridPercentage, solarPercentage } =
      localInput;
    const totalPercentage =
      ((dieselPercentage as number) ?? 0) +
      ((gridPercentage as number) ?? 0) +
      ((solarPercentage as number) ?? 0);
    return [
      (v: number) =>
        totalPercentage <= 1 ||
        `Total percentage should be <= 100%: it's ${formatNumberGhg(
          totalPercentage * 100
        )}`,
    ];
  };
  return [
    {
      style: {
        cols: "4",
      },
      text: "Diesel generator",
      value: "input.dieselPercentage",
      subtype: "percent",
      type: "number",
      rulesFn: hybridPercentagesRuleFn,
      hideFooterContent: false,
      formatter: (v: number) => {
        return formatNumberGhg(v, {
          style: "percent",
        });
      },
      conditional_function: conditionalFunctionElectricHybDevices,
    },
    {
      style: {
        cols: "4",
      },
      text: "Grid",
      value: "input.gridPercentage",
      subtype: "percent",
      type: "number",
      hideFooterContent: false,
      formatter: (v: number) => {
        return formatNumberGhg(v, {
          style: "percent",
        });
      },
      rulesFn: hybridPercentagesRuleFn,
      conditional_function: conditionalFunctionElectricHybDevices,
    },
    {
      style: {
        cols: "4",
      },
      text: "Solar",
      value: "input.solarPercentage",
      subtype: "percent",
      type: "number",
      rulesFn: hybridPercentagesRuleFn,
      hideFooterContent: false,
      formatter: (v: number) => {
        return formatNumberGhg(v, {
          style: "percent",
        });
      },
      conditional_function: conditionalFunctionElectricHybDevices,
    },
  ];
}
export function headers(
  countryCode: CountryIrradianceKeys,
  projectSolar: number | undefined,
  pp_per_hh: number | undefined
) {
  return [
    ...surveyTableHeaderIncrements,
    {
      items: [
        solidFuelsEnergyType,
        liquidFuelsEnergyType,
        electricFuelsEnergyType,
      ],
      style: {
        cols: "12",
      },
      text: "Energy for lighting",
      type: "select",
      value: "input.energyType",
      customEventInput: (
        energyType: EnergyType,
        localInput: EnergyLightingItemInput
      ) => {
        localInput = resetSurveyInput(localInput);
        localInput = resetDeviceInput(localInput);
        return localInput;
      },
      hideFooterContent: false,
    },
    {
      // items: ["SOLAR_LANTERN", "SINGLE_USE_BAT", "PLUG_IN_OR_CHARGE_BAT"],
      items: (): SelectOption<SelectValue>[] => {
        const result: string[] = [...energySubTypes];
        return result.map((item: string) => ({
          text: AllLightingFuelsWithTextById?.[item as AllFuel]?.text,
          value: item,
        }));
      },
      style: {
        cols: "12",
      },
      formatter: (v: AllFuel) => {
        return AllLightingFuelsWithTextById?.[v]?.text;
      },
      text: "Type of Lighting Device",
      type: "select",
      value: "input.energySubType",
      hideFooterContent: false,
      customEventInput: (
        energySubType: EnergySubType,
        localInput: EnergyLightingItemInput
      ) => {
        localInput = resetDeviceInput(localInput);
        localInput.electricPower =
          AllDevicesWithTextById[energySubType]?.default ?? 0;
        return localInput;
      },
      conditional_function: (itemInput: SurveyInput) => {
        if (itemInput?.energyType == electricFuelsEnergyType) {
          return true;
        }
        return false;
      },
    },
    {
      text: "Lighting powered by",
      value: "input.fuelType",
      items: (options: {
        localInput: SurveyInput;
        surveyItemHeader: SurveyTableHeader;
        intervention: boolean;
      }): SelectOption<SelectValue>[] => {
        let result: string[] = [];
        if (options.localInput.energyType === undefined) {
          result = allFuelsForLighing;
        }
        if (options.localInput.energyType === solidFuelsEnergyType) {
          result = ["FWD", "CNDL"];
        }
        if (options.localInput.energyType === liquidFuelsEnergyType) {
          result = ["OIL", "PET", "KRS"];
        }
        if (options.localInput.energyType === electricFuelsEnergyType) {
          // result = ["SOLAR_LANTERN", "SINGLE_USE_BAT", "PLUG_IN_OR_CHARGE_BAT"];
          result = electricFuelsWithoutNone as unknown as string[];
        }
        return result.map((item: string) => ({
          text: AllLightingFuelsWithTextById?.[item as AllFuel]?.text,
          value: item,
        }));
      },
      style: {
        cols: "12",
      },
      conditional_function: (itemInput: SurveyInput) => {
        if (itemInput?.energyType == undefined) {
          return false;
        }
        if (itemInput?.energyType == electricFuelsEnergyType) {
          // check for subtype!
          return itemInput?.energySubType == plugInOrChargeBatteryDevice;
        }

        return true;
      },
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
      type: "select",
      hideFooterContent: false,
    },
    ...hybridLightingElectricHeaders(),
    ...commonElectricSolarDevicesHeaders(),
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
      value: "input.percentageOfTotalHouseHolds",
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
          style: "percent",
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
// this.project.countryCode
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
    const { percentageOfTotalHouseHolds, fuelUsage, fuelType, energySubTypes } =
      localItemInput;
    if (percentageOfTotalHouseHolds === undefined) {
      throw new Error("percentage of total households not defined");
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
    const hhUsingTheFuel = percentageOfTotalHouseHolds * projectTotalHH; // number of cookstoves
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
      case plugingRecheargeableDevices.includes(
        energySubTypes as PlugingRecheargeableDevice
      ):
        totalCO2Emission = 0;
        break;
      case ["BAT", "LIGHT_SOLAR"].includes(fuelType as LightingFuel):
      case thermalFuels.includes(fuelType as ThermalFuel):
        totalCO2Emission = 0;
        break;
      // case fuelType === "LIGHT_HYB": {
      //   const { fuelUsageFirewood, fuelUsageParaffin, fuelUsageKerosene } =
      //     localItemInput;
      //   if (fuelUsageFirewood === undefined) {
      //     throw new Error("fuel usage not defined");
      //   }
      //   const fuelEfficiencyFirewood = ghgMapRef?.[`REF_EFF_FWD`]?.value;
      //   if (fuelEfficiencyFirewood == undefined) {
      //     const errorMessage = `there are no emission factor REF_EFF_FWD`;
      //     throw new Error(errorMessage);
      //   }
      //   const totalCO2EmissionFirewood =
      //     hhUsingTheFuel *
      //     fuelUsageFirewood * // fuel consumed in kg / day
      //     0.001 * // 1t/1000kg
      //     numberOfDaysPerYear * // days/yr
      //     fuelEfficiencyFirewood;

      //   // PARAFFIN
      //   if (fuelUsageParaffin === undefined) {
      //     throw new Error("fuel usage not defined");
      //   }
      //   const fuelEfficiencyParaffin = ghgMapRef?.[`REF_EFF_CNDL`]?.value;
      //   if (fuelEfficiencyParaffin == undefined) {
      //     const errorMessage = `there are no emission factor REF_EFF_CNDL`;
      //     throw new Error(errorMessage);
      //   }
      //   const totalCO2EmissionParaffin =
      //     hhUsingTheFuel *
      //     fuelUsageParaffin * // fuel consumed in kg / day
      //     0.001 * // 1t/1000kg
      //     numberOfDaysPerYear * // days/yr
      //     fuelEfficiencyParaffin;
      //   // END PARAFFIN

      //   // KEROSENE
      //   if (fuelUsageKerosene === undefined) {
      //     throw new Error("fuel usage not defined");
      //   }
      //   const fuelEfficiencyKerosene = ghgMapRef?.[`REF_EFF_KRS`]?.value;
      //   if (fuelEfficiencyKerosene == undefined) {
      //     const errorMessage = `there are no emission factor REF_EFF_KRS`;
      //     throw new Error(errorMessage);
      //   }
      //   const totalCO2EmissionKerosene =
      //     hhUsingTheFuel *
      //     fuelUsageKerosene * // fuel consumed in kg / day
      //     0.001 * // 1t/1000kg
      //     numberOfDaysPerYear * // days/yr
      //     fuelEfficiencyKerosene;
      //   // END KEROSENE
      //   totalCO2Emission =
      //     totalCO2EmissionFirewood +
      //     totalCO2EmissionParaffin +
      //     totalCO2EmissionKerosene;
      //   break;
      // }
      case ["NO_ACCESS"].includes(fuelType):
        totalCO2Emission = 0;
        break;
      default:
        throw new Error(`unknown fuel type ${fuelType}`);
    }
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is NaN`);
    }

    const totalPower =
      (localItemInput?.numberOfDevices ?? 0) *
      (localItemInput?.electricPower ?? 0);
    const operatingHours = localItemInput?.operatingHours ?? 0;
    const totalEnergy = (totalPower * operatingHours * 365.25) / 1000; // in kWh/year
    return {
      totalCO2Emission,
      totalPower,
      totalEnergy,
    };
  };
}
