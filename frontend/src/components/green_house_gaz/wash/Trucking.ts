import {
  EnergyItem,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

export const DIESEL = "Diesel";
export const PETROL = "Petrol / Gas";
export const KM = "km";
export const LITERS = "liters of fuel";

export interface WashTruckingItemInput extends SurveyInput, EnergyItem {
  US_TYP: string;
  US_UNI: string;
  TOT_WS: number;
  // LIT_WS: number; // replace by EnergyItem fuelUsage
  WASH_TYPE: string;
  WACL: number;
  TR_VOL: number;
  TR_TYP: string;
}

export interface WashTruckingItemResults extends SurveyResult {
  TR_NUM: number;
  TR_DIST: number;
  WACL: number; // total of collected volume
  totalCO2Emission: number;
}
export interface WashTruckingItem extends SurveyItem {
  input: WashTruckingItemInput;
  computed: WashTruckingItemResults;
}

export interface WashTruckingItemResultsBalance extends SurveyResult {
  TR_NUM_DIFF: number;
  TR_DIST_DIFF: number;
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface WashTruckingItemResultsWithBalance
  extends WashTruckingItemResults,
    WashTruckingItemResultsBalance {}

export type WashTruckingSurvey = GenericFormSurvey<
  WashTruckingItem,
  WashTruckingItemResults,
  WashTruckingItem,
  WashTruckingItemResultsWithBalance
>;
