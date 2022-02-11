export default interface Shelter {
  _id: string;
  name: string;
  organisation: string;
  shelter_total: number;
  shelter_occupants: number;
  shelter_lifespan: number;
  setup_people: number;
  setup_time: number;
  location_name: string;
  location_country: string;
  location_distance_from_capital: number;
  location_lat: number;
  location_lon: number;
  risk_flood: string;
  risk_seismic: string;
  habitability: Habitability;
  technical_performance: TechnicalPerformance;
}

/*
performance: {
      "key1": { input1: 0, input2: 0, input3: 0, input4: 0 },
      "key2": { input5: 0, input6: 0, input7: 0 },
}
*/
export type Score = Record<string, number>
export type ShelterPerformance = Record<string, Score>;


/*
technical performance: {
  "key1": { input1: 0, input2: 0, input3: 0, input4: 0 },
  "key2": {
    "key2_subkey_A": { input_a_1: 0, input_a_2: 0, input_a_3: 0, input_a_4: 0 },
    "key2_subkey_B": { input_a_5: 0, input_a_6: 0, input_a_7: 0 },
  },
}
*/
export type Habitability = ShelterPerformance;
export type TechnicalPerformance = Record<string, Score|ShelterPerformance>;