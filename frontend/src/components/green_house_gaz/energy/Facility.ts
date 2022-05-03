export const notPoweredName = "NotPowered";
type notPowered = "NotPowered";
type FacilityType =
  | "DieselGenerators"
  | "NationalGrid"
  | "RenewableEnergy"
  | "HybridMix"
  | notPowered;

export interface Facility {
  name: string;
  facilityType: FacilityType;
  gridPower: number;
  dieselLiters: number;
  renewablePower: number;
  totalCO2Emission: number;
}

export const facilityTypes = [
  { name: "Diesel generators", componentName: "DieselGenerators" },
  { name: "National Grid", componentName: "NationalGrid" },
  { name: "Renewable Energy", componentName: "RenewableEnergy" },
  { name: "Hybrid Mix", componentName: "HybridMix" },
  { name: "Not powered", componentName: notPoweredName },
];

export interface FacilityTypeItem {
  name: string;
  componentName: FacilityType;
}
