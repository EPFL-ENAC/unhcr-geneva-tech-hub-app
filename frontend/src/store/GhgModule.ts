/** Config store */
import { Country, GreenHouseGaz, Site } from "@/store/GhgInterface";
import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";
import { updateMetaFields } from "./documentUtils";
import { CouchUser } from "./UserModule";

const MSG_DB_DOES_NOT_EXIST = "Please, init your database";
const MSG_USER_NOT_PRESENT = "Could not find user information";

interface ProjectsState {
  projects: GreenHouseGaz[];
  project: GreenHouseGaz;
  countries: Array<Country>;
  sites: Site[];
  localCouch: SyncDatabase<GreenHouseGaz> | null;
}

const DB_NAME = "ghg";

function generateState(): ProjectsState {
  return {
    projects: [],
    project: {} as GreenHouseGaz,
    countries: [],
    sites: [],
    localCouch: null,
  };
}

function generateNewProject(
  newGhg: GreenHouseGaz,
  user: CouchUser
): GreenHouseGaz {
  if (!user.name) {
    // generate error
    throw new Error("User name does not exist");
  } else {
    return {
      ...newGhg,
      _id: newGhg.name,
      users: [user.name],
      created_by: user.name,
    };
  }
}
/** Getters */
const getters: GetterTree<ProjectsState, RootState> = {
  projects: (s): Array<GreenHouseGaz> => s.projects,
  project: (s): GreenHouseGaz | null => s.project,
  sites: (s): Array<Site> => s.sites,
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
  SET_SITES(state, sites) {
    if (sites && sites[0] && sites[0].value) {
      state.sites = sites[0].value;
    } else {
      state.sites = [];
    }
  },
  ADD_DOC(state, value) {
    state.projects.push(value);
  },
  REMOVE_DOC(state, value) {
    const indexToRemove = state.projects.findIndex((el) => el._id === value);
    state.projects.splice(indexToRemove, 1);
  },
};

function getGenericCountries(
  queryParams: CouchQuery = {
    reduce: true,
    group: true,
    skip: 0,
    limit: 1000,
  },
  COMMIT_NAME = "SET_COUNTRIES"
) {
  return function getCountries(
    context: ActionContext<ProjectsState, RootState>
  ) {
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      db?.query("project/countries_with_info", queryParams)
        .then(function (result) {
          if (result?.rows) {
            const countries = result.rows.filter((item) => item !== null);
            context.commit(COMMIT_NAME, countries);
            return countries;
          }
          throw new Error("undefined 'project/countries_with_info' response");
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  };
}

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
    const db = context.state.localCouch?.remoteDB;
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
  getSites: getGenericCountries({}, "SET_SITES"),
  getCountries: getGenericCountries(),
  addDoc: (
    context: ActionContext<ProjectsState, RootState>,
    newGhg: GreenHouseGaz
  ) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    // context.commit("ADD_DOC", generateNewProject(newGhg, user));
    const value = generateNewProject(newGhg, user);
    const remoteDB = context.state.localCouch?.remoteDB;
    if (remoteDB) {
      return remoteDB.post(value).then(() => {
        // set new rev
        return context.dispatch("getDoc", value._id);
      });
    }
  },
  removeDoc: (context: ActionContext<ProjectsState, RootState>, id) => {
    const remoteDB = context.state.localCouch?.remoteDB;
    if (!remoteDB) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    return remoteDB
      .get(id)
      .then(function (doc: PouchDB.Core.ExistingDocument<GreenHouseGaz>) {
        return remoteDB.put({ ...doc, _deleted: true });
      })
      .catch(function (err) {
        console.log(err);
      });
  },
  getDoc: (context: ActionContext<ProjectsState, RootState>, id) => {
    const db = context.state.localCouch?.remoteDB;
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
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (!user) {
      throw new Error(MSG_USER_NOT_PRESENT);
    }
    const newValue = updateMetaFields(value, user);
    context.commit("SET_PROJECT", newValue);
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      return await db
        .put(newValue, { force: true })
        .then((response) => {
          // set new rev
          return context.dispatch("getDoc", response.id);
        })
        .catch((response) => {
          // because error, we need to dispatch doc again
          context.dispatch("getDoc", response.id);
          console.log("error", response);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  updateLocalStore: async (
    context: ActionContext<ProjectsState, RootState>,
    value
  ) => {
    context.commit("SET_PROJECT", value);
  },
  hasDB: async (context: ActionContext<ProjectsState, RootState>) => {
    return context.state.localCouch?.remoteDB;
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

interface CouchQuery {
  reduce?: boolean;
  group?: boolean;
  skip?: number;
  limit?: number;
}

export default GhgModule;
