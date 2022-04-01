import {
  EnvPerf,
  EnvPerfRecord,
  Geometry,
  Item,
  Material,
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

export function getEnvPerfItems(items: Item[] = []): EnvPerf[] {
  const mats = items
    .filter((el: Item) => {
      // isMaterial
      return isMaterial(el);
    })
    .reduce((acc, n: Item) => {
      const el = n as Material;
      // only if el is a Material
      const prevMat = acc[el.materialId];
      const items = prevMat?.items
        ? prevMat.items.push(el) && prevMat.items
        : [el];
      acc[el.materialId] = {
        material: el.materialId,
        weight: el.weight + (prevMat?.weight ?? 0),
        embodied_carbon_production:
          el.embodiedCarbon + (prevMat?.embodied_carbon_production ?? 0),
        embodied_carbon_transport:
          el.embodiedCarbonTransport +
          (prevMat?.embodied_carbon_transport ?? 0),
        embodied_carbon_total:
          el.embodiedCarbon +
          el.embodiedCarbonTransport +
          (prevMat?.embodied_carbon_total ?? 0),
        embodied_water: el.embodiedWater + (prevMat?.embodied_water ?? 0),
        unit_cost: el.unitCost + (prevMat?.unit_cost ?? 0),
        total_cost: el.totalCost + (prevMat?.total_cost ?? 0),
        items,
      } as EnvPerf;
      return acc;
    }, {} as EnvPerfRecord);
  return Object.values(mats) as EnvPerf[];
}

export function getTotalEnvPerf(values: EnvPerf[]): EnvPerf {
  return values.reduce(
    (acc, el) => {
      acc.weight = el.weight + (acc?.weight ?? 0);
      acc.embodied_carbon_production =
        el.embodied_carbon_production + (acc?.embodied_carbon_production ?? 0);
      acc.embodied_carbon_transport =
        el.embodied_carbon_transport + (acc?.embodied_carbon_transport ?? 0);
      acc.embodied_carbon_total =
        el.embodied_carbon_total + (acc?.embodied_carbon_total ?? 0);
      acc.embodied_water = el.embodied_water + (acc?.embodied_water ?? 0);
      acc.unit_cost = el.unit_cost + (acc?.unit_cost ?? 0);
      acc.total_cost = el.total_cost + (acc?.total_cost ?? 0);

      return acc;
    },
    { material: "Total" } as EnvPerf
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
  if (totalEnvPerf?.total_cost) {
    returnValue.affordability =
      totalEnvPerf.total_cost / geometry.floorArea / shelter_lifespan;
  } else {
    console.log("total_cost not defined");
  }

  if (totalEnvPerf?.weight) {
    returnValue.weight =
      totalEnvPerf.weight / geometry.floorArea / shelter_lifespan;
  } else {
    console.log("weight not defined");
  }

  if (totalEnvPerf?.embodied_carbon_total) {
    returnValue.co2 =
      totalEnvPerf.embodied_carbon_total /
      geometry.floorArea /
      shelter_lifespan;
  } else {
    console.log("embodied_carbon_total not defined");
  }

  if (totalEnvPerf?.embodied_water) {
    returnValue.h2o =
      totalEnvPerf.embodied_water / geometry.floorArea / shelter_lifespan;
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
