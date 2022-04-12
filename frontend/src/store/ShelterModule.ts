import { RootState } from "@/store/index";
import { ScoreCard, Shelter, ShelterState } from "@/store/ShelterInterface";
import {
  generateNewShelter,
  generateState,
  getEnvPerfItems,
  getScoreCard,
  getTotalEnvPerf,
} from "@/store/ShelterModuleUtils";
import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { CouchUser } from "./UserModule";

const DB_NAME = "shelters";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Getters */
const getters: GetterTree<ShelterState, RootState> = {
  shelters: (s): Array<Shelter> => s.shelters,
  shelter: (s): Shelter | null => s.shelter,
  db: (s): SyncDatabase<Shelter> | null => s.localCouch,
  scorecards: (s): ScoreCard[] => s.scorecards,
};

/** Mutations */
const mutations: MutationTree<ShelterState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_SHELTERS(state, value) {
    state.shelters = value;
  },
  SET_SHELTER(state, value) {
    state.shelter = value;
    state.shelter.envPerfItems = getEnvPerfItems(value?.items);
    state.shelter.totalEnvPerf = getTotalEnvPerf(
      state.shelter.envPerfItems,
      value?.items
    );
    state.shelter.scorecard = getScoreCard(value);
  },
  SET_SCORECARDS(state, value) {
    state.scorecards = value;
  },
  ADD_DOC(state, value) {
    state.localCouch?.db
      .put(value)
      .then(() => {
        state.shelters.push(value);
      })
      .catch((error: Error) => {
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
  },
  closeDB: (context: ActionContext<ShelterState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getShelters: (context: ActionContext<ShelterState, RootState>) => {
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
  getScorecards: (
    context: ActionContext<ShelterState, RootState>,
    id: string
  ) => {
    const localCouch = context.state.localCouch;
    // shelters/_design/shelter/_view/scorecards?include_docs=true
    return localCouch?.db
      .query("shelter/scorecards", { include_docs: true })
      .then(function (result) {
        const scorecards = result.rows
          .filter((x) => x.value !== undefined)
          .map((x) => ({ ...x.value, id: x.id, selected: x.id === id }));
        scorecards.sort((a, b) => Number(a.selected) - Number(b.selected));
        // we needed to sort the scorecards, so the selected may appear at the end
        context.commit("SET_SCORECARDS", scorecards);
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
  updateDoc: (context: ActionContext<ShelterState, RootState>, value) => {
    context.commit("SET_SHELTER", value);
    const db = context.state.localCouch?.db;
    if (db) {
      db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  getDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.get(id).then(function (result: Shelter) {
        context.commit("SET_SHELTER", result);
      });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
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
