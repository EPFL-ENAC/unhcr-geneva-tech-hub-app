import ghg_reference from "@/assets/references/ghg_reference.json";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

export type ItemReferencesMap = Record<string, ReferenceItemInterface>;
export type referenceType = "number" | "percentage";
export interface ReferenceItemInterface {
  _id: string;
  description: string;
  value: number;
  type?: string; // number or percentage
  source?: string | null;
  category?: string;
  index?: number;
}

interface GhgReferenceModuleState {
  item: ReferenceItemInterface;
}

/** Default Configure state value */
function generateState(): GhgReferenceModuleState {
  return {
    item: {} as ReferenceItemInterface,
  };
}
const MSG_COULD_NOT_FIND_ITEM = "Could not find item with this id";

/** Getters */
const getters: GetterTree<GhgReferenceModuleState, RootState> = {
  items: (): ReferenceItemInterface[] | null => ghg_reference,
  ghgMapRef: (s): ItemReferencesMap | undefined => {
    if (!ghg_reference) {
      return undefined;
    }
    return ghg_reference.reduce(
      (acc: ItemReferencesMap, item: ReferenceItemInterface) => {
        acc[item._id] = item;
        return acc;
      },
      {} as ItemReferencesMap
    );
  },
};

/** Mutations */
const mutations: MutationTree<GhgReferenceModuleState> = {
  SET_ITEM(state, value) {
    state.item = value;
  },
};

/** Action */
const actions: ActionTree<GhgReferenceModuleState, RootState> = {
  getDoc: (
    context: ActionContext<GhgReferenceModuleState, RootState>,
    id: string
  ): ReferenceItemInterface | undefined => {
    const foundItem = ghg_reference.find((item) => item._id === id);
    if (foundItem) {
      context.commit("SET_ITEM", foundItem);
    } else {
      console.log(MSG_COULD_NOT_FIND_ITEM);
    }
    return foundItem;
  },
};

/** VuexStore */
const GhgReferenceModule: Module<GhgReferenceModuleState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default GhgReferenceModule;
