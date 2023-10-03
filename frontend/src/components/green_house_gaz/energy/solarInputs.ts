import {
  numberOfDaysPerYear,
  TimePeriod,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import { formatNumber } from "@/plugins/filters";
import { EnergyItem } from "@/store/GhgInterface";

const countryIrradiance = {
  IR: 5.540210523,
  SD: 6.144615357,
  ET: 5.58995835,
  NG: 5.048999786,
  SS: 5.594999909,
  IQ: 5.144899988,
  SY: 5.275000095,
  DJ: 5.999500037,
  TD: 6.189173947,
  GH: 4.905750036,
  TG: 5.423499823,
  PK: 5.217333158,
  TH: 4.730999947,
  CD: 5.191285883,
  CM: 5.514249981,
  BY: 2.960749984,
  CU: 5.421000004,
  BD: 4.949235285,
  KE: 5.797000027,
  IN: 5.351500035,
  BW: 3.657000065,
  MW: 5.708000183,
  NP: 3.720999956,
  LR: 4.922000051,
  ZW: 5.741499901,
  AF: 5.170000076,
  YE: 5.926000118,
  SI: 3.513000011,
  AO: 5.414000034,
  JO: 5.909666697,
  ZM: 5.852000078,
  MZ: 5.338999987,
  TZ: 5.707000097,
  NA: 6.465000153,
  default: 5.317878598,
};

export type CountryIrradianceKeys = keyof typeof countryIrradiance;
export function computeKWHPerDayPerCountry(
  kW: number,
  countryTwoLetterCode: CountryIrradianceKeys,
  locationIrradianceValue: number | undefined
): number {
  // return the number of kWh per day

  const performanceRatio = 0.8;
  const defaultIrradiance = countryIrradiance.default;
  const irradiance =
    locationIrradianceValue ??
    countryIrradiance?.[countryTwoLetterCode] ??
    defaultIrradiance;

  const kWh = kW * irradiance * performanceRatio;
  return parseFloat(kWh.toFixed(1));
}

export function computeKWHPerYearPerCountry(
  kw: number,
  countryTwoLetterCode: CountryIrradianceKeys,
  locationIrradianceValue: number | undefined
): number {
  const kWhPerYear =
    computeKWHPerDayPerCountry(
      kw,
      countryTwoLetterCode,
      locationIrradianceValue
    ) * numberOfDaysPerYear;
  return parseFloat(kWhPerYear.toFixed(1));
}

export function computeKWInstalledWithKwhPerDayPerCountry(
  kWh: number,
  countryTwoLetterCode: CountryIrradianceKeys,
  locationIrradianceValue: number | undefined
): number {
  // return the number of kWh per day
  const defaultIrradiance = countryIrradiance.default;
  const performanceRatio = 0.8;
  const irradiance =
    locationIrradianceValue ??
    countryIrradiance?.[countryTwoLetterCode] ??
    defaultIrradiance;
  const kw = kWh / (irradiance * performanceRatio);

  // if kWh = kw * h * performanceRatio then
  // kw = kWh / h * performanceRatio
  return parseFloat(kw.toFixed(1));
}

export function computeKWInstalledWithKwhPerYearPerCountry(
  kWh: number,
  countryTwoLetterCode: CountryIrradianceKeys,
  locationIrradianceValue: number | undefined
): number {
  const kWInstalledPerYear =
    computeKWInstalledWithKwhPerDayPerCountry(
      kWh,
      countryTwoLetterCode,
      locationIrradianceValue
    ) / numberOfDaysPerYear;
  return parseFloat(kWInstalledPerYear.toFixed(3));
}

export function solarInputsProducedPer(
  timePeriod: TimePeriod,
  countryTwoLetterCode: CountryIrradianceKeys,
  locationIrradianceValue: number | undefined,
  { hideFooterContent } = { hideFooterContent: false }
): any[] {
  let computeSolarPower: any;
  let computeSolarInstalled: any;
  let suffix: string;
  switch (timePeriod) {
    case "Day":
      computeSolarPower = computeKWHPerDayPerCountry;
      computeSolarInstalled = computeKWInstalledWithKwhPerDayPerCountry;
      suffix = "kWh/day";
      break;
    // case "Month":
    //   break;
    case "Week":
      throw new Error("Week is not supported for Solar");
      break;
    case "Year":
      suffix = "kWh/year";
      computeSolarPower = computeKWHPerYearPerCountry;
      computeSolarInstalled = computeKWInstalledWithKwhPerYearPerCountry;
      break;
    default:
      suffix = "kWh/unknown";
      break;
  }
  return [
    {
      value: "input.solarInstalled", // maybe use like in DieselGeneratorWithoutLitres
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
      formatter: (v: number) => {
        return formatNumber(v);
      },
      text: "Total kW of solar installed",
      suffix: "Kw",
      style: {
        cols: "12",
      },
      type: "number",
    },
    {
      value: "input.renewablePower", // maybe use like in DieselGeneratorWithoutLitres
      conditional_value: ["ELE_SOLAR", "ELE_HYB"],
      disabled: false,
      text: `Solar (${suffix}) estimated`,
      formatter: (v: number) => {
        return formatNumber(v);
      },
      customEventInput: (renewablePower: number, localInput: EnergyItem) => {
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
      hideFooterContent,
    },
  ];
}
