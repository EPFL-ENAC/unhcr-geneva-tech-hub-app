export const alphaSecondary = 0.6;
export const alpha = 0.2;
import { cccmColors } from "@/plugins/vuetify";
export const shelterColors = {
  Emergency: {
    name: "blue",
    primary: cccmColors.primary, // "#2A87C8" blue unhcr cccm
    secondary: `rgba(32,135,200,${alphaSecondary})`,
  },
  Transitional: {
    name: "brown",
    primary: cccmColors.secondary2, // #9d4838" brown unhcr cccm
    secondary: `rgba(157,72,56,${alphaSecondary})`,
  },
  Durable: {
    name: "grey",
    primary: cccmColors.secondary1, // `#545456`, // grey unhcr
    secondary: `rgba(84,84,86,${alphaSecondary})`,
  },
  "": {
    // default
    name: "default",
    primary: cccmColors.secondary5, // #f8e4d2 `rgba(248, 228, 210,1)`, // secondary colour 1
    secondary: `rgba(248, 228, 210,${alphaSecondary})`,
  },
};
