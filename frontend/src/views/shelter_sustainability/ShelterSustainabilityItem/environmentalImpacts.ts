import { ScorecardConfig } from "@/views/shelter_sustainability/ShelterSustainabilityItem/generateScorecardOptions";
import { alpha } from "@/views/shelter_sustainability/shelterTypeColors";

export const environmentalImpacts: ScorecardConfig[] = [
  {
    id: "co2",
    min: 0,
    max: function (): undefined {
      return undefined; // don't know why but it truncates properly at . 2 decimals
    },
    title: "Embodied CO2",
    unit: "kg-CO2/year/m²",
    selectedField: "embodiedCarbonTotal",
    selectedFieldUnit: "kgCO2e",
    subpart: true,
    description:
      "Embodied CO2 score describes kg-CO2 per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
    colors: {
      primary: `rgba(84,84,86,1)`, // secondary colour 1
      secondary: `rgba(84,84,86,${alpha})`,
    },
  },
  {
    id: "h2o",
    min: 0,
    max: function (): undefined {
      return undefined; // don't know why but it truncates properly at . 2 decimals
    },
    title: "Embodied water",
    selectedField: "embodiedWater",
    selectedFieldUnit: "L",
    subpart: true,
    unit: "L/year/m²",
    description:
      "Embodied H2O score describes litres-H2O per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
    colors: {
      primary: `rgba(32,135,200,1)`, // primary colour
      secondary: `rgba(32,135,200,${alpha})`,
    },
  },

  {
    id: "weight",
    selectedField: "weight",
    seltectedFieldUnit: "Kg",
    title: "Material efficiency",
    subpart: true,
    min: 0,
    max: function (): undefined {
      return undefined; // don't know why but it truncates properly at . 2 decimals
    },
    unit: "kg/year/m²",
    description:
      "Material efficiency score describes total weight (kg) per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
    colors: {
      primary: `rgba(157,72,56,1)`, // secondary colour 2
      secondary: `rgba(157,72,56,${alpha})`,
    },
  },
];
