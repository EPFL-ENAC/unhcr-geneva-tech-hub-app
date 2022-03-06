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
}
export interface Country {
  key: string; // name of country
  value: string[]; // array of city;
}

export interface GreenHouseGazReference {
  _id: string;
  iges_grid_2021: igesItem[];
  energy: Record<string, referenceItem>;
  // to be completed
}

export type referenceType = "number" | "percentage";
export interface referenceItem {
  description: string;
  value: number|string;
  type?: referenceType;
  source: string;
}

export interface igesItem {
  name: string;
  value: number;
  country_code: string;
}