import { RootState } from "@/store/index";
import { Shelter } from "@/store/ShelterInterface";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { CouchUser } from "./UserModule";

interface ShelterState {
  shelters: Array<Shelter>;
  localCouch: SyncDatabase<Shelter> | null;
}

function generateState(): ShelterState {
  return {
    shelters: [],
    localCouch: null,
  };
}

const DB_NAME = "shelters";

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
    state.localCouch = createSyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_SHELTERS(state, value) {
    state.shelters = value;
  },
  ADD_DOC(state, value) {
    state.localCouch?.db
      .put(value)
      .then(() => {
        state.shelters.push(value);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  REMOVE_DOC(state, value) {
    const indexToRemove = state.shelters.findIndex((el) => el._id === value);
    state.shelters.splice(indexToRemove, 1);
    state.localCouch?.db.get(value).then(function (doc) {
      return state.localCouch?.db.remove(doc);
    });
  },
};

/** Action */
const actions: ActionTree<ShelterState, RootState> = {
  syncDB: (context: ActionContext<ShelterState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      context.dispatch("getDB");
    });
  },
  closeDB: (context: ActionContext<ShelterState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDB: (context: ActionContext<ShelterState, RootState>) => {
    const localCouch = context.state.localCouch;
    // shelters/_design/shelter/_view/lits?include_docs=true
    return localCouch?.db
      .query("shelter/list")
      .then(function (result) {
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
