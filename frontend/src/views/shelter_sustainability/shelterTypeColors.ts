export const alphaSecondary = 0.6;
export const alpha = 0.2;
import { cccmColors } from "@/plugins/vuetify";
import { ShelterType } from "@/store/ShelterInterface";

export const shelterColors: Record<ShelterType, ShelterColor> = {
  Emergency: {
    name: "blue",
    primary: cccmColors.primary(),
    secondary: cccmColors.primary(alphaSecondary.toString()),
  },
  Transitional: {
    name: "brown",
    primary: cccmColors.secondary2(),
    secondary: cccmColors.secondary2(alphaSecondary.toString()),
  },
  Durable: {
    name: "grey",
    primary: cccmColors.secondary1(),
    secondary: cccmColors.secondary1(alphaSecondary.toString()),
  },
  "": {
    // default
    name: "default",
    primary: cccmColors.secondary5(),
    secondary: cccmColors.secondary5(alphaSecondary.toString()),
  },
};

export type ShelterColors = Record<ShelterType, ShelterColor>;
export interface ShelterColor {
  name: string;
  primary: string;
  secondary: string;
}

export const shelterIcons = {
  Emergency: "$mdiHomeVariantOutline",
  Transitional: "$mdiHomeOutline",
  Durable: "$mdiHome",
};
