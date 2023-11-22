/** Config store */
import { CountryExtended, GreenHouseGaz } from "@/store/GhgInterface";
import { SyncDatabase } from "@/utils/couchdb";
import { countriesMap } from "@/utils/countriesAsList";
import { v4 as uuidv4 } from "uuid";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";
import { updateMetaFieldsForUpdate } from "./documentUtils";
import { IgesItem } from "./GhgReferenceIgesGridModule";
import { ReferenceItemInterface } from "./GhgReferenceModule";
import { CouchUser } from "./UserModule";

const MSG_DB_DOES_NOT_EXIST = "Please, init your database";
const MSG_USER_NOT_PRESENT = "Could not find user information";

const timeoutIds: NodeJS.Timeout[] = [];

function cleartimeouts(timeoutIds: NodeJS.Timeout[]): void {
  timeoutIds.forEach((id) => {
    clearTimeout(id);
  });
}

interface ProjectsState {
  projects: GreenHouseGaz[];
  project: GreenHouseGaz;
  projectLoading: boolean;
  countries: Array<CountryExtended>;
  sites: GreenHouseGaz[];
  siteAssessments: GreenHouseGaz[];
  siteAssessmentsLoading: boolean;
  newAssessment: boolean;
  removeAssessment: boolean;
  removeAssessments: boolean;
  updateAssessment: boolean;
  localCouch: SyncDatabase<GreenHouseGaz> | null;
}

const DB_NAME = "ghg_projects_1696578512055758";

function generateState(): ProjectsState {
  return {
    projects: [],
    project: {} as GreenHouseGaz,
    projectLoading: false,
    countries: [],
    sites: [],
    siteAssessments: [],
    siteAssessmentsLoading: false,
    localCouch: null,
    newAssessment: false,
    removeAssessment: false,
    removeAssessments: false,
    updateAssessment: false,
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
      users: [user],
      created_by: user.name,
    };
  }
}
/** Getters */
const getters: GetterTree<ProjectsState, RootState> = {
  projects: (s): Array<GreenHouseGaz> => s.projects,
  project: (s): GreenHouseGaz | null => s.project,
  projectLoading: (s): boolean | null => s.projectLoading,
  project_REF_GRD: (
    _state,
    getters,
    _rootState,
    rootGetters
  ): ReferenceItemInterface | null => {
    const ghgMapRef = rootGetters["GhgReferenceModule/ghgMapRef"];
    const iges_grid = rootGetters["GhgReferenceIgesGridModule/items"];
    if (!ghgMapRef || !iges_grid) {
      throw new Error("GhgMapRef or igesGrid is not defined");
    }
    const REF_GRD = ghgMapRef.REF_GRD;
    const iges_grid_match = iges_grid.find(
      (el: IgesItem) => el._id === getters.project.countryCode
    );
    REF_GRD.value = iges_grid_match?.value ?? REF_GRD.value; // find REF_GRD per country

    return REF_GRD;
  },
  sites: (s): GreenHouseGaz[] => s.sites,
  siteAssessments: (s): GreenHouseGaz[] => s.siteAssessments,
  siteAssessmentsLoading: (s): boolean => s.siteAssessmentsLoading,
  countries: (s): Array<CountryExtended> => s.countries,
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
  SET_PROJECT_LOADING(state, value) {
    state.projectLoading = value;
  },
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
    state.sites = countries
      .map((x: any) => x.value)
      .reduce((acc: any[], el: any) => acc.concat(el));
  },
  SET_SITE_ASSESSMENTS(state, siteAssessments) {
    state.siteAssessments = siteAssessments;
  },
  SET_SITE_ASSESSMENTS_LOADING(state, value) {
    state.siteAssessmentsLoading = value;
  },
  SET_SITES(state, sites) {
    state.sites = sites.map((x: any) => x.value);
  },
  ADD_DOC(state, value) {
    state.projects.push(value);
  },
  NEW_ASSESSEMENT(state, value) {
    state.newAssessment = value;
  },
  REMOVE_ASSESSEMENT(state, value) {
    state.removeAssessment = value;
  },
  REMOVE_ASSESSMENTS(state, value) {
    state.removeAssessments = value;
  },
  UPDATE_ASSESSEMENT(state, value) {
    state.updateAssessment = value;
  },
  REMOVE_DOC(state, value) {
    // todo:check that projects exists!
    const indexToRemove = state.projects.findIndex((el) => el.id === value);
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
  return function getCountriesGenerated(
    context: ActionContext<ProjectsState, RootState>
  ) {
    const db = context.state.localCouch?.remoteDB;
    if (!db) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    db?.query("project/countries_with_info", queryParams).then(function (
      result
    ) {
      if (result?.rows) {
        let value: CountryExtended[] = result.rows.filter(
          (item) => item !== null
        );
        let error: boolean | string = false;
        value = value.map((item: CountryExtended) => {
          const countryCode = item?.key?.[0] ?? "";
          if (countryCode === "" && item.key == null) {
            item.key = ["unknown"];
            item.value = [];
            error = "reduce overflow in 'project/countries_with_info'";
          }
          item.countryName =
            countriesMap[countryCode]?.name ?? "unknown country code";
          // item.country = countriesMap[item.key[0]];
          // countriesMap[country.key[0]].name
          return item;
        });
        value.sort((a, b) =>
          (a?.countryName ?? "").localeCompare(b?.countryName ?? "")
        );
        // add coutryName field
        // sort by countryName !
        context.commit(COMMIT_NAME, value);
        if (error !== false) {
          throw new Error(error);
        }
        return value;
      }
      throw new Error("undefined 'project/countries_with_info' response");
    });
  };
}

function getGenericSite(
  queryParams: CouchQuery = {
    // reduce: true,
    // group: true,
    // group_level: 1,
    reduce: false,
    skip: 0,
    limit: 1000,
  },
  COMMIT_NAME = "SET_SITE_ASSESSMENTS"
) {
  return function getSite(
    context: ActionContext<ProjectsState, RootState>,
    id: number | string
  ) {
    // first setup loading
    // second reset data
    // third get data
    // fourth reset loading
    context.commit("SET_SITE_ASSESSMENTS_LOADING", true);
    const timeId: NodeJS.Timeout = setTimeout(function () {
      context.dispatch("setLoading", true, { root: true });
    }, 300);
    timeoutIds.push(timeId);
    context.commit(COMMIT_NAME, []);
    const db = context.state.localCouch?.remoteDB;
    if (!db) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    // http://localhost:5984/ghg_projects_1696578512055758/_design/project/_view/sites_with_assessments?skip=0&limit=51&reduce=true&group=true&key=582
    db?.query("project/sites_with_assessments", {
      ...queryParams,
      key: id,
    })
      .then(function (result) {
        if (result?.rows) {
          const value = result.rows
            .filter((item) => item !== null)
            .reduce((acc, x) => {
              return acc.concat(x.value);
            }, []);
          context.commit(COMMIT_NAME, value);
          return value;
        }
        context.commit("SET_SITE_ASSESSMENTS_LOADING", false);
        cleartimeouts(timeoutIds);
        context.dispatch("setLoading", false, { root: true });
        throw new Error("undefined 'project/sites_with_assessments' response");
      })
      .finally(() => {
        cleartimeouts(timeoutIds);
        context.dispatch("setLoading", false, { root: true });
        context.commit("SET_SITE_ASSESSMENTS_LOADING", false);
      });
  };
}

/** Action */
const actions: ActionTree<ProjectsState, RootState> = {
  syncDB: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("INIT_DB");
    // context.state.localCouch?.onChange(function () {
    //   context.dispatch("getCountries");
    // });
  },
  closeDB: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDB: async (context: ActionContext<ProjectsState, RootState>) => {
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      const result = await db?.query("project/list", {
        limit: 10000,
      });
      const projects = result.rows.map((x) => ({ _id: x.id, _rev: x.key }));
      context.commit("SET_PROJECTS", projects);
      return projects;
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  getSites: getGenericCountries(
    {
      reduce: false,
      group: false,
      skip: 0,
      limit: 1000,
    },
    "SET_SITES"
  ),
  getCountries: getGenericCountries({
    group_level: 1,
  }),
  getSite: getGenericSite(),
  addDoc: (
    context: ActionContext<ProjectsState, RootState>,
    newGhg: GreenHouseGaz
  ) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    // context.commit("ADD_DOC", generateNewProject(newGhg, user));
    const value = generateNewProject(newGhg, user) as any;
    const remoteDB = context.state.localCouch?.remoteDB;
    if (remoteDB) {
      delete value.isUNHCR;
      value._id = value?._id ?? value?.id ?? uuidv4();
      delete value.id; // just in case we forgot to remove it
      delete value._rev; // just in case we forgot to remove it
      return remoteDB.post(value).then((response) => {
        context.commit("NEW_ASSESSEMENT", true);
        return context.dispatch("getDoc", response.id);
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
      .finally(() => {
        context.commit("REMOVE_ASSESSEMENT", true);
      });
  },
  setDoc: (
    context: ActionContext<ProjectsState, RootState>,
    value: GreenHouseGaz
  ) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (!user) {
      throw new Error(MSG_USER_NOT_PRESENT);
    }
    const newValue = updateMetaFieldsForUpdate(value, user);
    context.commit("SET_PROJECT", newValue);
  },
  getDoc: (context: ActionContext<ProjectsState, RootState>, id) => {
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      context.commit("SET_PROJECT_LOADING", true);
      return db
        .get(id)
        .then(function (result) {
          context.commit("SET_PROJECT", result);
          return result;
        })
        .catch(function (err: Error) {
          context.commit("SET_PROJECT_LOADING", false);
          err.message = `${err?.message} ${id}`;
          throw err;
        })
        .finally(() => {
          context.commit("SET_PROJECT_LOADING", false);
        });
    } else {
      context.commit("SET_PROJECT_LOADING", false);
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  resetDoc: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("SET_PROJECT", {} as GreenHouseGaz);
    context.commit("SET_PROJECT_LOADING", false);
  },
  updateDoc: async (
    context: ActionContext<ProjectsState, RootState>,
    value
  ) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (!user) {
      throw new Error(MSG_USER_NOT_PRESENT);
    }
    const newValue = updateMetaFieldsForUpdate(value, user);
    delete newValue.isUNHCR;
    // no need for  "SET_PROJECT" it should only be done by getDoc

    context.commit("SET_PROJECT_LOADING", true);
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      // first retrieve latest rev
      // const doc = await db.get(newValue.id);
      // newValue._id = doc._id;
      // newValue._rev = doc._rev;
      return await db
        .put(newValue, { force: true })
        .then((response) => {
          // set new rev
          context.commit("UPDATE_ASSESSEMENT", true);
          return context.dispatch("getDoc", response.id);
        })
        .catch((response) => {
          // because error, we need to dispatch doc again
          context.commit("SET_PROJECT_LOADING", false);
          context.dispatch("getDoc", newValue._id);
          throw response;
        })
        .finally(() => {
          context.commit("SET_PROJECT_LOADING", false);
        });
    } else {
      context.commit("SET_PROJECT_LOADING", false);
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
  resetSitesAssessments: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("SET_SITE_ASSESSMENTS", []);
  },
  removeDrafts: async (context: ActionContext<ProjectsState, RootState>) => {
    // WARNING: Draft has priority over 'reference'! even if it's a reference it is considered a draft
    const remoteDB = context.state.localCouch?.remoteDB;
    if (!remoteDB) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    context.commit("SET_SITE_ASSESSMENTS_LOADING", true);

    const timeId: NodeJS.Timeout = setTimeout(function () {
      context.dispatch("setLoading", true, { root: true });
    }, 300);
    timeoutIds.push(timeId);
    // getDB retrieve allDrafts already
    const allDrafts = await context.dispatch("getDB");
    const draftsToDelete: any[] = allDrafts.map(
      (assessment: GreenHouseGaz) => ({
        ...assessment,
        _deleted: true,
      })
    );
    const bulkResult = await remoteDB.bulkDocs(draftsToDelete);
    console.log(bulkResult);
    context.commit("SET_SITE_ASSESSMENTS_LOADING", false);
    context.commit("REMOVE_ASSESSMENTS", true);
    cleartimeouts(timeoutIds);
    context.dispatch("setLoading", false, { root: true });
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
  group_level?: number;
  skip?: number;
  limit?: number;
}

export default GhgModule;
