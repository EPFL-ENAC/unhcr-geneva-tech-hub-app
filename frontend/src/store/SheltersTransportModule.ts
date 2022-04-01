import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";

import { RootState } from ".";
import { SyncDatabase } from "@/utils/couchdb";

interface SheltersTransportState {
  item: ShelterTransport;
  items: ShelterTransport[];
  localCouch: SyncDatabase<ShelterTransport> | null;
  paginate: Paginate;
  itemsLength: number;
}

export interface Paginate {
  limit: number;
  skip?: number;
  startkey?: string;
}

/*
** Local materials as defined by André Ullal @epfl.ch
  Clay
  Earth, soil, clay, mud
  Grass, straw
  Sand
  Stone
*/
interface ShelterTransport {
  _id: string; // 'AAA_BBB' source country (AAA) / destination country (BBB) in iso3166 3 letters
  t: number; // Transport   embodied carbon  kgCO2/kg (i.e. local materials)
  o: number; // Transport   embodied carbon  kgCO2/kg (all others materials)
}

const DB_NAME = "shelters_transport";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): SheltersTransportState {
  return {
    item: {} as ShelterTransport,
    items: [] as ShelterTransport[],
    localCouch: null,
    paginate: {
      limit: 10,
      skip: 0,
    },
    itemsLength: 0,
  };
}

/** Getters */
const getters: GetterTree<SheltersTransportState, RootState> = {
  item: (s): ShelterTransport => s.item,
  items: (s): ShelterTransport[] => s.items,
  paginate: (s): Paginate => s.paginate,
  itemsLength: (s): number => s.itemsLength,
};

/** Mutations */
const mutations: MutationTree<SheltersTransportState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_ITEM(state, value) {
    state.item = value;
  },
  SET_ITEMS(state, value) {
    state.items = value;
  },
  SET_PAGINATE(state, value) {
    state.paginate = value;
  },
  SET_ITEMS_LENGTH(state, value) {
    state.itemsLength = value;
  },
};

/** Action */
const actions: ActionTree<SheltersTransportState, RootState> = {
  syncDB: (context: ActionContext<SheltersTransportState, RootState>) => {
    context.commit("INIT_DB");
    // const localCouch = context.state.localCouch;
    // localCouch?.onChange(function () {
    //   // TODO retrieve all documents on remote change only
    // });
  },
  closeDB: (context: ActionContext<SheltersTransportState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDoc: (context: ActionContext<SheltersTransportState, RootState>, id) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.get(id)
        .then(function (result) {
          context.commit("SET_ITEM", result);
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  changePaginate: (
    context: ActionContext<SheltersTransportState, RootState>,
    paginate: Paginate
  ) => {
    // compage paginate and current paginate to avoid infinite loop.
    const hasSameLimit = paginate.limit === context.state.paginate.limit;
    const hasSameSkip = paginate.skip === context.state.paginate.skip;
    if (hasSameLimit && hasSameSkip) {
      return;
    }
    context.commit("SET_PAGINATE", paginate);
    return context.dispatch("getAllDocs");
  },
  // we need pagination for this; not ready for startKey/endKey with vuetify
  //https://pouchdb.com/2014/04/14/pagination-strategies-with-pouchdb.html
  getAllDocs: (context: ActionContext<SheltersTransportState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.allDocs({
        include_docs: true,
        ...context.state.paginate,
      })
        .then(function (result) {
          context.commit("SET_ITEMS_LENGTH", result.total_rows);
          context.commit(
            "SET_ITEMS",
            result.rows.map((x) => x.doc)
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
    context: ActionContext<SheltersTransportState, RootState>,
    value
  ) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
};

/** VuexStore */
const ShelterMaterialsModule: Module<SheltersTransportState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterMaterialsModule;
