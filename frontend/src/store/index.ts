import { env } from "@/config";
import { themeColor } from "@/plugins/vuetify";
import router from "@/router/index";
import GhgDefaultValuesModule from "@/store/GhgDefaultValuesModule";
import GhgModule from "@/store/GhgModule";
import GHGReferenceBioWasteModule from "@/store/GHGReferenceBioWasteModule";
import GHGReferencefNRB from "@/store/GHGReferencefNRB";
import GhgReferenceGridModule from "@/store/GhgReferenceGridModule";
import GhgReferenceModule from "@/store/GhgReferenceModule";
import GHGReferenceNonBioWasteModule from "@/store/GHGReferenceNonBioWasteModule";
import GhgReferenceRegionModule from "@/store/GHGReferenceRegionModule";
import GhgReferenceSolarModule from "@/store/GHGReferenceSolarModule";
import ShelterBillOfQuantitiesModule from "@/store/ShelterBillOfQuantitiesModule";
import ShelterModule from "@/store/ShelterModule";
import SheltersMaterialModule from "@/store/SheltersMaterialModule";
import UNHCRLocationModule from "@/store/UNHCRLocationModule";
import UserModule from "@/store/UserModule";
import { throttle } from "lodash";
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
  /** hold notifications with an expiration */
  notifications: UnhcrNotification[];
  /** Hold value that say if referenceDataDrawer is open or not */
  referenceDataDrawer: boolean;
  overviewDataDrawer: boolean;
  notificationDialog: boolean;
  helper?: Record<string, string>;
  helperDialog: boolean;
}

export interface UnhcrNotification {
  title?: string | undefined;
  message: string;
  date?: string | undefined; // as new Date(),
  type?: string | undefined; // error/warning/info;
  stack?: string | undefined;
  expire?: number | undefined; // timestamp in ms in the future (new Date()).getTime() + 5000)
  name: string;
}

/** State Default value */
const state: RootState = {
  loading: false,
  progress: 0,
  message: undefined,
  notifications: [],
  error: undefined,
  helper: undefined,
  referenceDataDrawer: false,
  overviewDataDrawer: false,
  notificationDialog: false,
  helperDialog: false,
};

/** Getters */
const getters: GetterTree<RootState, RootState> = {
  loading: (s): boolean => s.loading,
  progress: (s): number => s.progress,
  notifications: (s): UnhcrNotification[] => s.notifications,
  notificationsLength: (s): number => s.notifications.length,
  message: (s): string | undefined => s.notifications?.[0]?.message,
  notificationsStatusColor: (s): string => {
    const colorDefault = "grey";
    const numberOfError = s.notifications.filter(
      (notification) => notification.type === "error"
    ).length;
    const numberOfWarning = s.notifications.filter(
      (notification) => notification.type === "warning"
    ).length;
    const numberOfInfo = s.notifications.filter(
      (notification) => notification.type === "info"
    ).length;
    const numberOfSuccess = s.notifications.filter(
      (notification) => notification.type === "success"
    ).length;
    if (numberOfError) {
      return themeColor.light.error;
    }
    if (numberOfWarning) {
      return themeColor.light.warning;
    }
    if (numberOfSuccess) {
      return themeColor.light.success;
    }
    if (numberOfInfo) {
      return themeColor.light.info;
    }
    return colorDefault;
  },
  error: (s): string | undefined => s.error,
  referenceDataDrawer: (s): boolean => s.referenceDataDrawer,
  overviewDataDrawer: (s): boolean => s.overviewDataDrawer,
  notificationDialog: (s): boolean => s.notificationDialog,
  helperDialog: (s): boolean => s.helperDialog,
  helper: (s): Record<string, string> | undefined => s.helper,
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
  storeMessage(s, notification: UnhcrNotification) {
    s.notifications.unshift(notification);
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
    let changed = false;
    if (value !== s.referenceDataDrawer) {
      changed = true;
    }
    s.referenceDataDrawer = value;
    const hash = value ? router.currentRoute?.hash || "reference-data" : "";
    const currentHash = router.currentRoute?.hash;
    if (currentHash !== hash && changed) {
      router.push({
        query: router.currentRoute?.query,
        hash,
      });
    }
  },
  storeOverviewDataDrawer(s, value: boolean) {
    s.overviewDataDrawer = value;
  },
  storeNotificationDialog(s, value: boolean) {
    s.notificationDialog = value;
  },
  clearNotifications(s) {
    s.notifications = [];
  },
  storeHelperDialog(s, value: boolean) {
    s.helperDialog = value;
  },
  storeHelper(s, value: Record<string, string>) {
    s.helper = value;
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
  notifyUser: throttle(
    (
      context: ActionContext<RootState, RootState>,
      notification: UnhcrNotification
    ) => {
      context.dispatch("realnotifyUser", notification);
    },
    30,
    { leading: true, trailing: true }
  ),

  realnotifyUser(
    context: ActionContext<RootState, RootState>,
    notification: UnhcrNotification
  ) {
    if (!notification.expire) {
      notification.expire = new Date().getTime() + 5000;
    }
    if (!notification.date) {
      notification.date = new Date().toISOString();
    }
    if (!notification.type) {
      notification.type = "warning";
    }
    context.commit("storeMessage", notification);
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
  setNotificationDialog(
    context: ActionContext<RootState, RootState>,
    notificationDialog = false
  ) {
    context.commit("storeOverviewDataDrawer", notificationDialog);
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
  toggleNotificationCenter(context: ActionContext<RootState, RootState>) {
    context.commit(
      "storeNotificationDialog",
      !context.state.notificationDialog
    );
  },
  clearNotifications(context: ActionContext<RootState, RootState>) {
    context.commit("clearNotifications");
  },
  toggleHelperCenter(context: ActionContext<RootState, RootState>) {
    context.commit("storeHelperDialog", !context.getters.helperDialog);
  },
  setHelperDialog(
    context: ActionContext<RootState, RootState>,
    helperDialog = false
  ) {
    context.commit("storeHelperDialog", helperDialog);
  },
  setHelper(
    context: ActionContext<RootState, RootState>,
    helper: Record<string, string>
  ) {
    context.commit("storeHelperDialog", true);
    context.commit("storeHelper", helper);
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
    ShelterModule,
    SheltersMaterialModule,
    ShelterBillOfQuantitiesModule,
    GhgModule,
    GHGReferenceBioWasteModule,
    GHGReferenceNonBioWasteModule,
    GhgReferenceModule,
    GhgDefaultValuesModule,
    GhgReferenceGridModule,
    GhgReferenceRegionModule,
    GhgReferenceSolarModule,
    GHGReferencefNRB,
    UNHCRLocationModule,
    UserModule,
  },
  plugins: [
    // store as session storage
    new VuexPersistence({
      key: env.VUE_APP_USER_NAMESPACE,
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
