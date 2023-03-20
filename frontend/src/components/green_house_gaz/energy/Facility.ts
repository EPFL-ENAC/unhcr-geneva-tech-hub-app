export const notPoweredName = "NotPowered";
export type notPowered = "NotPowered";
export type FacilityTypeOld =
  | "DieselGenerators"
  | "NationalGrid"
  | "RenewableEnergy"
  | "HybridMix"
  | notPowered;

// duplicate of export interface EnergyItem {
// TODO: decomission this interface.
export interface Facility {
  name: string;
  facilityType: FacilityTypeOld;
  // diesel configuration
  dieselLiters: number;
  disableDieselLiters: boolean;
  generatorSize: number; // replace the diesel liter
  operatingHours: number; // replace the diesel liter
  generatorLoad?: number; // replace the diesel factor
  // end of diesela
  gridPower?: number;
  dieselPower?: number; // computed based on litres and REF_DIES_EFF
  renewablePower?: number;
  renewableKiloWattInstalled: number;
  // computed
  totalCO2Emission: number;
}

export const facilityTypesOld = [
  { name: "Diesel generators", componentName: "DieselGenerators" },
  { name: "National Grid", componentName: "NationalGrid" },
  { name: "Solar Energy", componentName: "RenewableEnergy" },
  { name: "Hybrid Mix", componentName: "HybridMix" },
  { name: "Not powered", componentName: notPoweredName },
];

export interface FacilityTypeItemOld {
  name: string;
  componentName: FacilityTypeOld;
}
