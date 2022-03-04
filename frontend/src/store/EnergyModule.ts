import { Cooking } from "@/models/energyModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import { Module } from "vuex";
import { RootState } from ".";

interface State {
  cookingDatabase?: SyncDatabase<Cooking>;
  cookings: Cooking[];
}

enum MutationTypes {
  SetCookingDatabase = "SetCookingDatabase",
  SetCookings = "SetCookings",
}

export enum ActionTypes {
  Created = "SetCookingDatabase",
  Destroyed = "SetCookings",
  UpdateCookings = "UpdateCookings",
}

const energyModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    cookings: [],
  },
  mutations: {
    [MutationTypes.SetCookingDatabase](
      state,
      cookingDatabase: SyncDatabase<Cooking>
    ) {
      state.cookingDatabase = cookingDatabase;
    },
    [MutationTypes.SetCookings](state, cookings: Cooking[]) {
      state.cookings = cookings;
    },
  },
  actions: {
    [ActionTypes.Created](context) {
      const cookingDatabase = createSyncDatabase<Cooking>("energy_cookings");
      cookingDatabase.onChange(() =>
        context.dispatch(ActionTypes.UpdateCookings)
      );
      context.commit(MutationTypes.SetCookingDatabase, cookingDatabase);
      context.dispatch(ActionTypes.UpdateCookings);
    },
    [ActionTypes.Destroyed](context) {
      context.state.cookingDatabase?.cancel();
    },
    [ActionTypes.UpdateCookings](context) {
      context.state.cookingDatabase
        ?.getAllDocuments()
        .then((documents) =>
          context.commit(MutationTypes.SetCookings, documents)
        );
    },
  },
};

export default energyModule;
