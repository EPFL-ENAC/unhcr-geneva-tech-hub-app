import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

interface DieselItem {
  dieselLiters?: number;
  disableDieselLiters?: boolean;
  generatorSize?: number; // replace the diesel liter
  operatingHours?: number; // replace the diesel liter
  generatorLoad?: number; // load of generator (should be default to 60%)
}

const numberOfDaysPerYear = 365.25;
const numberOfWeekPerYear = 52;

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

export type countryIrradianceKeys = keyof typeof countryIrradiance;
export function computeKWHPerDayPerCountry(
  kW: number,
  countryTwoLetterCode: countryIrradianceKeys,
  locationIrradianceValue: number | undefined
): number {
  // return the number of kwh per day

  const performanceRatio = 0.8;
  const defaultIrradiance = countryIrradiance.default;
  const irradiance =
    locationIrradianceValue ??
    countryIrradiance?.[countryTwoLetterCode] ??
    defaultIrradiance;

  const kwh = kW * irradiance * performanceRatio;
  return parseFloat(kwh.toFixed(1));
}

export function computeKWHPerYearPerCountry(
  kw: number,
  countryTwoLetterCode: countryIrradianceKeys,
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
  countryTwoLetterCode: countryIrradianceKeys,
  locationIrradianceValue: number | undefined
): number {
  // return the number of kwh per day
  const defaultIrradiance = countryIrradiance.default;
  const performanceRatio = 0.8;
  const irradiance =
    locationIrradianceValue ??
    countryIrradiance?.[countryTwoLetterCode] ??
    defaultIrradiance;
  const kw = kWh / (irradiance * performanceRatio);

  // if kwh = kw * h * performanceRatio then
  // kw = kwh / h * performanceRatio
  return parseFloat(kw.toFixed(1));
}

export function computeKWInstalledWithKwhPerYearPerCountry(
  kwh: number,
  countryTwoLetterCode: countryIrradianceKeys,
  locationIrradianceValue: number | undefined
): number {
  const kWInstalledPerYear =
    computeKWInstalledWithKwhPerDayPerCountry(
      kwh,
      countryTwoLetterCode,
      locationIrradianceValue
    ) / numberOfDaysPerYear;
  return parseFloat(kWInstalledPerYear.toFixed(1));
}

export function computeLitresDiesel(localItem: DieselItem): number {
  const {
    generatorSize = 0,
    operatingHours = 0,
    generatorLoad = 60,
  } = localItem || {};
  // generatorLoad in percentage 10% not 0.1
  const genLoad = (generatorLoad ?? 60) / 100;
  const DIE_GEN_L_per_kWh = -0.031 * Math.log(genLoad) + 0.2514;
  const litres =
    generatorSize *
    (operatingHours * numberOfWeekPerYear) *
    DIE_GEN_L_per_kWh *
    genLoad;

  return parseFloat(litres.toFixed(0));
}

export function computeLitresPerDayDiesel(localItem: DieselItem): number {
  const {
    generatorSize = 0,
    operatingHours = 0, // perDay
    generatorLoad = 60,
  } = localItem || {};
  // generatorLoad in percentage 10% not 0.1
  const genLoad = (generatorLoad ?? 60) / 100;
  const DIE_GEN_L_per_kWh = -0.031 * Math.log(genLoad) + 0.2514;
  const litres = generatorSize * operatingHours * DIE_GEN_L_per_kWh * genLoad;

  return parseFloat(litres.toFixed(0));
}

export function getLitres(localItem: DieselItem): number {
  if (localItem.disableDieselLiters) {
    return computeLitresDiesel(localItem);
  } else {
    return localItem?.dieselLiters ?? 0;
  }
}

/// TODO: remove duplicate of GhgInterface
interface EnergyItem extends DieselItem {
  gridPower?: number;
  dieselPower?: number;
  renewablePower?: number;
}

export function computeCO2Cost(
  localItem: EnergyItem,
  REF_DIES_L: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  const dieselLitres = getLitres(localItem);
  // l * kgCO2/l / 1000  === tCO2e
  result += (dieselLitres * (REF_DIES_L?.value ?? 0)) / 1000;
  if (REF_GRD?.value === undefined) {
    throw new Error("REF_GRD value is undefined");
  }
  // FYI, some countries are not in the IGES_GRID in MWH should be KWH
  // kwh * (tcO2/MWh) / 1000 == tco2e
  // because if 1 ton per megahw then we will have 1 ton per 1000kwh
  // then 1/1000 ton per kwh
  result += ((localItem?.gridPower ?? 0) * REF_GRD.value) / 1000;
  return result;
}

export function computeDieselPower(
  localItem: EnergyItem,
  REF_EFF_DIES_L: ReferenceItemInterface | undefined
): number {
  if (REF_EFF_DIES_L?.value) {
    const result = (localItem?.dieselLiters ?? 0) / REF_EFF_DIES_L?.value;
    return parseFloat(result.toFixed(0));
  }
  return 0;
}
