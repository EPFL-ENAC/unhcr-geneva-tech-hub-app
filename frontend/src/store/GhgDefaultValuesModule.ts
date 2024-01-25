import ghg_default_value from "@/assets/references/ghg_default_value.json";
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
  items: (): ReferenceItemInterface[] | null => ghg_default_value,
  ghgMapDefaultValue: (): ItemReferencesMap | undefined => {
    if (!ghg_default_value) {
      return undefined;
    }
    return ghg_default_value.reduce(
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
