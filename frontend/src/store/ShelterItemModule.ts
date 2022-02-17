/** Config store */
import PouchDB from "pouchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";
import { Score, Shelter } from "./ShelterInterface";

interface ShelterState {
  shelter: Shelter | null;
  localCouch: PouchDB.Database | null;
  sync: PouchDB.Replication.Sync<Shelter> | null;
  replicate: PouchDB.Replication.Replication<Shelter> | null;
}

const remoteCouch = "http://localhost:5984/shelters";

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
      state.replicate?.cancel(); // whenever you want to cancel the replicate!
      state.sync?.cancel(); // whenever you want to cancel the sync!
      // hopefully removing the replicate!
      state.localCouch = null;
    });
  },
  SET_SHELTER(state, value) {
    state.shelter = value;
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
    context.commit("INIT_SYNC");

    const localCouch = context.state.localCouch;
    const replicate = localCouch?.replicate
      .from(remoteCouch)
      .on("complete", function () {
        const sync = localCouch
          ?.sync(remoteCouch, { live: true, retry: true })
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
    context.commit("SET_SHELTER", value);
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
      throw new Error("localCouch is null: should have been initialized");
    }
  },
  getDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    context.state.localCouch
      ?.get(id)
      .then(function (result) {
        console.log(result);
        context.commit("SET_SHELTER", result);
      })
      .catch(function (err: Error) {
        console.log(err);
      });
  },
  computeScore: (
    context: ActionContext<ShelterState, RootState>,
    performance: Score
  ): number => {
    function _recursiveCompute(performance: Score): number {
      const levels = Object.values(performance);
      return (
        levels.reduce((acc: number, level: Score | number) => {
          if (typeof level === "number") {
            return acc + level;
          }
          return acc + _recursiveCompute(level);
        }, 0 as number) ?? 0
      );
    }

    return _recursiveCompute(performance);
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
