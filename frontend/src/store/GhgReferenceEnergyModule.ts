import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

export type EnergyReferences = Record<string, ReferenceItemInterface>;
export type referenceType = "number" | "percentage";
export interface ReferenceItemInterface {
  description: string;
  value: number;
  type?: referenceType;
  source?: string;
  _id: string;
}

interface GhgReferenceEnergyState {
  items: ReferenceItemInterface[] | null;
  itemsLength: number;
  localCouch: SyncDatabase<EnergyReferences> | null;
}

const DB_NAME = "ghg_reference_energy";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): GhgReferenceEnergyState {
  return {
    items: null,
    itemsLength: 0,
    localCouch: null,
  };
}

/** Getters */
const getters: GetterTree<GhgReferenceEnergyState, RootState> = {
  energy: (s): ReferenceItemInterface[] | null => s.items,
};

/** Mutations */
const mutations: MutationTree<GhgReferenceEnergyState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_ITEMS(state, value) {
    state.items = value;
  },
  SET_ITEMS_LENGTH(state, value) {
    state.itemsLength = value;
  },
};

/** Action */
const actions: ActionTree<GhgReferenceEnergyState, RootState> = {
  syncDB: (context: ActionContext<GhgReferenceEnergyState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      context.dispatch("getAllDocs");
    });
  },
  closeDB: (context: ActionContext<GhgReferenceEnergyState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getAllDocs: (context: ActionContext<GhgReferenceEnergyState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.query("configuration/list")
        .then(function (result) {
          context.commit("SET_ITEMS_LENGTH", result.total_rows);
          context.commit(
            "SET_ITEMS",
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
  updateDoc: (
    context: ActionContext<GhgReferenceEnergyState, RootState>,
    value
  ) => {
    context.commit("SET_ITEMS", value);
    const db = context.state.localCouch?.db;
    if (db) {
      db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
};

/** VuexStore */
const GhgReferenceModule: Module<GhgReferenceEnergyState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GhgReferenceModule;
