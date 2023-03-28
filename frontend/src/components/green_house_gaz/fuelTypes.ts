interface FuelTypesItem<T> {
  _id: T;
  defaultValue: number;
  text: string;
}
// electric fuels
export const electricFuels = [
  "ELE_DIES",
  "ELE_GRID",
  "ELE_SOLAR",
  "ELE_HYB",
  "ELE_NONE",
] as const;
export type ElectricFuel = typeof electricFuels[number];
export const electricFuelWithText: FuelTypesItem<ElectricFuel>[] = [
  { _id: "ELE_DIES", text: "Diesel generators", defaultValue: 0 },
  { _id: "ELE_GRID", text: "National Grid", defaultValue: 3 },
  { _id: "ELE_SOLAR", text: "Solar Energy", defaultValue: 1 },
  { _id: "ELE_HYB", text: "Hybrid Mix", defaultValue: 0 },
  { _id: "ELE_NONE", text: "Not powered", defaultValue: 0 },
];
// end of electric fuels

// biomass fuels
export const biomassFuels = ["FWD", "CHC", "BRQ", "PLTS"] as const;
export type BioMassFuel = typeof biomassFuels[number];
export const biomassFuelsWithoutCHC: BioMassFuel[] = ["FWD", "BRQ", "PLTS"];
export const biomassFuelWithText: FuelTypesItem<BioMassFuel>[] = [
  { _id: "FWD", text: "Wood", defaultValue: 8.5 },
  { _id: "CHC", text: "Charcoal", defaultValue: 4.5 },
  { _id: "PLTS", text: "Pellets", defaultValue: 5 },
  { _id: "BRQ", text: "Briquette", defaultValue: 5 },
];
// end of biomass fuels

// liquid fuels
export const liquidFuels = ["ETH", "PET", "DIES", "KRS"] as const;
export type LiquidFuel = typeof liquidFuels[number];
export const liquidFuelWithText: FuelTypesItem<LiquidFuel>[] = [
  { _id: "ETH", text: "Ethanol/alcohol", defaultValue: 1 },
  { _id: "PET", text: "Petrol", defaultValue: 1 }, // same as wash
  { _id: "DIES", text: "Diesel", defaultValue: 1 }, // same as facilities for diesel gen
  { _id: "KRS", text: "Kerosene/paraffin", defaultValue: 1 },
];
// end of liquid fuels

// gasFuels fuels
export const gasFuels = ["LPG", "BGS", "PNG"] as const;
export type GasFuel = typeof gasFuels[number];
export const gasFuelWithText: FuelTypesItem<GasFuel>[] = [
  { _id: "LPG", text: "LPG", defaultValue: 0.43 },
  { _id: "BGS", text: "BIOGAS", defaultValue: 0 },
  { _id: "PNG", text: "Piped Natural Gas", defaultValue: 0 },
];
// end of gasFuels fuels

// thermal fuels
export const thermalFuels = ["THE"] as const;
export type ThermalFuel = typeof thermalFuels[number];
export const thermalFuelWithText: FuelTypesItem<ThermalFuel>[] = [
  { _id: "THE", text: "Thermal solar", defaultValue: 0 },
];
// end of thermal fuels

// no access
export const noAccessFuels = ["NO_ACCESS"] as const;
export type NoAccessFuel = typeof noAccessFuels[number];
export const noAcessWithText: FuelTypesItem<NoAccessFuel>[] = [
  { _id: "NO_ACCESS", text: "No access", defaultValue: 0 },
];
// end of thermal fuels

export const allFuelsButElectric = [
  ...biomassFuels,
  ...liquidFuels,
  ...gasFuels,
  ...thermalFuels,
];
// export type AllFuelsButElectric = typeof allFuelsButElectric[number];

export type AllFuel =
  | ElectricFuel
  | BioMassFuel
  | LiquidFuel
  | GasFuel
  | ThermalFuel
  | NoAccessFuel;

export const AllFuelsWithTextById = [
  ...electricFuelWithText,
  ...biomassFuelWithText,
  ...liquidFuelWithText,
  ...gasFuelWithText,
  ...thermalFuelWithText,
  ...noAcessWithText,
].reduce((acc, el: FuelTypesItem<AllFuel>) => {
  acc[el._id] = el;
  return acc;
}, {} as Record<AllFuel, FuelTypesItem<AllFuel>>);
