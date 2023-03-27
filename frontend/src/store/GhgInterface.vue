<script lang="ts">
import { WashTruckingSurvey } from "@/components/green_house_gaz/wash/Trucking.vue";
import { ShelterRegions } from "@/store/ShelterInterface";
import { CouchUser } from "./UserModule";
// import { Material } from "@/store/ShelterInterface";
export type CountriesInfoMap = Record<string, CountryInfo>;
export interface Country {
  key: CountryCode;
  value: Sites;
}

export interface CountryInfo {
  name: string;
  code: string;
  region: ShelterRegions;
  lat: number;
  lon: number;
}
export interface Site {
  _rev?: string;
  id: string; // site unique identitier (name as first)
  name: string; // site name // location
  country_code: CountryCode;
  created_by: Email | string;
  users: (CouchUser | Email | string)[];
  lat?: number;
  lon?: number;
}
type CountryCode = string;
type Email = string;
export type Sites = Site[];

export interface GreenHouseGaz {
  _rev?: string;
  _id: string; // uuid4 mandatory
  name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  surveys: Survey[];
  users: (CouchUser | Email | string)[];
  solar?: number;
  population: number; // total population
  hh: number; // % of hh using cookstove
  pp_per_hh: number; // ave people per hh
  totalHH: number;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  isUNHCR?: boolean;
}

export interface SurveyForms {
  energy: EnergySurvey;
  wash: WashSurvey;
  material: MaterialSurvey;
  offset: OffsetSurvey;
}

// export type SurveyCategory = "energy" | "wash" | "material" | "offset";

export type SurveyCategory = keyof SurveyForms;

export interface Survey extends SurveyForms {
  _id: string; // uuid4
  created_at: string;
  created_by: string;
  updated_by?: string;
  updated_at?: string;
  reference?: boolean; // say if the survey is a reference or not
  name: string; // name is year
}

export type SurveyKey = keyof Survey;

export interface EnergySurvey {
  facilities: EnergyFacilitySurvey;
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
  pumping: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
}
export type EnergySurveyCategory = keyof EnergySurvey;

// should be generic survey with import type from Trucking.vue
export interface WashSurvey {
  trucking: WashTruckingSurvey;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// TODO replace by GenericFormSurvey
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
export type SurveyInputValue = number | string | boolean | string[] | undefined;
export type SurveyInput = Record<string, SurveyInputValue>;
export type SurveyResultValue = number | boolean;
export type SurveyResult = Record<string, SurveyResultValue>;
export interface SurveyItem {
  _id: string; // as of uuidv4Type
  increment: number; // increment value in number
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
  dieselLiters?: number;
  disableDieselLiters?: boolean;
  generatorSize?: number; // replace the diesel liter
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
}

export interface EnergyFacilityItem extends EnergyItem {
  name: string;
  facilityType: FacilityType;
  totalCO2Emission: number;
  totalPower?: number;
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
  shelter: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
  cri: GenericFormSurvey<SurveyItem, SurveyResult, SurveyItem, SurveyResult>;
  hhwaste: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
}

// export type MaterialCRISurvey = FormSurvey;

// export type MaterialHHwasteSurvey = FormSurvey;

export interface OffsetSurvey {
  treeplanting: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;
}

// export interface OffsetTreePlantingSurvey {
//   baseline: number;
//   endline: number;
// }
// export interface MaterialShelterSurvey {
//   baseline: MaterialShelterSurveyItem;
//   endline: MaterialShelterSurveyItemWithBalance;
// }
// export interface MaterialShelterSurveyItem {
//   inputs: Material[];
//   results: Material[];
// }

// export interface MaterialShelterSurveyItemWithBalance
//   extends MaterialShelterSurveyItem {
//   resultsBalance: MaterialShelterSurveyBalance;
// }

// export interface MaterialShelterSurveyBalance {
//   SH_BAL_MAT: number; // Difference in material used
//   SH_BAL_CO2: number; // Difference in CO2 Emissions
// }
export type SurveySubcategory =
  | keyof EnergySurvey
  | keyof WashSurvey
  | keyof MaterialSurvey
  | keyof OffsetSurvey;
</script>
