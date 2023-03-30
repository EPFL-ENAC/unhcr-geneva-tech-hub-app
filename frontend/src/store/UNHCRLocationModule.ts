import unhcr_location from "@/assets/references/unhcr_location.json";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { RootState } from ".";

interface UNHCRLocationState {
  items: UNHCRLocation[];
  itemsLength: number;
}

/*
** Local materials as defined by André Ullal @epfl.ch
  Clay
  Earth, soil, clay, mud
  Grass, straw
  Sand
  Stone
*/
export interface UNHCRLocation {
  _rev?: string;
  _id: string; // "Abazar : Point",
  Country: string; // "IR",
  Population: number;
  "Location id": number;
  latitude: number; //: 28.978026
  longitude: number; // : 50.8379918,
  solar_peak_hours: number; // 5.607999802,
}

/** Default Configure state value */
function generateState(): UNHCRLocationState {
  return {
    items: unhcr_location,
    itemsLength: unhcr_location.length,
  };
}

/** Getters */
const getters: GetterTree<UNHCRLocationState, RootState> = {
  items: (s): UNHCRLocation[] => s.items,
  itemsLength: (s): number => s.itemsLength,
};

/** Mutations */
const mutations: MutationTree<UNHCRLocationState> = {};

/** Action */
const actions: ActionTree<UNHCRLocationState, RootState> = {};

/** VuexStore */
const UNHCRLocationModule: Module<UNHCRLocationState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default UNHCRLocationModule;
