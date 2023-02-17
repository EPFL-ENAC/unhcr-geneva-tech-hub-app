import { CouchUser } from "@/store/UserModule";

export interface ProjectDocument {
  name: string;
  siteName: string;
  isTemplate?: boolean;
  users: (string | CouchUser)[];
  modules: Modules;
}
export interface Modules {
  general?: GeneralModule;
  householdCooking?: HouseholdCookingModule;
  scenario?: ScenarioModule;
}

// Common

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

export interface RangeModel {
  val: number;
  min?: number;
  max?: number;
}

// General

export interface GeneralModule {
  /**
   * @deprecated
   */
  name?: string;
  countryCode?: string;
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
  woodCarbonation: number;
  woodDensity: number;
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

// Household Cooking

export interface HouseholdCookingModule {
  technologyYears: TechnologyYear[];

  substitutionInterventions: CookingTechnologyIntervention[];
  efficiencyInterventions: CookingTechnologyIntervention[];
  cashInterventions: CookingCashIntervention[];

  /**
   * @deprecated for backward compatibility
   */
  interventions?: CookingTechnologyIntervention[];
  /**
   * @deprecated for backward compatibility
   */
  categoryCookings: CategoryCooking[];
}
export interface TechnologyYear {
  yearIndex: number;
  technologies: CategoryCooking[];
}
export interface CategoryCooking {
  categories: Record<SocioEconomicCategory, HouseholdCookingInput>;
  stove: CookingStove;
  fuel: CookingFuel;
}
export interface HouseholdCookingInput {
  /**
   * n
   */
  countPerHousehold: number;
  /**
   * CU
   */
  useFactor: number;
}

// Scenario

export interface ScenarioModule {
  selectedId: string;
  scenarios: Scenario[];
}
export interface Scenario {
  id: string;
  name: string;
  energyPriceTrend: ScenarioTrend;
  investmentCostTrend: ScenarioTrend;

  years: ScenarioYear[];
}
export interface ScenarioYear {
  yearIndex: number;
  householdSize: RangeModel;
  /**
   * d1
   */
  discountRate: RangeModel;
  /**
   * r1
   */
  incomeRate: RangeModel;
  /**
   * a1
   */
  demographicGrowth: RangeModel;
  fuelPriceRates: Record<CookingFuelId, RangeModel>;
}
export type ScenarioTrend = "stable" | "increase" | "decrease";

// Intervention

export interface ParentIntervention {
  type: string;
  name: string;
  selected: boolean;
  yearStart: number;
  yearEnd: number;
}
export interface CookingTechnologyIntervention extends ParentIntervention {
  type: "cooking-technology";
  newStoveId: CookingStoveId;
  oldStoveIds: CookingStoveId[];
  categories: SocioEconomicCategory[];
  count: number;
}
export interface CookingCashIntervention extends ParentIntervention {
  type: "cooking-cash";
  categories: SocioEconomicCategory[];
  costAffordability: number;
}

// CouchDB Models

export type CookingStoveId =
  | "traditional-wood"
  | "traditional-charcoal"
  | "clay-wood"
  | "clay-charcoal"
  | "ceramic-wood"
  | "ceramic-charcoal"
  | "metal-side-wood"
  | "metal-side-charcoal"
  | "metal-batch-wood"
  | "metal-batch-charcoal"
  | "gasifier"
  | "ethanol"
  | "kerosene"
  | "lpg"
  | "biogas"
  | "induction"
  | "solar-panel"
  | "solar-box"
  | "solar-parabolic"
  | "solar-tube";
export type CookingFuelId =
  | "wood"
  | "charcoal"
  | "pellets"
  | "ethanol"
  | "kerosene"
  | "lpg"
  | "biogas"
  | "electricity"
  | "solar";
export const cookingFuelIds: CookingFuelId[] = [
  "wood",
  "charcoal",
  "pellets",
  "ethanol",
  "kerosene",
  "lpg",
  "biogas",
  "electricity",
  "solar",
];

export interface CookingStove {
  _id: CookingStoveId;
  index: number;
  name: string;
  fuel: CookingFuelId;
  technologyType: "conventional" | "improved" | "clean" | "electric" | "solar";
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
  iwaEfficiencyTier?: string;
  /**
   * CTP
   */
  iwaIndoorEmissionTier?: string;
}

export interface CookingFuel {
  _id: CookingFuelId;
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
