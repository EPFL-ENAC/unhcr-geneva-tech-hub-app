import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";

import { GreenHouseGazReference } from "@/store/GhgInterface";
import { MaterialReferenceData } from "@/store/ShelterInterface";
import { RootState } from ".";
import { SyncDatabase } from "@/utils/couchdb";

interface GhgReferenceState {
  reference: GreenHouseGazReference | null;
  localCouch: SyncDatabase<GreenHouseGazReference> | null;
  materialForms: Record<string, MaterialReferenceData[]>;
  materials: string[];
  materialMap: Record<string, MaterialReferenceData>;
}

const DB_NAME = "ghg_reference";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): GhgReferenceState {
  return {
    reference: null,
    localCouch: null,
    materials: [],
    materialForms: {},
    materialMap: {},
  };
}

/** Getters */
const getters: GetterTree<GhgReferenceState, RootState> = {
  reference: (s): GreenHouseGazReference | null => s.reference,
  materials: (s): string[] => s.materials,
  materialForms: (s): Record<string, MaterialReferenceData[]> =>
    s.materialForms,
  materialMap: (s): Record<string, MaterialReferenceData> => s.materialMap,
};

/** Mutations */
const mutations: MutationTree<GhgReferenceState> = {
  INIT_DB(state) {
    state.localCouch = new SyncDatabase(DB_NAME);
  },
  CLOSE_DB(state) {
    state.localCouch?.cancel();
  },
  SET_REFERENCE(state, value) {
    state.reference = value;
  },
  SET_MATERIALS(state, value) {
    state.materials = value;
  },
  SET_MATERIAL_FORM(state, value) {
    state.materialForms = value;
  },
  SET_MATERIAL_MAP(state, value) {
    state.materialMap = value;
  },
};

/** Action */
const actions: ActionTree<GhgReferenceState, RootState> = {
  syncDB: (context: ActionContext<GhgReferenceState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;

    localCouch?.onChange(function () {
      context.dispatch("getDoc", context.state.reference?._id);
    });
  },
  closeDB: (context: ActionContext<GhgReferenceState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDoc: (context: ActionContext<GhgReferenceState, RootState>, id) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.get(id)
        .then(function (result) {
          context.commit("SET_REFERENCE", result);
          context.dispatch("setMaterialForm", result.materials);
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
  setMaterialForm: (
    context: ActionContext<GhgReferenceState, RootState>,
    value
  ) => {
    if (value) {
      const materials = Array.from(
        new Set(value.map((x: MaterialReferenceData) => x.material))
      );
      context.commit("SET_MATERIALS", materials);

      const materialForms = value.reduce(
        (
          acc: Record<string, MaterialReferenceData[]>,
          el: MaterialReferenceData
        ) => {
          if (!acc[el.material]) {
            acc[el.material] = [];
          }
          acc[el.material] = !acc[el.material] ? [] : acc[el.material];
          acc[el.material].push({
            ...el,
          });
          return acc;
        },
        {} as Record<string, MaterialReferenceData[]>
      );
      context.commit("SET_MATERIAL_FORM", materialForms);
      const formIdMap = value.reduce(
        (
          acc: Record<string, MaterialReferenceData>,
          el: MaterialReferenceData
        ) => {
          acc[el._id] = el;
          return acc;
        },
        {} as Record<string, MaterialReferenceData>
      );
      context.commit("SET_MATERIAL_MAP", formIdMap);
    }
  },

  updateDoc: (context: ActionContext<GhgReferenceState, RootState>, value) => {
    context.commit("SET_REFERENCE", value);
    const db = context.state.localCouch?.db;
    if (db) {
      db.put(value);
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },
};

/** VuexStore */
const GhgReferenceModule: Module<GhgReferenceState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GhgReferenceModule;
