import { env } from "@/config";

export const unhcr_logo = {
  imgPath: `${env.BASE_URL}app_logo_new/Logo_UNHCR.png`,
  label: "Logo_UNHCR",
  urlDescription:
    "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
};

export const logos = [
  {
    imgPath: `${env.BASE_URL}app_logo_new/sdc_2.png`,
    label: "geneva technical hub brochure",
    urlDescription:
      "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
  },

  {
    imgPath: `${env.BASE_URL}app_logo_new/geneva_tech_hub.png`,
    label: "geneva_tech_hub",
    urlDescription:
      "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
  },
  unhcr_logo,

  {
    imgPath: `${env.BASE_URL}app_logo_new/EPFL.png`,
    label: "EPFL",
    urlDescription: "https://epfl.ch",
    height: "30px",
  },
];

export const labLogos = [
  {
    imgPath: `${env.BASE_URL}app_logo_new/EssentialTech_Logo_5.png`,
    label: "essential tech",
    urlDescription: "https://essentialtech.center/hth/",
  },
  {
    imgPath: `${env.BASE_URL}app_logo_new/enac-it4r.png`,
    label: "enac-it4r",
    urlDescription: "https://enac-it4r.epfl.ch/",
  },
];
