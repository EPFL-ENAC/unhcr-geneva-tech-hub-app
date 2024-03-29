import { AllFuel } from "@/components/green_house_gaz/fuelTypes";
import { ShelterRegions } from "@/store/ShelterInterface";
import { v4 as uuidv4 } from "uuid";
import { CouchUser } from "./UserModule";

// import { Material } from "@/store/ShelterInterface";
export type CountriesInfoMap = Record<string, CountryInfo>;
export interface Country {
  key: [CountryCode];
  value: GreenHouseGaz[];
}

export interface CountryExtended extends Country {
  countryName?: string;
}

export interface CountryInfo {
  name: string;
  code: string;
  region: ShelterRegions;
  lat: number;
  lon: number;
}

type CountryCode = string;
type Email = string;

export interface SurveyForms {
  energy: EnergySurvey;
  wash: WashSurvey;
}
export const DEFAULT_PP_PER_HH = 5;

export function newDefaultCampSite(username?: string): GreenHouseGaz {
  return {
    id: uuidv4(), // since it's new
    siteName: "",
    siteId: uuidv4(),
    description: "",
    countryCode: "",
    latitude: 0,
    longitude: 0,
    users: [],
    population: 0,
    ...newSurveyForm(),
    pp_per_hh: DEFAULT_PP_PER_HH, // 4.73 (based on the most recent values for average household size from Database on Household Size and Composition 2022
    totalHH: 0,
    created_at: new Date().toISOString(),
    created_by: username,
  } as GreenHouseGaz;
}

export function newSurveyForm(): SurveyForms {
  return {
    energy: {
      facilities: generateNewGenericFormSurvey(),
      cooking: generateNewGenericFormSurvey(),
      lighting: generateNewGenericFormSurvey(),
    },
    wash: {
      watersupply: generateNewGenericFormSurvey(),
      domesticsolidwaste: generateNewGenericFormSurvey(),
    },
  };
}

export interface GreenHouseGaz extends SurveyForms {
  _id?: string;
  _rev?: string;
  id: string; // uuid4 mandatory // it's optional because if we create a new one, it's not there yet
  rev?: string; // only for some views
  description: string; // assessment description  // was called survey name before
  siteId: string; // in old times it was the location_id or a uuid, now it's a string: location_pcode or uuidv4
  location_id?: number;
  location_pcode?: string;
  siteName: string;
  countryCode: string;
  reference?: boolean; // say if the survey is a reference or not
  lat?: number; // lat of the site
  lon?: number; // lon of the site
  latitude?: number;
  longitude?: number;
  year?: number;
  // surveys: Survey[];
  users: (CouchUser | Email | string)[];
  solar?: number;
  population: number; // total population
  pp_per_hh: number; // ave people per hhtotalHH
  public?: boolean; // true if public; false|undefined if private ; default is private
  totalHH: number;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  isUNHCR?: boolean;
}

export type SurveyKey = keyof GreenHouseGaz;

export function generateNewGenericFormSurvey(): GenericFormSurvey<
  SurveyItem,
  SurveyResult,
  SurveyItem,
  SurveyResult
> {
  return {
    baseline: {
      items: [],
      results: {} as SurveyResult,
    },
    endline: {
      items: [],
      results: {} as SurveyResult,
    },
  };
}

export interface EnergySurvey {
  facilities: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
  cooking: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
  lighting: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
}
export type EnergySurveyCategory = keyof EnergySurvey;

// should be generic survey with import type from Trucking.vue
export interface WashSurvey {
  watersupply: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
  domesticsolidwaste: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
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

// GENERIC START
export type SurveyInputValue =
  | number
  | string
  | boolean
  | string[] // exception for fuelTypes that should not be there
  | undefined;
export type SurveyInput = Record<string, SurveyInputValue>;
export type SurveyResultValue = number | boolean;
export type SurveyResult = Record<string, SurveyResultValue>;
export interface SurveyItem {
  _id: string; // as of uuidv4Type
  increment: number; // increment value in number
  enabled?: boolean; // for computation on endline
  overrideAll?: boolean; // override all the values in endline, should be a temporary boolean
  origin?: string; // as of uuidv4Type of an existing item
  originIncrement?: number; // increment value of an existing
  input: SurveyInput;
  computed: SurveyResult;
}

export interface GenericFormSurvey<
  BaselineItemType extends SurveyItem,
  BaselineResultsType extends SurveyResult,
  EndlineItemType extends SurveyItem,
  EndlineResultsType extends SurveyResult
> {
  baseline: GenericBaseline<BaselineItemType, BaselineResultsType>;
  endline: GenericEndline<EndlineItemType, EndlineResultsType>;
}
export interface GenericBaseline<
  BaselineItemType extends SurveyItem,
  BaselineResultsType extends SurveyResult
> {
  items: BaselineItemType[];
  results: BaselineResultsType;
}

export interface GenericEndline<
  EndlineItemType extends SurveyItem,
  EndlineResultsType extends SurveyResult
> {
  items: EndlineItemType[];
  results: EndlineResultsType;
  alertDismissed?: boolean;
}

// GENERIC STOP

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

export interface DieselItem {
  fuelUsage?: number; // L/day
  disableDieselLiters?: boolean;
  disabledFuelUsage?: boolean;
  generatorSize?: number; // kW
  generatorSizekVA?: number; // kVA = 0.8 * kW
  operatingHours?: number; // replace the diesel liter
  generatorLoad?: number; // load of generator (should be default to 60%)
  dieselPowerEstimated?: boolean;
  dieselLitersEstimated?: boolean;
}

export interface SolarItem {
  solarInstalled?: number;
}

export interface EnergyItem extends DieselItem, SolarItem {
  // power is optional
  gridPower?: number;
  dieselPower?: number;
  renewablePower?: number;

  fuelUsage?: number; // [L/yr]
  fuelType?: AllFuel; // key of ElectricFuel

  totalPower?: number; // [kWh/yr]
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

export type SurveySubcategory = keyof EnergySurvey | keyof WashSurvey;
