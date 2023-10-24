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

export interface CookstoveTech {
  readonly _id: string;
  readonly fuelTypes: readonly AllFuel[];
  readonly text: string;
  readonly image: string | undefined;
  readonly defaults?: PartialRecord<AllFuel, number>;
}

export const cookstoveIdWithoutAccess = "1";
export const cookstoveIdSolarCooker = "9";

export const cookstoveTECHs: CookstoveTech[] = [
  {
    _id: cookstoveIdWithoutAccess,
    fuelTypes: noAccessFuels,
    text: "Without any access (no possibility to cook)",
    image: undefined,
  },
  {
    _id: "2",
    fuelTypes: biomassFuels,
    text: "Traditional three stone fire",
    image: "/images/energy/cookstoves/traditional-wood.png",
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
    text: "Traditional cookstove with solid biomass fuel",
    image: "/images/energy/cookstoves/traditional-bricket.jpg",
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
    text: "Improved cookstove with solid biomass fuel",
    image: "/images/energy/cookstoves/improved-bricket.jpg",
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
    image: "/images/energy/cookstoves/gasifier.png",
    defaults: {
      FWD: 0.631428571,
      BRQ: 0.849162562,
      PLTS: 0.849162562,
    },
  },
  {
    _id: "6",
    fuelTypes: liquidFuels,
    text: "Liquid fuel cookstove",
    image: "/images/energy/cookstoves/kerosene.png",
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
    text: "Gas powered cookstove",
    image: "/images/energy/cookstoves/lpg.webp",
    defaults: {
      LPG: 0.086,
      BGS: 0.155112839,
      PNG: 0.18554637,
    },
  },
  {
    _id: "8",
    fuelTypes: electricFuelsWithoutNone,
    text: "Electric cookstove",
    image: "/images/energy/cookstoves/induction.png",
    defaults: {
      ELE_DIES: 0.2,
      ELE_GRID: 0.6,
      ELE_HYB: 0.6,
      ELE_NONE: 0,
      ELE_SOLAR: 0.6,
    },
  },
  {
    _id: cookstoveIdSolarCooker,
    fuelTypes: thermalFuels,
    text: "Solar cooker",
    image: "/images/energy/cookstoves/solar-parabolic.png",
    defaults: {
      THE: 0.02, // of: ~0.02 kWh/d/person.
    },
  },
];

export const cookstoveTECHsWithAccess = cookstoveTECHs.slice(1);
export const cookstoveIdsTECHsWithAccess = cookstoveTECHsWithAccess.map(
  (cookstove) => cookstove._id
);
export const cookstoveIdsTECHsWithBioMass = cookstoveTECHsWithAccess
  .filter(
    (cookstove) =>
      JSON.stringify(cookstove.fuelTypes) === JSON.stringify(biomassFuels)
  )
  .map((cookstove) => cookstove._id);
