import ghg_emission_factors from "@/assets/references/ghg_emission_factors.json";
import { GetterTree, Module } from "vuex";
import { RootState } from ".";

export type ItemReferencesMap = Record<string, ReferenceItemInterface>;
export type referenceType = "number" | "percentage";
export interface ReferenceItemInterface {
  _id: string;
  description: string;
  value: number;
  type?: string; // number or percentage
  source?: string | string[] | null;
  category?: string[];
  subcat?: string[];
  index?: number;
}

/** Getters */
const getters: GetterTree<null, RootState> = {
  items: (): ReferenceItemInterface[] | null => ghg_emission_factors,
  ghgMapRef: (): ItemReferencesMap | undefined => {
    if (!ghg_emission_factors) {
      return undefined;
    }
    return ghg_emission_factors.reduce(
      (acc: ItemReferencesMap, item: ReferenceItemInterface) => {
        acc[item._id] = item;
        return acc;
      },
      {} as ItemReferencesMap
    );
  },
};

/** VuexStore */
const GhgReferenceModule: Module<null, RootState> = {
  namespaced: true,
  state: undefined,
  getters,
  mutations: undefined,
  actions: undefined,
};

export default GhgReferenceModule;
