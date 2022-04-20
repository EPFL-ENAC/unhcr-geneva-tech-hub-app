/** Config store */
import { Country, GreenHouseGaz } from "@/store/GhgInterface";
import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";
import { CouchUser } from "./UserModule";

const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

interface ProjectsState {
  projects: Array<GreenHouseGaz>;
  project: GreenHouseGaz;
  countries: Array<Country>;
  localCouch: SyncDatabase<GreenHouseGaz> | null;
}

const DB_NAME = "ghg";

function generateState(): ProjectsState {
  return {
    projects: [],
    project: {} as GreenHouseGaz,
    countries: [],
    localCouch: null,
  };
}

function generateNewProject(newGhg: GreenHouseGaz, user: CouchUser) {
  return {
    ...newGhg,
    _id: newGhg.name,
    users: [user.name],
    created_by: user.name,
  };
}
/** Getters */
const getters: GetterTree<ProjectsState, RootState> = {
  projects: (s): Array<GreenHouseGaz> => s.projects,
  project: (s): GreenHouseGaz | null => s.project,

  countries: (s): Array<Country> => s.countries,
};

/** Mutations */
const mutations: MutationTree<ProjectsState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_PROJECTS(state, value) {
    state.projects = value;
  },
  SET_PROJECT(state, value) {
    state.project = value;
  },
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
  },
  ADD_DOC(state, value) {
    state.localCouch?.db.put(value).then(() => {
      state.projects.push(value);
    });
  },
  REMOVE_DOC(state, value) {
    const indexToRemove = state.projects.findIndex((el) => el._id === value);
    state.projects.splice(indexToRemove, 1);
    state.localCouch?.db.get(value).then(function (doc) {
      return state.localCouch?.db.remove(doc);
    });
  },
};

/** Action */
const actions: ActionTree<ProjectsState, RootState> = {
  syncDB: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      context.dispatch("getCountries");
    });
  },
  closeDB: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDB: (context: ActionContext<ProjectsState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db?.query("project/list")
        .then(function (result) {
          context.commit(
            "SET_PROJECTS",
            result.rows.map((x) => x.value)
          );
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  getCountries: (context: ActionContext<ProjectsState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db?.query("project/countries_with_info", {
        reduce: true,
        group: true,
        skip: 0,
        limit: 100,
      })
        .then(function (result) {
          if (result?.rows) {
            context.commit("SET_COUNTRIES", result.rows);
            return result.rows;
          }
          throw new Error("undefined 'project/countries_with_info' response");
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  addDoc: (
    context: ActionContext<ProjectsState, RootState>,
    newGhg: GreenHouseGaz
  ) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (user.name) {
      context.commit("ADD_DOC", generateNewProject(newGhg, user));
    }
  },
  removeDoc: (context: ActionContext<ProjectsState, RootState>, id) => {
    context.commit("REMOVE_DOC", id);
  },
  getDoc: (context: ActionContext<ProjectsState, RootState>, id) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.get(id)
        .then(function (result) {
          context.commit("SET_PROJECT", result);
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  updateDoc: async (
    context: ActionContext<ProjectsState, RootState>,
    value
  ) => {
    context.commit("SET_PROJECT", value);
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      await db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  hasDB: async (context: ActionContext<ProjectsState, RootState>) => {
    return context.state.localCouch?.db;
  },
};

/** VuexStore */
const GhgModule: Module<ProjectsState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GhgModule;
