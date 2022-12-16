import { EnergyItem } from "@/store/GhgInterface.vue";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

export function computeLitresDiesel(
  generatorSize: number,
  operatingHours: number,
  generatorLoad: number | undefined
): number {
  // generatorLoad in percentage 10% not 0.1
  const REF_DIES_GEN = -0.031 * Math.log((generatorLoad ?? 0.6) / 100) + 0.2514;
  // operating hours are hours-per-day and we should use hours-per-year
  const litres = generatorSize * (operatingHours * 365) * REF_DIES_GEN;
  return parseFloat(litres.toFixed(2));
}

export function computeCO2Cost(
  localItem: EnergyItem,
  REF_DIES: ReferenceItemInterface | undefined,
  REF_WSH_D_L: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  const {
    dieselLiters,
    gridPower,
    generatorSize,
    operatingHours,
    generatorLoad,
  } = localItem || {};

  if (REF_WSH_D_L && generatorSize && operatingHours) {
    // generatorSize and operating Hours has priority over dieselLiters
    // we don't want to use REF_DIES but REF_WSH_D_L
    // REF_DIES_GEN is now comming from -0.031*Math.log(0.6) + 0.2514 with 0.6 being 60% load
    // cf https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/106 as reference

    const KW_2_LITRE_DIE = computeLitresDiesel(
      generatorSize,
      operatingHours,
      generatorLoad
    );
    result += (REF_WSH_D_L.value * KW_2_LITRE_DIE) / 1000;
  } else if (REF_DIES && dieselLiters) {
    result += (dieselLiters * REF_DIES.value) / 1000;
  }
  if (REF_GRD && gridPower) {
    result += (gridPower * REF_GRD.value) / 1000;
  }
  return result;
}
