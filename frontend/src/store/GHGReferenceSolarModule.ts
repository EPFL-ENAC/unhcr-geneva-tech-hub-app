import axios, { AxiosPromise } from "axios";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface GHGSolarState {
  item: GHGSolar;
  items: GHGSolar[];
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
export interface GHGSolar {
  iso: string; // 'iso two letters'
  s: number; // number of hours
}

const MSG_COULD_NOT_FIND_ITEM = "Could not find item with this id";

/** Default Configure state value */
function generateState(): GHGSolarState {
  return {
    item: {} as GHGSolar,
    items: [],
    paginate: {
      limit: 10,
      skip: 0,
    },
    itemsLength: 0,
  };
}

/** Getters */
const getters: GetterTree<GHGSolarState, RootState> = {
  item: (s): GHGSolar => s.item,
  items: (s): GHGSolar[] => s.items,
  paginate: (s): Paginate => s.paginate,
  itemsLength: (s): number => s.itemsLength,
};

/** Mutations */
const mutations: MutationTree<GHGSolarState> = {
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
};

/** Action */
const actions: ActionTree<GHGSolarState, RootState> = {
  getDoc: (
    context: ActionContext<GHGSolarState, RootState>,
    id: string
  ): GHGSolar | undefined => {
    const foundItem = context.state.items.find((item) => item.iso === id);
    if (foundItem) {
      context.commit("SET_ITEM", foundItem);
    } else {
      console.log(MSG_COULD_NOT_FIND_ITEM);
    }
    return foundItem;
  },
  getAllDocs: (
    context: ActionContext<GHGSolarState, RootState>
  ): AxiosPromise<(GHGSolar | void)[]> => {
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
      });
  },
};

/** VuexStore */
const ShelterMaterialsModule: Module<GHGSolarState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterMaterialsModule;
