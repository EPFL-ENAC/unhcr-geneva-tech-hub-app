/** Config store */
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";

import PouchDB from "pouchdb";
import { RootState } from ".";

export interface Shelter {
  _id: string;
  name: string;
  organisation: string;
  shelter_total: number;
  shelter_occupants: number;
  shelter_lifespan: number;
  setup_people: number;
  setup_time: number;
  location_name: string;
  location_country: string;
  location_distance_from_capital: number;
  location_lat: number;
  location_lon: number;
  risk_flood: string;
  risk_seismic: string;
}

export interface ShelterState {
  shelters: Array<Shelter>;
  localCouch: PouchDB.Database | null;
  sync: PouchDB.Replication.Sync<Shelter> | null;
  replicate: PouchDB.Replication.Replication<Shelter> | null;
}

const remoteCouch = "http://pierre:pierre@localhost:5984/shelters";

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

    state.localCouch?.put(value).then(() => {
      console.log("successfully put new document");
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
    return localCouch
      ?.allDocs({
        include_docs: true,
        attachments: true,
      })
      .then(function (result) {
        // handle result
        console.log(
          "getdb mutation",
          result.rows.map((x) => x.doc)
        );
        context.commit(
          "SET_SHELTERS",
          result.rows.map((x) => x.doc)
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
