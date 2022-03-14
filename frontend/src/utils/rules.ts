import { sumBy } from "lodash";

export type Rule = (
  value: string | boolean | number | null | undefined
) => boolean | string;

export const checkRequired: Rule = function (value) {
  return (
    (value != undefined &&
      (typeof value === "boolean" ||
        typeof value === "number" ||
        typeof value === "object" ||
        (typeof value === "string" && value.length > 0))) ||
    "Required."
  );
};

export function checkMin(min: number): Rule {
  return (value) =>
    (typeof value === "number" && value >= min) || `Mininum ${min}.`;
}

export function checkMax(max: number): Rule {
  return (value) =>
    (typeof value === "number" && value <= max) || `Maximum ${max}.`;
}

export function checkSum<T>(
  t: T,
  expected: number,
  ...keys: (keyof T)[]
): Rule {
  return () =>
    sumBy(keys, (key) => t[key] as unknown as number) === expected ||
    `Sum to ${expected}`;
}
