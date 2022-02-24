/** Config store */
import { Shelter } from "@/store/ShelterInterface";
import PouchDB from "pouchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";
import { CouchUser } from "./UserModule";

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
  return {
    _id: name,
    name,
    organisation: "",
    shelter_total: undefined, // number of shelters
    shelter_occupants: undefined, // people
    shelter_lifespan: undefined, // years
    setup_people: undefined, // 2 people necessary for setup
    setup_time: undefined, // days,
    location_name: "",
    location_country: "", // iso code ?
    location_distance_from_capital: undefined, // km
    location_lat: undefined, // option
    location_lon: undefined, // option
    risk_flood: "",
    risk_seismic: "",
    habitability: {},
    habitability_score: undefined,
    technical_performance_score: undefined,
    technical_performance: {},
    shelter_dimensions: { L: undefined, W: undefined },
    doors_dimensions: [{ Wd: undefined, Hd: undefined }],
    windows_dimensions: [{ Ww: undefined, Hw: undefined, Hs: undefined }],
    shelter_geometry_type: "",
    users: [""],
    created_by: "",
  } as Shelter;
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
    state.localCouch
      ?.put(value)
      .then(() => {
        state.shelters.push(value);
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
        console.log("complete: proced to sync");
        // then two-way, continuous, retriable sync
        sync(localCouch);
      })
      .on("change", function (info) {
        console.log("change", info);
        // handle change
      })
      .on("paused", function (err) {
        console.log("paused", err);
        // replication paused (e.g. replication up to date, user went offline)
      })
      .on("active", function () {
        console.log("active");
        // replicate resumed (e.g. new changes replicating, user went back online)
      })
      .on("denied", function (err) {
        console.log("denied", err);
        // a document failed to replicate (e.g. due to permissions)
      })
      .on("error", function (err) {
        console.log("error", err);
        // handle error
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
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    console.log(user);
    if (user.name) {
      const newShelter = generateNewShelter(name);
      newShelter.users = [user.name];
      newShelter.created_by = user.name;
      context.commit("ADD_DOC", newShelter);
    }
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
