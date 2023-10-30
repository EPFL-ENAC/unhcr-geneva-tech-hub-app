import {
  DoorDimensions,
  Geometry,
  Item,
  listOfShelterType,
  Material,
  MaterialTree,
  MaterialTreeRecord,
  Score,
  ScoreCard,
  ScoreCardWithErrors,
  Shelter,
  ShelterState,
  WindowDimensions,
} from "@/store/ShelterInterface";
import { cloneDeep, isNumber } from "lodash";
import { CouchUser } from "./UserModule";

export const TOTAL_SCORE_HAB = 14;
export const TOTAL_HAB_ITEMS = 14;
export const TOTAL_SCORE_TECH_PERF = 42;
export const TOTAL_TECH_PERF_ITEMS = 39;

export function generateState(): ShelterState {
  return {
    shelter: {} as Shelter,
    shelterLoading: false,
    shelters: [],
    sheltersLength: 0,
    scorecards: [],
    localCouch: null,
    years: [], // hold all the years of shelters created_at grouped
    countries: [], // hold all the shelters countries grouped
  };
}

export function areDoorsBiggerThan90cm(geometry: Geometry): number {
  const { doors_dimensions } = geometry;
  if (doors_dimensions.length === 0) {
    return -1; // false // no doors
  }
  const maxDoorWidth = Math.max(
    ...doors_dimensions.map((door: DoorDimensions) => door.Wd ?? 0)
  );
  // -1 means false; undefined means not applicable or unknown; 1 means true
  // cf habitabilityForm.ts
  return maxDoorWidth < 0.9 ? -1 : 1;
}

export function getMaxWindowArea(windowDimensions: WindowDimensions[]): number {
  if (windowDimensions.length === 0) {
    return 0;
  }
  return Math.max(
    ...windowDimensions.map(({ Ww, Hw }) => {
      if (!Ww || !Hw) {
        return 0; // missing Ww or Hw area is 0
      }
      return Ww * Hw;
    })
  );
}

export function getScore(score: Score): { score: number; completed: number } {
  const ytech = Object.keys(score)
    .filter((x) => !x.match("na$"))
    .filter((x) => x !== "completed")
    .filter((x) => x.match("^input.*"));
  // check that it doesn not contains na and completed field
  const completedTech = ytech
    .map((x) => score[x])
    .filter((x) => x !== undefined && typeof x !== "boolean" && x !== null);
  const completedTechLength = completedTech.length;

  const valuesTech = completedTech.filter(
    (x) => x !== undefined && x !== -1
  ) as number[];

  return {
    score: valuesTech.reduce((acc, el) => acc + el, 0),
    completed: completedTechLength,
  };
}

export function getNonApplicableScore(score: Score): {
  score: number;
  length: number;
} {
  const xtech = Object.keys(score).filter((x) => x.match("na$"));
  const nonApplicableArray = xtech
    .map((x) => score[x])
    .filter((x) => x !== undefined && x !== false && x !== 0); /// new: na can be number or boolean; if 0 false, 1 true
  const nonApplicableScore = nonApplicableArray.reduce((acc: number, el) => {
    if (typeof el === "boolean") {
      return acc + 1; // statisticaly, 90% of the time it will be true.. and it happens only for old schemas
    } else {
      return acc + (el as number);
    }
  }, 0);
  return {
    score: nonApplicableScore,
    length: nonApplicableArray.length,
  };
}

export function computeShelter(value: Shelter): Shelter {
  const newShelter = cloneDeep(value);
  const resultShelter = completeMissingFields(newShelter);
  // Divide by number of individual shelters in BOQ
  resultShelter.envPerfItems = getEnvPerfItems(
    newShelter?.items,
    newShelter?.items_individual_shelter
  );
  resultShelter.totalEnvPerf = getTotalEnvPerf(
    resultShelter.envPerfItems,
    newShelter?.items
  );

  // technical performance
  const technicalScore = getScore(resultShelter.technical_performance);
  const nonApplicableTechnicalScore = getNonApplicableScore(
    resultShelter.technical_performance
  );
  const totalTechWithApplicable =
    TOTAL_SCORE_TECH_PERF - nonApplicableTechnicalScore.score;

  resultShelter.technical_performance_score_real = `${technicalScore.score} / ${totalTechWithApplicable}`;
  resultShelter.technical_performance_score =
    technicalScore.score / totalTechWithApplicable;

  const totalToBeCompleted =
    TOTAL_TECH_PERF_ITEMS - nonApplicableTechnicalScore.length;
  resultShelter.technical_performance.completed =
    technicalScore.completed === totalToBeCompleted;

  // habitability
  const habitabilityScore = getScore(resultShelter.habitability);
  const nonApplicableHabitabilityScore = getNonApplicableScore(
    resultShelter.habitability
  );
  const totalHabWithApplicable =
    TOTAL_SCORE_HAB - nonApplicableHabitabilityScore.score;

  resultShelter.habitability_score_real = `${habitabilityScore.score} / ${totalHabWithApplicable}`;
  resultShelter.habitability_score =
    habitabilityScore.score / totalHabWithApplicable;

  // todo change completed
  const totalHabToBeCompleted =
    TOTAL_HAB_ITEMS - nonApplicableHabitabilityScore.length;
  resultShelter.habitability.completed =
    habitabilityScore.completed === totalHabToBeCompleted;

  resultShelter.completed_geometry =
    resultShelter.geometry?.floorArea > 0 && resultShelter.geometry?.volume > 0;
  resultShelter.completed =
    (resultShelter.completed_info &&
      resultShelter.completed_geometry &&
      resultShelter.completed_boq &&
      (resultShelter.habitability.completed as boolean) &&
      (resultShelter.technical_performance.completed as boolean)) ??
    false;

  const { scorecard, errors } = getScoreCard(resultShelter);
  resultShelter.scorecard = scorecard;
  resultShelter.scorecard_errors = errors;
  return resultShelter;
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

export function getEnvPerfItems(
  items: Item[] = [],
  items_individual_shelter = 1
): MaterialTree[] {
  const mats = items.filter(isMaterial).reduce((acc, n: Item) => {
    const el = n as Material;
    const prevMat = acc[el.materialId];
    const children = prevMat?.children
      ? prevMat.children.push(el) && prevMat.children
      : [el];
    let embodiedCarbonTransport: number | string;
    const prevEmbodiedCarbonTransport: number =
      (prevMat?.embodiedCarbonTransport as number) ?? 0;
    if (typeof el.embodiedCarbonTransport === "number") {
      embodiedCarbonTransport =
        el.embodiedCarbonTransport + prevEmbodiedCarbonTransport;
    } else {
      embodiedCarbonTransport = 0;
    }
    acc[el.materialId] = {
      materialId: el.materialId,
      formId: "",
      weight: el.weight + (prevMat?.weight ?? 0),
      embodiedCarbonProduction:
        el.embodiedCarbonProduction + (prevMat?.embodiedCarbonProduction ?? 0),
      embodiedCarbonTransport,
      embodiedCarbonTotal:
        el.embodiedCarbonTotal + (prevMat?.embodiedCarbonTotal ?? 0),
      embodiedWater: el.embodiedWater + (prevMat?.embodiedWater ?? 0),
      unitCost: el.unitCost + (prevMat?.unitCost ?? 0),
      totalCost: el.totalCost + (prevMat?.totalCost ?? 0),
      children,
    } as MaterialTree;
    return acc;
  }, {} as MaterialTreeRecord);
  const result = Object.values(mats).map((mat) => ({
    ...mat,
    children: mat.children?.map((child) => ({
      ...child,
      embodiedCarbonProduction:
        child.embodiedCarbonProduction / items_individual_shelter,
      embodiedCarbonTotal: child.embodiedCarbonTotal / items_individual_shelter,
      embodiedCarbonTransport: isNumber(child.embodiedCarbonTransport)
        ? child.embodiedCarbonTransport / items_individual_shelter
        : child.embodiedCarbonTransport,
      embodiedWater: child.embodiedWater / items_individual_shelter,
      totalCost: child.totalCost / items_individual_shelter,
      weight: child.weight / items_individual_shelter,
    })),
    embodiedCarbonProduction:
      mat.embodiedCarbonProduction / items_individual_shelter,
    embodiedCarbonTotal: mat.embodiedCarbonTotal / items_individual_shelter,
    embodiedCarbonTransport: isNumber(mat.embodiedCarbonTransport)
      ? mat.embodiedCarbonTransport / items_individual_shelter
      : mat.embodiedCarbonTransport,
    embodiedWater: mat.embodiedWater / items_individual_shelter,
    totalCost: mat.totalCost / items_individual_shelter,
    weight: mat.weight / items_individual_shelter,
  })) as MaterialTree[];
  return result;
}

export function getTotalEnvPerf(
  values: MaterialTree[],
  items: Item[] = []
): MaterialTree {
  const total = values.reduce(
    (acc, el) => {
      let embodiedCarbonTransport: number;
      const prevEmbodiedCarbonTransport: number =
        (acc?.embodiedCarbonTransport as number) ?? 0;
      if (typeof el.embodiedCarbonTransport === "number") {
        embodiedCarbonTransport =
          el.embodiedCarbonTransport + prevEmbodiedCarbonTransport;
      } else {
        embodiedCarbonTransport = 0;
      }

      acc.weight = el.weight + (acc?.weight ?? 0);
      acc.embodiedCarbonProduction =
        el.embodiedCarbonProduction + (acc?.embodiedCarbonProduction ?? 0);
      acc.embodiedCarbonTransport = embodiedCarbonTransport;
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
export function getDefaultScoreCard(): ScoreCard {
  return {
    weight: 0, // l kg/m2/year
    co2: 0,
    h2o: 0,
    techPerf: 0,
    habitability: 0,
    affordability: 0,
  };
}

export function getScoreCard(value: Shelter): ScoreCardWithErrors {
  const scorecard = getDefaultScoreCard();
  scorecard.techPerf = value.technical_performance_score ?? 0;
  scorecard.habitability = value.habitability_score ?? 0;
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

export function generateNewShelter(name: string, user: CouchUser): Shelter {
  if (!user.name) {
    // generate error
    throw new Error("User name does not exist");
  } else {
    const currentDate = new Date().toISOString();
    return {
      _id: name,
      name,
      organisation: "",
      shelter_type: listOfShelterType[0],
      completed: false,
      completed_info: false,
      completed_geometry: false,
      completed_boq: false,
      public: true,
      region: "",
      shelter_occupants: undefined, // people
      shelter_lifespan: undefined, // years
      setup_people: undefined, // 2 people necessary for setup
      setup_time: undefined, // days,
      location_name: "",
      location_country: "", // iso code ?
      latitude: 0,
      longitude: 0,
      images: [],
      risk_flood: "",
      risk_seismic: "",
      habitability: {
        completed: false,
      },
      habitability_score: 0,
      technical_performance_score: 0,
      technical_performance: {
        completed: false,
      },
      geometry: getNewGeometry(),
      items: [],
      items_individual_shelter: 1,
      envPerfItems: [],
      totalEnvPerf: getTotalEnvPerf([], []),
      scorecard: getDefaultScoreCard(),
      scorecard_errors: [],
      users: [user],
      created_by: user.name,
      created_at: currentDate,
      updated_at: currentDate,
      updated_by: user.name,
    };
  }
}

export function completeMissingFields(shelter: Shelter): Shelter {
  return {
    ...shelter, // set _rev, _id, name,created_by, users by doing so
    // real overide
    organisation: shelter.organisation ?? "",
    shelter_occupants: shelter.shelter_occupants ?? undefined, // people
    shelter_lifespan: shelter.shelter_lifespan ?? undefined, // years
    setup_people: shelter.setup_people ?? undefined, // 2 people necessary for setup
    setup_time: shelter.setup_time ?? undefined, // days,
    location_name: shelter.location_name ?? "",
    location_country: shelter.location_country ?? "", // iso code ?
    latitude: shelter.latitude ?? 0,
    longitude: shelter.longitude ?? 0,
    images: shelter.images ?? [],
    risk_flood: shelter.risk_flood ?? "",
    risk_seismic: shelter.risk_seismic ?? "",
    habitability: shelter.habitability ?? {},
    habitability_score: shelter.habitability_score ?? 0,
    technical_performance_score: shelter.technical_performance_score ?? 0,
    technical_performance: shelter.technical_performance ?? {},
    geometry: shelter.geometry ?? getNewGeometry(),
    items: shelter.items ?? [],
    envPerfItems: shelter.envPerfItems ?? [],
    totalEnvPerf: shelter.totalEnvPerf ?? getTotalEnvPerf([], []),
    scorecard: shelter.scorecard ?? getDefaultScoreCard(),
    scorecard_errors: shelter.scorecard_errors ?? [],
  };
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
