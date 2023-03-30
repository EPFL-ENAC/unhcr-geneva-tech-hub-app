import ghg_fnrb from "@/assets/references/ghg_fnrb.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export interface GHGfNRB {
  _id: string; // 'iso two letters'
  country: string; // full name
  value: number;
  index: number;
}
/** Getters */
const getters: GetterTree<Record<string, never>, RootState> = {
  items: (): GHGfNRB[] | null => ghg_fnrb,
};

/** VuexStore */
const GHGReferencefNRB: Module<Record<string, never>, RootState> = {
  namespaced: true,
  getters,
};

export default GHGReferencefNRB;
