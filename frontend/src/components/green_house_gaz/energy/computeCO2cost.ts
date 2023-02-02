import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

interface DieselItem {
  dieselLiters?: number;
  disableDieselLiters?: boolean;
  generatorSize?: number; // replace the diesel liter
  operatingHours?: number; // replace the diesel liter
  generatorLoad?: number; // load of generator (should be default to 60%)
}

export function computeLitresDiesel(localItem: DieselItem): number {
  const {
    generatorSize = 0,
    operatingHours = 0,
    generatorLoad = 60,
  } = localItem || {};
  // 52 is number of weeks per year
  // generatorLoad in percentage 10% not 0.1
  const genLoad = (generatorLoad ?? 60) / 100;
  const DIE_GEN_L_per_kWh = -0.031 * Math.log(genLoad) + 0.2514;
  const litres =
    generatorSize * (operatingHours * 52) * DIE_GEN_L_per_kWh * genLoad;

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

interface EnergyItem extends DieselItem {
  gridPower: number;
  dieselPower?: number;
  renewablePower: number;
}
export function computeCO2Cost(
  localItem: EnergyItem,
  REF_DIES_L: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  const dieselLitres = getLitres(localItem);
  result += (dieselLitres * (REF_DIES_L?.value ?? 0)) / 1000;

  if (REF_GRD && localItem.gridPower) {
    // FYI, some countries are not in the IGES_GRID
    result += (localItem.gridPower * REF_GRD.value) / 1000;
  }
  return result;
}

export function computeDieselPower(
  localItem: EnergyItem,
  REF_EFF_DIES: ReferenceItemInterface | undefined
): number {
  if (REF_EFF_DIES?.value) {
    const result = (localItem?.dieselLiters ?? 0) / REF_EFF_DIES?.value;
    return parseFloat(result.toFixed(0));
  }
  return 0;
}
