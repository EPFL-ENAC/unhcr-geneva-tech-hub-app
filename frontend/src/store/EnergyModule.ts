import { ExistingDocument } from "@/models/couchdbModel";
import {
  CookingFuel,
  CookingStove as CookingStove,
  ProjectDocument,
} from "@/models/energyModel";
import { DatabaseName, SyncDatabase } from "@/utils/couchdb";
import { sortBy } from "lodash";
import { Module } from "vuex";
import { RootState } from ".";

interface State {
  cookingFuelsDatabase?: SyncDatabase<CookingFuel>;
  cookingFuels: CookingFuel[];
  cookingStovesDatabase?: SyncDatabase<CookingStove>;
  cookingStoves: CookingStove[];
  sitesDatabase?: SyncDatabase<ProjectDocument>;
  sites: ExistingDocument<ProjectDocument>[];
  templatesDatabase?: SyncDatabase<ProjectDocument>;
  templates: ExistingDocument<ProjectDocument>[];
}

enum MutationTypes {
  SetCookingFuelsDatabase = "SetCookingFuelsDatabase",
  SetCookingFuels = "SetCookingFuels",
  SetCookingStovesDatabase = "SetCookingStovesDatabase",
  SetCookingStoves = "SetCookingStoves",
  SetSitesDatabase = "SetSitesDatabase",
  SetSites = "SetSites",
  SetTemplatesDatabase = "SetTemplatesDatabase",
  SetTemplates = "SetTemplates",
}

export enum ActionTypes {
  Created = "Created",
  Destroyed = "Destroyed",
  UpdateCookingFuels = "UpdateCookingFuels",
  UpdateCookingStoves = "UpdateCookingStoves",
  UpdateSites = "UpdateSites",
  UpdateTemplates = "UpdateTemplates",
}

const energyModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    cookingFuels: [],
    cookingStoves: [],
    sites: [],
    templates: [],
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
    [MutationTypes.SetTemplatesDatabase](
      state,
      value: SyncDatabase<ProjectDocument>
    ) {
      state.templatesDatabase = value;
    },
    [MutationTypes.SetTemplates](
      state,
      value: ExistingDocument<ProjectDocument>[]
    ) {
      state.templates = value;
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

      const sitesDatabase = new SyncDatabase<ProjectDocument>(
        DatabaseName.EnergySites
      );
      sitesDatabase.onChange(() => context.dispatch(ActionTypes.UpdateSites));
      context.commit(MutationTypes.SetSitesDatabase, sitesDatabase);
      context.dispatch(ActionTypes.UpdateSites);

      const templatesDatabase = new SyncDatabase<ProjectDocument>(
        DatabaseName.EnergyTemplates
      );
      templatesDatabase.onChange(() =>
        context.dispatch(ActionTypes.UpdateTemplates)
      );
      context.commit(MutationTypes.SetTemplatesDatabase, templatesDatabase);
      context.dispatch(ActionTypes.UpdateTemplates);
    },
    [ActionTypes.Destroyed](context) {
      context.state.cookingFuelsDatabase?.cancel();
      context.state.cookingStovesDatabase?.cancel();
      context.state.sitesDatabase?.cancel();
      context.state.templatesDatabase?.cancel();
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
    [ActionTypes.UpdateTemplates](context) {
      context.state.templatesDatabase
        ?.getDocuments()
        .then((documents) =>
          context.commit(MutationTypes.SetTemplates, documents)
        );
    },
  },
};

export default energyModule;
