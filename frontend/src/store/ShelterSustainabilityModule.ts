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
  /** Dark Theme mode */
  shelters: Array<Shelter>;
}

const localCouch: any = new PouchDB("couchShelters");
const remoteCouch = "http://pierre:pierre@localhost:5984/shelters";

/** Default Configure state value */
function generateState(): ShelterState {
  return {
    shelters: [],
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
  SET_SHELTERS(state, value) {
    state.shelters = value;
  },
  ADD_DOC(state, value) {
    console.log("running ADD_DOC mutation");
    state.shelters.push(value);
    localCouch.put(value).then((response: any) => {
      console.log(response);
    });
  },
  REMOVE_DOC(state, value) {
    console.log("running REMOVE_DOC mutation");
    // rmeove locally ?
    const indexToRemove = state.shelters.findIndex((el) => el._id === value);
    console.log("indexToRemove", indexToRemove);
    state.shelters.splice(indexToRemove, 1);
    localCouch.get(value).then(function (doc: any) {
      console.log("removing document", doc)
      return localCouch.remove(doc);
    });
  },
};

/** Action */
const actions: ActionTree<ShelterState, RootState> = {
  syncDB: (context: ActionContext<ShelterState, RootState>) => {
    localCouch.replicate.from(remoteCouch).on("complete", function () {
      localCouch
        .sync(remoteCouch, { live: true, retry: true })
        .on("change", function () {
          context.dispatch("getDB");
        });
    });
  },
  getDB: (context: ActionContext<ShelterState, RootState>) => {
    localCouch
    .allDocs({
      include_docs: true,
      attachments: true,
    })
    .then(function (result: Array<Shelter>) {
      // handle result
      console.log("getdb mutation", result.rows.map(x => x.doc));
      context.commit("SET_SHELTERS", result.rows.map(x => x.doc));
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
  }
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