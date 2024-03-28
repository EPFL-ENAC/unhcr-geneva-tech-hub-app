<template>
  <v-app>
    <header class="justify-space-between align-center d-none d-print-flex">
      <h4 class="font-weight-bold primary--text">
        <span v-if="$route.name === 'ShelterSustainabilityCompare'"
          >Shelter Comparison Report</span
        >
        <span v-else-if="currentRouteId">{{ currentRouteId }}</span>
      </h4>
      <figure>
        <img
          :src="unhcr_logo.imgPath"
          :height="unhcr_logo.height || '40px'"
          alt="UNHCR LOGO"
        />
      </figure>
    </header>
    <hr
      class="d-none d-print-flex font-weight-bold justify-space-between align-center primary"
    />
    <v-app-bar
      app
      clipped-right
      class="main-app-bar"
      color="primary"
      height="64px"
    >
      <span
        role="img"
        aria-label="menu"
        data-cy="menu-icon"
        tabindex="-1"
        class="anticon anticon-menu"
        style="
          margin-left: -30px;
          font-size: 20px;
          color: white;
          margin-top: 6px;
          pointer: default;
        "
      >
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="menu"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"
          ></path>
        </svg>
      </span>
      <img
        data-cy="logo"
        :src="`${env.BASE_URL_WITHOUT_SLASH}/logo-e45dc393.png`"
        alt="Logo"
        style="margin: 5px; margin-top: 11px; height: 60px"
      />
      <span
        v-if="env.VUE_APP_ENVIRONEMENT !== 'production'"
        class="ant-tag ant-tag-orange"
        style="margin-top: 6px"
      >
        ENV: DEV
      </span>
      <v-spacer />

      <v-progress-linear
        :active="loading"
        :indeterminate="progress === null"
        :value="progress"
        absolute
        bottom
        color="primary accent-3"
      />
    </v-app-bar>

    <v-main class="unhcr-main d-flex align-center justify-center">
      <div class="d-flex align-center justify-center">
        <span>
          The app has been moved permanently to
          <a :href="env.VUE_APP_REDIRECT_URI">TIMS</a>
        </span>
      </div>
    </v-main>

    <v-overlay v-model="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-snackbar
      bottom
      right
      :value="updateExists"
      :timeout="-1"
      color="primary"
    >
      An update is available, updating will reload the page
      <v-btn text @click="refreshApp"> Update </v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="snackbar"
      class="d-print-none"
      app
      timeout="5000"
      transition="scroll-y-transition"
    >
      {{ snackbarText?.message }}
      <template #action="{ attrs }">
        <v-btn
          aria-label="close-snakbar"
          color="primary"
          icon
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>$mdiClose</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { unhcr_logo } from "@/components/commons/logos";
import HelperCenter from "@/components/HelperCenter.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import NotificationCenter from "@/components/NotificationCenter.vue";
import OverviewData from "@/components/OverviewData.vue";
import ReferenceData from "@/components/ReferenceData.vue";

import { env } from "@/config";
import update from "@/mixins/update.js";
import { CouchUser } from "@/store/UserModule";
import { ghg, shelter } from "@/utils/apps";
import md5 from "@/utils/md5";
import { AxiosError, AxiosPromise } from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route, RouteRecordPublic } from "vue-router";
import { mapActions, mapGetters } from "vuex";
import { UnhcrNotification } from "./store";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
    ...mapGetters([
      "referenceDataDrawer",
      "overviewDataDrawer",
      "notificationDialog",
      "notificationsLength",
    ]),
  },
  mixins: [update],
  methods: {
    ...mapActions("UserModule", {
      logoutStore: "logout",
      loginToken: "loginToken",
      loginAsGuest: "loginAsGuest",
      refreshToken: "refreshToken",
    }),
    ...mapActions([
      "setReferenceDataDrawer",
      "toggleReferenceData",
      "toggleOverviewData",
      "toggleNotificationCenter",
      "setHelper",
    ]),
  },
  components: {
    LoginComponent,
    ReferenceData,
    OverviewData,
    NotificationCenter,
    HelperCenter,
  },
})
/** ProjectList */
export default class App extends Vue {
  referenceDataDrawer!: boolean;
  overviewDataDrawer!: boolean;
  notificationDialog!: boolean;
  toggleReferenceData!: () => AxiosPromise;
  setReferenceDataDrawer!: (value: boolean) => AxiosPromise;
  toggleNotificationCenter!: () => void;
  setHelper!: () => void;

  // probably vuex Promise and not AxiosPromise
  logoutStore!: () => AxiosPromise;
  loginToken!: ({
    token,
    byPassLoading,
  }: Record<string, string | boolean>) => Promise<Record<string, unknown>>;

  refreshToken!: () => AxiosPromise;
  user!: CouchUser;
  md5Function: (v: string) => string = md5;
  env = env;
  title = env.VUE_APP_TITLE ?? "UNHCR-TSS"; // use env variable,
  /** Drawer menu visibility */
  drawer = false;
  mini = true;
  /** Snackbar visibility */
  snackbar = false;
  unhcr_logo = unhcr_logo;
  intervalId!: number;
  rootRoute = {} as RouteRecordPublic;
  currentRouteName = "";
  rootRouteTitle = "";
  authModule = window.authModule;
  loginAsGuest!: () => AxiosPromise;

  noGuardsRoutes = [
    "Login",
    "Apps",
    "ForgotPassword",
    "Register",
    "Confirm",
    "Unconfirm",
    "ResetPassword",
  ];

  public goToDashboards(): void {
    window.location.href = "/dashboards";
  }

  public goToHome(): void {
    window.location.href = "/";
  }

  public goToAnalysis(): void {
    window.location.href = "/analysis";
  }

  public goToGisVisualisation(): void {
    window.location.href = "/gis";
  }

  get userTitle(): string {
    return this.$userIs("Azure")
      ? `AD ${this.$userIs("Admin") ? "admin" : ""} user`
      : `CouchDB ${this.$userIs("Admin") ? "admin" : ""} user`;
  }

  get currentRouteId(): string | undefined {
    return this.$store.getters?.["ShelterModule/shelter"]?.name;
  }

  get snackbarText(): UnhcrNotification {
    return this.$store.getters.notifications[0];
  }
  get notificationColor(): string {
    return this.$store.getters.notificationsStatusColor;
  }
  get progress(): number {
    return this.$store.getters.progress;
  }
  set progress(value: number) {
    this.$store.dispatch("setProgress", value);
  }
  get loading(): boolean {
    return this.$store.getters.loading;
  }
  set loading(value: boolean) {
    this.$store.dispatch("setLoading", value);
  }
  get error(): string {
    return this.$store.getters.error;
  }

  // ${env.VUE_APP_S3_URL}/2023-03-27/
  get shelterHelpers(): Helpers[] {
    return [
      {
        title: "Instruction manual",
        icon: "mdiFileDocumentOutline",
        type: "pdf",
        href: shelter.link,
      },
      {
        title: "Viewing existing projects",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Viewing existing projects.mp4`,
      },
      {
        title: "Creating new projects",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Creating new projects.mp4`,
      },
      {
        title: "Entering project information",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Entering project information.mp4`,
      },
      {
        title: "Uploading and downloading project files",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Uploading and downloading project files.mp4`,
      },
      {
        title: "Entering geometry information",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Entering geometry information.mp4`,
      },
      {
        title: "Entering Bill of Quantities information",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Entering BOQ information.mp4`,
      },
      {
        title: "Assessing technical performance criteria",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Assessing technical performance.mp4`,
      },
      {
        title: "Assessing habitability criteria",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Assessing Habitability.mp4`,
      },
      {
        title: "Comparing projects",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Comparing projects.mp4`,
      },
      {
        title: "Exporting reports",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Exporting reports.mp4`,
      },
      {
        title: "Viewing overview data",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Viewing overview data.mp4`,
      },
      {
        title: "Viewing reference data",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Viewing reference data.mp4`,
      },
    ];
  }

  get GHGHelpers(): Helpers[] {
    return [
      {
        title: ghg.linkName,
        icon: "mdiFileDocumentOutline",
        type: "pdf",
        href: ghg.link,
      },
      {
        title: "Introduction to the GHG Tool",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Introduction to GHG Calculation Tool.mp4`,
      },
      {
        title: "GHG Databases and Creating Assessments",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/GHG Databases and Creating Assessments.mp4`,
      },
      {
        title: "Energy for Facilities Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Energy_facilities.mp4`,
      },
      {
        title: "Energy for Cooking Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Energy for Cooking Tutorial.mp4`,
      },
      {
        title: "Energy for Lighting Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Energy_lighting.mp4`,
      },
      {
        title: "Water Supply Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Water Supply Tutorial.mp4`,
      },
      {
        title: "Domestic Solid Waste Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Domestic Solid Waste Tutorial.mp4`,
      },
      {
        title: "Multiple Endlines",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/multiple_endlines.mp4`,
      },
      {
        title: "Results and Printing",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/results_and_printing.mp4`,
      },
      {
        title: "LCA_Facilities_GHG_Brief_Mar2024_vf",
        type: "pdf",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/LCA_Facilities_GHG_Brief_Mar2024_vf.pdf`,
        icon: "mdiFileDocumentOutline",
      },
      {
        title: "LCA_Water_Supply_GHG_Brief_Mar2024_vf",
        type: "pdf",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/LCA_Water_Supply_GHG_Brief_Mar2024_vf.pdf`,
        icon: "mdiFileDocumentOutline",
      },
      {
        title: "LCA_SWM_GHG_Brief_Mar2024_vf",
        type: "pdf",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/LCA_SWM_GHG_Brief_Mar2024_vf.pdf`,
        icon: "mdiFileDocumentOutline",
      },
      {
        title: "LCA_Lighting_GHG_Brief_Mar2024_vf",
        type: "pdf",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/LCA_Lighting_GHG_Brief_Mar2024_vf.pdf`,
        icon: "mdiFileDocumentOutline",
      },
      {
        title: "LCA_Cooking_GHG_Brief_Mar2024_vf",
        type: "pdf",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/LCA_Cooking_GHG_Brief_Mar2024_vf.pdf`,
        icon: "mdiFileDocumentOutline",
      },
    ];
  }

  @Watch("$route", { immediate: true, deep: true })
  onRouteChanged(newRoute: Route): void {
    this.rootRoute = newRoute.matched[0];
    this.rootRouteTitle = this.rootRoute?.meta?.title ?? "Unknown title";
    this.currentRouteName = newRoute.name ?? "Unknown Route name";
    if (newRoute.hash.includes("reference-data")) {
      this.setReferenceDataDrawer(true);
    }
    /** When route change, hide snackbar */
    this.snackbar = false;
  }

  @Watch("loading")
  onLoadingChange(): void {
    /** When loading change cursor*/
    document.body.style.cursor = this.loading ? "wait" : "auto";
  }
  @Watch("error")
  onError(): void {
    /** When error has occurred */
    if (this.currentRouteName !== "Error") {
      this.$router.push({ name: "Error" });
    }
  }

  public get hasLoginPage(): boolean {
    return this.$router
      .getRoutes()
      .map((x) => x.name)
      .includes("Login");
  }

  login(): void {
    // if login page exist we go to login page, otherwise we go to loginRedirect
    this.hasLoginPage
      ? this.currentRouteName !== "Login" &&
        this.$router.push({ name: "Login" })
      : window.authModule.login("loginRedirect");
  }

  signup(): void {
    this.hasLoginPage
      ? this.currentRouteName !== "Register" &&
        this.$router.push({ name: "Register" })
      : (window.location.href = "/signup");
  }

  logout(): void {
    this.logoutStore()
      .then(() => {
        if (this.currentRouteName !== "Login") {
          this.$router.push({ name: "Login" });
        }
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          case 401:
            this.$store.dispatch(
              "setGlobalError",
              "Invalid credentials / Not authenticated"
            );
            break;
          default:
            this.$store.dispatch("setGlobalError", error.message);
        }
      });
  }

  toggleMini(): void {
    this.mini = !this.mini;
  }

  /** Run once. */
  async mounted(): Promise<void> {
    this.$vuetify.theme.dark = false;
    document.title = this?.title ?? "unknown";

    this.loading = false;
    // this.loading is set to false at the end of the flow: logic has been moved to initialize in AuthModule.ts

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["storeMessage"];
      if (shouldUpdate.includes(mutation.type)) {
        if (mutation.payload.byPassLoading) {
          return;
        }
        this.snackbar = true;
      }
    });
  }
  beforeDestroy(): void {
    clearInterval(this.intervalId);
  }
}

interface Helpers {
  title: string;
  icon?: string;
  type?: string;
  href?: string;
}
</script>

<style lang="scss">
:root {
  --c-shelter: var(--v-primary-base);
  --c-unhcr: var(--v-primary-base);
}

.v-sheet.v-app-bar.main-app-bar.v-toolbar:not(.v-sheet--outlined) {
  box-shadow: none;
}

.menu-icon {
  margin-left: -30px;
  font-size: 20px;
  color: white;
}
.v-application .v-app-bar {
  text-rendering: auto;
  -webkit-font-smoothing: auto;
}
.main-app-bar {
  z-index: 1000;
  background-color: var(--v-primary-base) !important;
  padding: 0 50px;
  /* color: #000000a6; */
  line-height: 64px;
  background: #001529;
  box-sizing: border-box;
  box-shadow: none;
  & .v-toolbar__content {
    padding: 0;
    align-items: baseline;
    box-shadow: none;
    display: flex;
    align-items: center;
    // margin-top: 3px;
  }

  a {
    color: #0072bc;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
    -webkit-text-decoration-skip: objects;
  }

  a:hover {
    color: #208bc9;
  }

  a:active {
    color: #005596;
  }

  a:active,
  a:hover {
    text-decoration: none;
    outline: 0;
  }

  a:focus {
    text-decoration: none;
    outline: 0;
  }

  a[disabled] {
    color: #00000040;
    cursor: not-allowed;
  }
}

.anticon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  // line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon[tabindex] {
  cursor: default;
}

.ant-tag {
  box-sizing: border-box;
  margin: 0 8px 0 0;
  color: #000000a6;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: "tnum";
  display: inline-block;
  height: auto;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 1px;
  opacity: 1;
  transition: all 0.3s;
  &.ant-tag-orange {
    color: #d46b08;
    background: #fff7e6;
    border-color: #ffd591;
  }
}

@media print {
  * {
    -webkit-print-color-adjust: exact; /* Chrome, Safari 6 – 15.3, Edge */
    print-color-adjust: exact; /* Firefox 97+, Safari 15.4+ */
  }
  .v-application .v-app-bar,
  .v-application .v-navigation-drawer {
    display: none;
  }
  .v-application .unhcr-main {
    padding: 0px !important;
    padding-top: 20px !important;
  }

  @page {
    size: A4;
    margin: 1cm;
    margin-top: 4mm;
    margin-bottom: 0mm;
    padding: 5px;
    width: 100%;
  }
  .pagebreak {
    page-break-before: always;
  }
  .project__header,
  .project__h3 {
    font-size: 1rem;
  }
  .container {
    padding: 0px !important;
  }
  .v-application .elevation-1,
  .v-application .elevation-2 {
    z-index: 0;
    box-shadow: none !important;
  }
  :deep(.v-sheet.v-card) {
    box-shadow: none !important;
  }
}

.project__header,
.project__h3 {
  color: var(--c-shelter);
}
.flag {
  border: 1px solid grey;
}

.rotate-180 {
  transform: rotate(180deg);
}
.rotate-90 {
  transform: rotate(90deg);
}

.v-icon__component {
  // for shelter and ghg svg custom icon component
  // in case of other svg custom icom, act accordingly if you don't want to change
  fill: currentColor;
}

.account-color > svg {
  fill: #c5c5c5;
}

.helper-menu {
  font-size: 0.85rem;
  .v-list-item {
    min-height: 24px;
    &:hover {
      background-color: #c5c5c5;
      cursor: pointer;
    }
  }
  .v-list-item__action {
    margin: 2px 0;
  }
  .v-list-item__content {
    padding: 2px 0;
  }
}
</style>

<style lang="scss" scoped>
.theme-light.app-home-icon {
  color: white;
}
.shelter-title-tab {
  max-width: 100%;
  justify-content: left;
  color: white;
}
.custom-avatar {
  min-height: 48px;
  min-width: 52px;
  border-radius: 0px;
  margin-right: 10px;
}
</style>

<style lang="scss">
.ant-drawer {
  position: fixed;
  z-index: 1000;
  width: 0%;
  height: 100%;
  transition: width 0s ease 0.3s, height 0s ease 0.3s;
}

.ant-drawer-content-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.ant-drawer .ant-drawer-content {
  width: 100%;
  height: 100%;
}

.ant-drawer-left,
.ant-drawer-right {
  top: 0;
  width: 0%;
  height: 100%;
}

.ant-drawer-left .ant-drawer-content-wrapper,
.ant-drawer-right .ant-drawer-content-wrapper {
  height: 100%;
}

.ant-drawer-left.ant-drawer-open,
.ant-drawer-right.ant-drawer-open {
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.ant-drawer-left,
.ant-drawer-left .ant-drawer-content-wrapper {
  left: 0;
}

.ant-drawer-left.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: 6px 0 16px -8px #00000014, 9px 0 28px #0000000d,
    12px 0 48px 16px #00000008;
}

.ant-drawer-right,
.ant-drawer-right .ant-drawer-content-wrapper {
  right: 0;
}

.ant-drawer-right.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: -6px 0 16px -8px #00000014, -9px 0 28px #0000000d,
    -12px 0 48px 16px #00000008;
}

.ant-drawer-right.ant-drawer-open.no-mask {
  right: 1px;
  transform: translate(1px);
}

.ant-drawer-top,
.ant-drawer-bottom {
  left: 0;
  width: 100%;
  height: 0%;
}

.ant-drawer-top .ant-drawer-content-wrapper,
.ant-drawer-bottom .ant-drawer-content-wrapper {
  width: 100%;
}

.ant-drawer-top.ant-drawer-open,
.ant-drawer-bottom.ant-drawer-open {
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.ant-drawer-top {
  top: 0;
}

.ant-drawer-top.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: 0 6px 16px -8px #00000014, 0 9px 28px #0000000d,
    0 12px 48px 16px #00000008;
}

.ant-drawer-bottom,
.ant-drawer-bottom .ant-drawer-content-wrapper {
  bottom: 0;
}

.ant-drawer-bottom.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: 0 -6px 16px -8px #00000014, 0 -9px 28px #0000000d,
    0 -12px 48px 16px #00000008;
}

.ant-drawer-bottom.ant-drawer-open.no-mask {
  bottom: 1px;
  transform: translateY(1px);
}

.ant-drawer.ant-drawer-open .ant-drawer-mask {
  height: 100%;
  opacity: 1;
  transition: none;
  animation: antdDrawerFadeIn 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: auto;
}

.ant-drawer-title {
  flex: 1;
  margin: 0;
  color: #000000d9;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
}

.ant-drawer-content {
  position: relative;
  z-index: 1;
  overflow: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 0;
}

.ant-drawer-close {
  display: inline-block;
  margin-right: 12px;
  color: #00000073;
  font-weight: 700;
  font-size: 16px;
  font-style: normal;
  line-height: 1;
  text-align: center;
  text-transform: none;
  text-decoration: none;
  background: transparent;
  border: 0;
  outline: 0;
  cursor: pointer;
  transition: color 0.3s;
  text-rendering: auto;
}

.ant-drawer-close:focus,
.ant-drawer-close:hover {
  color: #000000bf;
  text-decoration: none;
}

.ant-drawer-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  color: #000000a6;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 1px 1px 0 0;
}

.ant-drawer-header-title {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}

.ant-drawer-header-close-only {
  padding-bottom: 0;
  border: none;
}

.ant-drawer-wrapper-body {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
}

.ant-drawer-body {
  flex-grow: 1;
  padding: 24px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.5715;
  word-wrap: break-word;
}

.ant-drawer-footer {
  flex-shrink: 0;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
}

.ant-drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #00000073;
  opacity: 0;
  transition: opacity 0.3s linear, height 0s ease 0.3s;
  pointer-events: none;
}

.ant-drawer .ant-picker-clear {
  background: #fff;
}

@keyframes antdDrawerFadeIn {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.ant-drawer-rtl {
  direction: rtl;
}

.ant-drawer-rtl .ant-drawer-close {
  margin-right: 0;
  margin-left: 12px;
}

.ant-menu-item:active {
  background-color: inherit;
  user-select: none;
}
.ant-menu-item-danger.ant-menu-item,
.ant-menu-item-danger.ant-menu-item:hover,
.ant-menu-item-danger.ant-menu-item-active {
  color: #f5222d;
}

.ant-menu-item-danger.ant-menu-item:active {
  background: #fff1f0;
}

.ant-menu-item-danger.ant-menu-item-selected {
  color: #f5222d;
}

.ant-menu-item-danger.ant-menu-item-selected > a,
.ant-menu-item-danger.ant-menu-item-selected > a:hover {
  color: #f5222d;
}

.ant-menu:not(.ant-menu-horizontal)
  .ant-menu-item-danger.ant-menu-item-selected {
  background-color: #fff1f0;
}

.ant-menu-inline .ant-menu-item-danger.ant-menu-item:after {
  border-right-color: #f5222d;
}

.ant-menu-dark .ant-menu-item-danger.ant-menu-item,
.ant-menu-dark .ant-menu-item-danger.ant-menu-item:hover,
.ant-menu-dark .ant-menu-item-danger.ant-menu-item > a {
  color: #f5222d;
}

.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal)
  .ant-menu-item-danger.ant-menu-item-selected {
  color: #fff;
  background-color: #f5222d;
}

.ant-menu {
  box-sizing: border-box;
  margin: 0;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: "tnum";
  padding: 0;
  color: #000000a6;
  font-size: 14px;
  line-height: 0;
  text-align: left;
  list-style: none;
  background: #fff;
  outline: none;
  box-shadow: none;
  transition: none;
}

.ant-menu:before {
  display: table;
  content: "";
}

.ant-menu:after {
  display: table;
  clear: both;
  content: "";
}

.ant-menu.ant-menu-root:focus-visible {
  box-shadow: 0 0 0 2px #99d9f0;
}

.ant-menu ul,
.ant-menu ol {
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: none;
}

.ant-menu-overflow {
  display: flex;
  box-shadow: none;
  line-height: normal;
}

.ant-menu-overflow-item {
  flex: none;
  line-height: normal;
}

.ant-menu-hidden,
.ant-menu-submenu-hidden {
  display: none;
}

.ant-menu-item-group-title {
  height: 1.5715;
  padding: 8px 16px;
  color: #00000073;
  font-size: 14px;
  line-height: 1.5715;
  transition: all 0.3s;
}

.ant-menu-horizontal .ant-menu-submenu {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu,
.ant-menu-submenu-inline {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-item:active,
.ant-menu-submenu-title:active {
  background: #e3f7fc;
}

.ant-menu-submenu .ant-menu-sub {
  cursor: initial;
  transition: background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-title-content {
  transition: color 0.3s;
}

.ant-menu-horizontal .ant-menu-submenu {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu,
.ant-menu-submenu-inline {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-item:active,
.ant-menu-submenu-title:active {
  background: #e3f7fc;
}

.ant-menu-submenu .ant-menu-sub {
  cursor: initial;
  transition: background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-title-content {
  transition: color 0.3s;
}

.ant-menu-item a {
  color: #000000a6;
}

.ant-menu-item a:hover {
  color: #0072bc;
}

.ant-menu-item a:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  content: "";
}

.ant-menu-item > .ant-badge a {
  color: #000000a6;
}

.ant-menu-item > .ant-badge a:hover {
  color: #0072bc;
}

.ant-menu-item-divider {
  overflow: hidden;
  line-height: 0;
  border-color: #f0f0f0;
  border-style: solid;
  border-width: 1px 0 0;
}

.ant-menu-item-divider-dashed {
  border-style: dashed;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu {
  margin-top: -1px;
}

.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-active,
.ant-menu-horizontal > .ant-menu-submenu .ant-menu-submenu-title:hover {
  background-color: transparent;
}

.ant-menu-item-selected,
.ant-menu-item-selected a,
.ant-menu-item-selected a:hover {
  color: #0072bc;
}

.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #e3f7fc;
}

.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: 1px solid #f0f0f0;
}

.ant-menu-vertical-right {
  border-left: 1px solid #f0f0f0;
}

.ant-menu-vertical.ant-menu-sub,
.ant-menu-vertical-left.ant-menu-sub,
.ant-menu-vertical-right.ant-menu-sub {
  min-width: 160px;
  max-height: calc(100vh - 100px);
  padding: 0;
  overflow: hidden;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-left.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-right.ant-menu-sub:not([class*="-active"]) {
  overflow-x: hidden;
  overflow-y: auto;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item {
  left: 0;
  margin-left: 0;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item:after {
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-submenu {
  transform-origin: 0 0;
}

.ant-menu-horizontal.ant-menu-sub {
  min-width: 114px;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu-title {
  transition: border-color 0.3s, background 0.3s;
}

.ant-menu-item,
.ant-menu-submenu-title {
  position: relative;
  display: block;
  margin: 0;
  padding: 0 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s,
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-item .ant-menu-item-icon,
.ant-menu-submenu-title .ant-menu-item-icon,
.ant-menu-item .anticon,
.ant-menu-submenu-title .anticon {
  min-width: 14px;
  font-size: 14px;
  transition: font-size 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.3s;
}

.ant-menu-item .ant-menu-item-icon + span,
.ant-menu-submenu-title .ant-menu-item-icon + span,
.ant-menu-item .anticon + span,
.ant-menu-submenu-title .anticon + span {
  margin-left: 10px;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s,
    color 0.3s;
}

.ant-menu-item .ant-menu-item-icon.svg,
.ant-menu-submenu-title .ant-menu-item-icon.svg {
  vertical-align: -0.125em;
}

.ant-menu-item.ant-menu-item-only-child > .anticon,
.ant-menu-submenu-title.ant-menu-item-only-child > .anticon,
.ant-menu-item.ant-menu-item-only-child > .ant-menu-item-icon,
.ant-menu-submenu-title.ant-menu-item-only-child > .ant-menu-item-icon {
  margin-right: 0;
}

.ant-menu-item:focus-visible,
.ant-menu-submenu-title:focus-visible {
  box-shadow: 0 0 0 2px #99d9f0;
}

.ant-menu > .ant-menu-item-divider {
  margin: 1px 0;
  padding: 0;
}

.ant-menu-submenu-popup {
  position: absolute;
  z-index: 1050;
  background: transparent;
  border-radius: 1px;
  box-shadow: none;
  transform-origin: 0 0;
}

.ant-menu-submenu-popup:before {
  position: absolute;
  top: -7px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0.0001;
  content: " ";
}

.ant-menu-submenu-placement-rightTop:before {
  top: 0;
  left: -7px;
}

.ant-menu-submenu > .ant-menu {
  background-color: #fff;
  border-radius: 1px;
}

.ant-menu-submenu > .ant-menu-submenu-title:after {
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-popup > .ant-menu {
  background-color: #fff;
}

.ant-menu-submenu-expand-icon,
.ant-menu-submenu-arrow {
  position: absolute;
  top: 50%;
  right: 16px;
  width: 10px;
  color: #000000a6;
  transform: translateY(-50%);
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-arrow:before,
.ant-menu-submenu-arrow:after {
  position: absolute;
  width: 6px;
  height: 1.5px;
  background-color: currentcolor;
  border-radius: 2px;
  transition: background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  content: "";
}

.ant-menu-submenu-arrow:before {
  transform: rotate(45deg) translateY(-2.5px);
}

.ant-menu-submenu-arrow:after {
  transform: rotate(-45deg) translateY(2.5px);
}

.ant-menu-submenu:hover
  > .ant-menu-submenu-title
  > .ant-menu-submenu-expand-icon,
.ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
  color: #0072bc;
}

.ant-menu-inline-collapsed .ant-menu-submenu-arrow:before,
.ant-menu-submenu-inline .ant-menu-submenu-arrow:before {
  transform: rotate(-45deg) translate(2.5px);
}

.ant-menu-inline-collapsed .ant-menu-submenu-arrow:after,
.ant-menu-submenu-inline .ant-menu-submenu-arrow:after {
  transform: rotate(45deg) translate(-2.5px);
}

.ant-menu-submenu-horizontal .ant-menu-submenu-arrow {
  display: none;
}

.ant-menu-submenu-open.ant-menu-submenu-inline
  > .ant-menu-submenu-title
  > .ant-menu-submenu-arrow {
  transform: translateY(-2px);
}

.ant-menu-submenu-open.ant-menu-submenu-inline
  > .ant-menu-submenu-title
  > .ant-menu-submenu-arrow:after {
  transform: rotate(-45deg) translate(-2.5px);
}

.ant-menu-submenu-open.ant-menu-submenu-inline
  > .ant-menu-submenu-title
  > .ant-menu-submenu-arrow:before {
  transform: rotate(45deg) translate(2.5px);
}

.ant-menu-vertical .ant-menu-submenu-selected,
.ant-menu-vertical-left .ant-menu-submenu-selected,
.ant-menu-vertical-right .ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-horizontal {
  line-height: 46px;
  border: 0;
  border-bottom: 0px solid #f0f0f0;
  box-shadow: none;
}

.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu {
  margin-top: -1px;
  margin-bottom: 0;
  padding: 0 20px;
}

.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-active,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-active,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-open,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-open,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-active:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-active:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-open:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-open:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected:after {
  border-bottom: 2px solid #0072bc;
}

.ant-menu-horizontal > .ant-menu-item,
.ant-menu-horizontal > .ant-menu-submenu {
  position: relative;
  top: 1px;
  display: inline-block;
  vertical-align: bottom;
}

.ant-menu-horizontal > .ant-menu-item:after,
.ant-menu-horizontal > .ant-menu-submenu:after {
  position: absolute;
  right: 20px;
  bottom: 0;
  left: 20px;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  content: "";
}

.ant-menu-horizontal > .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0;
}

.ant-menu-horizontal > .ant-menu-item a {
  color: #000000a6;
}

.ant-menu-horizontal > .ant-menu-item a:hover {
  color: #0072bc;
}

.ant-menu-horizontal > .ant-menu-item a:before {
  bottom: -2px;
}

.ant-menu-horizontal > .ant-menu-item-selected a {
  color: #0072bc;
}

.ant-menu-horizontal:after {
  display: block;
  clear: both;
  height: 0;
  content: " ";
}

.ant-menu-vertical .ant-menu-item,
.ant-menu-vertical-left .ant-menu-item,
.ant-menu-vertical-right .ant-menu-item,
.ant-menu-inline .ant-menu-item {
  position: relative;
}

.ant-menu-vertical .ant-menu-item:after,
.ant-menu-vertical-left .ant-menu-item:after,
.ant-menu-vertical-right .ant-menu-item:after,
.ant-menu-inline .ant-menu-item:after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  border-right: 3px solid #0072bc;
  transform: scaleY(0.0001);
  opacity: 0;
  transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
  content: "";
}

.ant-menu-vertical .ant-menu-item,
.ant-menu-vertical-left .ant-menu-item,
.ant-menu-vertical-right .ant-menu-item,
.ant-menu-inline .ant-menu-item,
.ant-menu-vertical .ant-menu-submenu-title,
.ant-menu-vertical-left .ant-menu-submenu-title,
.ant-menu-vertical-right .ant-menu-submenu-title,
.ant-menu-inline .ant-menu-submenu-title {
  height: 40px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 0 16px;
  overflow: hidden;
  line-height: 40px;
  text-overflow: ellipsis;
}

.ant-menu-vertical .ant-menu-submenu,
.ant-menu-vertical-left .ant-menu-submenu,
.ant-menu-vertical-right .ant-menu-submenu,
.ant-menu-inline .ant-menu-submenu {
  padding-bottom: 0.02px;
}

.ant-menu-vertical .ant-menu-item:not(:last-child),
.ant-menu-vertical-left .ant-menu-item:not(:last-child),
.ant-menu-vertical-right .ant-menu-item:not(:last-child),
.ant-menu-inline .ant-menu-item:not(:last-child) {
  margin-bottom: 8px;
}

.ant-menu-vertical > .ant-menu-item,
.ant-menu-vertical-left > .ant-menu-item,
.ant-menu-vertical-right > .ant-menu-item,
.ant-menu-inline > .ant-menu-item,
.ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 40px;
  line-height: 40px;
}

.ant-menu-vertical .ant-menu-item-group-list .ant-menu-submenu-title,
.ant-menu-vertical .ant-menu-submenu-title {
  padding-right: 34px;
}

.ant-menu-inline {
  width: 100%;
}

.ant-menu-item a {
  color: #000000a6;
}

.ant-menu-item a:hover {
  color: #0072bc;
}

.ant-menu-item a:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  content: "";
}

.ant-menu-item > .ant-badge a {
  color: #000000a6;
}

.ant-menu-item > .ant-badge a:hover {
  color: #0072bc;
}

.ant-menu-item-divider {
  overflow: hidden;
  line-height: 0;
  border-color: #f0f0f0;
  border-style: solid;
  border-width: 1px 0 0;
}

.ant-menu-item-divider-dashed {
  border-style: dashed;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu {
  margin-top: -1px;
}

.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-active,
.ant-menu-horizontal > .ant-menu-submenu .ant-menu-submenu-title:hover {
  background-color: transparent;
}

.ant-menu-item-selected,
.ant-menu-item-selected a,
.ant-menu-item-selected a:hover {
  color: #0072bc;
}

.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #e3f7fc;
}

.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: 1px solid #f0f0f0;
}

.ant-menu-vertical-right {
  border-left: 1px solid #f0f0f0;
}

.ant-menu-vertical.ant-menu-sub,
.ant-menu-vertical-left.ant-menu-sub,
.ant-menu-vertical-right.ant-menu-sub {
  min-width: 160px;
  max-height: calc(100vh - 100px);
  padding: 0;
  overflow: hidden;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-left.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-right.ant-menu-sub:not([class*="-active"]) {
  overflow-x: hidden;
  overflow-y: auto;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item {
  left: 0;
  margin-left: 0;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item:after {
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-submenu {
  transform-origin: 0 0;
}

.ant-menu-horizontal.ant-menu-sub {
  min-width: 114px;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu-title {
  transition: border-color 0.3s, background 0.3s;
}

.ant-menu-item,
.ant-menu-submenu-title {
  position: relative;
  display: block;
  margin: 0;
  padding: 0 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s,
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-item .ant-menu-item-icon,
.ant-menu-submenu-title .ant-menu-item-icon,
.ant-menu-item .anticon,
.ant-menu-submenu-title .anticon {
  min-width: 14px;
  font-size: 14px;
  transition: font-size 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.3s;
}

.ant-menu-item .ant-menu-item-icon + span,
.ant-menu-submenu-title .ant-menu-item-icon + span,
.ant-menu-item .anticon + span,
.ant-menu-submenu-title .anticon + span {
  margin-left: 10px;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s,
    color 0.3s;
}

.ant-menu-item .ant-menu-item-icon.svg,
.ant-menu-submenu-title .ant-menu-item-icon.svg {
  vertical-align: -0.125em;
}

.ant-menu-item.ant-menu-item-only-child > .anticon,
.ant-menu-submenu-title.ant-menu-item-only-child > .anticon,
.ant-menu-item.ant-menu-item-only-child > .ant-menu-item-icon,
.ant-menu-submenu-title.ant-menu-item-only-child > .ant-menu-item-icon {
  margin-right: 0;
}

.ant-menu-item:focus-visible,
.ant-menu-submenu-title:focus-visible {
  box-shadow: 0 0 0 2px #99d9f0;
}

.ant-menu > .ant-menu-item-divider {
  margin: 1px 0;
  padding: 0;
}

.ant-menu-submenu-popup {
  position: absolute;
  z-index: 1050;
  background: transparent;
  border-radius: 1px;
  box-shadow: none;
  transform-origin: 0 0;
}

.ant-menu-submenu-popup:before {
  position: absolute;
  top: -7px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0.0001;
  content: " ";
}
</style>
