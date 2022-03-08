export interface GreenHouseGaz {
  _id: string;
  name: string;
  country_code: string;
  surveys: Survey[];
  users: string[];
  created_by: string;
}

export interface Survey {
  created_at: string;
  name: string;
  energy: EnergySurvey;
}

export interface EnergySurvey {
  facilities: Record<string, number>;
  cooking: Record<string, number>;
  lighting: Record<string, number>;
  pumping: Record<string, number>;
}
export interface Country {
  key: string; // name of country
  value: string[]; // array of city;
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
