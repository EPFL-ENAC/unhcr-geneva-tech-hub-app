import { ShelterMaterial } from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface SheltersMaterialsState {
  materials: ShelterMaterial[];
  material: ShelterMaterial;
  localCouch: SyncDatabase<ShelterMaterial> | null;
}

const DB_NAME = "shelters_materials";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): SheltersMaterialsState {
  return {
    materials: [] as ShelterMaterial[],
    material: {} as ShelterMaterial,
    localCouch: null,
  };
}

/** Getters */
const getters: GetterTree<SheltersMaterialsState, RootState> = {
  materials: (s): ShelterMaterial[] => s.materials,
};

/** Mutations */
const mutations: MutationTree<SheltersMaterialsState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_MATERIALS(state, value) {
    state.materials = value;
  },
};

/** Action */
const actions: ActionTree<SheltersMaterialsState, RootState> = {
  syncDB: (context: ActionContext<SheltersMaterialsState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      // TODO retrieve all documents ?
      context.dispatch("getAllDocs");
      // TODO do something better
      // context.dispatch("getDoc", context.state.material?._id);
    });
  },
  closeDB: (context: ActionContext<SheltersMaterialsState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDoc: (context: ActionContext<SheltersMaterialsState, RootState>, id) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.get(id)
        .then(function (result) {
          console.log(result);
          context.commit("SET_MATERIAL", result);
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },

  getAllDocs: (context: ActionContext<SheltersMaterialsState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.allDocs({
        include_docs: true,
      })
        .then(function (result) {
          context.commit(
            "SET_MATERIALS",
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
    context: ActionContext<SheltersMaterialsState, RootState>,
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
const ShelterMaterialsModule: Module<SheltersMaterialsState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterMaterialsModule;
