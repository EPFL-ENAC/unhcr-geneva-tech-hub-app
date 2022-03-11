export interface ProjectDocument {
  name: string;
  users: string[];
  modules: {
    general?: GeneralModule;
    householdCooking?: HouseholdCookingModule;
  };
}

export interface GeneralModule {
  year: number;
  name: string;
  locationLatitude: number;
  locationLongitude: number;
  temporary: boolean;
  expirationYear?: number;
  integration?: Integration;
  electricityCompanyName: string;
  publicGridConnection: boolean;
  publicGridDomesticRate?: number;
  publicGridDistance?: number;
  networkExtension?: boolean;
  shelterTemporary: number;
  shelterTemporaryTent: number;
  shelterTemporarySheeting: number;
  shelterTemporaryKit: number;
  shelterPermanent: number;
  shelterPermanentContainer: number;
  shelterPermanentPrefabricated: number;
  shelterPermanentRhu: number;
  electricalSafetyCompliance: number;
  annualLocalWindMinimum: number;
  annualLocalWindAverage: number;
  annualLocalWindMaximum: number;
  totalPopulation: number;
  familiesCount: number;
  currency: string;
  exchangeRateUsd: number;
  businessShare: number;
  farApartHouses: FarApartHouses;
  areaPerPerson: AreaPerPerson;
  vacantSpaceInside: VacantSpaceInside;
  woodLandscape: WoodLandscape;
  topography: Topography;
  vacantSpaceOutside: vacantSpaceOutside;
}
export type Integration = "well" | "moderately" | "badly";
export type FarApartHouses = "few" | "3-6" | "6-12" | "12-20" | "20+";
export type AreaPerPerson = "-29" | "30-34" | "35-44" | "45+";
export type VacantSpaceInside =
  | "no"
  | "10"
  | "50"
  | "100"
  | "250"
  | "500"
  | "1000+";
export type WoodLandscape =
  | "rain"
  | "forest-savanna"
  | "deciduous"
  | "woodland"
  | "shrubland"
  | "grassland-savannah";
export type Topography = "flat" | "hilly" | "valley";
export type vacantSpaceOutside = "no" | "little" | "medium" | "lots";

export interface HouseholdCookingModule {
  categoryCookings: {
    stove: CookingStove;
    categoryCounts: Record<SocioEconomicCategory, number>;
  }[];
}

export interface CookingStove {
  _id: string;
  name: string;
  fuel: "wood" | "charcoal" | "pellet" | "ethanol" | "kerosene";
  technologyType: "conventional" | "improved";
  energyEfficiency: number;
  capacity: number;
  investmentCost: number;
  lifetime: number;
  emmissionFactorCo2: number;
  emmissionFactorPm: number;
  iwaEfficiencyTier: Tier;
  iwaIndoorEmissionTier: Tier;
}

export interface CookingFuel {
  _id: string;
  name: string;
  energy: number;
  emissionFactorCo2: number;
  price: number;
}

type Tier = number | [number, number];

export type SocioEconomicCategory =
  | "veryLow"
  | "low"
  | "middle"
  | "high"
  | "veryHigh";
export const socioEconomicCategories: string[] = [
  "veryLow",
  "low",
  "middle",
  "high",
  "veryHigh",
];
