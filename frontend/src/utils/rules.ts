export type Rule = (
  value: string | boolean | number | null | undefined
) => boolean | string;

export const required: Rule = function (value) {
  return (
    (value != undefined &&
      (typeof value === "boolean" ||
        typeof value === "number" ||
        typeof value === "object" ||
        (typeof value === "string" && value.length > 0))) ||
    "Required."
  );
};

export function min(min: number): Rule {
  return (value) =>
    (typeof value === "number" && value >= min) || `Mininum ${min}.`;
}

export function max(max: number): Rule {
  return (value) =>
    (typeof value === "number" && value <= max) || `Maximum ${max}.`;
}
