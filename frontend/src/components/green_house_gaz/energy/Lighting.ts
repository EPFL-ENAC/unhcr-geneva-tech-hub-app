/* eslint-disable @typescript-eslint/no-explicit-any */
import { numberOfDaysPerYear } from "@/components/green_house_gaz/energy/computeCO2cost";
import {
  CountryIrradianceKeys,
  getSolarPowerText,
} from "@/components/green_house_gaz/energy/solarInputs";
import {
  AllFuel,
  allFuelsForLighing,
  AllLightingFuelsWithTextById,
  BioMassFuel,
  biomassFuels,
  ElectricDevices,
  electricDevicesWithText,
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
import { getDieselPowerText } from "./dieselInputs";
import { computeCO2costElectric, getGridPowerText } from "./poweredBy";

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
  deviceType?: AllDevices; // special for electric

  energyType?: EnergyType;
  energySubType?: EnergySubType;

  gridPercentage?: number;
  dieselPercentage?: number;
  solarPercentage?: number;
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
  "PLUGIN_LIGHT_BULB_INC",
  "PLUGIN_LIGHT_BULB_LED",
  "RECHARGEABLE_BAT_TORCH",
  "RECHARGEABLE_BAT_BIG_TORCH",
  "RECHARGEABLE_BAT_LANTERN",
] as const;
export type PlugingRecheargeableDevice =
  (typeof plugingRecheargeableDevices)[number];
export const plugingRecheargeableDevicesWithText: IdTextTypesItem<PlugingRecheargeableDevice>[] =
  [
    { _id: "POWER_KNOWN", text: "Power of device known" },
    {
      _id: "PLUGIN_LIGHT_BULB_INC",
      text: "Incandescent light bulb (plug-in)",
    },
    {
      _id: "PLUGIN_LIGHT_BULB_LED",
      text: "LED light bulb (plug-in)",
    },
    {
      _id: "RECHARGEABLE_BAT_TORCH",
      text: "Small handheld torch (rechargeable batteries)",
    },
    {
      _id: "RECHARGEABLE_BAT_BIG_TORCH",
      text: "Big handheld torch (rechargeable batteries)",
    },
    {
      _id: "RECHARGEABLE_BAT_LANTERN",
      text: "Lantern (rechargeable batteries)",
    },
  ];

export const singleUseBatteryDevices = [
  "TORCH",
  "TORCH_BIG",
  "LANTERN",
] as const;
export type SingleUseBatteryDevices = (typeof singleUseBatteryDevices)[number];
export const singleUseBatteryDevicesWithText: IdTextTypesItem<SingleUseBatteryDevices>[] =
  [
    { _id: "TORCH", text: "Small handheld torch" },
    { _id: "TORCH_BIG", text: "Big handheld torch" },
    { _id: "LANTERN", text: "Lantern" },
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
export const electricFuelsEnergyType = "Electric / Battery / Solar";
export const energyTypes = [
  solidFuelsEnergyType,
  liquidFuelsEnergyType,
  electricFuelsEnergyType,
] as const;
export type EnergyType = (typeof energyTypes)[number];

export const energySubTypes = [
  "SOLAR_LANTERN",
  "SINGLE_USE_BAT",
  "PLUG_IN_OR_CHARGE_BAT",
] as const;
export type EnergySubType = (typeof energySubTypes)[number];

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
  const timePeriod = "Year";
  return [
    {
      value: "input.deviceType",
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
      customEventInput: (
        deviceType: AllDevices,
        localInput: SurveyInput,
        _: ItemReferencesMap,
        ghgMapDefaultValue: ItemReferencesMap
      ) => {
        localInput.electricPower =
          ghgMapDefaultValue?.[`REF_LIGHTING_${deviceType}`]?.value ?? 0;
        return localInput;
      },
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
      hintFn: (options: {
        localInput: EnergyLightingItemInput;
        surveyItemHeader: SurveyTableHeader;
        intervention: boolean;
        ghgMapDefaultValues?: ItemReferencesMap;
      }): string | undefined => {
        const defaultPower = getDefaultPower(
          options?.localInput,
          options?.ghgMapDefaultValues
        );
        // warning since it's a percentage we return 1; because it means 100%
        return `default: ${defaultPower}`;
      },
      hideFooterContent: true,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
    {
      style: {
        cols: "4",
      },
      text: "Number of devices per household",
      min: 0,
      formatter: (v: number) => {
        return formatNumberGhg(v);
      },
      type: "number",
      value: "input.numberOfDevices",
      hideFooterContent: true,
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
      hideFooterContent: true,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
    {
      style: {
        cols: "6",
      },
      text: `Total power`,
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
      hideFooterContent: true,
      computeResults: true,
      conditional_function: conditionalFunctionElectricSolarDevices,
    },
    {
      style: {
        cols: "6",
      },
      value: "computed.totalEnergy",
      text: "Annual fuel / Energy consumption",
      formatter: (v: number, _: any, localInput: any) => {
        let suffixTimePeriod = "";
        switch (timePeriod) {
          case "Year":
            suffixTimePeriod = "/yr";
            break;
          default:
            break;
        }
        const suffix = `kWh${suffixTimePeriod}`;

        if (localInput?.input?.energyType === solidFuelsEnergyType) {
          return formatNumberGhg(localInput?.input?.fuelUsage * 365.25, {
            suffix: "kg/yr",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });
        }
        if (localInput?.input?.energyType === liquidFuelsEnergyType) {
          return formatNumberGhg(localInput?.input?.fuelUsage * 365.25, {
            suffix: "L/yr",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });
        }
        if (
          localInput?.input?.fuelType === "ELE_SOLAR" ||
          localInput?.input?.fuelType === "ELE_HYB" ||
          localInput?.input?.fuelType === "ELE_GRID"
          // localInput?.input?.fuelType === "ELE_DIES"
        ) {
          // use the formater of the correct input!
          return formatNumberGhg(v, {
            suffix,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });
        }
        if (localInput?.input?.fuelType === "ELE_DIES") {
          // return dieselFormatter(v, args, localInput);
          return formatNumberGhg(localInput?.input?.fuelUsage, {
            suffix: "L/yr",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });
        }
        if (localInput?.input?.fuelType === "NO_ACCESS") {
          return formatNumberGhg(v, {
            suffix,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });
        }
        return formatNumberGhg(localInput?.input?.fuelUsage, {
          suffix: "L/yr",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        });
      },
      tooltipInfoFn: (value: string, args: any, localItem: any) => {
        // iterate diesel/grid/solar estimated
        let suffixTimePeriod = "";
        switch (timePeriod) {
          case "Year":
            suffixTimePeriod = "/yr";
            break;
          default:
            break;
        }
        const suffix = `kWh${suffixTimePeriod}`;
        if (localItem?.input?.fuelType === "ELE_HYB") {
          const dieselTotalPowerRatio =
            (localItem?.computed?.totalEnergy ?? 0) *
            (localItem?.input?.dieselPercentage ?? 0);
          const gridTotalPowerRatio =
            (localItem?.computed?.totalEnergy ?? 0) *
            (localItem?.input?.gridPercentage ?? 0);
          const solarTotalPowerRatio =
            (localItem?.computed?.totalEnergy ?? 0) *
            (localItem?.input?.solarPercentage ?? 0);
          return `
        <ul>
            <li>
            ${getDieselPowerText()}:
                ${formatNumberGhg(dieselTotalPowerRatio)} ${suffix}
            </li>
            <li>
              ${getGridPowerText()}:
              ${formatNumberGhg(gridTotalPowerRatio)} ${suffix}
            </li>
            <li>
            ${getSolarPowerText()}:
            ${formatNumberGhg(solarTotalPowerRatio)} ${suffix}
          </li>
          <ul>
        `;
        }
        return false;
      },
      min: 0,
      type: "number",
      // formatter: (v: number) => {
      //   return formatNumberGhg(v, { suffix: "kWh/year" });
      // },
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

export function getDefaultFuel(
  localInput: EnergyLightingItemInput,
  pp_per_hh: number | undefined,
  ghgMapDefaultValues?: ItemReferencesMap
): number {
  if (pp_per_hh === undefined) {
    // should be defined, so no error
    return 0;
  }

  const currentFuelType = localInput?.fuelType ?? "NO_ACCESS";
  const currentDefault =
    ghgMapDefaultValues?.[`REF_LIGHTING_${currentFuelType}`]?.value ?? 0;
  return currentDefault * pp_per_hh;
}

export function getDefaultPower(
  localInput: EnergyLightingItemInput,
  ghgMapDefaultValues?: ItemReferencesMap
): number {
  const currentEnergySubType = localInput.energySubType;
  const currentEnergyType = localInput.energyType;
  let defaultElectricPower = 0;
  if (currentEnergyType == electricFuelsEnergyType) {
    if (currentEnergySubType !== solarLanternDevice) {
      if (localInput.deviceType !== undefined) {
        defaultElectricPower =
          ghgMapDefaultValues?.[`REF_LIGHTING_${localInput.deviceType}`]
            ?.value ?? 0;
      }
    } else {
      if (currentEnergySubType !== undefined) {
        defaultElectricPower =
          ghgMapDefaultValues?.[`REF_LIGHTING_${currentEnergySubType}`]
            ?.value ?? 0;
      }
    }
  }

  return defaultElectricPower;
}

export function hybridLightingElectricHeaders() {
  // diesel/ grid / solar

  const hybridPercentagesRuleFn =
    (key: string) =>
    // (localInput: SurveyInput, surveyItem: SurveyTableHeader) => {
    (localInput: SurveyInput) => {
      // warning: It's not working properly because of computed lag
      return [
        // (v: number) => {
        () => {
          const { dieselPercentage, gridPercentage, solarPercentage } =
            localInput;
          const totalPercentage =
            ((dieselPercentage as number) ?? 0) +
            ((gridPercentage as number) ?? 0) +
            ((solarPercentage as number) ?? 0);
          console.log("totalPercentage", totalPercentage, key);
          return true;
          // return (
          //   totalPercentage <= 1 ||
          //   `Sum should be == 100%  Sum now = ${formatNumberGhg(
          //     totalPercentage,
          //     {
          //       style: "percent",
          //     }
          //   )}`
          // );
        },
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
      rulesFn: hybridPercentagesRuleFn("dieselPercentage"),
      hideFooterContent: true,
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
      hideFooterContent: true,
      formatter: (v: number) => {
        return formatNumberGhg(v, {
          style: "percent",
        });
      },
      rulesFn: hybridPercentagesRuleFn("gridPercentage"),
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
      rulesFn: hybridPercentagesRuleFn("solarPercentage"),
      hideFooterContent: true,
      formatter: (v: number) => {
        return formatNumberGhg(v, {
          style: "percent",
        });
      },
      conditional_function: conditionalFunctionElectricHybDevices,
    },
    // {
    //   style: {
    //     cols: "12",
    //   },
    //   text: "Total percentage",
    //   value: "computed.totalPercentage",
    //   isInput: true,
    //   subtype: "percent",
    //   type: "number",
    //   rulesFn: hybridPercentagesRuleFn("solarPercentage"),
    //   hideFooterContent: true,
    //   formatter: (v: number) => {
    //     return formatNumberGhg(v, {
    //       style: "percent",
    //     });
    //   },
    //   conditional_function: conditionalFunctionElectricHybDevices,
    // },
  ];
}
export function headers(
  countryCode: CountryIrradianceKeys,
  projectSolar: number | undefined,
  pp_per_hh: number
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
      items: (): SelectOption<SelectValue>[] => {
        const result: string[] = [...energySubTypes];
        return result.map((item: string) => ({
          text: AllLightingFuelsWithTextById?.[item as AllFuel]?.text,
          value: item,
          default: AllLightingFuelsWithTextById?.[item as AllFuel]?.default,
        }));
      },
      style: {
        cols: "12",
      },
      formatter: (
        v: AllFuel,
        tableHeader: SurveyTableHeader,
        localItem: EnergyLightingItem
      ) => {
        const deviceType = localItem.input.deviceType;
        let deviceTypeText = "";
        if (deviceType !== undefined) {
          deviceTypeText = AllDevicesWithTextById[deviceType]?.text ?? "";
          deviceTypeText = ` — ${deviceTypeText}`;
        }
        return `${
          AllLightingFuelsWithTextById?.[v]?.text ?? "—"
        }${deviceTypeText}`;
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
          return itemInput?.energySubType == plugInOrChargeBatteryDevice;
        }

        return true;
      },
      formatter: (v: AllFuel, _: any, localItem: EnergyLightingItem) => {
        if (
          v === "NO_ACCESS" &&
          localItem.input.energySubType === "SOLAR_LANTERN"
        ) {
          return "Solar";
        }
        if (
          v === "NO_ACCESS" &&
          localItem.input.energySubType === "SINGLE_USE_BAT"
        ) {
          return "Batteries";
        }
        return AllLightingFuelsWithTextById?.[v]?.text;
      },
      tooltipInfoFn: (
        value: string,
        args: any,
        localItem: EnergyLightingItem
      ) => {
        if (localItem?.input?.fuelType === "ELE_HYB" || value === "ELE_HYB") {
          return `
          Hybrid mix percentages:<br/>
          Diesel generator: ${formatNumberGhg(
            localItem?.input?.dieselPercentage ?? 0,
            {
              style: "percent",
            }
          )}<br/>
          National Grid: ${formatNumberGhg(
            localItem?.input?.gridPercentage ?? 0,
            {
              style: "percent",
            }
          )}<br/>
          Solar: : ${formatNumberGhg(localItem?.input?.solarPercentage ?? 0, {
            style: "percent",
          })}`;
        }
        // if (localItem?.input?.fuelType === "CNDL" || value === "CNDL") {
        //   return `default (5 person/hh) 0.026 kg/d: Based on a mean weight loss of wax 6.75 g/h). Reference: <a target="_blank" href="https://iopscience.iop.org/article/10.1088/1757-899X/1252/1/012011/pdf">https://iopscience.iop.org/article/10.1088/1757-899X/1252/1/012011/pdf</a>`;
        // }
        // if (localItem?.input?.fuelType === "FWD" || value === "FWD") {
        //   return `default (5 person/hh) value is 1.7 kg wood/cap/day. Then, the wood consumed for Lighting would be: 2.14kg/capita/day -1.7 kg/cap/day =0.44 kg/capita/day kg/d: Based on a mean weight loss of wax 6.75 g/h). Reference: <a target="_blank" href="https://www.sciencedirect.com/science/article/pii/S0961953400000726">https://www.sciencedirect.com/science/article/pii/S0961953400000726</a>`;
        // }
      },
      tooltipAttrs: {
        "open-on-click": true,
        "open-on-focus": false,
        "open-on-hover": false,
        "close-delay": 1000,
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
        localInput: EnergyLightingItemInput,
        _?: ItemReferencesMap,
        ghgMapDefaultValues?: ItemReferencesMap
      ) => {
        resetSurveyFuelOption(localInput);
        // setup default value based on fueltype
        if (fuelType === "FWD") {
          localInput.dryWood = true;
        }
        localInput.fuelType = fuelType;
        localInput.fuelUsage = getDefaultFuel(
          localInput,
          pp_per_hh,
          ghgMapDefaultValues
        );
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
      persistentHint: true,
      hintFn: (options: {
        localInput: EnergyLightingItemInput;
        surveyItemHeader: SurveyTableHeader;
        intervention: boolean;
        ghgMapDefaultValues?: ItemReferencesMap;
      }): string | undefined => {
        // warning since it's a percentage we return 1; because it means 100%
        return `default: ${getDefaultFuel(
          options?.localInput,
          pp_per_hh,
          options?.ghgMapDefaultValues
        )}`;
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
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
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

// deprecated we don't use lihgt hybrid anymore
export function computeItemLightHyb(
  localItemInput: EnergyLightingItemInput,
  ghgMapRef: ItemReferencesMap,
  hhUsingTheFuel: number
) {
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
  return {
    totalCO2Emission:
      totalCO2EmissionFirewood +
      totalCO2EmissionParaffin +
      totalCO2EmissionKerosene,
  };
}

export function computeItemBiomass(
  fuelUsage: number | undefined,
  localItemInput: EnergyLightingItemInput,
  ghgMapRef: ItemReferencesMap,
  countryCode: string,
  fuelType: AllFuel,
  hhUsingTheFuel: number,
  itemsGHGfNRB: GHGfNRB[]
) {
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
    const fuelEfficiencyC = ghgMapRef?.[`REF_EFF_${fuelTypeEnhanced}_C`]?.value;
    if (fuelEfficiencyC == undefined) {
      const errorMessage = `there are no emission factor REF_EFF_${fuelTypeEnhanced}_C`;
      throw new Error(errorMessage);
    }
    const fuelEfficiencyP = ghgMapRef?.[`REF_EFF_${fuelTypeEnhanced}_P`]?.value;
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
    const fuelEfficiency = ghgMapRef?.[`REF_EFF_${fuelTypeEnhanced}`]?.value;
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
  return {
    totalCO2Emission:
      hhUsingTheFuel *
      fuelUsage * // fuel consumed in kg / day
      drynessFactor * // only for wood but since it's 1 as default it's going to be okay
      0.001 * // 1t/1000kg
      numberOfDaysPerYear * // days/yr
      efficiencyFactor,
  };
}

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
    const { percentageOfTotalHouseHolds, fuelUsage, fuelType, energySubType } =
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

    const totalPower =
      (localItemInput?.numberOfDevices ?? 0) *
      (localItemInput?.electricPower ?? 0);
    const operatingHours = localItemInput?.operatingHours ?? 0;
    const hhUsingTheFuel = percentageOfTotalHouseHolds * projectTotalHH; // number of cookstoves
    const totalEnergyPerHouseHold =
      totalPower * operatingHours * 365.25 * 0.001; // in kWh/year
    const totalEnergy =
      totalEnergyPerHouseHold * percentageOfTotalHouseHolds * projectTotalHH; // in kWh/year
    let totalCO2Emission = 0;

    switch (true) {
      /* solid fuels "FWD", "CHC", "BRQ", "PLTS" */
      case biomassFuels.includes(fuelType as BioMassFuel): {
        // todo: simplify argument to this function
        totalCO2Emission = computeItemBiomass(
          fuelUsage,
          localItemInput,
          ghgMapRef,
          countryCode,
          fuelType,
          hhUsingTheFuel,
          itemsGHGfNRB
        ).totalCO2Emission;
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
      case ["SOLAR_LANTERN", "SINGLE_USE_BAT"].includes(
        energySubType as PlugingRecheargeableDevice
      ): {
        totalCO2Emission = 0;
        break;
      }
      case ["PLUG_IN_OR_CHARGE_BAT"].includes(
        energySubType as PlugingRecheargeableDevice
      ): {
        totalCO2Emission = 0;
        switch (true) {
          case ["ELE_GRID"].includes(fuelType as PlugingRecheargeableDevice): {
            localItemInput.gridPower = totalEnergyPerHouseHold;
            localItemInput.fuelUsage = 0;
            totalCO2Emission = computeCO2costElectric(
              localItemInput,
              ghgMapRef,
              project_REF_GRD,
              hhUsingTheFuel
            );
            break;
          }
          case ["ELE_DIES"].includes(fuelType as PlugingRecheargeableDevice): {
            localItemInput.gridPower = 0;
            // totalEnergy is kWh/year
            // REF_EFF_DIES_L is  [l/kWh]
            // then fuelUsage is l/year
            localItemInput.fuelUsage =
              totalEnergy * ghgMapRef?.REF_EFF_DIES_L?.value;
            totalCO2Emission = computeCO2costElectric(
              localItemInput,
              ghgMapRef,
              project_REF_GRD,
              hhUsingTheFuel
            );
            break;
          }
          case ["ELE_SOLAR"].includes(fuelType as PlugingRecheargeableDevice): {
            totalCO2Emission = 0;
            break;
          }
          case ["ELE_HYB"].includes(fuelType as PlugingRecheargeableDevice): {
            // side effect here.
            localItemInput.gridPower =
              totalEnergyPerHouseHold * (localItemInput?.gridPercentage ?? 0);
            localItemInput.fuelUsage =
              totalEnergyPerHouseHold *
              ghgMapRef?.REF_EFF_DIES_L?.value *
              (localItemInput?.dieselPercentage ?? 0);
            totalCO2Emission = computeCO2costElectric(
              localItemInput,
              ghgMapRef,
              project_REF_GRD,
              hhUsingTheFuel
            );
            break;
          }
          default:
            break;
        }
        break;
      }
      // case ["BAT", "LIGHT_SOLAR"].includes(fuelType as LightingFuel):
      case thermalFuels.includes(fuelType as ThermalFuel):
        totalCO2Emission = 0;
        break;
      case fuelType === "LIGHT_HYB": {
        totalCO2Emission = computeItemLightHyb(
          localItemInput,
          ghgMapRef,
          hhUsingTheFuel
        ).totalCO2Emission;
        break;
      }
      case ["NO_ACCESS"].includes(fuelType):
        totalCO2Emission = 0;
        break;
      default:
        throw new Error(
          `unknown fuel type ${fuelType} for lighting: ${JSON.stringify(
            localItemInput
          )}`
        );
    }
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is NaN`);
    }

    return {
      totalCO2Emission,
      totalPower,
      totalEnergy,
    };
  };
}
