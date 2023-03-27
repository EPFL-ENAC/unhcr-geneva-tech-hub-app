import {
  AllFuel,
  biomassFuels,
  biomassFuelsWithoutCHC,
  electricFuels,
  gasFuels,
  liquidFuels,
  noAccessFuels,
  thermalFuels,
} from "@/components/green_house_gaz/fuelTypes";

export interface CookstoveTech {
  readonly _id: string;
  readonly fuelTypes: readonly AllFuel[];
  readonly text: string;
  readonly image: string | undefined;
}

export const cookstoveTECHs: CookstoveTech[] = [
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
    image: "/images/energy/cookstoves/traditional-wood.png",
  },
  {
    _id: "3",
    fuelTypes: biomassFuels,
    text: "Traditional cookstove with solid biomass fuel",
    image: "/images/energy/cookstoves/traditional-bricket.jpg",
  },
  {
    _id: "4",
    fuelTypes: biomassFuels,
    text: "Improved cookstove with solid biomass fuel",
    image: "/images/energy/cookstoves/improved-bricket.jpg",
  },
  {
    _id: "5",
    fuelTypes: biomassFuelsWithoutCHC,
    text: "Gasifier stove",
    image: "/images/energy/cookstoves/gasifier.png",
  },
  {
    _id: "6",
    fuelTypes: liquidFuels,
    text: "Liquid fuel cookstove",
    image: "/images/energy/cookstoves/kerosene.png",
  },
  {
    _id: "7",
    fuelTypes: gasFuels,
    text: "Gas powered cookstove",
    image: "/images/energy/cookstoves/lpg.png",
  },
  {
    _id: "8",
    fuelTypes: electricFuels,
    text: "Electric cookstove",
    image: "/images/energy/cookstoves/induction.png",
  },
  {
    _id: "9",
    fuelTypes: thermalFuels,
    text: "Solar cooker",
    image: "/images/energy/cookstoves/solar-parabolic.png",
  },
];

export const cookstoveTECHsWithAccess = cookstoveTECHs.slice(1);
export const cookstoveIdsTECHsWithAccess = cookstoveTECHsWithAccess.map(
  (cookstove) => cookstove._id
);
export const cookstoveIdWithoutAccess = "1";
