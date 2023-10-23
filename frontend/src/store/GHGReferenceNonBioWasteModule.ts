import mixedNonBioWaste from "@/assets/references/ghg_ef_mixed_non_biowaste_list.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export interface GHGReferenceNonBioWaste {
  region: string; // Region
  PIT: number;
  MAN: number;
  BUR: number;
}
/** Getters */
const getters: GetterTree<Record<string, never>, RootState> = {
  items: (): GHGReferenceNonBioWaste[] | null => mixedNonBioWaste,
  itemsMap: (): Record<string, GHGReferenceNonBioWaste> | null =>
    mixedNonBioWaste.reduce((acc, el) => {
      acc[el.region] = el;
      return acc;
    }, {} as Record<string, GHGReferenceNonBioWaste>),
};

/** VuexStore */
const GHGReferenceNonBioWasteModule: Module<
  Record<string, never>,
  RootState
> = {
  namespaced: true,
  getters,
};

export default GHGReferenceNonBioWasteModule;
