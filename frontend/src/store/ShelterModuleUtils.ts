import {
  Geometry,
  Item,
  Material,
  MaterialTree,
  MaterialTreeRecord,
  ScoreCard,
  Shelter,
  ShelterState,
} from "@/store/ShelterInterface";

export function generateState(): ShelterState {
  return {
    shelter: {} as Shelter,
    shelters: [],
    scorecards: [],
    localCouch: null,
  };
}
export function isMaterial(object: unknown): object is Material {
  return (
    Object.prototype.hasOwnProperty.call(object, "materialId") &&
    Object.prototype.hasOwnProperty.call(object, "formId")
  );
}

export function getFormIdItems(items: Item[] = []): string[] {
  return items
    .filter((el: Item) => {
      // isMaterial
      return isMaterial(el);
    })
    .map((el: Item) => (el as Material).formId);
}

export function getEnvPerfItems(items: Item[] = []): MaterialTree[] {
  const mats = items.filter(isMaterial).reduce((acc, n: Item) => {
    const el = n as Material;
    const prevMat = acc[el.materialId];
    const items = prevMat?.children
      ? prevMat.children.push(el) && prevMat.children
      : [el];
    acc[el.materialId] = {
      materialId: el.materialId,
      formId: "",
      weight: el.weight + (prevMat?.weight ?? 0),
      embodiedCarbonProduction:
        el.embodiedCarbonProduction + (prevMat?.embodiedCarbonProduction ?? 0),
      embodiedCarbonTransport:
        el.embodiedCarbonTransport + (prevMat?.embodiedCarbonTransport ?? 0),
      embodiedCarbonTotal:
        el.embodiedCarbonTotal + (prevMat?.embodiedCarbonTotal ?? 0),
      embodiedWater: el.embodiedWater + (prevMat?.embodiedWater ?? 0),
      unitCost: el.unitCost + (prevMat?.unitCost ?? 0),
      totalCost: el.totalCost + (prevMat?.totalCost ?? 0),
      items,
    } as MaterialTree;
    return acc;
  }, {} as MaterialTreeRecord);
  return Object.values(mats) as MaterialTree[];
}

export function getTotalEnvPerf(values: MaterialTree[]): MaterialTree {
  // TODO: for unitCost and totalCost add also labour and other
  return values.reduce(
    (acc, el) => {
      acc.weight = el.weight + (acc?.weight ?? 0);
      acc.embodiedCarbonProduction =
        el.embodiedCarbonProduction + (acc?.embodiedCarbonProduction ?? 0);
      acc.embodiedCarbonTransport =
        el.embodiedCarbonTransport + (acc?.embodiedCarbonTransport ?? 0);
      acc.embodiedCarbonTotal =
        el.embodiedCarbonTotal + (acc?.embodiedCarbonTotal ?? 0);
      acc.embodiedWater = el.embodiedWater + (acc?.embodiedWater ?? 0);
      acc.unitCost = el.unitCost + (acc?.unitCost ?? 0);
      acc.totalCost = el.totalCost + (acc?.totalCost ?? 0);

      return acc;
    },
    { materialId: "Total" } as MaterialTree
  );
}

export function getScoreCard(value: Shelter): ScoreCard {
  const returnValue = {
    weight: 0, // l kg/m2/year
    co2: 0,
    h2o: 0,
    techPerf: value.technical_performance_score ?? 0,
    habitability: value.habitability_score ?? 0,
    affordability: 0,
  };
  const { totalEnvPerf, shelter_lifespan, geometry } = value;
  if (!shelter_lifespan) {
    console.log("Shelter lifespan not defined");
  }
  if (!geometry?.floorArea) {
    console.log("Floor area not defined");
  }
  if (!shelter_lifespan || !geometry?.floorArea) {
    return returnValue;
  }
  // start computing information here
  if (totalEnvPerf?.totalCost) {
    returnValue.affordability =
      totalEnvPerf.totalCost / geometry.floorArea / shelter_lifespan;
  } else {
    console.log("total_cost not defined");
  }

  if (totalEnvPerf?.weight) {
    returnValue.weight =
      totalEnvPerf.weight / geometry.floorArea / shelter_lifespan;
  } else {
    console.log("weight not defined");
  }

  if (totalEnvPerf?.embodiedCarbonTotal) {
    returnValue.co2 =
      totalEnvPerf.embodiedCarbonTotal / geometry.floorArea / shelter_lifespan;
  } else {
    console.log("embodied_carbon_total not defined");
  }

  if (totalEnvPerf?.embodiedWater) {
    returnValue.h2o =
      totalEnvPerf.embodiedWater / geometry.floorArea / shelter_lifespan;
  } else {
    console.log("embodied_carbon_total not defined");
  }

  return returnValue;
}

export function generateNewShelter(name: string): Shelter {
  return {
    _id: name,
    name,
    organisation: "",
    shelter_total: undefined, // number of shelters
    shelter_occupants: undefined, // people
    shelter_lifespan: undefined, // years
    setup_people: undefined, // 2 people necessary for setup
    setup_time: undefined, // days,
    location_name: "",
    location_country: "", // iso code ?
    location_distance_from_capital: undefined, // km
    location_lat: undefined, // option
    location_lon: undefined, // option
    risk_flood: "",
    risk_seismic: "",
    habitability: {},
    habitability_score: undefined,
    technical_performance_score: undefined,
    technical_performance: {},
    geometry: getNewGeometry(),
    users: [""],
    created_by: "",
  } as Shelter;
}

export function getNewGeometry(): Geometry {
  return {
    shelter_dimensions: { L: 0, W: 0 },
    doors_dimensions: [{ Wd: 0, Hd: 0 }],
    windows_dimensions: [{ Ww: 0, Hw: 0, Hs: 0 }],
    shelter_geometry_type: "",
    windowArea: 0,
    floorArea: 0,
    volume: 0,
  };
}
