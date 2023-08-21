import regionList from "@/assets/references/ghg_country_region_list.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export interface GHGRegion {
  _id: string; // 'iso two letters'
  Region: string; // Region
  Country: string; // Country
}
/** Getters */
const getters: GetterTree<Record<string, never>, RootState> = {
  items: (): GHGRegion[] | null => regionList,
  itemsMap: (): Record<string, GHGRegion> | null =>
    regionList.reduce((acc, el) => {
      acc[el._id] = el;
      return acc;
    }, {} as Record<string, GHGRegion>),
};

/** VuexStore */
const GhgReferenceRegionModule: Module<Record<string, never>, RootState> = {
  namespaced: true,
  getters,
};

export default GhgReferenceRegionModule;
