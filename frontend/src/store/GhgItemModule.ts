import { GreenHouseGaz } from "@/store/GhgInterface";
import PouchDB from "pouchdb";
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
  localCouch: PouchDB.Database | null;
  sync: PouchDB.Replication.Sync<GreenHouseGaz> | null;
  replicate: PouchDB.Replication.Replication<GreenHouseGaz> | null;
}

const DB_NAME = "ghg";
const REMOTE_COUCH = `http://localhost:5984/${DB_NAME}`;
const MSG_DB_NOT_INITIALIZED = "local couchdb should have been initialized";

/** Default Configure state value */
function generateState(): GhgState {
  return {
    project: null,
    localCouch: null,
    sync: null,
    replicate: null,
  };
}

/** Getters */
const getters: GetterTree<GhgState, RootState> = {
  project: (s): GreenHouseGaz | null => s.project,
};

/** Mutations */
const mutations: MutationTree<GhgState> = {
  INIT_SYNC(state) {
    state.localCouch = new PouchDB("couchGreenHouseGazs", {
      auto_compaction: true,
    });
  },
  CLOSE_SYNC(state) {
    state?.localCouch?.close().then(function () {
      // success
      state.replicate?.cancel(); // whenever you want to cancel the replicate!
      state.sync?.cancel(); // whenever you want to cancel the sync!
      // hopefully removing the replicate!
      state.localCouch = null;
    });
  },
  SET_PROJECT(state, value) {
    state.project = value;
  },
  SET_SYNC(state, value) {
    state.sync = value;
  },
  SET_REPLICATE(state, value) {
    state.replicate = value;
  },
};

/** Action */
const actions: ActionTree<GhgState, RootState> = {
  syncDB: (context: ActionContext<GhgState, RootState>) => {
    // init
    context.commit("INIT_SYNC");

    const localCouch = context.state.localCouch;
    const replicate = localCouch?.replicate
      .from(REMOTE_COUCH)
      .on("complete", function () {
        const sync = localCouch
          ?.sync(REMOTE_COUCH, { live: true, retry: true })
          .on("change", function () {
            context.dispatch("getDoc", context.state.project?._id);
          });
        context.commit("SET_SYNC", sync);
      })
      .on("error", function (error: PouchDB.Core.Error) {
        console.log("could not replicate", error);
        if (error.status === 401) {
          // you are not authorized
        }
      });
    context.commit("SET_REPLICATE", replicate);
  },
  closeDB: (context: ActionContext<GhgState, RootState>) => {
    context.commit("CLOSE_SYNC");
  },
  updateDoc: (context: ActionContext<GhgState, RootState>, value) => {
    context.commit("SET_PROJECT", value);
    if (context.state.localCouch) {
      context.state.localCouch
        .put(value)
        .then(function () {
          // DANGER!
          // From now on, revision 1 is no longer available.
        })
        .catch(function (err: Error) {
          // handle errors
          // TODO: handle errors properly with notification and tool
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_NOT_INITIALIZED);
    }
  },
  getDoc: (context: ActionContext<GhgState, RootState>, id) => {
    context.state.localCouch
      ?.get(id)
      .then(function (result) {
        console.log(result);
        context.commit("SET_PROJECT", result);
      })
      .catch(function (err: Error) {
        console.log(err);
      });
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
