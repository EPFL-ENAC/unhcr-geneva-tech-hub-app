import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";

import { RootState } from ".";
import { SyncDatabase } from "@/utils/couchdb";

interface SheltersMaterialState {
  item: ShelterMaterial;
  items: ShelterMaterial[];
  localCouch: SyncDatabase<ShelterMaterial> | null;
  paginate: Paginate;
  itemsLength: number;

  materialForms: Record<string, ShelterMaterial[]>;
  materials: string[];
  materialMap: Record<string, ShelterMaterial>;
}

export interface Paginate {
  limit: number;
  skip?: number;
  startkey?: string;
}

export interface ShelterMaterial {
  local: boolean; //
  density: number;
  density_ref: string; //"ICE DB V2.0 (2011)"
  density_unit: string; //"kg/m3"
  embodied_carbon: number; // kgCO2e/kg
  embodied_carbon_ref: string; //"ICE DB V3.0 (10.11.2019)"
  embodied_water: number; //
  embodied_water_ref: string; //"EcoInvent 3.8, aluminium alloy production, Metallic Matrix Composite, GLO (Global)"
  form: string; // "Composite panel"
  material: string; //"Aluminium"
  units: string[]; //['KG', 'M2', 'PCE']
  _id: string; // "ALU-CPA_"
}

const DB_NAME = "shelters_materials";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";

/** Default Configure state value */
function generateState(): SheltersMaterialState {
  return {
    item: {} as ShelterMaterial,
    items: [] as ShelterMaterial[],

    materials: [],
    materialForms: {},
    materialMap: {},

    localCouch: null,
    paginate: {
      limit: 10,
      skip: 0,
    },
    itemsLength: 0,
  };
}

/** Getters */
const getters: GetterTree<SheltersMaterialState, RootState> = {
  item: (s): ShelterMaterial => s.item,
  items: (s): ShelterMaterial[] => s.items,
  paginate: (s): Paginate => s.paginate,
  itemsLength: (s): number => s.itemsLength,
  materials: (s): string[] => s.materials,
  materialForms: (s): Record<string, ShelterMaterial[]> => s.materialForms,
  materialMap: (s): Record<string, ShelterMaterial> => s.materialMap,
};

/** Mutations */
const mutations: MutationTree<SheltersMaterialState> = {
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
const actions: ActionTree<SheltersMaterialState, RootState> = {
  syncDB: (context: ActionContext<SheltersMaterialState, RootState>) => {
    context.commit("INIT_DB");
    const localCouch = context.state.localCouch;
    localCouch?.onChange(function () {
      context.dispatch("getAllDocs");
    });
  },
  closeDB: (context: ActionContext<SheltersMaterialState, RootState>) => {
    context.commit("CLOSE_DB");
  },
  getDoc: (context: ActionContext<SheltersMaterialState, RootState>, id) => {
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
    context: ActionContext<SheltersMaterialState, RootState>,
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
  getAllDocs: (context: ActionContext<SheltersMaterialState, RootState>) => {
    const db = context.state.localCouch?.db;
    if (db) {
      db.query("configuration/list")
        .then(function (result) {
          context.commit("SET_ITEMS_LENGTH", result.total_rows);
          const materials = result.rows.map((x) => x.value);
          context.commit("SET_ITEMS", materials);
          context.dispatch("setMaterialForm", materials);
        })
        .catch(function (err: Error) {
          console.log(err);
        });
    } else {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
  },

  setMaterialForm: (
    context: ActionContext<SheltersMaterialState, RootState>,
    value
  ) => {
    if (value) {
      const materials = Array.from(
        new Set(value.map((x: ShelterMaterial) => x.material))
      );
      context.commit("SET_MATERIALS", materials);

      const materialForms = value.reduce(
        (acc: Record<string, ShelterMaterial[]>, el: ShelterMaterial) => {
          if (!acc[el.material]) {
            acc[el.material] = [];
          }
          acc[el.material] = !acc[el.material] ? [] : acc[el.material];
          acc[el.material].push({
            ...el,
          });
          return acc;
        },
        {} as Record<string, ShelterMaterial[]>
      );
      context.commit("SET_MATERIAL_FORM", materialForms);
      const formIdMap = value.reduce(
        (acc: Record<string, ShelterMaterial>, el: ShelterMaterial) => {
          acc[el._id] = el;
          return acc;
        },
        {} as Record<string, ShelterMaterial>
      );
      context.commit("SET_MATERIAL_MAP", formIdMap);
    }
  },

  updateDoc: (
    context: ActionContext<SheltersMaterialState, RootState>,
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
const ShelterMaterialsModule: Module<SheltersMaterialState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterMaterialsModule;
