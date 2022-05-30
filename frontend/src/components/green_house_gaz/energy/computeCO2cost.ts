import { EnergyItem } from "@/store/GhgInterface";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

export function computeCO2Cost(
  localItem: EnergyItem,
  REF_DIES: ReferenceItemInterface | undefined,
  REF_GRD: ReferenceItemInterface | undefined
): number {
  let result = 0;
  const { dieselLiters, gridPower } = localItem || {};
  if (REF_DIES && dieselLiters) {
    result += (dieselLiters * REF_DIES.value) / 1000;
  }
  if (REF_GRD && gridPower) {
    result += (gridPower * REF_GRD.value) / 1000;
  }
  return result;
}
