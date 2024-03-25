import grid from "@/assets/references/ghg_grid_emission_factors.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export interface GridItem {
  name: string;
  value: number;
  _id: string;
}

/** Getters */
const getters: GetterTree<Record<string, never>, RootState> = {
  items: (): GridItem[] | null => grid,
};

/** VuexStore */
const GridModule: Module<Record<string, never>, RootState> = {
  namespaced: true,
  getters,
};

export default GridModule;
