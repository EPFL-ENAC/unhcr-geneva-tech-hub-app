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

// WARNING: WRITE on remote / READ on local
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
  SET_SCORECARDS(state, value) {
    state.scorecards = value;
  },
  SET_SHELTER(state, newShelter) {
    state.shelter = newShelter;
    state.shelter.envPerfItems = getEnvPerfItems(newShelter?.items);
    state.shelter.totalEnvPerf = getTotalEnvPerf(
      state.shelter.envPerfItems,
      newShelter?.items
    );

    const valuesTech = Object.values(
      state.shelter.technical_performance
    ) as number[];

    if (valuesTech.length) {
      state.shelter.technical_performance_score = valuesTech.reduce(
        (acc, el) => acc + el
      );
    } else {
      state.shelter.technical_performance_score = 0;
    }

    const valuesHab = Object.values(state.shelter.habitability) as number[];
    if (valuesHab.length) {
      state.shelter.habitability_score = valuesHab.reduce(
        (acc, el) => acc + el
      );
    } else {
      state.shelter.habitability_score = 0;
    }
    const { scorecard, errors } = getScoreCard(newShelter);
    state.shelter.scorecard = scorecard;
    state.shelter.scorecard_errors = errors;
  },
  ADD_DOC(state, value) {
    state.shelters.push(value);
  },
  REMOVE_DOC(state, value) {
    const indexToRemove = state.shelters.findIndex((el) => el._id === value);
    state.shelters.splice(indexToRemove, 1);
    state.localCouch?.remoteDB.get(value).then(function (doc) {
      return state.localCouch?.remoteDB.remove(doc);
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
      const value = generateNewShelter(name);
      return context.state.localCouch?.db.put(value).then(() => {
        context.commit("ADD_DOC", value);
      });
    }
  },
  removeDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    context.commit("REMOVE_DOC", id);
  },
  updateDoc: (context: ActionContext<ShelterState, RootState>, value) => {
    context.commit("SET_SHELTER", value);
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  updateLocalDoc: (context: ActionContext<ShelterState, RootState>, value) => {
    context.commit("SET_SHELTER", value);
  },
  getDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    const db = context.state.localCouch?.remoteDB;
    if (db) {
      db.get(id).then(function (result: Shelter) {
        context.commit("SET_SHELTER", result);
        context.dispatch(
          "ShelterBillOfQuantitiesModule/setItems",
          result.items,
          { root: true }
        );
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
