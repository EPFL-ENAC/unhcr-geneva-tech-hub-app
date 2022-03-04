/** Config store */
import { Shelter } from "@/store/ShelterInterface";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
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
  projects: Array<Shelter>;
  localCouch: SyncDatabase<Shelter> | null;
}

const DB_NAME = "ghg";

function generateState(): ProjectsState {
  return {
    projects: [],
    localCouch: null,
  };
}

function generateNewProject(name: string, user: CouchUser) {
  return {
    _id: name,
    name,
    users: [user.name],
    created_by: user.name,
  };
}
/** Getters */
const getters: GetterTree<ProjectsState, RootState> = {
  projects: (s): Array<Shelter> => s.projects,
};

/** Mutations */
const mutations: MutationTree<ProjectsState> = {
  INIT_DB(state) {
    state.localCouch = createSyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_PROJECTS(state, value) {
    state.projects = value;
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
      context.dispatch("getDB");
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
  addDoc: (context: ActionContext<ProjectsState, RootState>, name: string) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (user.name) {
      context.commit("ADD_DOC", generateNewProject(name, user));
    }
  },
  removeDoc: (context: ActionContext<ProjectsState, RootState>, id) => {
    context.commit("REMOVE_DOC", id);
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
