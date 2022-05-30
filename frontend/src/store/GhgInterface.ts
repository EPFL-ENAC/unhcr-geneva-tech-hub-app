import { Material } from "@/store/ShelterInterface";
export type CountriesInfoMap = Record<string, CountryInfo>;
export interface Country {
  key: CountryCode;
  value: Sites;
}

export interface CountryInfo {
  name: string;
  code: string;
  lat: number;
  lon: number;
}
export interface Site {
  id: string; // site unique identitier (name as first)
  name: string; // site name // location
  country_code: CountryCode;
  created_by: Email;
  users: Email[];
  lat?: number;
  lon?: number;
}
type CountryCode = string;
type Email = string;
export type Sites = Site[];

export interface GreenHouseGaz {
  _id?: string | undefined;
  name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  surveys: Survey[];
  users: string[];
  created_by: string;
  created_at: string;
}

export interface SurveyForms {
  energy: EnergySurvey;
  wash: WashSurvey;
  material: MaterialSurvey;
  offset: OffsetSurvey;
}

export interface Survey extends SurveyForms {
  _id?: string; // uuid4
  created_at: string;
  created_by: string;
  updated_by?: string;
  updated_at?: string;
  name: string; // name is year
}

export type SurveyKey = keyof Survey;

export interface EnergySurvey {
  facilities: EnergyFacilitySurvey;
  cooking: FormSurvey;
  lighting: FormSurvey;
  pumping: FormSurvey;
}

export interface WashSurvey {
  trucking: WashTruckingSurvey;
}

export interface WashTruckingItemInputs {
  US_TYP: string;
  TOT_WS: number;
  WACL: number;
  TR_VOL: number;
  TR_TYP: string;
}

export interface WashTruckingItemResults {
  TR_NUM: number;
  TR_DIST: number;
  CO2_WSH_TRB: number;
}
export interface WashTruckingItem {
  inputs: WashTruckingItemInputs;
  results: WashTruckingItemResults;
}

export interface WashTruckingItemBalance {
  TR_NUM_DIFF: number;
  TR_DIST_DIFF: number;
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface WashTruckingItemWithBalance extends WashTruckingItem {
  resultsBalance: WashTruckingItemBalance;
}
export interface WashTruckingSurvey {
  baseline: WashTruckingItem;
  endline: WashTruckingItemWithBalance;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface FormSurvey {
  baseline: {
    inputs: FormSurveyInput[];
    results: FormSurveyResult;
  };
  endline: {
    inputs: FormSurveyInput[];
    results: FormSurveyResultWithBalance;
  };
}

export interface FormSurveyInput {
  name?: string;
}

export interface FormSurveyResult {
  totalCO2Emission: number;
}

export interface FormSurveyResultWithBalance extends FormSurveyResult {
  changeInEmission: number | null;
}

// start of energy facility survey
export interface EnergyFacilitySurvey {
  baseline: {
    inputs: EnergyFacilityItem[];
    results: EnergyFacilityItemResult;
  };
  endline: {
    inputs: EnergyFacilityInterventionItem[];
    results: EnergyFacilityInterventionItemResult;
  };
}

type FacilityType =
  | "DieselGenerators"
  | "NationalGrid"
  | "RenewableEnergy"
  | "HybridMix"
  | "NotPowered";

export interface EnergyItem {
  gridPower: number;
  dieselLiters: number;
  renewablePower: number;
}

export interface EnergyFacilityItem extends EnergyItem {
  name: string;
  facilityType: FacilityType;
  totalCO2Emission: number;
}

export type EnergyFacilityItemResult = Omit<
  EnergyFacilityItem,
  "name" | "facilityType"
>;

export interface EnergyFacilityInterventionItem
  extends Omit<EnergyFacilityItem, "facilityType"> {
  description: string;
  changeInEmission: number | null;
}

export type EnergyFacilityInterventionItemResult = Omit<
  EnergyFacilityInterventionItem,
  "description" | "name"
>;

// start of material survey
export interface MaterialSurvey {
  shelter: MaterialShelterSurvey;
  cri: MaterialCRISurvey;
  hhwaste: MaterialHHwasteSurvey;
}

export type MaterialCRISurvey = FormSurvey;

export type MaterialHHwasteSurvey = FormSurvey;

export interface OffsetSurvey {
  treeplanting: OffsetTreePlantingSurvey;
}

export interface OffsetTreePlantingSurvey {
  baseline: number;
  endline: number;
}
export interface MaterialShelterSurvey {
  baseline: MaterialShelterSurveyItem;
  endline: MaterialShelterSurveyItemWithBalance;
}
export interface MaterialShelterSurveyItem {
  inputs: Material[];
  results: Material[];
}

export interface MaterialShelterSurveyItemWithBalance
  extends MaterialShelterSurveyItem {
  resultsBalance: MaterialShelterSurveyBalance;
}

export interface MaterialShelterSurveyBalance {
  SH_BAL_MAT: number; // Difference in material used
  SH_BAL_CO2: number; // Difference in CO2 Emissions
}
