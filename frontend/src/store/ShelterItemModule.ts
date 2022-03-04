import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";
import { Shelter } from "./ShelterInterface";

interface ShelterState {
  shelter: Shelter | null;
  localCouch: SyncDatabase<Shelter> | null;
}

/** Default Configure state value */
function generateState(): ShelterState {
  return {
    shelter: null,
    localCouch: null,
  };
}

const DB_NAME = "shelters";
/** Getters */
const getters: GetterTree<ShelterState, RootState> = {
  shelter: (s): Shelter | null => s.shelter,
};

/** Mutations */
const mutations: MutationTree<ShelterState> = {
  INIT_DB(state) {
    state.localCouch = createSyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_SHELTER(state, value) {
    state.shelter = value;
  },
};

/** Action */
const actions: ActionTree<ShelterState, RootState> = {
  syncDB: (context: ActionContext<ShelterState, RootState>) => {
    // init
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;
    localCouch?.onChange(function () {
      context.dispatch("getDoc", context.state.shelter?._id);
    });
  },
  closeDB: (context: ActionContext<ShelterState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  updateDoc: (context: ActionContext<ShelterState, RootState>, value) => {
    context.commit("SET_SHELTER", value);
    const db = context.state.localCouch?.db;
    if (db) {
      db.put(value);
    } else {
      throw new Error("localCouch is null: should have been initialized");
    }
  },
  getDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.get(id).then(function (result) {
        context.commit("SET_SHELTER", result);
      });
    } else {
      throw new Error("localCouch is null: should have been initialized");
    }
  },
};

/** VuexStore */
const ShelterItemModule: Module<ShelterState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterItemModule;
