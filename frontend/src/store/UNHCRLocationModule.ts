import unhcr_location from "@/assets/references/unhcr_location.json";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface UNHCRLocationState {
  item: UNHCRLocation;
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
  "GHI/Daily_solar_peak_hours": number; // 5.607999802,
}

const MSG_COULD_NOT_FIND_ITEM = "Could not find item with this id";

/** Default Configure state value */
function generateState(): UNHCRLocationState {
  return {
    item: {} as UNHCRLocation,
    items: [],
    itemsLength: 0,
  };
}

/** Getters */
const getters: GetterTree<UNHCRLocationState, RootState> = {
  item: (s): UNHCRLocation => s.item,
  items: (): UNHCRLocation[] => unhcr_location,
  itemsLength: (s): number => s.itemsLength,
};

/** Mutations */
const mutations: MutationTree<UNHCRLocationState> = {
  SET_ITEM(state, value) {
    state.item = value;
  },
  SET_ITEMS(state, value) {
    state.items = value;
  },
  SET_ITEMS_LENGTH(state, value) {
    state.itemsLength = value;
  },
};

/** Action */
const actions: ActionTree<UNHCRLocationState, RootState> = {
  getDoc: (
    context: ActionContext<UNHCRLocationState, RootState>,
    id: string
  ): UNHCRLocation | undefined => {
    const foundItem = context.state.items.find((item) => item._id === id);
    if (foundItem) {
      context.commit("SET_ITEM", foundItem);
    } else {
      console.log(MSG_COULD_NOT_FIND_ITEM);
    }
    return foundItem;
  },
};

/** VuexStore */
const UNHCRLocationModule: Module<UNHCRLocationState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default UNHCRLocationModule;
