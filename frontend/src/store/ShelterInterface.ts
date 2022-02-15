export interface Shelter {
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
  habitability: Score;
  habitability_score: number;
  technical_performance: Score;
  technical_performance_score: number;

  shelter_geometry_type: string;
  shelter_dimensions: ShelterDimensions;
  doors_dimensions: DoorDimensions[];
  windows_dimensions: WindowDimensions[];
}
export interface Score {
  [property: string]: number | Score;
}
export interface ShelterDimensions {
  L: number;
  W: number;
  H1?: number;
  H2?: number;
  H?: number;
}

export interface DoorDimensions {
  Wd: number;
  Hd: number;
}

export interface WindowDimensions {
  Ww: number;
  Hw: number;
  Hs: number;
}
