import type { EnergyItem, DieselItem } from "@/store/GhgInterface";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

export const numberOfDaysPerYear = 365.25;
export const numberOfWeekPerYear = 52;

export type TimePeriod = "Day" | "Week" | "Year";

export function computeCO2CostEnergy(
  localItem: EnergyItem,
  REF_EFF_DIES: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  // l * kgCO2/l / 1000  === tCO2e
  if (REF_EFF_DIES?.value === undefined) {
    throw new Error("REF_EFF_DIES value is undefined");
  }
  result += ((localItem?.fuelUsage ?? 0) * REF_EFF_DIES?.value) / 1000;

  // FYI, some countries are not in the IGES_GRID in MWH should be KWH
  // kwh * (tcO2/MWh) / 1000 == tco2e
  // because if 1 ton per megahw then we will have 1 ton per 1000kwh
  // then 1/1000 ton per kwh

  if (REF_GRD?.value === undefined) {
    throw new Error("REF_GRD value is undefined");
  }
  result += ((localItem?.gridPower ?? 0) * REF_GRD.value) / 1000;
  return result;
}
