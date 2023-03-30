import materialsReference from "@/assets/references/materials.json";
import { MaterialShape } from "@/store/ShelterInterface";
import { materialColors } from "@/utils/materialColors";

import { cloneDeep } from "lodash";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { RootState } from ".";

interface SheltersMaterialState {
  items: ShelterMaterial[];
  itemsLength: number;
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
  parameters?: Record<string, number> | null;
  color?: string; // hsl(34, 10%, 10%);
  _id: string; // "ALU-CPA_"
}

/** Default Configure state value */
function generateState(): SheltersMaterialState {
  return {
    items: materialsReference as ShelterMaterial[],
    itemsLength: materialsReference.length,
  };
}

/** Getters */
const getters: GetterTree<SheltersMaterialState, RootState> = {
  items: (s): ShelterMaterial[] => {
    const copyColors = cloneDeep(materialColors);
    return s.items.map((materialForm: ShelterMaterial) => {
      // we don't shift but pop, because =>
      // we want to keep the first value of array for the material itself
      materialForm.color = copyColors[materialForm.material].pop();
      return materialForm;
    }) as ShelterMaterial[];
  },
  itemsLength: (s): number => s.itemsLength,
  materials: (s): string[] => {
    return Array.from(new Set(s.items.map((x: ShelterMaterial) => x.material)));
  },
  materialForms: (s): Record<string, ShelterMaterial[]> => {
    return s.items.reduce(
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
  },
  materialMap: (s): Record<string, ShelterMaterial> => {
    return s.items.reduce(
      (acc: Record<string, ShelterMaterial>, el: ShelterMaterial) => {
        acc[el._id] = el;
        return acc;
      },
      {} as Record<string, ShelterMaterial>
    );
  },
};

/** Mutations */
const mutations: MutationTree<SheltersMaterialState> = {
  SET_ITEMS(state, value) {
    state.items = value;
  },
  SET_ITEMS_LENGTH(state, value) {
    state.itemsLength = value;
  },
};

/** Action */
const actions: ActionTree<SheltersMaterialState, RootState> = {};

/** VuexStore */
const ShelterMaterialsModule: Module<SheltersMaterialState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterMaterialsModule;
