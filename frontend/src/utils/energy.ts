import {
  CookingFuel,
  CookingStove,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { cccmColors } from "@/plugins/vuetify";

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function applyMap<T>(
  t: Record<keyof T, number | undefined>,
  fn: (value: number | undefined) => number
): Record<keyof T, number> {
  return Object.fromEntries<number>(
    Object.entries<number | undefined>(t).map(([key, value]) => [
      key,
      fn(value),
    ])
  ) as Record<keyof T, number>;
}

export function applyReduce<T extends Record<keyof T, number | undefined>>(
  ts: T[],
  fn: (a: number | undefined, b: number | undefined) => number,
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

export function fnSum(a: number | undefined, b: number | undefined): number {
  return (a ?? 0) + (b ?? 0);
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

export function toPercentage(value?: number): number | undefined {
  return value !== undefined ? value * 100 : undefined;
}

/**
 * @deprecated change values to percentage
 */
export function toRate(value?: number): number | undefined {
  return value !== undefined ? (value - 1) * 100 : undefined;
}
