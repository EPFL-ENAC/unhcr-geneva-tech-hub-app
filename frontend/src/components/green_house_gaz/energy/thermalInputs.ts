import { numberOfDaysPerYear } from "@/components/green_house_gaz/energy/computeCO2cost";

export function computeThermalKWHPerYearFromPerDay(
  KwhPerdayPerHH: number
): number {
  // return KwhPerYearPerHH
  const kWhPerYear = KwhPerdayPerHH * numberOfDaysPerYear;
  return parseFloat(kWhPerYear.toFixed(1));
}

export function computeThermalKWHPerDayFromPerYear(
  KwhPerYearPerHH: number
): number {
  return KwhPerYearPerHH / numberOfDaysPerYear;
}