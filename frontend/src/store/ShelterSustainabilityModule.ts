import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";

import PouchDB from "pouchdb";
import { RootState } from ".";
/** Config store */
import { Shelter } from "@/store/ShelterInterface";

interface ShelterState {
  shelters: Array<Shelter>;
  localCouch: PouchDB.Database | null;
  sync: PouchDB.Replication.Sync<Shelter> | null;
  replicate: PouchDB.Replication.Replication<Shelter> | null;
}

const remoteCouch = "http://localhost:5984/shelters";

function generateState(): ShelterState {
  return {
    shelters: [],
    localCouch: null,
    sync: null,
    replicate: null,
  };
}

function generateNewShelter(name: string) {
  const uuid = Math.random().toString(36).substring(2, 15);
  function shuffle(seed: number): number {
    return Math.floor(Math.random() * seed);
  }
  function shuffleArray(array: Array<string>): string {
    return array[shuffle(array.length)];
  }
  return {
    _id: uuid,
    name: name ?? "project " + shuffle(100000) + uuid,
    organisation: shuffleArray(["UNHCR", "WHO", "CIA", "TFF"]),
    shelter_total: shuffle(100), // number of shelters
    shelter_occupants: shuffle(10), // people
    shelter_lifespan: shuffle(6), // years
    setup_people: shuffle(2), // 2 people necessary for setup
    setup_time: shuffle(10), // days,
    location_name: shuffleArray(["Paris", "London", "Berlin", "Moscow"]),
    location_country: shuffleArray(["France", "Germany", "Uk", "Russia"]), // iso code ?
    location_distance_from_capital: shuffle(1000), // km
    location_lat: shuffle(180), // option
    location_lon: shuffle(180), // option
    risk_flood: shuffleArray(["high", "medium", "low"]),
    risk_seismic: shuffleArray(["high", "medium", "low"]),
    habitability: {
      "1_floor": { input1: 0, input2: 0, input3: 0, input4: 0 },
      "2_accessibility": { input5: 0, input6: 0, input7: 0 },
      "3_privacy": { input8: 0, input9: 0, input10: 0, input11: 0 },
      "4_artificial_lighting": { input12: 0, input13: 0 },
      "5_complimentary_facilities": {
        input14: 0,
        input15: 0,
        input16: 0,
        input17: 0,
        input18: 0,
      },
    },
    technical_performance: {
      "1_hazard": {},
      "2_internal_comfort": {},
      "3_safety_and_security": {},
      "4_construction_techniques": {},
    },
    shelter_dimensions: { L: 0, W: 0 },
    doors_dimensions: [{ Wd: 0, Hd: 0 }],
    windows_dimensions: [{ Ww: 0, Hw: 0, Hs: 0 }],
    shelter_geometry_type: "",
  };
}
/** Getters */
const getters: GetterTree<ShelterState, RootState> = {
  shelters: (s): Array<Shelter> => s.shelters,
};

/** Mutations */
const mutations: MutationTree<ShelterState> = {
  INIT_DB(state) {
    state.localCouch = new PouchDB("couchShelters", { auto_compaction: true });
  },
  CLOSE_DB(state) {
    state?.localCouch?.close().then(function () {
      // success
      state.replicate?.cancel(); // whenever you want to cancel the replicate!
      state.sync?.cancel(); // whenever you want to cancel the sync!
      // hopefully removing the replicate!
      state.localCouch = null;
      console.log("succeessfully closing localCouch");
    });
  },
  SET_SHELTERS(state, value) {
    state.shelters = value;
  },
  ADD_DOC(state, value) {
    console.log("running ADD_DOC mutation");
    state.shelters.push(value);

    state.localCouch
      ?.put(value)
      .then(() => {
        console.log("successfully put new document");
      })
      .catch((error) => {
        console.log(error);
      });
  },
  REMOVE_DOC(state, value) {
    console.log("running REMOVE_DOC mutation");
    // rmeove locally ?
    const indexToRemove = state.shelters.findIndex((el) => el._id === value);
    console.log("indexToRemove", indexToRemove);
    state.shelters.splice(indexToRemove, 1);

    state.localCouch?.get(value).then(function (doc) {
      console.log("removing document", doc);
      return state.localCouch?.remove(doc);
    });
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
    console.log("syncDB action in ShelterItem List Module");
    context.commit("INIT_DB");
    const opts = { live: true, retry: true };
    const localCouch = context.state.localCouch;

    function sync(db: PouchDB.Database | null) {
      const sync = db
        ?.sync(remoteCouch, opts)
        .on("change", function () {
          context.dispatch("getDB");
        })
        .on("paused", function () {
          // replication paused (e.g. replication up to date, user went offline)
        })
        .on("active", function () {
          // replicate resumed (e.g. new changes replicating, user went back online)
        })
        .on("denied", function () {
          // a document failed to replicate (e.g. due to permissions)
        })
        .on("complete", function () {
          // handle complete
        })
        .on("error", function () {
          // handle error
        });
      context.commit("SET_SYNC", sync);
    }
    // do one way, one-off sync from the server until completion
    const replicate = localCouch?.replicate
      .from(remoteCouch)
      .on("complete", function () {
        // then two-way, continuous, retriable sync
        sync(localCouch);
      })
      .on("error", function (err) {
        console.log("On sync Error", err);
      });
    context.commit("SET_REPLICATE", replicate);
  },
  closeDB: (context: ActionContext<ShelterState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDB: (context: ActionContext<ShelterState, RootState>) => {
    const localCouch = context.state.localCouch;
    // shelters/_design/shelter/_view/shelters?include_docs=true
    // shelters/_design/shelter/_update/shelter
    return localCouch
      ?.query("shelter/list")
      .then(function (result) {
        // handle result
        console.log(
          "getdb mutation",
          result.rows.map((x) => x.value)
        );
        context.commit(
          "SET_SHELTERS",
          result.rows.map((x) => x.value)
        );
      })
      .catch(function (err: Error) {
        console.log(err);
      });
  },
  addDoc: (context: ActionContext<ShelterState, RootState>, name: string) => {
    const newShelter = generateNewShelter(name);
    context.commit("ADD_DOC", newShelter);
  },
  removeDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    context.commit("REMOVE_DOC", id);
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
