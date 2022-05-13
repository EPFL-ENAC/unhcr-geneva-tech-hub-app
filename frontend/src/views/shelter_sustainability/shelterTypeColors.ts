export const alphaSecondary = 0.6;
export const alpha = 0.2;
export const shelterColors = {
  Emergency: {
    name: "blue",
    primary: `rgba(32,135,200,1)`, // blue unhcr cccm
    secondary: `rgba(32,135,200,${alphaSecondary})`,
  },
  Transitional: {
    name: "brown",
    primary: `rgba(157,72,56,1)`, // brown unhcr cccm
    secondary: `rgba(157,72,56,${alphaSecondary})`,
  },
  Durable: {
    name: "grey",
    primary: `rgba(84,84,86,1)`, // grey unhcr
    secondary: `rgba(84,84,86,${alphaSecondary})`,
  },
  "": {
    // default
    name: "default",
    primary: `rgba(248, 228, 210,1)`, // secondary colour 1
    secondary: `rgba(248, 228, 210,${alphaSecondary})`,
  },
};
