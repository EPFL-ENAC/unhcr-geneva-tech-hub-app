import {
  computeKWHPerDayPerCountry,
  computeKWHPerYearPerCountry,
  computeKWInstalledWithKwhPerDayPerCountry,
  computeKWInstalledWithKwhPerYearPerCountry,
  countryIrradianceKeys,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import { EnergyItem } from "@/store/GhgInterface.vue";

export type TimePeriod = "Day" | "Week" | "Year";
export function solarInputsProducedPer(
  timePerdiod: TimePeriod,
  countryTwoLetterCode: countryIrradianceKeys,
  locationIrradianceValue: number | undefined
): any[] {
  let computeSolarPower: any;
  let computeSolarInstalled: any;
  let suffix: string;
  switch (timePerdiod) {
    case "Day":
      computeSolarPower = computeKWHPerDayPerCountry;
      computeSolarInstalled = computeKWInstalledWithKwhPerDayPerCountry;
      suffix = "Kwh/day";
      break;
    case "Week":
      throw new Error("Week is not supported for Solar");
      break;
    case "Year":
      suffix = "Kwh/year";
      computeSolarPower = computeKWHPerYearPerCountry;
      computeSolarInstalled = computeKWInstalledWithKwhPerYearPerCountry;
      break;
  }
  return [
    {
      value: "input.solarInstalled", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
      conditional_value: ["ELE_SOLAR", "ELE_HYB"],
      conditional: "fuelType",
      tooltipInfo:
        "A performance ratio of 80% is included which assumes a 10% loss through the inverter and 10% transmission loss.",
      customEventInput: (solarInstalled: number, localInput: EnergyItem) => {
        // computeKWHPerYearPerCountry
        localInput.renewablePower = computeSolarPower(
          solarInstalled,
          countryTwoLetterCode,
          locationIrradianceValue
        );
        return localInput;
      },
      text: "Total kW of solar installed",
      suffix: "Kw",
      style: {
        cols: "12",
      },
      type: "number",
    },
    {
      value: "input.renewablePower", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
      conditional_value: ["ELE_SOLAR", "ELE_HYB"],
      disabled: false,
      text: `Solar (${suffix}) estimated`,
      customEventInput: (renewablePower: number, localInput: EnergyItem) => {
        // computeKWInstalledWithKwhPerDayPerCountry
        localInput.solarInstalled = computeSolarInstalled(
          renewablePower,
          countryTwoLetterCode,
          locationIrradianceValue
        );
        return localInput;
      },
      conditional: "fuelType",
      suffix,
      style: {
        cols: "12",
      },
      type: "number",
      computeResults: true,
      hideFooterContent: false,
    },
  ];
}
