import {
  AllFuel,
  biomassFuels,
  biomassFuelsForGasifier,
  electricFuelsForCooking,
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
    text: "Without any access (no possibility to cook)",
    image: undefined,
  },
  {
    _id: "2",
    fuelTypes: biomassFuels,
    text: "Traditional three stone fire",
    image: "/images/energy/lightings/traditional-wood.png",
    defaults: {
      FWD: 1.7,
      CHC: 0.898983050847458,
      PLTS: 2.28620689655172,
      BRQ: 2.28620689655172,
    },
  },
  {
    _id: "3",
    fuelTypes: biomassFuels,
    text: "Traditional lighting with solid biomass fuel",
    image: "/images/energy/lightings/traditional-bricket.jpg",
    defaults: {
      FWD: 1.578571429,
      CHC: 0.834769976,
      BRQ: 2.122906404,
      PLTS: 2.122906404,
    },
  },
  {
    _id: "4",
    fuelTypes: biomassFuels,
    text: "Improved lighting with solid biomass fuel",
    image: "/images/energy/lightings/improved-bricket.jpg",
    defaults: {
      FWD: 1.163157895,
      CHC: 0.615093666,
      BRQ: 1.564246824,
      PLTS: 1.564246824,
    },
  },
  {
    _id: "5",
    fuelTypes: biomassFuelsForGasifier,
    text: "Gasifier stove",
    image: "/images/energy/lightings/gasifier.png",
    defaults: {
      FWD: 0.631428571,
      BRQ: 0.849162562,
      PLTS: 0.849162562,
    },
  },
  {
    _id: "6",
    fuelTypes: liquidFuels,
    text: "Liquid fuel lighting",
    image: "/images/energy/lightings/kerosene.png",
    defaults: {
      ETH: 0.354443685,
      PET: 0.226270184,
      DIES: 0.205055612,
      KRS: 0.211251553,
    },
  },
  {
    _id: "7",
    fuelTypes: gasFuels,
    text: "Gas powered lighting",
    image: "/images/energy/lightings/lpg.webp",
    defaults: {
      LPG: 0.086,
      BGS: 0.155112839,
      PNG: 0.18554637,
    },
  },
  {
    _id: "8",
    fuelTypes: electricFuelsForCooking,
    text: "Electric lighting",
    image: "/images/energy/lightings/induction.png",
    defaults: {
      ELE_DIES: 0.2,
      ELE_GRID: 0.6,
      ELE_HYB: 0.6,
      ELE_NONE: 0,
      ELE_SOLAR: 0.6,
    },
  },
  {
    _id: "9",
    fuelTypes: thermalFuels,
    text: "Solar cooker",
    image: "/images/energy/lightings/solar-parabolic.png",
    defaults: {
      THE: 0,
    },
  },
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
