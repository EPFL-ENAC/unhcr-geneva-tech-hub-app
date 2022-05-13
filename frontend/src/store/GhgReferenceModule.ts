import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

export type ItemReferencesMap = Record<string, ReferenceItemInterface>;
export type referenceType = "number" | "percentage";
export interface ReferenceItemInterface {
  description: string;
  value: number;
  type?: referenceType;
  source?: string;
  _id: string;
}

interface GhgReferenceState {
  items: ReferenceItemInterface[] | null;
  itemsLength: number;
  localCouch: SyncDatabase<ReferenceItemInterface> | null;
}

const DB_NAME = "ghg_reference";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): GhgReferenceState {
  return {
    items: null,
    itemsLength: 0,
    localCouch: null,
  };
}

/** Getters */
const getters: GetterTree<GhgReferenceState, RootState> = {
  items: (s): ReferenceItemInterface[] | null => s.items,
  ghgMapRef: (s): ItemReferencesMap | undefined => {
    if (!s.items) {
      return undefined;
    }
    return s.items.reduce(
      (acc: ItemReferencesMap, item: ReferenceItemInterface) => {
        acc[item._id] = item;
        return acc;
      },
      {} as ItemReferencesMap
    );
  },
};

/** Mutations */
const mutations: MutationTree<GhgReferenceState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_ITEMS(state, value) {
    state.items = value;
  },
  SET_ITEMS_LENGTH(state, value) {
    state.itemsLength = value;
  },
};

/** Action */
const actions: ActionTree<GhgReferenceState, RootState> = {
  syncDB: (context: ActionContext<GhgReferenceState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      context.dispatch("getAllDocs");
    });
  },
  closeDB: (context: ActionContext<GhgReferenceState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getAllDocs: (context: ActionContext<GhgReferenceState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.query("configuration/list")
        .then(function (result) {
          context.commit("SET_ITEMS_LENGTH", result.total_rows);
          context.commit(
            "SET_ITEMS",
            result.rows.map((x) => x.value)
          );
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  updateDoc: (context: ActionContext<GhgReferenceState, RootState>, value) => {
    context.commit("SET_ITEMS", value);
    const db = context.state.localCouch?.db;
    if (db) {
      db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
};

/** VuexStore */
const GhgReferenceModule: Module<GhgReferenceState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GhgReferenceModule;
