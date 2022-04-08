export interface ProjectDocument {
  name: string;
  users: string[];
  modules: Modules;
}

export interface Modules {
  general?: GeneralModule;
  householdCooking?: HouseholdCookingModule;
  scenario?: ScenarioModule;
}

export interface GeneralModule {
  name: string;
  yearStart: number;
  yearEnd: number;
  locationLatitude: number;
  locationLongitude: number;
  temporary: boolean;
  expirationYear?: number;
  integration?: Integration;
  electricityCompanyName?: string;
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
  categories: Record<SocioEconomicCategory, GeneralCategory>;
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
export interface GeneralCategory {
  proportion: number;
  cookingHours: number;
  annualIncome: number;
}

export interface HouseholdCookingModule {
  categoryCookings: CategoryCooking[];
}

export interface CategoryCooking {
  categories: Record<SocioEconomicCategory, HouseholdCookingInput>;
  stove: CookingStove;
  fuel: CookingFuel;
}

export interface HouseholdCookingInput {
  /**
   * CU
   */
  useFactor: number;
  /**
   * n
   */
  countPerHousehold: number;
}

type Tier = number | [number, number];

export type SocioEconomicCategory =
  | "veryLow"
  | "low"
  | "middle"
  | "high"
  | "veryHigh";
export const socioEconomicCategories: SocioEconomicCategory[] = [
  "veryLow",
  "low",
  "middle",
  "high",
  "veryHigh",
];

export type ScenarioTrend = "stable" | "increase" | "decrease";
export interface ScenarioModule {
  selectedId: string;
  scenarios: Scenario[];
}
export interface Scenario {
  id: string;
  name: string;
  energyPriceTrend: ScenarioTrend;
  investmentCostTrend: ScenarioTrend;
  /**
   * d1
   */
  discountRate: number;
  /**
   * r1
   */
  incomeRate: number;
  /**
   * a1
   */
  demographicGrowth: number;
}

/**
 * CouchDB Models
 */

export interface CookingStove {
  _id: string;
  index: number;
  name: string;
  fuel: "wood" | "charcoal" | "pellet" | "ethanol" | "kerosene";
  technologyType: "conventional" | "improved";
  /**
   * CE
   */
  energyEfficiency: number;
  /**
   * CCAP
   */
  capacity: number;
  /**
   * CI
   */
  investmentCost: number;
  /**
   * CLT
   */
  lifetime: number;
  emissionFactorCo: number;
  emissionFactorPm: number;
  /**
   * CTE
   */
  iwaEfficiencyTier: Tier;
  /**
   * CTP
   */
  iwaIndoorEmissionTier: Tier;
}

export interface CookingFuel {
  _id: string;
  index: number;
  name: string;
  /**
   * LHV
   */
  energy: number;
  /**
   * EF
   */
  emissionFactorCo2: number;
  /**
   * CPf
   */
  price: number;
}
