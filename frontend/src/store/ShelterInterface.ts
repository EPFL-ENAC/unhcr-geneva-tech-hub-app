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

  materials: Material[];

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

export enum Units {
  PCE = "pce",
  KG = "kg",
  M = "m",
  M2 = "m2",
  M3 = "m3",
  L = "l",
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

/*
 CUB: Cube = m*m*m
 SHE: Plate/Sheet/Panel=m*m*mm
 LIT: Liter
 KIL: Kilogram
 CYL: Cylinder Plain tube: Rope/Cylinder (plain) 
 TUB: Tube: Hollow tube
 .. etc but not a lot many more
*/
export const materialsForm = {
  ALU: ["Pipe", "Sheet"],
  BMB: ["Sheet"],
  BIT: ["Sheet"],
  PLC: ["Sheet"],
  CDB: ["Sheet"],
  CEM: ["Sheet"],
  CLA: ["Sheet"],
  CON: ["Sheet"],
  EAR: ["Sheet"],
  GLA: ["Sheet"],
  GRA: ["Sheet"],
  GYP: ["Sheet"],
  HMP: ["Sheet"],
  LME: ["Sheet"],
  MFX: ["Sheet"],
  PLA: ["Sheet"],
  RBR: ["Sheet"],
  SND: ["Sheet"],
  STE: ["Sheet"],
  STO: ["Sheet"],
  TIM: ["Sheet"],
} as Record<string, FormsMaterial[]>;

export type FormsMaterial =
  | "Cube"
  | "UProfile"
  | "Pipe"
  | "Sheet"
  | "Cylinder"
  | "Kilogram"
  | "Liter";

type Weight = number;
type Meter = number;
type Milimeter = number;
type Liter = number;
type Density = number;
type MaterialsFunction = Record<FormsMaterial, densityFunction>;

type densityCube = (L: Meter, W: Meter, H: Meter, density: Density) => Weight;

type densitySheet = (
  L: Meter,
  W: Meter,
  Thickness: Milimeter,
  density: Density
) => Weight;

type densityUProfile = (
  L: Meter,
  W: Meter,
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
  Kilogram: (n: number) => n,
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
} as MaterialsFunction;

export const materialConfigurationV2 = {
  ALU: [{}, {}, {}],
};

export const materialConfiguration = {
  ALU: {
    name: "Aluminium",
    forms: {
      CMP: {
        name: "Composite panel (polystyrene core)",
        PCE: {
          variables: ["ALU_CMP_LEN", "ALU_CMP_WID", "ALU_CMP_THK"],
          reference: ["PLA_PSY_DEN"],
          function(
            ALU_CMP_LEN: number,
            ALU_CMP_WID: number,
            ALU_CMP_THK: number,
            PLA_PSY_DEN: number
          ): number {
            // return the weight
            const ALUMINIUM = 2 * ALU_CMP_LEN * ALU_CMP_WID * 1.38;
            const POLYSTYRENE =
              ALU_CMP_LEN * ALU_CMP_WID * ALU_CMP_THK * PLA_PSY_DEN;
            return ALUMINIUM + POLYSTYRENE;
          },
        },
        M2: {
          variables: ["ALU_CMP_LEN", "ALU_CMP_WID", "ALU_CMP_THK"],
          reference: ["PLA_PSY_DEN"],
          function(
            ALU_CMP_LEN: number,
            ALU_CMP_WID: number,
            ALU_CMP_THK: number,
            PLA_PSY_DEN: number
          ): number {
            // return the weight
            const ALUMINIUM = 2 * ALU_CMP_LEN * ALU_CMP_WID * 1.38;
            const POLYSTYRENE =
              ALU_CMP_LEN * ALU_CMP_WID * ALU_CMP_THK * PLA_PSY_DEN;
            return ALUMINIUM + POLYSTYRENE;
          },
        },
        units: [Units.PCE, Units.M2],
      },
      PRO: {
        name: "U-Profile (or similar)",
        units: [Units.KG, Units.PCE],
      },
      SHE: {
        name: "Sheet",
        units: [Units.KG, Units.M2, Units.PCE],
      },
    },
  },
  BMB: {
    name: "Bamboo",
    forms: {
      POL: {
        name: "Pole",
        units: [Units.KG, Units.PCE],
      },
      MAT: {
        name: "Woven mat",
        units: [Units.KG],
      },
    },
  },
};

export interface Material {
  name: string | undefined;
  source: string | undefined;
  type: MaterialId | undefined;
  form: string | undefined;
  unit: Units | undefined;
  dimensions: MaterialDimensions | undefined;
}

export interface MaterialDimensions {
  PCE?: number | undefined; // =piece
  LEN?: number | undefined; // =length
  WID?: number | undefined; // =width
  THK?: number | undefined; // =thickness
  DIA?: number | undefined; // =diameter
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
