import solar_averaged from "@/assets/references/solar_averaged.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export type ItemReferencesMap = Record<string, GHGSolar>;
export type referenceType = "number" | "percentage";

export interface GHGSolar {
  _id: string; // 'iso two letters'
  c: number; // number of hours
}
/** Getters */
const getters: GetterTree<Record<string, never>, RootState> = {
  items: (): GHGSolar[] | null => solar_averaged,
  itemsMap: (): Record<string, GHGSolar> | null =>
    solar_averaged.reduce((acc, el) => {
      acc[el._id] = el;
      return acc;
    }, {} as Record<string, GHGSolar>),
};

/** VuexStore */
const GhgReferenceSolarModule: Module<Record<string, never>, RootState> = {
  namespaced: true,
  getters,
};

export default GhgReferenceSolarModule;
