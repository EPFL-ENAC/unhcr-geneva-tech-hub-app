import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface UNHCRLocationState {
  item: UNHCRLocation;
  items: UNHCRLocation[];
  paginate: Paginate;
  itemsLength: number;
  localCouch: SyncDatabase<UNHCRLocationState> | null;
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
export interface UNHCRLocation {
  _rev?: string;
  _id: string; // "Abazar : Point",
  Country: string; // "IR",
  Population: number;
  "Location id": number;
  latitude: number; //: 28.978026
  longitude: number; // : 50.8379918,
  "GHI/Daily_solar_peak_hours": number; // 5.607999802,
}

const MSG_COULD_NOT_FIND_ITEM = "Could not find item with this id";
const DB_NAME = "unhcr_location";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): UNHCRLocationState {
  return {
    item: {} as UNHCRLocation,
    items: [],
    paginate: {
      limit: 10,
      skip: 0,
    },
    itemsLength: 0,
    localCouch: null,
  };
}

/** Getters */
const getters: GetterTree<UNHCRLocationState, RootState> = {
  item: (s): UNHCRLocation => s.item,
  items: (s): UNHCRLocation[] => s.items,
  paginate: (s): Paginate => s.paginate,
  itemsLength: (s): number => s.itemsLength,
};

/** Mutations */
const mutations: MutationTree<UNHCRLocationState> = {
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
const actions: ActionTree<UNHCRLocationState, RootState> = {
  syncDB: (context: ActionContext<UNHCRLocationState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      // todo: we should throttle this to avoid 10000 calls
      context.dispatch("getAllDocs");
    });
  },
  closeDB: (context: ActionContext<UNHCRLocationState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getAllDocs: async (context: ActionContext<UNHCRLocationState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      try {
        const result = await db.allDocs({
          include_docs: true,
          limit: 250,
          skip: 0,
        });

        context.commit("SET_ITEMS_LENGTH", result.total_rows);
        context.commit(
          "SET_ITEMS",
          result.rows.map((x) => x.doc)
        );
      } catch (err) {
        throw new Error(MSG_COULD_NOT_FIND_ITEM);
      }
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
};

/** VuexStore */
const ShelterMaterialsModule: Module<UNHCRLocationState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterMaterialsModule;
