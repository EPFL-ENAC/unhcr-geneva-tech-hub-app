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
  location_pcode: string; // "20IDN023", unique id per unhcr standard
  population: number; // key was Population
  location_id: number; // was siteId // we should rename everywhere siteId to location_id ?
  latitude: number; //: 28.978026
  longitude: number; // : 50.8379918,
  solar_peak_hours: number; // 5.607999802,
  year: number; // 2022,
  country_code_2: string; // "IR", // key was named 'Country'
  country_name?: string; // "Iran (Islamic Republic of)", // key was named 'Country' not present in the json
  _id: string; // "Abazar : Point",
  index: number; // 0
}

// "_id": "Nusa Tenggara Timur : Provinsi - Province",
// "country_code_2": "ID",
// "population": 200,
// "location_id": 1411,
// "location_pcode": "20IDN023",
// "latitude": "-8,6573819",
// "longitude": "121,0793705",
// "solar_peak_hours": "5,508999825",
// "year": 2022,
// "index": 127

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
