import { EnergyItem } from "@/store/GhgInterface";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

export function computeCO2Cost(
  localItem: EnergyItem,
  REF_DIES: ReferenceItemInterface | undefined,
  REF_DIES_GEN: ReferenceItemInterface | undefined,
  REF_WSH_D_L: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  const { dieselLiters, gridPower, generatorSize, operatingHours } =
    localItem || {};

  if (REF_WSH_D_L && REF_DIES_GEN && generatorSize && operatingHours) {
    // generatorSize and operating Hours has priority over dieselLiters
    // we don't want to use REF_DIES but REF_WSH_D_L
    const KW_2_LITRE_DIE = generatorSize * operatingHours * REF_DIES_GEN.value;
    result += (REF_WSH_D_L.value * KW_2_LITRE_DIE) / 1000;
  } else if (REF_DIES && dieselLiters) {
    result += (dieselLiters * REF_DIES.value) / 1000;
  }
  if (REF_GRD && gridPower) {
    result += (gridPower * REF_GRD.value) / 1000;
  }
  return result;
}
