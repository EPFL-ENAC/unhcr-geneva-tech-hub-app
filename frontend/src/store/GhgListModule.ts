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

const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

interface ProjectsState {
  projects: Array<Shelter>;
  localCouch: PouchDB.Database | null;
  sync: PouchDB.Replication.Sync<Shelter> | null;
  replicate: PouchDB.Replication.Replication<Shelter> | null;
}

const DB_NAME = "ghg";
const REMOTE_COUCH = `http://localhost:5984/${DB_NAME}`;

function generateState(): ProjectsState {
  return {
    projects: [],
    localCouch: null,
    sync: null,
    replicate: null,
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
    state.localCouch = new PouchDB(DB_NAME, { auto_compaction: true });
  },
  CLOSE_DB(state) {
    if (!state.localCouch) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    state.localCouch.close().then(function () {
      state.replicate?.cancel();
      state.sync?.cancel();
      state.localCouch = null;
    });
  },
  SET_PROJECTS(state, value) {
    state.projects = value;
  },
  ADD_DOC(state, value) {
    if (!state.localCouch) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    state.localCouch
      ?.put(value)
      .then(() => {
        // add locally
        state.projects.push(value);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  REMOVE_DOC(state, value) {
    // locally
    const indexToRemove = state.projects.findIndex((el) => el._id === value);
    state.projects.splice(indexToRemove, 1);
    // remote
    state.localCouch?.get(value).then(function (doc) {
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
const actions: ActionTree<ProjectsState, RootState> = {
  syncDB: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("INIT_DB");
    const opts = { live: true, retry: true };
    const localCouch = context.state.localCouch;

    function sync(db: PouchDB.Database | null) {
      const sync = db?.sync(REMOTE_COUCH, opts).on("change", function () {
        context.dispatch("getDB");
      });
      context.commit("SET_SYNC", sync);
    }
    // do one way, one-off sync from the server until completion
    const replicate = localCouch?.replicate
      .from(REMOTE_COUCH)
      .on("complete", function () {
        // then two-way, continuous, retriable sync
        sync(localCouch);
      });
    context.commit("SET_REPLICATE", replicate);
  },
  closeDB: (context: ActionContext<ProjectsState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDB: (context: ActionContext<ProjectsState, RootState>) => {
    const localCouch = context.state.localCouch;
    // shelters/_design/shelter/_view/shelters?include_docs=true
    // shelters/_design/shelter/_update/shelter
    return localCouch
      ?.query("project/list")
      .then(function (result) {
        context.commit(
          "SET_PROJECTS",
          result.rows.map((x) => x.value)
        );
      })
      .catch(function (err: Error) {
        console.log(err);
      });
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
