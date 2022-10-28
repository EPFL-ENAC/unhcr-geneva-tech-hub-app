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
  disableDieselLiters: boolean;
  generatorSize: number; // replace the diesel liter
  operatingHours: number; // replace the diesel liter
  renewablePower: number;
  totalCO2Emission: number;
}

export const facilityTypes = [
  { name: "Diesel generators", componentName: "DieselGenerators" },
  { name: "National Grid", componentName: "NationalGrid" },
  { name: "Solar Energy", componentName: "RenewableEnergy" },
  { name: "Hybrid Mix", componentName: "HybridMix" },
  { name: "Not powered", componentName: notPoweredName },
];

export interface FacilityTypeItem {
  name: string;
  componentName: FacilityType;
}
