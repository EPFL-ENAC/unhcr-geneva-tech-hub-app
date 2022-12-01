import { alpha } from "@/views/shelter_sustainability/shelterTypeColors";
export default [
  {
    id: "affordability",
    title: "Affordability",
    min: 0,
    // max: 100,
    unit: "$/year/m²",
    description:
      "Affordability score describes shelter cost (USD) per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
    colors: {
      primary: `rgba(248, 228, 210, 1)`, // seconday colour 5
      secondary: `rgba(248, 228, 210, ${alpha})`,
    },
  },
];