export type CountriesInfoMap = Record<string, CountryInfo>;
export interface Country {
  key: CountryCode;
  value: Sites;
}

export interface CountryInfo {
  name: string;
  code: string;
  emoji: string;
}
export interface Site {
  country_code: CountryCode;
  created_by: Email;
  name: string; // site name // location
  users: Email[];
}
type CountryCode = string;
type Email = string;
export type Sites = Site[];

export interface GreenHouseGaz {
  _id: string;
  name: string;
  country_code: string;
  surveys: Survey[];
  users: string[];
  created_by: string;
  created_at: string;
}
export interface Survey {
  created_at: string;
  created_by: string;
  name: string; // name is year
  energy: EnergySurvey;
  wash: WashSurvey;
}

export interface EnergySurvey {
  facilities: FacilitySurvey;
  cooking: Record<string, number>;
  lighting: Record<string, number>;
  pumping: Record<string, number>;
}

export interface FacilitySurvey {
  configuration: Record<string, number>;
  configurationComputed: Record<string, number>;
  inputs: Record<string, number>;
  inputsComputed: Record<string, number>;
  results: Record<string, number>;
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
  CO2_WSH_TRB_DIFF: number;
  CO2_WSH_TRB_PER: number;
}
export interface WashTruckingItemWithBalance extends WashTruckingItem {
  resultsBalance: WashTruckingItemBalance;
}
export interface WashTruckingSurvey {
  baseline: WashTruckingItem;
  endline: WashTruckingItemWithBalance;
}
