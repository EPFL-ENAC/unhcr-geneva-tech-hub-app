import { ExistingDocument } from "@/models/couchdbModel";
import {
  CookingFuel,
  CookingStove,
  ProjectDocument,
} from "@/models/energyModel";
import { DatabaseName, SyncDatabase } from "@/utils/couchdb";
import { sortBy } from "lodash";
import { ActionContext, Module } from "vuex";
import { RootState } from ".";

interface State {
  cookingFuelsDatabase?: SyncDatabase<CookingFuel>;
  cookingFuels: CookingFuel[];
  cookingStovesDatabase?: SyncDatabase<CookingStove>;
  cookingStoves: CookingStove[];
  sitesDatabase?: SyncDatabase<ProjectDocument>;
  sites: ExistingDocument<ProjectDocument>[];
}

enum MutationTypes {
  SetCookingFuelsDatabase = "SetCookingFuelsDatabase",
  SetCookingFuels = "SetCookingFuels",
  SetCookingStovesDatabase = "SetCookingStovesDatabase",
  SetCookingStoves = "SetCookingStoves",
  SetSitesDatabase = "SetSitesDatabase",
  SetSites = "SetSites",
}

export enum ActionTypes {
  Created = "Created",
  Destroyed = "Destroyed",
  UpdateCookingFuels = "UpdateCookingFuels",
  UpdateCookingStoves = "UpdateCookingStoves",
  UpdateSites = "UpdateSites",
}

function createDatabase<T>(
  context: ActionContext<State, RootState>,
  databaseName: DatabaseName,
  setDatabaseMutation: MutationTypes,
  updateDocumentsAction: ActionTypes
): void {
  const database = new SyncDatabase<T>(databaseName);
  database.onChange(() => context.dispatch(updateDocumentsAction));
  context.commit(setDatabaseMutation, database);
  context.dispatch(updateDocumentsAction);
}

const energyModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    cookingFuels: [],
    cookingStoves: [],
    sites: [],
  },
  mutations: {
    [MutationTypes.SetCookingFuelsDatabase](
      state,
      value: SyncDatabase<CookingFuel>
    ) {
      state.cookingFuelsDatabase = value;
    },
    [MutationTypes.SetCookingFuels](state, value: CookingFuel[]) {
      state.cookingFuels = sortBy(value, (item) => item.index);
    },
    [MutationTypes.SetCookingStovesDatabase](
      state,
      value: SyncDatabase<CookingStove>
    ) {
      state.cookingStovesDatabase = value;
    },
    [MutationTypes.SetCookingStoves](state, value: CookingStove[]) {
      state.cookingStoves = sortBy(value, (item) => item.index);
    },
    [MutationTypes.SetSitesDatabase](
      state,
      value: SyncDatabase<ProjectDocument>
    ) {
      state.sitesDatabase = value;
    },
    [MutationTypes.SetSites](
      state,
      value: ExistingDocument<ProjectDocument>[]
    ) {
      state.sites = value;
    },
  },
  actions: {
    [ActionTypes.Created](context) {
      createDatabase(
        context,
        DatabaseName.EnergyCookingStoves,
        MutationTypes.SetCookingStovesDatabase,
        ActionTypes.UpdateCookingStoves
      );

      createDatabase(
        context,
        DatabaseName.EnergyCookingFuels,
        MutationTypes.SetCookingFuelsDatabase,
        ActionTypes.UpdateCookingFuels
      );

      createDatabase(
        context,
        DatabaseName.EnergySites,
        MutationTypes.SetSitesDatabase,
        ActionTypes.UpdateSites
      );
    },
    [ActionTypes.Destroyed](context) {
      context.state.cookingFuelsDatabase?.cancel();
      context.state.cookingStovesDatabase?.cancel();
      context.state.sitesDatabase?.cancel();
    },
    [ActionTypes.UpdateCookingFuels](context) {
      context.state.cookingFuelsDatabase
        ?.getDocuments()
        .then((documents) =>
          context.commit(MutationTypes.SetCookingFuels, documents)
        );
    },
    [ActionTypes.UpdateCookingStoves](context) {
      context.state.cookingStovesDatabase
        ?.getDocuments()
        .then((documents) =>
          context.commit(MutationTypes.SetCookingStoves, documents)
        );
    },
    [ActionTypes.UpdateSites](context) {
      context.state.sitesDatabase
        ?.getDocuments()
        .then((documents) => context.commit(MutationTypes.SetSites, documents));
    },
  },
};

export default energyModule;
