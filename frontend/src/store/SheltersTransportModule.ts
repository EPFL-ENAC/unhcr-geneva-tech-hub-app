import transports from "@/assets/references/transports.json";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface SheltersTransportState {
  item: ShelterTransport;
  items: ShelterTransport[];
  itemsLoading: boolean;
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
export interface ShelterTransport {
  _id: string; // 'AAA_BBB' source country (AAA) / destination country (BBB) in iso3166 3 letters
  t: number; // Transport   embodied carbon  kgCO2/kg (i.e. local materials)
  o: number; // Transport   embodied carbon  kgCO2/kg (all others materials)
}

const MSG_COULD_NOT_FIND_ITEM = "Could not find item with this id";

/** Default Configure state value */
function generateState(): SheltersTransportState {
  return {
    item: {} as ShelterTransport,
    items: transports,
    itemsLoading: false,
    itemsLength: transports.length,
  };
}

/** Getters */
const getters: GetterTree<SheltersTransportState, RootState> = {
  item: (s): ShelterTransport => s.item,
  items: (s): ShelterTransport[] => s.items,
  itemsLoading: (s): boolean => s.itemsLoading,
  itemsLength: (s): number => s.itemsLength,
};

/** Mutations */
const mutations: MutationTree<SheltersTransportState> = {
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
const actions: ActionTree<SheltersTransportState, RootState> = {
  getDoc: (
    context: ActionContext<SheltersTransportState, RootState>,
    id: string
  ): ShelterTransport | undefined => {
    const foundItem = context.getters.items.find(
      (item: ShelterTransport) => item._id === id
    );
    if (!foundItem) {
      throw new Error(MSG_COULD_NOT_FIND_ITEM);
    }
    context.commit("SET_ITEM", foundItem);
    return foundItem;
  },
};

/** VuexStore */
const ShelterMaterialsModule: Module<SheltersTransportState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterMaterialsModule;
