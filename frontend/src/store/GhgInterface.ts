export interface GreenHouseGaz {
  _id: string;
  name: string;
  country_code: string;
  users: string[];
  created_by: string;
}

export interface Country {
  key: string; // name of country
  value: string[]; // array of city;
}
