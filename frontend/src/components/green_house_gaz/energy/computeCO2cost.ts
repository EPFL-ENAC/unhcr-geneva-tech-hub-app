import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

interface DieselItem {
  dieselLiters?: number;
  disableDieselLiters?: boolean;
  generatorSize?: number; // replace the diesel liter
  operatingHours?: number; // replace the diesel liter
  generatorLoad?: number; // load of generator (should be default to 60%)
}

export const numberOfDaysPerYear = 365.25;
export const numberOfWeekPerYear = 52;

export type TimePeriod = "Day" | "Week" | "Year";

// TODO: remove duplicate of GhgInterface
interface EnergyItem extends DieselItem {
  gridPower?: number;
  dieselPower?: number;
  renewablePower?: number;
}

export function computeCO2CostEnergy(
  localItem: EnergyItem,
  REF_DIES_L: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  // const dieselLiters = getLitresPerYearForGeneratorHoursPerWeek(localItem);
  // dieselLiters should always be defined prior
  // l * kgCO2/l / 1000  === tCO2e
  if (REF_DIES_L?.value === undefined) {
    throw new Error("REF_DIES_L value is undefined");
  }
  result += ((localItem?.dieselLiters ?? 0) * REF_DIES_L?.value) / 1000;

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
