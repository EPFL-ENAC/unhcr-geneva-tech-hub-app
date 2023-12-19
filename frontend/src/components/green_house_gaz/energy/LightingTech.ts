import {
  AllFuel,
  biomassFuels,
  biomassFuelsForGasifier,
  electricFuelsWithoutNone,
  gasFuels,
  liquidFuels,
  noAccessFuels,
  thermalFuels,
} from "@/components/green_house_gaz/fuelTypes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export interface LightingTech {
  readonly _id: string;
  readonly fuelTypes: readonly AllFuel[];
  readonly text: string;
  readonly image: string | undefined;
  readonly defaults?: PartialRecord<AllFuel, number>;
}

export const lightingTECHs: LightingTech[] = [
  {
    _id: "1",
    fuelTypes: noAccessFuels,
    text: "Without any access",
    image: undefined,
  
];

export const lightingTECHsWithAccess = lightingTECHs.slice(1);
export const lightingIdsTECHsWithAccess = lightingTECHsWithAccess.map(
  (lighting) => lighting._id
);
export const lightingIdsTECHsWithBioMass = lightingTECHsWithAccess
  .filter(
    (lighting) =>
      JSON.stringify(lighting.fuelTypes) === JSON.stringify(biomassFuels)
  )
  .map((lighting) => lighting._id);
export const lightingIdWithoutAccess = "1";
