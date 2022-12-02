import { ShelterDimensions } from "@/store/ShelterInterface";
export const geometryOtherName = "other";
export const geometriesUrl = {
  gableHW: "/houses_new/SSC_P1_Shelter-GableHW_220201.png",
  flatRoof: "/houses_new/SSC_P3_Shelter-FlatRoof_220201.png",
  dome: "/houses_new/SSC_P4_Shelter-Dome_220201.png",
  tukul: "/houses_new/SSC_P5_Shelter-Tukul_220201.png",
  [geometryOtherName]: "/houses_new/SSC_P6_Shelter-Other_220201.png",
};

export const geometries: Geometry[] = [
  {
    _id: "gableHW", // High wall
    name: "Double-pitch roof (hip or gable) - Regular plan",
    image_url: geometriesUrl.gableHW,
    image_clean_url: geometriesUrl.gableHW.replace("_new", "_clean"),
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
    image_clean_url: geometriesUrl.flatRoof.replace("_new", "_clean"),
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
    image_clean_url: geometriesUrl.tukul.replace("_new", "_clean"),
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
    image_clean_url: geometriesUrl.dome.replace("_new", "_clean"),
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
    image_clean_url: geometriesUrl[geometryOtherName].replace("_new", "_clean"),
  },
];

export const geometriesName = geometries.reduce(
  (acc: Record<string, string>, geometry: Geometry) => {
    acc[geometry._id] = geometry.name;
    return acc;
  },
  {} as Record<string, string>
);

interface Geometry {
  _id: string;
  name: string;
  image_url: string;
  image_clean_url: string;
  shelter_dimensions?: string[];
  door_dimensions?: string[];
  window_dimensions?: string[];
  areaFunction?: (shelterDimension: ShelterDimensions) => number;
  volumeFunction?: (shelterDimension: ShelterDimensions) => number;
  hiddenInputs?: undefined | boolean;
}
