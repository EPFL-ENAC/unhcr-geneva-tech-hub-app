import { SyncDatabase } from "@/utils/couchdb";
export interface ShelterState {
  shelter: Shelter;
  shelters: Array<Shelter>;
  scorecards: Array<ScoreCard>;
  localCouch: SyncDatabase<Shelter> | null;
}
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

  items: Item[];
  envPerfItems: MaterialTree[];
  totalEnvPerf: MaterialTree;

  habitability: Score;
  habitability_score: number | undefined;
  technical_performance: Score;
  technical_performance_score: number | undefined;

  scorecard: ScoreCard;
  geometry: Geometry;

  users: string[];
  created_by: string;
}

export interface ScoreCard {
  weight: number;
  co2: number;
  h2o: number;
  techPerf: number;
  habitability: number;
  affordability: number;
}
export interface Geometry {
  shelter_geometry_type: string;
  shelter_dimensions: ShelterDimensions;
  doors_dimensions: DoorDimensions[];
  windows_dimensions: WindowDimensions[];
  windowArea: number;
  floorArea: number;
  volume: number;
}

export interface Score {
  [property: string]: number | Score;
}

export enum Units {
  KG = "kg",
  M = "m",
  M2 = "m2",
  M3 = "m3",
  L = "l",
  PCE = "pce",
}

export enum ItemTypes {
  Material = "material",
  Labour = "labour",
}

export type FormTypeMaterial =
  | "Cube"
  | "UProfile"
  | "Sandwitch"
  | "Pipe"
  | "Rope"
  | "Sheet"
  | "Cylinder"
  | "Kilogram"
  | "Liter";

type Weight = number;
type Meter = number;
type Milimeter = number;
type Liter = number;
type Kilogram = number;
type Density = number;
type MaterialsFunction = Record<FormTypeMaterial, densityFunction>;

type densityCube = (L: Meter, W: Meter, H: Meter, density: Density) => Weight;

type densitySheet = (
  L: Meter,
  W: Meter,
  Thickness: Milimeter,
  density: Density
) => Weight;

type densityUProfile = (
  L: Meter,
  W: Milimeter,
  H: Milimeter,
  Thickness: Milimeter,
  density: Density
) => Weight;

type densityCylinder = (
  L: Meter,
  diameter: Milimeter,
  density: Density
) => Weight;

type densityFunction =
  | densityCube
  | densityCylinder
  | densitySheet
  | densityUProfile;

// use to convert liter in m3 and milimeter in meter;
const ONE_THOUSANDTH = 1e-3;

export const materialFunction = {
  Cube: (
    length: Meter,
    width: Meter,
    height: Meter,
    density: Density
  ): Weight => {
    return length * width * height * density;
  },
  Sheet: (
    length: Meter,
    width: Meter,
    thickness: Milimeter,
    density: Density
  ) => {
    // 1milimeter == 0.001 meter
    return length * width * thickness * ONE_THOUSANDTH * density;
  },
  Pipe: (
    length: Meter,
    diameter: Milimeter,
    thickness: Milimeter,
    density: Density
  ) => {
    // 1milimeter == 0.001 meter
    // cylinder A minus Cylinder B
    // cylinder A has diameter == diameter
    // Cylinder B as diameter  == diameter - 2* thickness

    const half_diameter_a = (diameter / 2) * ONE_THOUSANDTH;
    const half_diameter_b = ((diameter - 2 * thickness) / 2) * ONE_THOUSANDTH;
    // const cylinder_a_weight = L * Math.pow(half_diameter_a, 2) * Math.PI * density;
    // const cylinder_b_weight = L * Math.pow(half_diameter_b, 2) * Math.PI * density;
    // a * x - b * x = x* (a - b)
    // a == A^2 AND b == B^2
    // A^2 - B^2 === (A - B)(A + B)
    //
    return (
      (half_diameter_a - half_diameter_b) *
      (half_diameter_a + half_diameter_b) *
      length *
      Math.PI *
      density
    );
  },

  Cylinder: (L: Meter, diameter: Milimeter, density: Density) => {
    // 1milimeter == 0.001 meter
    const half_diameter = (diameter / 2) * ONE_THOUSANDTH;
    return L * Math.pow(half_diameter, 2) * Math.PI * density;
  },
  Kilogram: (n: Kilogram) => n,
  Liter: (n: Liter, density: Density) => {
    // n is in liter hence (0.001 * n) m3 because 1000L = 1m3
    // density is kg per m3 or per 1000L
    // to keep dimensions consistent
    return n * density * ONE_THOUSANDTH;
  },
  UProfile: (
    length: Meter,
    width: Milimeter,
    height: Milimeter,
    thickness: Milimeter,
    density: Density
  ) => {
    // Total surface * thickness * density === weight
    const heightInMeter = height * ONE_THOUSANDTH;
    const widthInMeter = width * ONE_THOUSANDTH;
    const thicknessInMeter = thickness * ONE_THOUSANDTH;
    const side = widthInMeter + 2 * heightInMeter; // width + two times the height => |_|
    const surface = length * side;
    const volume = surface * thicknessInMeter; // in meter
    return volume * density;
  },
  Sandwitch: (length: Meter, width: Meter, height: Meter, density: Density) => {
    const volume = length * width * height;
    return volume * density;
  },
  Rope: (length: Meter, density: Density) => {
    // for Rope density is kg/m and not kg/m³
    return length * density;
  },
} as MaterialsFunction;

export type itemTypes = "Labour" | "Material" | "Other";
export interface Item {
  _id: string; // as uuid4
  itemType: itemTypes;
  source: string | undefined; // country
  quantity: number;
  unitCost: number; // in USD
  totalCost: number;
}
export interface Material extends Item {
  name: string;
  materialId: string;
  formId: string;
  unit: Units;
  dimensions: MaterialDimensions;
  embodiedCarbonProduction: number;
  embodiedCarbonTransport: number;
  embodiedCarbonTotal: number;
  embodiedWater: number;
  weight: number;
}
export type MaterialKeys = keyof Material;
export interface MaterialTree {
  materialId?: string;
  formId?: string;
  embodiedCarbonProduction: number;
  embodiedCarbonTransport: number;
  embodiedCarbonTotal: number;
  embodiedWater: number;
  weight: number;
  unitCost: number;
  totalCost: number;
  children?: Material[];
}

// TODO this afternoon
// rewrite embodiedCarbon by embodedCarbonProduction
// add embodiedCarbonTotal
// compute items at save (store instead of component scope)

export type MaterialTreeKey = keyof MaterialTree;
export type MaterialTreeRecord = Record<string, MaterialTree>;

export interface Labour extends Item {
  // 2 skilled worker for 2 day : 3USD per person
  // 1 unskilled worker for 1 day: 1 USD per person
  workerType: WorkerType;
  unit: WorkLabourTimeUnit; // number of day/hours necessary for construction
}
export interface Other extends Item {
  name: string | undefined;
  unit: Units | undefined;
}

export enum WorkerType {
  Skilled = "skilled",
  Unskilled = "unskilled",
}

export enum WorkLabourTimeUnit {
  Hour = "Hour",
  Day = "Day",
  LumpSum = "Lump sum",
}

// export type Item = Material | Labour;

// TODO change. MaterialDimension should be argument of MaterialsFunction
export interface MaterialDimensions {
  /// TODO: add Kg ? Liter, etc..
  kilogram?: Kilogram;
  liter?: Liter;
  length?: Meter;
  LEN?: number; // =length
  WID?: number; // =width
  THK?: number; // =thickness
  DIA?: number; // =diameter
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
export interface MaterialReferenceData {
  local: boolean; //
  density: number;
  density_ref: string; //"ICE DB V2.0 (2011)"
  density_unit: string; //"kg/m3"
  embodied_carbon: number; // kgCO2e/kg
  embodied_carbon_ref: string; //"ICE DB V3.0 (10.11.2019)"
  embodied_water: number; //
  embodied_water_ref: string; //"EcoInvent 3.8, aluminium alloy production, Metallic Matrix Composite, GLO (Global)"
  form: string; // "Composite panel"
  material: string; //"Aluminium"
  units: string[]; //['KG', 'M2', 'PCE']
  _id: string; // "ALU-CPA_"
}
