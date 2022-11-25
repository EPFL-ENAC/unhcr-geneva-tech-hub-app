import { getNewName, updateMetaFields } from "@/store/documentUtils";
import { RootState } from "@/store/index";
import { ScoreCard, Shelter, ShelterState } from "@/store/ShelterInterface";
import {
  computeShelter,
  generateNewShelter,
  generateState,
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
  years: (s): string[] => s.years,
  countries: (s): string[] => s.countries,
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
  SET_YEARS(state, value) {
    state.years = value;
  },
  SET_COUNTRIES(state, value) {
    state.countries = value;
  },
  SET_SHELTER_LOADING(state) {
    state.shelterLoading = true;
  },
  UNSET_SHELTER_LOADING(state) {
    state.shelterLoading = false;
  },
  SET_SHELTER(state, newShelter) {
    state.shelter = newShelter;
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
  getYears: (context: ActionContext<ShelterState, RootState>) => {
    const localCouch = context.state.localCouch;
    // shelters/_design/shelter/_view/years?include_docs=false&group=true&reduce=true
    return localCouch?.remoteDB
      .query("shelter/years", {
        include_docs: false,
        reduce: true,
        group: true,
      })
      .then(function (result) {
        const years = result.rows
          .filter((row) => row.key != "")
          .map((row) => row.key);
        context.commit("SET_YEARS", years);
      })
      .catch(function (err: Error) {
        console.log(err);
      });
  },
  getCountries: (context: ActionContext<ShelterState, RootState>) => {
    const localCouch = context.state.localCouch;
    // shelters/_design/shelter/_view/countries?include_docs=false&group=true&reduce=true
    return localCouch?.remoteDB
      .query("shelter/countries", {
        include_docs: false,
        reduce: true,
        group: true,
      })
      .then(function (result) {
        const countries = result.rows
          .filter((row) => row.key != "")
          .map((row) => row.key);
        context.commit("SET_COUNTRIES", countries);
      })
      .catch(function (err: Error) {
        console.log(err);
      });
  },
  addDoc: (context: ActionContext<ShelterState, RootState>, name: string) => {
    const user = context.rootGetters["UserModule/user"] as CouchUser;
    if (user.name) {
      const value = generateNewShelter(name, user);
      const remoteDB = context.state.localCouch?.remoteDB;
      if (!remoteDB) {
        throw new Error(MSG_DB_DOES_NOT_EXIST);
      }
      return remoteDB.post(value).then(() => {
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
      newValue = computeShelter(newValue);
      const remoteDB = context.state.localCouch?.remoteDB;
      if (!remoteDB) {
        throw new Error(MSG_DB_DOES_NOT_EXIST);
      }
      return remoteDB.post(newValue).then(() => {
        return context.dispatch("getShelters");
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
      const computedShelter = computeShelter(value);
      const remoteDB = context.state.localCouch?.remoteDB;
      if (!remoteDB) {
        throw new Error(MSG_DB_DOES_NOT_EXIST);
      }
      if (!context.getters["shelterLoading"]) {
        context.commit("SET_SHELTER_LOADING");
        try {
          const response = await remoteDB.put(computedShelter);
          const newValue = await context.dispatch("getDoc", response.id);
          context.commit("SET_SHELTER", newValue);
          context.commit("UNSET_SHELTER_LOADING");
          /* eslint-disable-next-line */
        } catch (e: any) {
          if (e.error === "conflict") {
            console.log("conflict error");

            // TODO: rerun dispatch updateDoc but only once
            // let newValue = await context.dispatch("getDoc", computedShelter._id);
            // computedShelter._rev = newValue._rev;
            // try again with latest revision
          }
          context.commit("UNSET_SHELTER_LOADING");
        }
      }
    }
  },
  updateLocalDoc: (
    context: ActionContext<ShelterState, RootState>,
    value: Shelter
  ) => {
    const result = computeShelter(value);
    context.commit("SET_SHELTER", result);
  },
  getDoc: (context: ActionContext<ShelterState, RootState>, id) => {
    const remoteDB = context.state.localCouch?.remoteDB;
    if (remoteDB) {
      return remoteDB.get(id).then(function (result: Shelter) {
        result = computeShelter(result);
        context.commit("SET_SHELTER", result);
        context.dispatch(
          "ShelterBillOfQuantitiesModule/setItems",
          context.state.shelter.items,
          { root: true }
        );
        context.dispatch(
          "ShelterBillOfQuantitiesModule/setItemsIndividualShelter",
          context.state.shelter.items_individual_shelter,
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
