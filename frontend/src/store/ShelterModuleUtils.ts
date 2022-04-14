import {
  Geometry,
  Item,
  Material,
  MaterialTree,
  MaterialTreeRecord,
  ScoreCard,
  ScoreCardWithErrors,
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
    const children = prevMat?.children
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
      children,
    } as MaterialTree;
    return acc;
  }, {} as MaterialTreeRecord);
  return Object.values(mats) as MaterialTree[];
}

export function getTotalEnvPerf(
  values: MaterialTree[],
  items: Item[] = []
): MaterialTree {
  const total = values.reduce(
    (acc, el) => {
      acc.weight = el.weight + (acc?.weight ?? 0);
      acc.embodiedCarbonProduction =
        el.embodiedCarbonProduction + (acc?.embodiedCarbonProduction ?? 0);
      acc.embodiedCarbonTransport =
        el.embodiedCarbonTransport + (acc?.embodiedCarbonTransport ?? 0);
      acc.embodiedCarbonTotal =
        el.embodiedCarbonTotal + (acc?.embodiedCarbonTotal ?? 0);
      acc.embodiedWater = el.embodiedWater + (acc?.embodiedWater ?? 0);
      acc.unitCost = el.unitCost + (acc?.unitCost ?? 0); // useless
      acc.totalCost = el.totalCost + (acc?.totalCost ?? 0);

      return acc;
    },
    { materialId: "Total" } as MaterialTree
  );
  total.totalCost = items.reduce(
    (acc: number, n: Item) => n.totalCost + acc,
    0
  );
  // filter out labour and others and add to unitCost and totalCost
  return total;
}

export function getScoreCard(value: Shelter): ScoreCardWithErrors {
  const scorecard = {
    weight: 0, // l kg/m2/year
    co2: 0,
    h2o: 0,
    techPerf: value.technical_performance_score ?? 0,
    habitability: value.habitability_score ?? 0,
    affordability: 0,
  } as ScoreCard;
  const errors: string[] = [];
  const { totalEnvPerf, shelter_lifespan, geometry } = value;
  if (!shelter_lifespan) {
    errors.push("Shelter lifespan not defined");
  }
  if (!geometry?.floorArea) {
    errors.push("Floor area not defined");
  }
  if (!shelter_lifespan || !geometry?.floorArea) {
    return { scorecard, errors };
  }
  // start computing information here
  if (totalEnvPerf?.totalCost) {
    scorecard.affordability =
      totalEnvPerf.totalCost / geometry.floorArea / shelter_lifespan;
  } else {
    errors.push("total cost not defined, missing bill of quantities");
  }

  if (totalEnvPerf?.weight) {
    scorecard.weight =
      totalEnvPerf.weight / geometry.floorArea / shelter_lifespan;
  } else {
    errors.push("weight not defined, missing bill of quantities");
  }

  if (totalEnvPerf?.embodiedCarbonTotal) {
    scorecard.co2 =
      totalEnvPerf.embodiedCarbonTotal / geometry.floorArea / shelter_lifespan;
  } else {
    errors.push(
      "embodied carbon total not defined, missing bill of quantities"
    );
  }

  if (totalEnvPerf?.embodiedWater) {
    scorecard.h2o =
      totalEnvPerf.embodiedWater / geometry.floorArea / shelter_lifespan;
  } else {
    errors.push("embodied water not defined, missing bill of quantities");
  }

  return { scorecard, errors };
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
    risk_flood: "",
    risk_seismic: "",
    habitability: {},
    habitability_score: 0,
    technical_performance_score: 0,
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
