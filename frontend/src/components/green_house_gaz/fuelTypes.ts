export interface IdTextTypesItem<T> {
  _id: T;
  text: string;
  description?: string;
  default?: number;
}

// TODO: lighting

/*
-- tous les electric/solar devices sous un meme group.

*/

// electric fuels
export const electricFuels = [
  "ELE_DIES",
  "ELE_GRID",
  "ELE_SOLAR",
  "ELE_HYB",
  "ELE_NONE",
] as const;
export const electricFuelsWithoutNone = [
  "ELE_DIES",
  "ELE_GRID",
  "ELE_SOLAR",
  "ELE_HYB",
] as const;
export type ElectricFuel = typeof electricFuels[number];
export const electricFuelWithText: IdTextTypesItem<ElectricFuel>[] = [
  { _id: "ELE_DIES", text: "Diesel generators" },
  { _id: "ELE_GRID", text: "National Grid" },
  { _id: "ELE_SOLAR", text: "Solar Energy" },
  { _id: "ELE_HYB", text: "Hybrid Electric Mix" },
  { _id: "ELE_NONE", text: "Not powered" },
];
// end of electric fuels

// biomass fuels
export const biomassFuels = ["FWD", "CHC", "BRQ", "PLTS"] as const;
export type BioMassFuel = typeof biomassFuels[number];
export const biomassFuelsForGasifier = ["FWD", "BRQ", "PLTS"] as const;
export type BioMassFuelWithoutCHC = typeof biomassFuelsForGasifier[number];
export const biomassFuelWithText: IdTextTypesItem<BioMassFuel>[] = [
  { _id: "FWD", text: "Wood" },
  { _id: "CHC", text: "Charcoal" },
  { _id: "PLTS", text: "Pellets" },
  { _id: "BRQ", text: "Briquette" },
];
// end of biomass fuels

// liquid fuels
export const liquidFuels = ["ETH", "PET", "DIES", "KRS"] as const;
export type LiquidFuel = typeof liquidFuels[number];
export const liquidFuelWithText: IdTextTypesItem<LiquidFuel>[] = [
  { _id: "ETH", text: "Ethanol/alcohol" },
  { _id: "PET", text: "Petrol" }, // same as wash
  { _id: "DIES", text: "Diesel" }, // same as facilities for diesel gen
  { _id: "KRS", text: "Kerosene" },
];
// end of liquid fuels

// gasFuels fuels
export const gasFuels = ["LPG", "BGS", "PNG"] as const;
export type GasFuel = typeof gasFuels[number];
export const gasFuelWithText: IdTextTypesItem<GasFuel>[] = [
  { _id: "LPG", text: "LPG" },
  { _id: "BGS", text: "BIOGAS" },
  { _id: "PNG", text: "Piped Natural Gas" },
];
// end of gasFuels fuels

// thermal fuels
export const thermalFuels = ["THE"] as const;
export type ThermalFuel = typeof thermalFuels[number];
export const thermalFuelWithText: IdTextTypesItem<ThermalFuel>[] = [
  { _id: "THE", text: "Thermal solar" },
];
// end of thermal fuels

// lighting fuels
export const lightingFuels = [
  "CNDL",
  "LIGHT_HYB",
  "PET",
  "OIL",
  "LIGHT_SOLAR",
  "BAT",
  "ELE_GRID",
  "ELE_DIES",
  "ELE_SOLAR",
  "ELE_HYB",
] as const;
export type LightingFuel = typeof lightingFuels[number];
export const lightingFuelsWithText: IdTextTypesItem<LightingFuel>[] = [
  { _id: "CNDL", text: "Candle (paraffin)" },
  {
    _id: "LIGHT_HYB",
    text: "Hybrid fuel mix (Firewood + paraffin + kerosene)",
    // description: "Firewood + paraffin + kerosene",
  },
  {
    _id: "PET",
    text: "Gasoline",
    description: "",
  },
  {
    _id: "OIL",
    text: "Vegetable oil",
    description: "",
  },
  {
    _id: "LIGHT_SOLAR",
    text: "Solar lantern", // total CO2 should be 0
  },
  {
    _id: "BAT",

    text: "Torch or phone with battery (rechargeable or not)",
  },
];
// end of lighting fuels

// no access
export const noAccessFuels = ["NO_ACCESS"] as const;
export type NoAccessFuel = typeof noAccessFuels[number];
export const noAcessWithText: IdTextTypesItem<NoAccessFuel>[] = [
  { _id: "NO_ACCESS", text: "Without any access" }, /// anciently No access
];
// end of thermal fuels
export const solarLanternDevice = "SOLAR_LANTERN" as const;
export const singleUseBatteryDevice = "SINGLE_USE_BAT" as const;
export const plugInOrChargeBatteryDevice = "PLUG_IN_OR_CHARGE_BAT" as const;
export const electricDevices = [
  solarLanternDevice,
  singleUseBatteryDevice,
  plugInOrChargeBatteryDevice,
] as const;
export type ElectricDevices = typeof electricDevices[number];
export const electricDevicesWithText: IdTextTypesItem<ElectricDevices>[] = [
  { _id: "SOLAR_LANTERN", text: "Solar lantern", default: 0.3 },
  {
    _id: "SINGLE_USE_BAT",
    text: "Single-use battery devices",
    description: "",
  },
  {
    _id: "PLUG_IN_OR_CHARGE_BAT",
    text: "Plug in or rechargeable batteries",
    description: "",
  },
];

export const allFuelsButElectric = [
  ...biomassFuels,
  ...liquidFuels,
  ...gasFuels,
  ...thermalFuels,
];

export const allFuelsButThermal = [
  ...biomassFuels,
  ...liquidFuels,
  ...gasFuels,
  ...electricFuels,
];

// export type AllFuelsButElectric = typeof allFuelsButElectric[number];
export const allFuels = [...allFuelsButElectric, ...electricFuels];

export const allFuelsForLighing = [
  // "NO_ACCESS",
  "FWD",
  "CNDL",
  "LIGHT_HYB", // rename Hybrid fuel mix (paraffin,.. ...)
  "OIL",
  "PET",
  "KRS",
  "LIGHT_SOLAR",
  "BAT",
  "ELE_GRID",
  "ELE_DIES",
  "ELE_SOLAR",
  "ELE_HYB", // rename Hybrid electric mix
];

export type AllFuel =
  | ElectricFuel
  | BioMassFuel
  | LiquidFuel
  | GasFuel
  | ThermalFuel
  | LightingFuel
  | ElectricDevices
  | NoAccessFuel;

// export type AllFuel =
//   | ElectricFuel
//   | BioMassFuel
//   | LiquidFuel
//   | GasFuel
//   | ThermalFuel
//   | NoAccessFuel
//   | LightingFuel;

export const AllFuelsWithTextById = [
  ...electricFuelWithText,
  ...biomassFuelWithText,
  ...liquidFuelWithText,
  ...gasFuelWithText,
  ...thermalFuelWithText,
  ...noAcessWithText,
].reduce((acc, el: IdTextTypesItem<AllFuel>) => {
  acc[el._id] = el;
  return acc;
}, {} as Record<AllFuel, IdTextTypesItem<AllFuel>>);

export const AllLightingFuelsWithTextById = [
  ...electricFuelWithText,
  ...biomassFuelWithText,
  ...liquidFuelWithText,
  ...gasFuelWithText,
  ...thermalFuelWithText,
  ...noAcessWithText,
  ...lightingFuelsWithText,
  ...electricDevicesWithText,
].reduce((acc, el: IdTextTypesItem<AllFuel>) => {
  acc[el._id] = el;
  return acc;
}, {} as Record<AllFuel, IdTextTypesItem<AllFuel>>);
