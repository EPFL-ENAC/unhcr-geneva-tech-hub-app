import {
  CookingFuel,
  CookingStove as CookingStove,
} from "@/models/energyModel";
import { DatabaseName, SyncDatabase } from "@/utils/couchdb";
import { Module } from "vuex";
import { RootState } from ".";

interface State {
  cookingFuelsDatabase?: SyncDatabase<CookingFuel>;
  cookingFuels: CookingFuel[];
  cookingStovesDatabase?: SyncDatabase<CookingStove>;
  cookingStoves: CookingStove[];
}

enum MutationTypes {
  SetCookingFuelsDatabase = "SetCookingFuelsDatabase",
  SetCookingFuels = "SetCookingFuels",
  SetCookingStovesDatabase = "SetCookingStovesDatabase",
  SetCookingStoves = "SetCookingStoves",
}

export enum ActionTypes {
  Created = "SetCookingDatabase",
  Destroyed = "SetCookings",
  UpdateCookingFuels = "UpdateCookingFuels",
  UpdateCookingStoves = "UpdateCookingStoves",
}

const energyModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    cookingFuels: [],
    cookingStoves: [],
  },
  mutations: {
    [MutationTypes.SetCookingFuelsDatabase](
      state,
      value: SyncDatabase<CookingFuel>
    ) {
      state.cookingFuelsDatabase = value;
    },
    [MutationTypes.SetCookingFuels](state, value: CookingFuel[]) {
      state.cookingFuels = value;
    },
    [MutationTypes.SetCookingStovesDatabase](
      state,
      value: SyncDatabase<CookingStove>
    ) {
      state.cookingStovesDatabase = value;
    },
    [MutationTypes.SetCookingStoves](state, value: CookingStove[]) {
      state.cookingStoves = value;
    },
  },
  actions: {
    [ActionTypes.Created](context) {
      const cookingStovesDatabase = new SyncDatabase<CookingStove>(
        DatabaseName.EnergyCookingStoves
      );
      cookingStovesDatabase.onChange(() =>
        context.dispatch(ActionTypes.UpdateCookingStoves)
      );
      context.commit(
        MutationTypes.SetCookingStovesDatabase,
        cookingStovesDatabase
      );
      context.dispatch(ActionTypes.UpdateCookingStoves);

      const cookingFuelsDatabase = new SyncDatabase<CookingFuel>(
        DatabaseName.EnergyCookingFuels
      );
      cookingFuelsDatabase.onChange(() =>
        context.dispatch(ActionTypes.UpdateCookingFuels)
      );
      context.commit(
        MutationTypes.SetCookingFuelsDatabase,
        cookingFuelsDatabase
      );
      context.dispatch(ActionTypes.UpdateCookingFuels);
    },
    [ActionTypes.Destroyed](context) {
      context.state.cookingFuelsDatabase?.cancel();
      context.state.cookingStovesDatabase?.cancel();
    },
    [ActionTypes.UpdateCookingFuels](context) {
      context.state.cookingFuelsDatabase
        ?.getAllDocuments()
        .then((documents) =>
          context.commit(MutationTypes.SetCookingFuels, documents)
        );
    },
    [ActionTypes.UpdateCookingStoves](context) {
      context.state.cookingStovesDatabase
        ?.getAllDocuments()
        .then((documents) =>
          context.commit(MutationTypes.SetCookingStoves, documents)
        );
    },
  },
};

export default energyModule;
