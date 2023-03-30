import iges_grid from "@/assets/references/iges_grid.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export interface IgesItem {
  name: string;
  value: number;
  _id: string;
}

/** Getters */
const getters: GetterTree<Record<string, never>, RootState> = {
  items: (): IgesItem[] | null => iges_grid,
};

/** VuexStore */
const IgesGridModule: Module<Record<string, never>, RootState> = {
  namespaced: true,
  getters,
};

export default IgesGridModule;
