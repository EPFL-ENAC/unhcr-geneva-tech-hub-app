import { GreenHouseGaz } from "@/store/GhgInterface";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface GhgState {
  project: GreenHouseGaz | null;
  localCouch: SyncDatabase<GreenHouseGaz> | null;
}

const DB_NAME = "ghg";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): GhgState {
  return {
    project: null,
    localCouch: null,
  };
}

/** Getters */
const getters: GetterTree<GhgState, RootState> = {
  project: (s): GreenHouseGaz | null => s.project,
};

/** Mutations */
const mutations: MutationTree<GhgState> = {
  INIT_DB(state) {
    state.localCouch = createSyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_PROJECT(state, value) {
    state.project = value;
  },
};

/** Action */
const actions: ActionTree<GhgState, RootState> = {
  syncDB: (context: ActionContext<GhgState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      context.dispatch("getDoc", context.state.project?._id);
    });
  },
  closeDB: (context: ActionContext<GhgState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDoc: (context: ActionContext<GhgState, RootState>, id) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.get(id)
        .then(function (result) {
          console.log(result);
          context.commit("SET_PROJECT", result);
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },

  updateDoc: async (context: ActionContext<GhgState, RootState>, value) => {
    context.commit("SET_PROJECT", value);
    const db = context.state.localCouch?.db;
    if (db) {
      await db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  hasDB: async (context: ActionContext<GhgState, RootState>) => {
    return context.state.localCouch?.db;
  },
};

/** VuexStore */
const GhgItemModule: Module<GhgState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GhgItemModule;
