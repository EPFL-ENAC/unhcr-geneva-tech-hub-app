import { ShelterDimensions } from "@/store/ShelterInterface";
export const geometryOtherName = "other";
export const geometriesUrl = {
  gableHW: "/houses_new/SSC_P1_Shelter-GableHW_220201.png",
  flatRoof: "/houses_new/SSC_P3_Shelter-FlatRoof_220201.png",
  tukul: "/houses_new/177516466-55a94506-26b4-442e-a80e-0946c1b8835d.png",
  dome: "/houses_new/SSC_P4_Shelter-Dome_220201.png",
  [geometryOtherName]: "/houses_new/GTH-SSC_Graphics_Typology_Other_5.png",
};

export const geometries = [
  {
    _id: "gableHW", // High wall
    name: "Double-pitch roof (hip or gable) - Regular plan",
    image_url: geometriesUrl.gableHW,
    shelter_dimensions: ["L", "W", "H1", "H2"],
    door_dimensions: ["Wd", "Hd"],
    window_dimensions: ["Ww", "Hw", "Hs"],
    volumeFunction(shelterDimension: ShelterDimensions): number {
      const { L, W, H1, H2 } = shelterDimension || {};
      if (!L || !W || !H1 || !H2) {
        return 0; // one dimension undefined volume is 0 by default
      }
      return L * W * H1 + 0.5 * L * W * (H2 - H1);
    },
  },
  {
    _id: "flatRoof",
    name: "Single-pitch roof (inc. flat roof) - Regular plan",
    image_url: geometriesUrl.flatRoof,
    shelter_dimensions: ["L", "W", "H"],
    door_dimensions: ["Wd", "Hd"],
    window_dimensions: ["Ww", "Hw", "Hs"],
    volumeFunction(shelterDimension: ShelterDimensions): number {
      const { L, W, H } = shelterDimension || {};
      if (!L || !W || !H) {
        return 0; // one dimension undefined volume is 0 by default
      }
      return L * W * H;
    },
  },
  {
    _id: "tukul",
    name: "Conical roof - circular plan",
    image_url: geometriesUrl.tukul,
    shelter_dimensions: ["W", "H1", "H2"],
    door_dimensions: ["Wd", "Hd"],
    window_dimensions: ["Ww", "Hw", "Hs"],
    areaFunction(shelterDimension: ShelterDimensions): number {
      const { W } = shelterDimension || {};
      if (!W) {
        return 0;
      }
      const radius = W / 2;
      return Math.PI * Math.pow(radius, 2);
    },
    volumeFunction(shelterDimension: ShelterDimensions): number {
      const { W, H1, H2 } = shelterDimension || {};
      if (!W || !H1 || !H2) {
        return 0; // one dimension undefined volume is 0 by default
      }
      const radius = W / 2;
      const surfaceArea = Math.PI * Math.pow(radius, 2);
      const cylindricalVolume = surfaceArea * H1;
      const coneVolume = surfaceArea * ((H2 - H1) / 3);
      return cylindricalVolume + coneVolume;
    },
  },
  {
    _id: "dome",
    name: "Dome - Circle or ellipse plan",
    image_url: geometriesUrl.dome,
    shelter_dimensions: ["L", "W", "H"],
    door_dimensions: ["Wd", "Hd"],
    window_dimensions: ["Ww", "Hw", "Hs"],
    volumeFunction(shelterDimension: ShelterDimensions): number {
      const { L, W, H } = shelterDimension || {};
      if (!L || !W || !H) {
        return 0; // one dimension undefined volume is 0 by default
      }
      return 0.1666667 * Math.PI * L * W * H;
    },
  },
  {
    _id: geometryOtherName,
    name: "Irregular roof or plan",
    hiddenInputs: true,
    image_url: geometriesUrl[geometryOtherName],
  },
];
