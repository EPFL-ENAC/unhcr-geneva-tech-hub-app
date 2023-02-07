import ConfigModule from "@/store/ConfigModule";
import EnergyModule from "@/store/EnergyModule";
import GhgModule from "@/store/GhgModule";
import GhgReferenceIgesGridModule from "@/store/GhgReferenceIgesGridModule";
import GhgReferenceModule from "@/store/GhgReferenceModule";
import GhgReferenceSolarModule from "@/store/GHGReferenceSolarModule";
import ShelterBillOfQuantitiesModule from "@/store/ShelterBillOfQuantitiesModule";
import ShelterModule from "@/store/ShelterModule";
import SheltersMaterialModule from "@/store/SheltersMaterialModule";
import SheltersTransportModule from "@/store/SheltersTransportModule";
import UNHCRLocation from "@/store/UNHCRLocation";

import UserModule from "@/store/UserModule";
import Vue from "vue";
import Vuex, {
  ActionContext,
  ActionTree,
  GetterTree,
  MutationTree,
  StoreOptions,
} from "vuex";
import VuexPersistence from "vuex-persist";

// import createPersistedState from 'vuex-persist-indexeddb';

Vue.use(Vuex);

/** Root State Interface */
export interface RootState {
  /* + Loading overlay */
  loading: boolean;
  /** ProgressBar Percentage */
  progress: number;
  /** SnackBar Text */
  message?: string;
  /** Error Message */
  error?: string;
  /** Hold value that say if referenceDataDrawer is open or not */
  referenceDataDrawer: boolean;
  overviewDataDrawer: boolean;
}

/** State Default value */
const state: RootState = {
  loading: false,
  progress: 0,
  message: undefined,
  error: undefined,
  referenceDataDrawer: false,
  overviewDataDrawer: false,
};

/** Getters */
const getters: GetterTree<RootState, RootState> = {
  loading: (s): boolean => s.loading,
  progress: (s): number => s.progress,
  message: (s): string | undefined => s.message,
  error: (s): string | undefined => s.error,
  referenceDataDrawer: (s): boolean => s.referenceDataDrawer,
  overviewDataDrawer: (s): boolean => s.overviewDataDrawer,
};

/** Mutations */
const mutations: MutationTree<RootState> = {
  /**
   * Store loading
   *
   * @param s - Vuex state
   * @param display - Payload
   */
  storeLoading(s, display: boolean) {
    s.loading = display;
  },
  /**
   * Store progress
   *
   * @param s - Vuex state
   * @param progres - Spayload
   */
  storeProgress(s, progress: number) {
    s.progress = progress;
    s.loading = true;
  },
  /**
   * Store snackbar text
   *
   * @param s - Vuex state
   * @param message - Payload
   */
  storeMessage(s, message: string) {
    s.message = message;
  },
  /**
   * Store error message
   *
   * @param s - Vuex state
   * @param error - Payload
   */
  storeError(s, error: string) {
    s.error = error;
  },
  /**
   * Store referenceDataDrawer on/off
   *
   * @param s - Vuex state
   * @param error - Payload
   */
  storeReferenceDataDrawer(s, value: boolean) {
    s.referenceDataDrawer = value;
  },
  storeOverviewDataDrawer(s, value: boolean) {
    s.overviewDataDrawer = value;
  },
};

/** Actions */
const actions: ActionTree<RootState, RootState> = {
  /**
   * Loading overlay visibility
   *
   * @param context - Vuex Context
   * @param display - Visibility
   */
  setLoading(context: ActionContext<RootState, RootState>, display: false) {
    context.commit("storeLoading", display);
  },
  /**
   * Loading progress bar value
   *
   * @param context - Vuex Context
   * @param progress - Percentage(0~100)
   */
  setProgress(context: ActionContext<RootState, RootState>, progress: 0) {
    context.commit("storeProgress", progress);
  },
  /**
   * Set snackbar message.
   *
   * @param context - Vuex Context
   * @param message - Message text
   */
  notifyUser(
    context: ActionContext<RootState, RootState>,
    message: string | undefined = undefined
  ) {
    context.commit("storeMessage", message);
  },
  /**
   * Set Error message
   *
   * @param context - Vuex Context
   * @param error - Error message etc.
   */
  setGlobalError(context: ActionContext<RootState, RootState>, error = null) {
    context.commit("storeError", error);
  },

  setReferenceDataDrawer(
    context: ActionContext<RootState, RootState>,
    referenceDataDrawer = false
  ) {
    context.commit("storeReferenceDataDrawer", referenceDataDrawer);
  },
  setOverviewDataDrawer(
    context: ActionContext<RootState, RootState>,
    overviewDataDrawer = false
  ) {
    context.commit("storeOverviewDataDrawer", overviewDataDrawer);
  },
  /**
   * toggleReferenceData
   */
  toggleReferenceData(context: ActionContext<RootState, RootState>) {
    context.commit(
      "storeReferenceDataDrawer",
      !context.state.referenceDataDrawer
    );
  },
  /**
   * toggleOverviewData
   */
  toggleOverviewData(context: ActionContext<RootState, RootState>) {
    context.commit(
      "storeOverviewDataDrawer",
      !context.state.overviewDataDrawer
    );
  },
};

/** VuexStore */
const store: StoreOptions<RootState> = {
  // https://vuex.vuejs.org/guide/strict.html#development-vs-production
  // PouchDB is modified outside
  strict: false,
  state,
  getters,
  mutations,
  actions,
  modules: {
    ConfigModule,
    ShelterModule,
    SheltersTransportModule,
    SheltersMaterialModule,
    ShelterBillOfQuantitiesModule,
    GhgModule,
    GhgReferenceModule,
    GhgReferenceIgesGridModule,
    GhgReferenceSolarModule,
    UNHCRLocation,
    UserModule,
    energy: EnergyModule,
  },
  plugins: [
    // store as session storage
    new VuexPersistence({
      key: process.env.VUE_APP_USER_NAMESPACE,
      storage: window.sessionStorage, //   storage: window.localStorage,
      modules: ["UserModule"],
    }).plugin,
    // store as Indexed DB (using vuex-persist-indexeddb)
    // createPersistedState({
    //   key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE,
    //   paths: ['SomeLargeModule'],
    // }),
  ],
};

const newStore = new Vuex.Store<RootState>(store);

export default newStore;
