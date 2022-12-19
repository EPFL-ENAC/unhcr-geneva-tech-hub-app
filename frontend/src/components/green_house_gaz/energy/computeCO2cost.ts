import { EnergyItem } from "@/store/GhgInterface.vue";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

export function computeLitresDiesel(localItem: EnergyItem): number {
  const {
    generatorSize = 0,
    operatingHours = 0,
    generatorLoad = 60,
  } = localItem || {};
  // generatorLoad in percentage 10% not 0.1
  // TOdO: remove REF_DIES_GEN from database! since it's dynamic now
  const REF_DIES_GEN = -0.031 * Math.log((generatorLoad ?? 60) / 100) + 0.2514;
  // operating hours are hours-per-day and we should use hours-per-year
  const litres = generatorSize * (operatingHours * 365) * REF_DIES_GEN;
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
  REF_DIES: ReferenceItemInterface | undefined,
  REF_WSH_D_L: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  const dieselLitres = computeLitresDiesel(localItem);
  // TODO:  find out why we use two similar factors. It probably be the same
  if (REF_WSH_D_L && localItem.disableDieselLiters) {
    result += (dieselLitres * REF_WSH_D_L.value) / 1000;
  } else if (REF_DIES) {
    result += (dieselLitres * REF_DIES.value) / 1000;
  }
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
  return localItem.dieselLiters * (REF_EFF_DIES?.value ?? 0);
}
