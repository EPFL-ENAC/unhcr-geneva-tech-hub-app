import { FormItem } from "@/components/commons/FormItem";
import { SyncDatabase } from "@/utils/couchdb";

export interface ShelterState {
  shelter: Shelter;
  shelterLoading: boolean;
  shelters: Array<Shelter>;
  scorecards: Array<ScoreCard>;
  years: Array<string>;
  countries: Array<string>;
  localCouch: SyncDatabase<Shelter> | null;
}

export const listOfShelterType: ShelterType[] = [
  "Emergency",
  "Transitional",
  "Durable",
];
export type ShelterType = "Emergency" | "Transitional" | "Durable" | "";

export const listOfRegions: ShelterRegions[] = [
  "All",
  "Asia and the Pacific",
  "Europe",
  "Middle East and North Africa",
  "Southern Africa",
  "The Americas",
  "West and Central Africa",
  "East and Horn of Africa",
];

export type ShelterRegions =
  | "All"
  | "East and Horn of Africa"
  | "Southern Africa"
  | "West and Central Africa"
  | "The Americas"
  | "Asia and the Pacific"
  | "Europe"
  | "Middle East and North Africa"
  | "Unknown";

// update --> Image / Drawing / Report / Other
export const imageShelterTypes = [
  "Image",
  "Drawing",
  "Report",
  "Other",
] as const;
export type ImageShelterType = typeof imageShelterTypes[number];

export interface ImageShelter {
  url: string; // path like /s3/unhcr_tss/xx
  origin_url?: string; // only for image
  description?: string;
  name: string;
  type: ImageShelterType;
}
export interface Shelter {
  _id?: string;
  _rev?: string;
  name: string;
  organisation: string;
  shelter_total: number | undefined;
  shelter_occupants: number | undefined;
  shelter_lifespan: number | undefined;
  shelter_type: ShelterType;
  setup_people: number | undefined;
  setup_time: number | undefined;
  location_name: string;
  location_country: string;
  latitude: number;
  longitude: number;
  images: ImageShelter[]; // uploaded images to custom s3

  risk_flood: string;
  risk_seismic: string;

  items: Item[];
  items_individual_shelter: number;
  envPerfItems: MaterialTree[];
  totalEnvPerf: MaterialTree;

  habitability: Score;
  habitability_score: number | undefined;
  technical_performance: Score;
  technical_performance_score: number | undefined;

  scorecard: ScoreCard;
  scorecard_errors: string[];
  geometry: Geometry;

  users: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export interface ScoreCard {
  affordability: number;
  co2: number;
  h2o: number;
  habitability: number;
  techPerf: number;
  weight: number;
}

export interface ScoreCardWithShelterInfo extends ScoreCard {
  name: string;
  shelter_type: ShelterType;
  created_at: string; // todo
  created_by: string;
  updated_by: string;
  updated_at: string;
  organisation: string;
  year: string;
  location_country: string; // todo
  id: string;
}
export type ScoreCardWithShelterInfoKeys = keyof ScoreCardWithShelterInfo;

export interface ScoreCardWithErrors {
  scorecard: ScoreCard;
  errors: string[];
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
export type GeometryKeys = "windowArea" | "floorArea" | "volume";

export interface Score {
  [property: string]: number | undefined | Score;
}

export type Units = UnitsMaterial | UnitsLabour | UnitsOther;
export type UnitsOther = "PCE";
export type UnitsMaterial = "KG" | "M" | "M2" | "M3" | "L" | "PCE";
export type UnitsLabour = "Hour" | "Day" | "Lump sum";

export const UnitsRef = {
  KG: "kg",
  mm: "mm",
  M: "m",
  M2: "m²",
  M3: "m³",
  L: "L",
  PCE: "Piece", // use plural letter
  carbon: "kgCO2e/kg",
  water: "L/kg",
};

export const otherUnits = ["KG", "M", "M2", "M3", "L", "PCE"];

export enum ItemTypes {
  Material = "material",
  Labour = "labour",
}

export type MaterialShape =
  | "COMPLEX-SECTION"
  | "COMPLEX-SHEET"
  | "CYLINDRICAL"
  | "FIXTURE"
  | "RECTANGULAR"
  | "BRICK"
  | "ROPE"
  | "SHEET"
  | "UNDEFINED";

// Units
// KG; //
// L; // --> liter
// M; // concat SHAPE
// M2; // concat SHAPE
// M3; // --> cube
// PCE; // concat SHAPE

export type FormTypeMaterial =
  | "KG"
  | "L"
  | "M3"
  | "M2_RECTANGULAR"
  | "M_RECTANGULAR"
  | "M_CYLINDRICAL"
  | "M_ROPE"
  | "M_COMPLEX-SECTION"
  | "PCE_BRICK"
  | "PCE_RECTANGULAR"
  | "PCE_CYLINDRICAL"
  | "PCE_SHEET"
  | "PCE_FIXTURE"
  | "PCE_UNDEFINED"
  | "PCE_COMPLEX-SECTION"
  | "PCE_COMPLEX-SHEET"
  | "OTHER";

export const materialsInputs: MaterialsInputs = {
  OTHER: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.KG,
    },
    {
      type: "number",
      key: "embodied_carbon",
      label: "Embodied CO2e coefficient",
      suffix: UnitsRef.carbon,
      conditionKey: "unit",
      conditionValue: "KG",
      optional: true,
      suffix_hint:
        "if left blank, material excluded from environmental performance calculations",
    },
    {
      type: "number",
      key: "embodied_water",
      label: "Embodied water coefficient",
      conditionKey: "unit",
      conditionValue: "KG",
      suffix: UnitsRef.water,
      optional: true,
      suffix_hint:
        "if left blank, material excluded from environmental performance calculations",
    },
  ],
  KG: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.KG,
    },
  ], // we use quantity a dimension
  L: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.L,
    },
  ], // we use quantity a dimension
  M3: [
    {
      type: "number",
      key: "quantity",
      label: "Volume",
      suffix: UnitsRef.M3,
    },
  ], // we use quantity a dimension
  M2_RECTANGULAR: [
    {
      type: "number",
      key: "quantity",
      label: "area",
      suffix: UnitsRef.M2,
    },
    {
      type: "number",
      key: "height",
      label: "Height/thickness",
      suffix: UnitsRef.mm,
    },
  ],
  M_RECTANGULAR: [
    {
      type: "number",
      key: "quantity",
      label: "Length",
      suffix: UnitsRef.mm,
    },
    {
      type: "number",
      key: "width",
      label: "Width",
      suffix: UnitsRef.mm,
    },
    {
      type: "number",
      key: "height",
      label: "Height/thickness",
      suffix: UnitsRef.mm,
    },
  ],
  M_CYLINDRICAL: [
    {
      type: "number",
      key: "diameter",
      label: "Diameter",
      suffix: UnitsRef.mm,
    },
    {
      type: "number",
      key: "quantity",
      label: "Length",
      suffix: UnitsRef.M,
    },
  ],
  M_ROPE: [
    {
      type: "number",
      key: "quantity",
      label: "Length",
      suffix: UnitsRef.M,
    },
  ], // we use quantity as number of meter
  "M_COMPLEX-SECTION": [
    {
      type: "number",
      key: "quantity",
      label: "Length",
      suffix: UnitsRef.M,
    },
    {
      type: "select",
      key: "specification",
      label: "Specification",
      options: [], // to be dynamically overided by ShelterMaterial
    },
  ],
  PCE_BRICK: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
    {
      type: "number",
      key: "length",
      label: "Length",
      suffix: UnitsRef.mm,
    },
    {
      type: "number",
      key: "width",
      label: "Width",
      suffix: UnitsRef.mm,
    },
    {
      type: "number",
      key: "height",
      label: "Height/thickness",
      suffix: UnitsRef.mm,
    },
  ],
  PCE_RECTANGULAR: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
    {
      type: "number",
      key: "length",
      label: "Length",
      suffix: UnitsRef.M,
    },
    {
      type: "number",
      key: "width",
      label: "Width",
      suffix: UnitsRef.mm,
    },
    {
      type: "number",
      key: "height",
      label: "Height/thickness",
      suffix: UnitsRef.mm,
    },
  ],
  PCE_CYLINDRICAL: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
    {
      type: "number",
      key: "diameter",
      label: "Diameter",
      suffix: UnitsRef.mm,
    },
    {
      type: "number",
      key: "length",
      label: "Length",
      suffix: UnitsRef.M,
    },
  ],
  PCE_SHEET: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
    {
      type: "number",
      key: "length",
      label: "Length",
      suffix: UnitsRef.M,
    },
    {
      type: "number",
      key: "width",
      label: "Width",
      suffix: UnitsRef.M,
    },
  ],
  PCE_FIXTURE: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
  ], // okay we use quantity
  PCE_UNDEFINED: [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
    {
      type: "number",
      key: "volume",
      label: "Volume",
      suffix: UnitsRef.M3,
    },
  ],
  "PCE_COMPLEX-SECTION": [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
    {
      type: "number",
      key: "length",
      label: "Length",
      suffix: UnitsRef.M,
    },
    {
      type: "select",
      key: "specification",
      label: "Specification",
      options: [], // to be dynamically overided by ShelterMaterial
    },
  ],
  "PCE_COMPLEX-SHEET": [
    {
      type: "number",
      key: "quantity",
      label: "quantity",
      suffix: UnitsRef.PCE,
    },
    {
      type: "number",
      key: "length",
      label: "Length",
      suffix: UnitsRef.M,
    },
    {
      type: "number",
      key: "width",
      label: "Width",
      suffix: UnitsRef.M,
    },
    {
      type: "select",
      key: "specification",
      label: "Specification",
      options: [], // to be dynamically overided by ShelterMaterial
    },
  ],
};

type Weight = number;
type Density = number;
type MaterialsFunction = Record<FormTypeMaterial, densityFunction>;
type MaterialsInputs = Record<FormTypeMaterial, FormItem[]>;

type densityFunction = (item: Material, density: Density) => Weight;

// use to convert liter in m3 and milimeter in meter;
const ONE_THOUSANDTH = 1e-3; // 1/1e3 ==> 0.001

export const materialFunctions: MaterialsFunction = {
  // return kg
  KG: (item: Material) => item.quantity ?? 0, // quantity in kg,
  OTHER: (item: Material) => item.quantity ?? 0, // quantity in kg,
  L: (item: Material, density: Density) => {
    // n is item.quantity in liter hence (0.001 * n) m3 because 1000L = 1m3
    // density is kg per m3 or per 1000L
    // to keep dimensions consistent
    const volume_in_m3 = (item.quantity ?? 0) * ONE_THOUSANDTH;
    return volume_in_m3 * density;
  },
  M3: (item: Material, density: Density) => (item.quantity ?? 0) * density, // volume in M3
  M2_RECTANGULAR: (item: Material, density: Density) => {
    /* {THK}*<ARE>*[DEN]
     ** THK is height in MM a.k.a thickness
     ** ARE is quantity in m2 // quantity in squared meters
     **  m2 * mm/1000
     **  1mm in meter => 1mm / 1e3 => 0.001m
     */
    const { height, quantity } = item;
    if (height && quantity) {
      const thickness_in_meter = height * ONE_THOUSANDTH;
      const volume_in_m3 = thickness_in_meter * (quantity ?? 0);
      return volume_in_m3 * density;
    }
    return 0;
  },
  M_RECTANGULAR: (item: Material, density: Density) => {
    /* {WID}*{HEI}*<LEN>*[DEN] // LEN is quantity in m
    WID: number, HEI: number, LEN: number, DEN: number
    */
    const { quantity, width, height } = item;
    if (quantity && width && height) {
      return (
        width *
        quantity *
        height *
        Math.pow(ONE_THOUSANDTH, 2) * // width, length, height in mm
        density
      );
    }
    return 0;
  },
  M_CYLINDRICAL: (item: Material, density: Density) => {
    /*
     ** (DIA: number, LEN: number, density: number) =>
     **  Math.PI * Math.pow(DIA / 2, 2) * LEN * density, // PI*(<DIA>/2)^2*<LEN>*[DEN]
     ** quantity is length
     */
    const { quantity, diameter } = item;
    if (quantity && diameter) {
      // TODO: need to multiply by proper factor to convert milimeter in mˆ2 dimension
      return (
        Math.PI *
        Math.pow((diameter * ONE_THOUSANDTH) / 2, 2) *
        quantity *
        density
      );
    }
    return 0;
  },
  M_ROPE: (item: Material, density: Density) => {
    /*
     ** (lengthInMeter: number, density: Density) => lengthInMeter * density, // <LEN>*[DEN]
     */
    const { quantity } = item;
    if (quantity) {
      // the density here is in kg/m and not kg/mˆ3
      return quantity * density;
    }
    return 0;
  },
  "M_COMPLEX-SECTION": (item: Material, alpha: Density) => {
    /*
     **   : (lengthInMeter: number, alpha: number) => // <LEN>*[ALPHA]
     */
    const { quantity } = item;
    if (quantity) {
      // the density here is in kg/m and not kg/mˆ3
      return quantity * alpha;
    }
    return 0;
  },
  PCE_BRICK: (item: Material, density: Density) => {
    /* {WID}*{HEI}*<LEN>*[DEN] // LEN is in mm
    WID: number, HEI: number, LEN: number, DEN: number
    */
    const { quantity, length, width, height } = item;
    if (quantity && length && width && height) {
      const volume = width * length * height;
      const total_volume = quantity * volume;
      // we mulitply by 1e-9 because we have width,length and height in mm
      const volume_in_m3 = total_volume * Math.pow(ONE_THOUSANDTH, 3);
      return volume_in_m3 * density;
    }
    return 0;
  },
  PCE_RECTANGULAR: (item: Material, density: Density) => {
    /* {WID}*{HEI}*<LEN>*[DEN] // LEN is quantity in m
    WID: number, HEI: number, LEN: number, DEN: number
    */
    const { quantity, length, width, height } = item;
    if (quantity && length && width && height) {
      return (
        width *
        quantity *
        length *
        height *
        Math.pow(ONE_THOUSANDTH, 2) * // width, height in mm and length in m
        density
      );
    }
    return 0;
  },

  PCE_CYLINDRICAL: (item: Material, density: Density) => {
    const { quantity, diameter, length } = item;
    if (quantity && diameter && length) {
      // TODO: need to multiply by proper factor to convert milimeter in mˆ2 dimension
      return (
        Math.PI *
        Math.pow((diameter * ONE_THOUSANDTH) / 2, 2) *
        length *
        quantity *
        density
      );
    }
    return 0;
  },
  PCE_SHEET: (item: Material, density: Density) => {
    // length: number, width: number, n: number, density: Density
    // length * width * n * density, // {LEN}*{WID}*<NUM>*[DEN]
    const { length, width, quantity } = item;
    if (length && width && quantity) {
      return length * width * quantity * density;
    }
    return 0;
  },
  PCE_FIXTURE: (item: Material, density: Density) => {
    if (item.quantity) {
      return item.quantity * density;
    }
    return 0;
  }, // <NUM>*[DEN]
  PCE_UNDEFINED: (item: Material, density: Density) => {
    // vol * n * density, // {VOL}*<NUM>*[DEN]
    const { volume, quantity } = item;
    if (volume && quantity) {
      return volume * quantity * density;
    }
    return 0;
  },
  "PCE_COMPLEX-SECTION": (item: Material, alpha: Density) => {
    /** /// {LEN}*{WID}*<NUM>*[ALPHA]
     * length: number,
        witdh: number,
        n: number,
        alpha: number
     */
    const { length, width, quantity } = item;
    if (length && width && quantity) {
      return length * width * quantity * alpha;
    }
    if (length && quantity) {
      return length * quantity * alpha;
    }
    return 0;
  },
  "PCE_COMPLEX-SHEET": (item: Material, alpha: Density) => {
    /*
     **   length * n * alpha, // {LEN}*<NUM>*[ALPHA]
     */
    const { length, quantity } = item;
    if (length && quantity) {
      // the density here is a special constant retrieved from materials table reference
      return length * quantity * alpha;
    }
    return 0;
  },
};

export type itemTypes = "Labour" | "Material" | "Other";
export interface Item {
  unit?: Units;
  _id: string; // as uuid4
  itemType: itemTypes;
  source: string | undefined; // country
  quantity?: number;
  unitCost: number; // in USD
  totalCost: number;
}
export interface Material extends Item {
  name: string;
  materialId: string;
  formId: string;
  unit?: UnitsMaterial;
  embodiedCarbonProduction: number;
  embodiedCarbonTransport: number | string;
  embodiedCarbonTotal: number;
  embodiedWater: number;
  // dimension
  weight: number;
  width?: number;
  height?: number;
  length?: number;
  diameter?: number;
  volume?: number;
  area?: number;
  embodied_carbon?: number; // Embodied CO2e coefficient use for custom OTHER material id when we don't have any reference to embodied carbon
  embodied_water?: number; // Embodied water coefficient: use for custom OTHER material
  specification?: number; // alpha from ShelterMaterial.parameters
}
export type MaterialKeys = keyof Material;
export interface MaterialTree {
  materialId?: string;
  formId?: string;
  embodiedCarbonProduction: number;
  embodiedCarbonTransport: number | string;
  embodiedCarbonTotal: number;
  embodiedWater: number;
  weight: number;
  unitCost: number;
  totalCost: number;
  children?: Material[];
}

export type MaterialTreeKey = keyof MaterialTree;
export type MaterialTreeRecord = Record<string, MaterialTree>;

export interface Labour extends Item {
  // 2 skilled worker for 2 day : 3USD per person
  // 1 unskilled worker for 1 day: 1 USD per person
  workerType: WorkerType;
  unit?: UnitsLabour; // number of day/hours necessary for construction
}
export interface Other extends Item {
  name: string | undefined;
  unit?: UnitsOther;
}

export enum WorkerType {
  Skilled = "skilled",
  Unskilled = "unskilled",
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
