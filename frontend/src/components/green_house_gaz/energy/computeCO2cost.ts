import { EnergyItem } from "@/store/GhgInterface.vue";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

export function computeLitresDiesel(localItem: EnergyItem): number {
  const {
    generatorSize = 0,
    operatingHours = 0,
    generatorLoad = 60,
  } = localItem || {};
  // generatorLoad in percentage 10% not 0.1
  const genLoad = (generatorLoad ?? 60) / 100;
  const DIE_GEN_L_per_kWh = -0.031 * Math.log(genLoad) + 0.2514;
  const litres =
    generatorSize * (operatingHours * 365) * DIE_GEN_L_per_kWh * genLoad;

  return parseFloat(litres.toFixed(2));
}

export function getLitres(localItem: EnergyItem): number {
  if (localItem.disableDieselLiters) {
    return computeLitresDiesel(localItem);
  } else {
    return localItem.dieselLiters;
  }
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
    // FYI, some countries are not in the IGES_GRID_2021
    result += (localItem.gridPower * REF_GRD.value) / 1000;
  }
  return result;
}

export function computeDieselPower(
  localItem: EnergyItem,
  REF_EFF_DIES: ReferenceItemInterface | undefined
): number {
  const result = localItem.dieselLiters * (REF_EFF_DIES?.value ?? 0);
  return parseFloat(result.toFixed(2));
}
