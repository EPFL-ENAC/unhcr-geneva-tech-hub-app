import { Item, Material, Other } from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

interface BoqState {
  items: Item[];
  editedItem: Item;
  editedIndex: number;
  isItemDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
}

function getDefaultItem(): Item {
  return {
    _id: uuidv4(),
  } as Item;
}

function getDefaultMaterialItem(): Item {
  return {
    _id: uuidv4(),
    itemType: "Material",
  } as Material;
}

function getDefaultLabourItem(): Item {
  return {
    _id: uuidv4(),
    itemType: "Labour",
  } as Item;
}

function getDefaultOther(): Item {
  return {
    _id: uuidv4(),
    itemType: "Other",
    unit: "PCE",
  } as Other;
}

/** Default Configure state value */
function generateState(): BoqState {
  return {
    items: [],
    editedItem: getDefaultItem() as Item,
    editedIndex: -1,
    isItemDialogOpen: false,
    isDeleteDialogOpen: false,
  };
}

/** Getters */
const getters: GetterTree<BoqState, RootState> = {
  items: (s): Item[] | null => s.items,
  editedItem: (s): Item => s.editedItem,
  editedIndex: (s): number => s.editedIndex,
  isItemDialogOpen: (s): boolean => s.isItemDialogOpen, // works for new & edit
  isDeleteDialogOpen: (s): boolean => s.isDeleteDialogOpen,
};

/** Mutations */
const mutations: MutationTree<BoqState> = {
  SET_ITEMS(state: BoqState, items: Item[]): void {
    state.items = items ?? [];
  },
  ADD_ITEM(state: BoqState, item: Item): void {
    state.items.push(item);
  },
  DUPLICATE_ITEM(state: BoqState, item: Item): void {
    const newItem = cloneDeep(item);
    newItem._id = uuidv4();
    state.items.splice(state.editedIndex + 1, 0, newItem);
  },
  DELETE_ITEM(state: BoqState): void {
    state.items.splice(state.editedIndex, 1);
  },
  UPDATE_ITEM(state: BoqState, item: Item): void {
    state.items.splice(state.editedIndex, 1, item);
  },
  SET_EDITED_INDEX(state: BoqState, index: number): void {
    state.editedIndex = index;
  },
  SET_EDITED_INDEX_FOR_ITEM(state: BoqState, item: Item): void {
    state.editedIndex = state.items.findIndex((v) => v._id === item._id);
  },
  SET_EDITED_ITEM(state: BoqState, item: Item): void {
    state.editedItem = item;
  },
  RESET_EDITED_ITEM(state: BoqState): void {
    state.editedItem = getDefaultItem();
  },
  SET_EDIT_ITEM_DIALOG(state: BoqState, value: boolean): void {
    state.isItemDialogOpen = value;
  },
  SET_DELETE_ITEM_DIALOG(state: BoqState, value: boolean): void {
    state.isDeleteDialogOpen = value;
  },
};

/** Action */
const actions: ActionTree<BoqState, RootState> = {
  setItems: (context: ActionContext<BoqState, RootState>, items: Item[]) => {
    context.commit("SET_ITEMS", items);
  },
  openNewItemDialog: (context: ActionContext<BoqState, RootState>) => {
    // open dialog and set store item and index for future save
    context.commit("RESET_EDITED_ITEM");
    context.commit("SET_EDITED_INDEX", -1);
    context.commit("SET_EDIT_ITEM_DIALOG", true);
  },
  openEditItemDialog: (
    context: ActionContext<BoqState, RootState>,
    item: Item
  ) => {
    // open dialog and set store item and index for future save
    context.commit("SET_EDIT_ITEM_DIALOG", true);
    context.commit("SET_EDITED_INDEX_FOR_ITEM", item);
    return context.dispatch("setItem", item);
  },
  setItem: (context: ActionContext<BoqState, RootState>, item: Item) => {
    context.commit("SET_EDITED_ITEM", item);
  },
  setItemToDefaultLabour: (context: ActionContext<BoqState, RootState>) => {
    context.commit("SET_EDITED_ITEM", getDefaultLabourItem());
  },
  setItemToDefaultMaterial: (context: ActionContext<BoqState, RootState>) => {
    context.commit("SET_EDITED_ITEM", getDefaultMaterialItem());
  },
  setItemToDefaultOther: (context: ActionContext<BoqState, RootState>) => {
    context.commit("SET_EDITED_ITEM", getDefaultOther());
  },
  saveItem: (context: ActionContext<BoqState, RootState>, item: Item) => {
    if (context.state.editedIndex > -1) {
      context.commit("UPDATE_ITEM", item);
    } else {
      context.commit("ADD_ITEM", item);
    }
    context.dispatch("closeEditDialog");
  },
  duplicate: (context: ActionContext<BoqState, RootState>, item: Item) => {
    context.commit("SET_EDITED_INDEX_FOR_ITEM", item);
    context.commit("DUPLICATE_ITEM", item);
    // end
    context.commit("RESET_EDITED_ITEM");
  },
  closeEditDialog: (context: ActionContext<BoqState, RootState>) => {
    context.commit("SET_EDIT_ITEM_DIALOG", false);
  },
  setEditDialog: (
    context: ActionContext<BoqState, RootState>,
    value: boolean
  ) => {
    context.commit("SET_EDIT_ITEM_DIALOG", value);
  },
  deleteItem: (context: ActionContext<BoqState, RootState>, item: Item) => {
    context.commit("SET_EDITED_INDEX_FOR_ITEM", item);
    context.commit("DELETE_ITEM");
    context.commit("RESET_EDITED_ITEM");
  },
  openDeleteDialog: (
    context: ActionContext<BoqState, RootState>,
    item: Item
  ) => {
    context.commit("SET_DELETE_ITEM_DIALOG", true);
    context.commit("SET_EDITED_INDEX_FOR_ITEM", item);
  },
  deleteItemConfirmed: (context: ActionContext<BoqState, RootState>) => {
    context.commit("DELETE_ITEM");
    context.commit("RESET_EDITED_ITEM");
    return context.dispatch("closeDeleteDialog");
  },
  closeDeleteDialog: (context: ActionContext<BoqState, RootState>) => {
    context.commit("SET_DELETE_ITEM_DIALOG", false);
  },
  setDeleteDialog: (
    context: ActionContext<BoqState, RootState>,
    value: boolean
  ) => {
    context.commit("SET_DELETE_ITEM_DIALOG", value);
  },
};

/** VuexStore */
const ShelterBillOfQuantitiesModule: Module<BoqState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default ShelterBillOfQuantitiesModule;
