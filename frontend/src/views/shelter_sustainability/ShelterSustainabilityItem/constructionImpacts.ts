import { ScorecardConfig } from "@/views/shelter_sustainability/ShelterSustainabilityItem/generateScorecardOptions";
import { alpha } from "@/views/shelter_sustainability/shelterTypeColors";
export const constructionImpacts: ScorecardConfig[] = [
  {
    id: "techPerf",
    min: 0,
    max: 100,
    title: "Technical performance",
    unit: "%",
    description:
      "Technical performance score is calculated from shelter characteristics identified in relation to: hazard-related structural performance, internal comfort, safety and security, and construction techniques.",
    colors: {
      primary: `rgba(212,140,116)`, // secondary colour 3
      secondary: `rgba(212,140,116, ${alpha})`,
    },
  },
  {
    id: "habitability",
    min: 0,
    max: 100,
    unit: "%",
    title: "Habitability",
    description:
      "Habitability score is calculated from shelter characteristics identified in relation to: floor area, accessibility, privacy, artificial lighting, and complimentary facilities.",
    colors: {
      primary: `rgba(240,184,158,1)`, // secondary colour 4
      secondary: `rgba(240,184,158,${alpha})`,
    },
  },
];
