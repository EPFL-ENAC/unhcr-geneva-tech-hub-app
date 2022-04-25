import {
  CookingFuel,
  CookingStove,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { cccmColors } from "@/plugins/vuetify";

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function applyMap<T extends Record<keyof T, number>>(
  t: T,
  fn: (value: number) => number
): T {
  return Object.fromEntries<number>(
    Object.entries<number>(t).map(([key, value]) => [key, fn(value)])
  ) as T;
}

export function applyReduce<T extends Record<keyof T, number>>(
  ts: T[],
  fn: (a: number, b: number) => number,
  initial?: T
): T {
  const callbackFn = (a: T, b: T) =>
    Object.fromEntries<number>(
      (Object.keys(a) as (keyof T)[]).map((key) => [key, fn(a[key], b[key])])
    ) as T;
  if (initial) {
    return ts.reduce(callbackFn, initial);
  } else {
    return ts.reduce(callbackFn);
  }
}

export function getCookingFuel(
  cookingFuels: CookingFuel[],
  stove: CookingStove,
  defaultFuel: CookingFuel = {
    _id: stove.fuel,
    name: stove.fuel,
    index: -1,
    energy: 0,
    emissionFactorCo2: 0,
    price: 0,
  }
): CookingFuel {
  return cookingFuels.find((fuel) => fuel._id === stove.fuel) ?? defaultFuel;
}

export function getColor(cat: SocioEconomicCategory): string {
  switch (cat) {
    case "veryLow":
      return cccmColors.secondary5;
    case "low":
      return cccmColors.secondary4;
    case "middle":
      return cccmColors.secondary3;
    case "high":
      return cccmColors.secondary2;
    case "veryHigh":
      return cccmColors.secondary1;
  }
}
