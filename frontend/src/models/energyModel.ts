export interface ProjectDocument {
  name: string;
  users: string[];
  modules: Modules;
}
export interface Modules {
  general?: GeneralModule;
  householdCooking?: HouseholdCookingModule;
  scenario?: ScenarioModule;
  /**
   * @deprecated for backward compatibility
   */
  intervention?: InterventionModule;
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

  interventions: Intervention[];

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

  /**
   * @deprecated
   */
  discountRate?: RangeModel;
  /**
   * @deprecated
   */
  incomeRate?: RangeModel;
  /**
   * @deprecated
   */
  demographicGrowth?: RangeModel;
  /**
   * @deprecated
   */
  fuelPriceRate?: RangeModel;
}
export interface ScenarioYear {
  yearIndex: number;
  householdSize: number;
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
  fuelPriceRate: RangeModel;
}
export type ScenarioTrend = "stable" | "increase" | "decrease";

// Intervention

export interface InterventionModule {
  interventions: Intervention[];
}
export type Intervention = CookingTechnologyIntervention;
interface ParentIntervention {
  type: "cooking-technology";
  name: string;
  selected: boolean;
  yearStart: number;
  yearEnd: number;
}
export interface CookingTechnologyIntervention extends ParentIntervention {
  type: "cooking-technology";
  newStoveId: CookingStoveId;
  oldStoveIds: CookingStoveId[];
  count: number;
  categories: SocioEconomicCategory[];
  cost: number;
  donnorSubsidy: number;
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
  iwaEfficiencyTier?: Tier;
  /**
   * CTP
   */
  iwaIndoorEmissionTier?: Tier;
}
type Tier = number | [number, number];

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
