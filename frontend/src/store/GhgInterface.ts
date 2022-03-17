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
}

export interface EnergySurvey {
  facilities: Record<string, number>;
  cooking: Record<string, number>;
  lighting: Record<string, number>;
  pumping: Record<string, number>;
}
export interface GreenHouseGazReference {
  _id: string;
  iges_grid_2021: IgesItemInterface[];
  energy: EnergyInterface;
  // to be completed
}

export type EnergyInterface = Record<string, ReferenceItemInterface>;
export type referenceType = "number" | "percentage";
export interface ReferenceItemInterface {
  description: string;
  value: number;
  type?: referenceType;
  source: string;
}

export interface IgesItemInterface {
  name: string;
  value: number;
  country_code: string;
}
