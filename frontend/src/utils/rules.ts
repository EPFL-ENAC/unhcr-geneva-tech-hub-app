export const rules: Record<
  string,
  (value: string | boolean | number | null | undefined) => boolean | string
> = {
  required: (value) =>
    (value != undefined &&
      (typeof value === "boolean" ||
        typeof value === "number" ||
        typeof value === "object" ||
        (typeof value === "string" && value.length > 0))) ||
    "Required.",
};
