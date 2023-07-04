import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

export interface WashTruckingItemInput extends SurveyInput {
  US_TYP: string;
  US_UNI: string;
  TOT_WS: number;
  LIT_WS: number;
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
