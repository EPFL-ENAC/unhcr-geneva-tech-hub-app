import mixedBioWaste from "@/assets/references/ghg_ef_mixed_biowaste_list.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export interface GHGReferenceBioWaste {
  region: string; // Region
  PIT: number;
  MAN: number;
  BUR: number;
}
/** Getters */
const getters: GetterTree<Record<string, never>, RootState> = {
  items: (): GHGReferenceBioWaste[] | null => mixedBioWaste,
  itemsMap: (): Record<string, GHGReferenceBioWaste> | null =>
    mixedBioWaste.reduce((acc, el) => {
      acc[el.region] = el;
      return acc;
    }, {} as Record<string, GHGReferenceBioWaste>),
};

/** VuexStore */
const GHGReferenceBioWasteModule: Module<Record<string, never>, RootState> = {
  namespaced: true,
  getters,
};

export default GHGReferenceBioWasteModule;
