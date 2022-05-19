import { getNewName, updateMetaFields } from "@/store/documentUtils";
import { RootState } from "@/store/index";
import { ScoreCard, Shelter, ShelterState } from "@/store/ShelterInterface";
import {
  completeMissingFields,
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
  shelterLoading: (s): boolean => s.shelterLoading,
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
  SET_SHELTER_LOADING(state) {
    state.shelterLoading = true;
  },
  UNSET_SHELTER_LOADING(state) {
    state.shelterLoading = false;
  },
  SET_SHELTER(state, newShelter) {
    const resultShelter = completeMissingFields(newShelter);
    resultShelter.envPerfItems = getEnvPerfItems(newShelter?.items);
    resultShelter.totalEnvPerf = getTotalEnvPerf(
      resultShelter.envPerfItems,
      newShelter?.items
    );

    const valuesTech = Object.values(
      resultShelter.technical_performance
    ) as number[];

    if (valuesTech.length) {
      resultShelter.technical_performance_score = valuesTech.reduce(
        (acc, el) => acc + el
      );
    } else {
      resultShelter.technical_performance_score = 0;
    }

    const valuesHab = Object.values(resultShelter.habitability) as number[];
    if (valuesHab.length) {
      resultShelter.habitability_score = valuesHab.reduce(
        (acc, el) => acc + el
      );
    } else {
      resultShelter.habitability_score = 0;
    }
    const { scorecard, errors } = getScoreCard(newShelter);
    resultShelter.scorecard = scorecard;
    resultShelter.scorecard_errors = errors;
    state.shelter = resultShelter;
    return state.shelter;
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
    return localCouch?.remoteDB
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
    return localCouch?.remoteDB
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
      const value = generateNewShelter(name, user);
      return context.state.localCouch?.remoteDB.post(value).then(() => {
        context.commit("ADD_DOC", value);
      });
    }
  },
  duplicateDoc: async (
    context: ActionContext<ShelterState, RootState>,
    value: Shelter
  ) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (user.name) {
      // retrieve real document first
      let newValue = await context.dispatch("getDoc", value._id);
      delete newValue._rev; // to avoid conflict
      delete newValue._id; // set by remote database (uuid v4)
      newValue = updateMetaFields(newValue, user);
      newValue.name = getNewName(newValue.name);

      context.commit("SET_SHELTER", newValue);
      newValue = context.state.shelter;
      return context.state.localCouch?.remoteDB
        .post(context.state.shelter)
        .then((response) => {
          newValue._id = response.id;
          newValue._rev = response.rev;
          context.commit("SET_SHELTER", newValue);
          context.commit("ADD_DOC", context.state.shelter);
          return context.state.shelter;
        });
    }
  },
  removeDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    context.commit("REMOVE_DOC", id);
  },
  updateDoc: async (context: ActionContext<ShelterState, RootState>, value) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (user.name) {
      value.updated_at = new Date().toISOString();
      value.updated_by = user.name;
      context.commit("SET_SHELTER", value);
      const remoteDB = context.state.localCouch?.remoteDB;
      if (!remoteDB) {
        throw new Error(MSG_DB_DOES_NOT_EXIST);
      }
      if (!context.getters["shelterLoading"]) {
        context.commit("SET_SHELTER_LOADING");
        const currentValue = context.state.shelter;
        let newValue = await context.dispatch("getDoc", currentValue._id);
        currentValue._rev = newValue._rev;
        try {
          const response = await remoteDB.put(currentValue);
          newValue = await context.dispatch("getDoc", response.id);
          context.commit("SET_SHELTER", newValue);
          context.commit("UNSET_SHELTER_LOADING");
          /* eslint-disable-next-line */
        } catch (e: any) {
          if (e.error === "conflict") {
            // rerun dispatch updateDoc but only once
            console.log("conflict error");
          }
          context.commit("UNSET_SHELTER_LOADING");
        }
      }
    }
  },
  updateLocalDoc: (context: ActionContext<ShelterState, RootState>, value) => {
    context.commit("SET_SHELTER", value);
  },
  getDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    const remoteDB = context.state.localCouch?.remoteDB;
    if (remoteDB) {
      return remoteDB.get(id).then(function (result: Shelter) {
        context.commit("SET_SHELTER", result);
        context.dispatch(
          "ShelterBillOfQuantitiesModule/setItems",
          context.state.shelter.items,
          { root: true }
        );
        return context.state.shelter;
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
