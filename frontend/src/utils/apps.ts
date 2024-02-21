import { env } from "@/config";

export const scope1 = `'Scope 1' indicates direct greenhouse gas (GHG) emissions that are from sources owned or controlled by the reporting entity.`;
export const scope2 = `'Scope 2' indicates indirect GHG emissions associated with the production of electricity, heat, or steam purchased by the reporting entity.`;
export const scope3 = `'Scope 3' indicates all other indirect emissions, i.e., emissions associated with the extraction and production of purchased materials, fuels, and services, including transport in vehicles not owned or controlled by the reporting entity, outsourced activities, waste disposal, etc`;

export const scope3Exception = `Emissions associated with feedstock production and/or processing
of some fuels are considered due to their high impact relative to the total emissions`;
export const scope1and2Exception = `For solar in particular, it is assumed that the addition of solar panels will add zero emissions.`;
export const ghg = {
  title: "GHG Emission Calculator",
  to: "GreenHouseGaz",
  link: `${env.VUE_APP_BLOB}${env.VUE_APP_BLOB_PREFIX}2023-11-23/GHG tool User's Manual v6.pdf`,
  linkName: "Guidance Manual",
  logoIcon: "$vuetify.icon.ghg",
  descriptionComponent: "ghgDescription",
};

export const shelter = {
  title: "Shelter and Sustainability",
  to: "ShelterSustainability",
  logoIcon: "$vuetify.icon.shelter",
  link: `${env.VUE_APP_BLOB}${env.VUE_APP_BLOB_PREFIX}2023-03-15/Shelter & Sustainability Manual_230312.pdf`,
  linkName:
    "A technical and environmental comparative overview of common shelter typologies found in settlements across UNHCR operations",
  description:
    "A tool supporting comparative assessments of environmental \
      impacts, technical performance, habitability and affordability of \
      shelter designs used in humanitarian relief operations.",
};
export default [shelter, ghg] as {
  title: string;
  link: string;
  linkName: string;
  to: string;
  logoIcon: string;
  description?: string;
  descriptionComponent?: string; // component Name
}[];
