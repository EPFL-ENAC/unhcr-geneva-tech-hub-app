export interface Shelter {
  _id: string;
  name: string;
  organisation: string;
  shelter_total: number | undefined;
  shelter_occupants: number | undefined;
  shelter_lifespan: number | undefined;
  setup_people: number | undefined;
  setup_time: number | undefined;
  location_name: string;
  location_country: string;
  location_distance_from_capital: number | undefined;
  location_lat: number | undefined;
  location_lon: number | undefined;
  risk_flood: string;
  risk_seismic: string;
  habitability: Score;
  habitability_score: number | undefined;
  technical_performance: Score;
  technical_performance_score: number | undefined;

  shelter_geometry_type: string;
  shelter_dimensions: ShelterDimensions;
  doors_dimensions: DoorDimensions[];
  windows_dimensions: WindowDimensions[];

  users: string[];
  created_by: string;
}
export interface Score {
  [property: string]: number | Score;
}
export interface ShelterDimensions {
  L: number | undefined;
  W: number | undefined;
  H1?: number | undefined;
  H2?: number | undefined;
  H?: number | undefined;
}

export interface DoorDimensions {
  Wd: number | undefined;
  Hd: number | undefined;
}

export interface WindowDimensions {
  Ww: number | undefined;
  Hw: number | undefined;
  Hs: number | undefined;
}
