import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface GHGfNRBState {
  item: GHGfNRB;
  items: GHGfNRB[];
  paginate: Paginate;
  itemsLength: number;
  localCouch: SyncDatabase<GHGfNRBState> | null;
}

export interface Paginate {
  limit: number;
  skip?: number;
  startkey?: string;
}

export interface GHGfNRB {
  _id: string; // 'iso two letters'
  country: string; // full name
  value: number;
  index: number;
}

const MSG_COULD_NOT_FIND_ITEM = "Could not find item with this id";
const DB_NAME = "ghg_fnrb";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): GHGfNRBState {
  return {
    item: {} as GHGfNRB,
    items: [],
    paginate: {
      limit: 10,
      skip: 0,
    },
    itemsLength: 0,
    localCouch: null,
  };
}

/** Getters */
const getters: GetterTree<GHGfNRBState, RootState> = {
  item: (s): GHGfNRB => s.item,
  items: (s): GHGfNRB[] => s.items,
  paginate: (s): Paginate => s.paginate,
  itemsLength: (s): number => s.itemsLength,
};

/** Mutations */
const mutations: MutationTree<GHGfNRBState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
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
const actions: ActionTree<GHGfNRBState, RootState> = {
  syncDB: (context: ActionContext<GHGfNRBState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      // todo: we should throttle this to avoid 10000 calls
      context.dispatch("getAllDocs");
    });
  },
  closeDB: (context: ActionContext<GHGfNRBState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getAllDocs: async (context: ActionContext<GHGfNRBState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      try {
        const result = await db.allDocs({
          include_docs: true,
          limit: 250,
          skip: 0,
        });

        context.commit("SET_ITEMS_LENGTH", result.total_rows);
        context.commit(
          "SET_ITEMS",
          result.rows.map((x) => x.doc)
        );
      } catch (err) {
        throw new Error(MSG_COULD_NOT_FIND_ITEM);
      }
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
};

/** VuexStore */
const GHGReferencefNRB: Module<GHGfNRBState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GHGReferencefNRB;
