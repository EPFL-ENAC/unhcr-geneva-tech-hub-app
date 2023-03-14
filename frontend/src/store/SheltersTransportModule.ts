import axios, { AxiosPromise } from "axios";
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
  paginate: Paginate;
  itemsLength: number;
}

export interface Paginate {
  limit: number;
  skip?: number;
  startkey?: string;
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
    itemsLoading: false,
    items: [],
    paginate: {
      limit: 10,
      skip: 0,
    },
    itemsLength: 0,
  };
}

/** Getters */
const getters: GetterTree<SheltersTransportState, RootState> = {
  item: (s): ShelterTransport => s.item,
  items: (s): ShelterTransport[] => s.items,
  itemsLoading: (s): boolean => s.itemsLoading,
  paginate: (s): Paginate => s.paginate,
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
  SET_PAGINATE(state, value) {
    state.paginate = value;
  },
  SET_ITEMS_LENGTH(state, value) {
    state.itemsLength = value;
  },
  SET_LOADING(state, value) {
    state.itemsLoading = value;
  },
};

/** Action */
const actions: ActionTree<SheltersTransportState, RootState> = {
  getDoc: (
    context: ActionContext<SheltersTransportState, RootState>,
    id: string
  ): ShelterTransport | undefined => {
    const foundItem = context.state.items.find((item) => item._id === id);
    if (foundItem) {
      context.commit("SET_ITEM", foundItem);
    } else {
      console.log(MSG_COULD_NOT_FIND_ITEM);
    }
    return foundItem;
  },
  getAllDocs: (
    context: ActionContext<SheltersTransportState, RootState>
  ): AxiosPromise<(ShelterTransport | void)[]> => {
    context.commit("SET_LOADING", true);
    return axios({
      method: "get",
      url: `${process.env.BASE_URL}shelter/transports.json`,
      transformResponse: (data) => JSON.parse(data),
    })
      .then((response) => {
        context.commit("SET_ITEMS", response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        context.commit("SET_LOADING", false);
      });
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
