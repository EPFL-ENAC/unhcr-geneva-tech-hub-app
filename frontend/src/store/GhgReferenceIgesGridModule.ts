import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

export interface IgesItemInterface {
  name: string;
  value: number;
  _id: string;
}

interface GhgReferenceIgesGridState {
  items: IgesItemInterface | null;
  itemsLength: number;
  localCouch: SyncDatabase<IgesItemInterface> | null;
}

const DB_NAME = "ghg_reference_iges_grid_2021";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): GhgReferenceIgesGridState {
  return {
    items: null,
    itemsLength: 0,
    localCouch: null,
  };
}

/** Getters */
const getters: GetterTree<GhgReferenceIgesGridState, RootState> = {
  iges_grid_2021: (s): IgesItemInterface | null => s.items,
};

/** Mutations */
const mutations: MutationTree<GhgReferenceIgesGridState> = {
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
const actions: ActionTree<GhgReferenceIgesGridState, RootState> = {
  syncDB: (context: ActionContext<GhgReferenceIgesGridState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      context.dispatch("getAllDocs");
    });
  },
  closeDB: (context: ActionContext<GhgReferenceIgesGridState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getAllDocs: (
    context: ActionContext<GhgReferenceIgesGridState, RootState>
  ) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.query("countries/list")
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
    context: ActionContext<GhgReferenceIgesGridState, RootState>,
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
const GhgReferenceModule: Module<GhgReferenceIgesGridState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GhgReferenceModule;
