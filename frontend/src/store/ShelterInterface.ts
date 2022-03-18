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

  habitability: Score;
  habitability_score: number | undefined;
  technical_performance: Score;
  technical_performance_score: number | undefined;

  shelter_geometry_type: string;
  shelter_dimensions: ShelterDimensions;
  doors_dimensions: DoorDimensions[];
  windows_dimensions: WindowDimensions[];
  windowArea: number;
  floorArea: number;
  volume: number;

  users: string[];
  created_by: string;
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
}

export enum ItemTypes {
  Material = "material",
  Labour = "labour",
}

export const OMaterial = {
  ALU: "Aluminium",
  BMB: "Bamboo",
  BIT: "Bitumen",
  PLC: "Canvas, Polycotton",
  CDB: "Cardboard, paper",
  CEM: "Cement",
  CLA: "Clay",
  CON: "Concrete",
  EAR: "Earth, soil, clay, mud",
  GLA: "Glass",
  GRA: "Grass, straw",
  GYP: "Gypsum, plaster",
  HMP: "Hemp",
  LME: "Lime",
  MFX: "Metal fixture, fixing (inc with steel embodied CO2)",
  PLA: "Plastic, polymer",
  RBR: "Rubber",
  SND: "Sand",
  STE: "Steel",
  STO: "Stone",
  TIM: "Timber",
} as {
  [key: string]: string;
};

export type MaterialId = typeof OMaterial[keyof typeof OMaterial];

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

export interface FormMaterial {
  type: FormTypeMaterial;
  name: string;
  code: string;
}
export type MaterialsForms = Record<MaterialId, FormMaterial[]>;

export const MaterialSubCategory = {
  ALU: [
    {
      type: "Sandwitch",
      name: "Composite panel (polystyrene core)",
      code: "ALU-ALL_DEN",
    },
    { type: "Sheet", name: "Sheet", code: "ALU-ALL_DEN" },
    {
      type: "UProfile",
      name: "Other (e.g window profile)",
      code: "ALU-ALL_DEN",
    },
  ],
  BMB: [
    { type: "Cylinder", name: "Pole", code: "BMB-POL_DEN" },
    { type: "Sheet", name: "Woven mat", code: "BMB-MAT_DEN" },
  ],
  BIT: [{ type: "Sheet", name: "Bitumen", code: "BIT-ALL_DEN" }],
  PLC: [
    {
      code: "PLC-HVY_DEN",
      type: "Sheet",
      name: "Heavy - sheet, tarpaulin, tent (e.g. SFT outer)",
    },
    {
      code: "PLC-LHT_DEN",
      type: "Sheet",
      name: "Light - sheet, tarpaulin, tent (e.g. SFT outer)",
    },
  ],
  CDB: [{ code: "CDB-ALL_DEN", type: "Sheet", name: "Cardboard, paper" }],
  CEM: [
    { code: "CEM-MTR_DEN", type: "Cube", name: "Mortar" },
    { code: "CEM-PUR_DEN", type: "Kilogram", name: "Pure cement powder" },
  ],
  CLA: [
    { code: "CLA-BRF_DEN", type: "Cube", name: "Brick, fired" },
    { code: "CLA-BRU_DEN", type: "Cube", name: "Brick, unfired" },
    { code: "CLA-TIL_DEN", type: "Cube", name: "Floor tile, fired" },
    { code: "CLA-TIL_DEN", type: "Cube", name: "Roof tile, fired" },
  ],
  CON: [
    { code: "CON-AEB_DEN", type: "Cube", name: "Aerated/lightweight block" },
    { code: "CON-GEN_DEN", type: "Cube", name: "General" },
    { code: "CON-PCB_DEN", type: "Cube", name: "Precast, block" },
    { code: "CON-PCU_DEN", type: "Cube", name: "Precast, other unit" },
    { code: "CON-REI_DEN", type: "Cube", name: "Reinforced" },
  ],
  EAR: [
    { code: "EAR-ALL_DEN", type: "Cube", name: "Earth roof" },
    { code: "EAR-ALL_DEN", type: "Cube", name: "Mud plaster" },
    { code: "EAR-ALL_DEN", type: "Cube", name: "Rammed earth" },
  ],
  GLA: [
    { code: "GLA-WIN_DEN", type: "Sheet", name: "Glass pane (window)" },
    { code: "GLA-WOO_DEN", type: "Cube", name: "Glass wool (insulation)" },
  ],
  GRA: [{ code: "GRA-ALL_DEN", type: "Kilogram", name: "Grass, straw" }],
  GYP: [{ code: "GYP-ALL_DEN", type: "Kilogram", name: "Gypsum, plaster" }],
  HMP: [
    {
      code: "HMP-ROP_DEN",
      type: "Rope",
      name: "Rope, hemp (or other natural fiber)(10mm)",
    },
  ],
  LME: [{ code: "LIME-ALL_DEN", type: "Kilogram", name: "Lime" }],
  MFX: [
    { code: "STE-ALL_DEN", type: "Kilogram", name: "Hinge" },
    { code: "STE-ALL_DEN", type: "Kilogram", name: "Lock" },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Nails, screws, bolts, other fixings",
    },
  ],
  PLA: [
    {
      code: "PLA-PCS_DEN",
      type: "Kilogram",
      name: "Polycarbonate, PC sheet - solid",
    },
    {
      code: "PLA-PCS_DEN",
      type: "Kilogram",
      name: "Polycarbonate, PC sheet - corrugated",
    },
    {
      code: "PLA-PCS_DEN",
      type: "Kilogram",
      name: "Polycarbonate, PC sheet - twinwall",
    },
    {
      code: "PLA-PSY_DEN",
      type: "Kilogram",
      name: "Polystyrene - sheet (e.g. for insulation)",
    },
    {
      code: "PLA-PVC_DEN",
      type: "Kilogram",
      name: "Polyvinyl chloride, PVC pipe",
    },
    {
      code: "PLA-ROP_DEN",
      type: "Kilogram",
      name: "Rope, polypropylene, nylon (or other synthetic material) (8mm)",
    },
    { code: "PLA-TAR_DEN", type: "Kilogram", name: "Tarpaulin, polyester    " },
  ],
  RBR: [{ code: "RBR-ALL_DEN", type: "Kilogram", name: "Rubber" }],
  SND: [{ code: "SND-ALL_DEN", type: "Kilogram", name: "Sand" }],
  STE: [
    { code: "STE-ALL_DEN", type: "Kilogram", name: "Rebar" },
    { code: "STE-ALL_DEN", type: "Kilogram", name: "Wire" },
    { code: "STE-ALL_DEN", type: "Kilogram", name: "Sheet - corrugated" },
    { code: "STE-ALL_DEN", type: "Kilogram", name: "Sheet/plate - flat" },
    { code: "STE-ALL_DEN", type: "Kilogram", name: "Strap" },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Structural section - circular hollow section (tube)",
    },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Structural section - square hollow section",
    },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Structural section - rectangular hollow section",
    },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Structural section - other",
    },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Structural section - I section",
    },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Structural section - C section",
    },
    {
      code: "STE-ALL_DEN",
      type: "Kilogram",
      name: "Structural section - Equal angle section",
    },
  ],
  STO: [
    { code: "STO-BLK_DEN", type: "Cube", name: "Block" },
    { code: "STO-AGG_DEN", type: "Cube", name: "Gravel, aggregate" },
  ],
  TIM: [
    {
      code: "TIM-HRD_DEN",
      type: "Kilogram",
      name: "Hardwood - rectangular section",
    },
    {
      code: "TIM-HRD_DEN",
      type: "Kilogram",
      name: "Hardwood - circular section",
    },
    {
      code: "TIM-PLY_DEN",
      type: "Kilogram",
      name: "Plywood, chipboard, fibreboard",
    },
    {
      code: "TIM-SFT_DEN",
      type: "Kilogram",
      name: "Softwood - rectangular section",
    },
    {
      code: "TIM-SFT_DEN",
      type: "Kilogram",
      name: "Softwood - circular section",
    },
  ],
} as MaterialsForms;

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

export interface Material {
  name: string | undefined;
  source: string | undefined;
  materialId: MaterialId | undefined;
  form: string | undefined;
  unit: Units | undefined;
  density_code: string | undefined;
  dimensions: MaterialDimensions | undefined;
  pieces: number;
}

export enum WorkerType {
  Skilled = "skilled",
  Unskilled = "unskilled",
}
export interface Labour {
  // 2 skilled worker for 2 day : 3USD per person
  // 1 unskilled worker for 1 day: 1 USD per person
  workerType: WorkerType;
  pricePerPerson: number; // in USD
  workDays: number; // number of day necessary
}

export type Item = Material | Labour;

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

// TODO: improve types for unit and variables at least
export interface ShelterMaterial {
  source: string; // : "EcoInvent 3.8\nbamboo pole production\nGLO (Global)",
  name: string; // : "Bamboo, pole",
  density: number; // : 700,
  density_ref: string;
  variable: string; // : "BMB-POL_DEN",
  embodied_carbon: number; // : 0.72,
  embodied_carbon_ref: string;
  unit: string; // : "L/kg",
  embodied_water: number; // : 0.00234,
  embodied_water_ref: string; // source reference for embodied water
  _id: string; // : "BMB-POL_DEN"
}
