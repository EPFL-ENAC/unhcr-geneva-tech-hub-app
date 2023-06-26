interface FuelTypesItem<T> {
  _id: T;
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
export const electricFuelsForCooking = [
  "ELE_DIES",
  "ELE_GRID",
  "ELE_SOLAR",
  "ELE_HYB",
] as const;
export type ElectricFuel = typeof electricFuels[number];
export const electricFuelWithText: FuelTypesItem<ElectricFuel>[] = [
  { _id: "ELE_DIES", text: "Diesel generators" },
  { _id: "ELE_GRID", text: "National Grid" },
  { _id: "ELE_SOLAR", text: "Solar Energy" },
  { _id: "ELE_HYB", text: "Hybrid Mix" },
  { _id: "ELE_NONE", text: "Not powered" },
];
// end of electric fuels

// biomass fuels
export const biomassFuels = ["FWD", "CHC", "BRQ", "PLTS"] as const;
export type BioMassFuel = typeof biomassFuels[number];
export const biomassFuelsForGasifier = ["FWD", "BRQ", "PLTS"] as const;
export type BioMassFuelWithoutCHC = typeof biomassFuelsForGasifier[number];
export const biomassFuelWithText: FuelTypesItem<BioMassFuel>[] = [
  { _id: "FWD", text: "Wood" },
  { _id: "CHC", text: "Charcoal" },
  { _id: "PLTS", text: "Pellets" },
  { _id: "BRQ", text: "Briquette" },
];
// end of biomass fuels

// liquid fuels
export const liquidFuels = ["ETH", "PET", "DIES", "KRS"] as const;
export type LiquidFuel = typeof liquidFuels[number];
export const liquidFuelWithText: FuelTypesItem<LiquidFuel>[] = [
  { _id: "ETH", text: "Ethanol/alcohol" },
  { _id: "PET", text: "Petrol" }, // same as wash
  { _id: "DIES", text: "Diesel" }, // same as facilities for diesel gen
  { _id: "KRS", text: "Kerosene" },
];
// end of liquid fuels

// gasFuels fuels
export const gasFuels = ["LPG", "BGS", "PNG"] as const;
export type GasFuel = typeof gasFuels[number];
export const gasFuelWithText: FuelTypesItem<GasFuel>[] = [
  { _id: "LPG", text: "LPG" },
  { _id: "BGS", text: "BIOGAS" },
  { _id: "PNG", text: "Piped Natural Gas" },
];
// end of gasFuels fuels

// thermal fuels
export const thermalFuels = ["THE"] as const;
export type ThermalFuel = typeof thermalFuels[number];
export const thermalFuelWithText: FuelTypesItem<ThermalFuel>[] = [
  { _id: "THE", text: "Thermal solar" },
];
// end of thermal fuels

// no access
export const noAccessFuels = ["NO_ACCESS"] as const;
export type NoAccessFuel = typeof noAccessFuels[number];
export const noAcessWithText: FuelTypesItem<NoAccessFuel>[] = [
  { _id: "NO_ACCESS", text: "No access" },
];
// end of thermal fuels


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
