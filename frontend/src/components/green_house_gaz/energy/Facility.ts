type FacilityType =
  | "DieselGenerators"
  | "NationalGrid"
  | "RenewableEnergy"
  | "HybridMix"
  | "NotPowered";

export interface Facility {
  name: string;
  facilityType: FacilityType;
  gridPower: number;
  dieselLiters: number;
  renewablePower: number;
  totalCO2Emission: number;
}
