/** Config store */
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import store, { RootState } from ".";

import PouchDB from "pouchdb";
import { Shelter } from "./ShelterSustainabilityModule";

export interface ShelterState {
  shelter: Shelter | null;
  localCouch: any;
  sync: any;
  replicate: any;
}

const remoteCouch = "http://pierre:pierre@localhost:5984/shelters";

/** Default Configure state value */
function generateState(): ShelterState {
  return {
    shelter: null,
    localCouch: null,
    sync: null,
    replicate: null,
  };
}

/** Getters */
const getters: GetterTree<ShelterState, RootState> = {
  shelter: (s): Shelter | null => s.shelter,
};

/** Mutations */
const mutations: MutationTree<ShelterState> = {
  INIT_SYNC(state) {
    state.localCouch = new PouchDB("couchShelters", { auto_compaction: true });
  },
  CLOSE_SYNC(state) {
    state?.localCouch?.close().then(function () {
      // success
      state.replicate.cancel(); // whenever you want to cancel the replicate!
      state.sync.cancel(); // whenever you want to cancel the sync!
      // hopefully removing the replicate!
      state.localCouch = null;
      console.log("succeessfully closing localCouch");
    });
  },
  SET_SHELTER(state, value) {
    state.shelter = value;
  },
  UPDATE_DOC(state, value) {
    console.log("running UPDATE_DOC mutation");
    state.shelter = value;
    if (state.localCouch) {
      state.localCouch
        .put(value)
        .then((response: any) => {
          console.log("update doc is done", response);
        })
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
      throw new Error("localCouch is null: should have been initialized");
    }
  },
  SET_SYNC(state, value) {
    state.sync = value;
  },
  SET_REPLICATE(state, value) {
    state.replicate = value;
  },
};

/** Action */
const actions: ActionTree<ShelterState, RootState> = {
  syncDB: (context: ActionContext<ShelterState, RootState>) => {
    // init
    console.log("syncDB action in ShelterItem Module");
    context.commit("INIT_SYNC");

    const replicate = context.state.localCouch.replicate
      .from(remoteCouch)
      .on("complete", function () {
        const sync = context.state.localCouch
          .sync(remoteCouch, { live: true, retry: true })
          .on("change", function () {
            context.dispatch("getDoc", context.state.shelter?._id);
          });
        context.commit("SET_SYNC", sync);
      });
    context.commit("SET_REPLICATE", replicate);
  },
  closeDB: (context: ActionContext<ShelterState, RootState>) => {
    context.commit("CLOSE_SYNC");
  },
  updateDoc: (context: ActionContext<ShelterState, RootState>, value) => {
    context.commit("UPDATE_DOC", value);
  },
  getDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    context?.state?.localCouch
      .get(id, {
        include_docs: true,
      })
      .then(function (result: any) {
        // handle result
        console.log("get doc mutation", result);
        context.commit("SET_SHELTER", result);
      })
      .catch(function (err: Error) {
        console.log(err);
      });
  },
};

/** VuexStore */
const ShelterSustainabilityModule: Module<ShelterState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterSustainabilityModule;
