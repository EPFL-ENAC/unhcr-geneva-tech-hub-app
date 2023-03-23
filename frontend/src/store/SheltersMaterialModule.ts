import materialsReference from "@/assets/references/materials.json";
import { MaterialShape } from "@/store/ShelterInterface";
import { materialColors } from "@/utils/materialColors";

import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface SheltersMaterialState {
  item: ShelterMaterial;
  items: ShelterMaterial[];
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
  shape: MaterialShape;
  parameters?: Record<string, number>;
  color?: string; // hsl(34, 10%, 10%);
  _id: string; // "ALU-CPA_"
}

/** Default Configure state value */
function generateState(): SheltersMaterialState {
  return {
    item: {} as ShelterMaterial,
    items: [] as ShelterMaterial[],

    materials: [],
    materialForms: {},
    materialMap: {},

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
  getAllDocs: (context: ActionContext<SheltersMaterialState, RootState>) => {
    context.commit("SET_ITEMS_LENGTH", materialsReference.length);
    context.commit("SET_ITEMS", materialsReference);
    context.dispatch("setMaterialForm", materialsReference);
  },

  setMaterialForm: (
    context: ActionContext<SheltersMaterialState, RootState>,
    materialFormList
  ) => {
    if (materialFormList) {
      const copyColors = JSON.parse(JSON.stringify(materialColors));
      const value = materialFormList.map((materialForm: ShelterMaterial) => {
        // we don't shift but pop, because =>
        // we want to keep the first value of array for the material itself
        materialForm.color = copyColors[materialForm.material].pop();
        return materialForm;
      }) as ShelterMaterial[];
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
