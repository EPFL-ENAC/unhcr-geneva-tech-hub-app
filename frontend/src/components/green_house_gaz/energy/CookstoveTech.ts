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
import { env } from "@/config";

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
  readonly tooltipInfo?: string;
  readonly comment?: string;
}

export const cookstoveIdWithoutAccess = "1";
export const cookstoveIdSolarCooker = "9";

export const cookstoveTECHs: CookstoveTech[] = [
  {
    _id: cookstoveIdWithoutAccess,
    fuelTypes: noAccessFuels,
    text: "Without any access (no possibility to cook)",
    tooltipInfo: "No access to cooking",
    image: undefined,
  },
  {
    _id: "2",
    fuelTypes: biomassFuels,
    text: "Three stone fire",
    comment: "Photo: Manuel Krähenbühl",
    image: `${env.BASE_URL}images/energy/cookstoves/three-stone-fire.webp`,
  },
  {
    _id: "3",
    fuelTypes: biomassFuels,
    text: "Artisanal cookstove with solid biomass fuel",
    comment: "Photo: Manuel Krähenbühl",
    image: `${env.BASE_URL}images/energy/cookstoves/artisanal-cookstove.webp`,
  },
  {
    _id: "4",
    fuelTypes: biomassFuels,
    text: "Improved cookstove with solid biomass fuel",
    image: `${env.BASE_URL}images/energy/cookstoves/improved-bricket.jpg`,
  },
  {
    _id: "5",
    fuelTypes: biomassFuelsForGasifier,
    text: "Gasifier stove",
    image: `${env.BASE_URL}images/energy/cookstoves/gasifier.png`,
  },
  {
    _id: "6",
    fuelTypes: liquidFuels,
    text: "Liquid fuel cookstove",
    image: `${env.BASE_URL}images/energy/cookstoves/kerosene.png`,
  },
  {
    _id: "7",
    fuelTypes: gasFuels,
    text: "Gas powered cookstove",
    comment: "Photo: Manuel Krähenbühl",
    image: `${env.BASE_URL}images/energy/cookstoves/gas-powered-cookstove.webp`,
  },
  {
    _id: "8",
    fuelTypes: electricFuelsWithoutNone,
    text: "Electric cookstove",
    image: `${env.BASE_URL}images/energy/cookstoves/induction.png`,
  },
  {
    _id: cookstoveIdSolarCooker,
    fuelTypes: thermalFuels,
    text: "Solar thermal cooker",
    tooltipInfo:
      "A solar thermal cooker cannot be used as a primary cooking solution to prepare 3 meals per day due to limitations with solar hours.",
    image: `${env.BASE_URL}images/energy/cookstoves/solar-parabolic.png`,
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
