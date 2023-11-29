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
    <v-app-bar app dense>
      <v-menu offset-y bottom min-width="330px" max-width="330px">
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" aria-label="shelter-help" v-on="on">
            <v-avatar class="custom-avatar">
              <v-badge
                :content="notificationsLength"
                :value="notificationsLength"
                :color="notificationColor"
                overlap
              >
                <v-icon v-if="$can('admin')" large title="admin"
                  >$mdiShieldAccount</v-icon
                >
                <v-icon v-else large class="account-color"
                  >$mdiAccountCircle
                </v-icon>
              </v-badge>
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="helper-menu">
          <v-list-item v-if="user.name" class="px-2">
            <v-list-item-title>{{ user.name }} </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="$userIs('LoggedOut')" @click="login">
            <v-list-item-icon>
              <v-icon> $mdiLogin </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="$userIs('LoggedIn')" @click="logout">
            <v-list-item-icon>
              <v-icon>$mdiLogout </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="notificationsLength"
            @click.stop="toggleNotificationCenter"
          >
            <v-list-item-icon>
              <v-btn
                icon
                small
                style="width: 24px; height: 24px"
                aria-label="notification-center"
              >
                <v-badge
                  :content="notificationsLength"
                  :value="notificationsLength"
                  :color="notificationColor"
                  overlap
                >
                  <v-icon> $mdiBellOutline </v-icon>
                </v-badge>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Notifications </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-app-bar-nav-icon :to="{ name: 'Apps' }" link>
        <template #default>
          <v-icon>$mdiHome</v-icon>
        </template>
      </v-app-bar-nav-icon>
      <v-tabs>
        <v-tab
          v-if="rootRoute"
          :to="{ name: rootRoute.name }"
          class="shelter-title-tab"
          >{{ rootRouteTitle }}
          <span v-if="currentRouteId">: {{ currentRouteId }}</span>
        </v-tab>
      </v-tabs>
      <v-spacer />
      <v-menu
        v-if="$router.currentRoute.name?.includes('Shelter')"
        offset-y
        bottom
        min-width="330px"
        max-width="330px"
      >
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" aria-label="shelter-help" v-on="on">
            <v-icon> $mdiHelpCircleOutline </v-icon>
          </v-btn>
        </template>
        <v-list class="helper-menu">
          <v-list-item
            v-for="(item, index) in shelterHelpers"
            :key="index"
            @click="setHelper(item)"
          >
            <v-list-item-action>
              <v-icon>${{ item?.icon }}</v-icon></v-list-item-action
            >
            <v-list-item-content>{{ item?.title }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu
        v-if="$router.currentRoute.name?.includes('GreenHouseGaz')"
        offset-y
        bottom
        min-width="330px"
        max-width="330px"
      >
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" aria-label="shelter-help" v-on="on">
            <v-icon> $mdiHelpCircleOutline </v-icon>
          </v-btn>
        </template>
        <v-list class="helper-menu">
          <v-list-item
            v-for="(item, index) in GHGHelpers"
            :key="index"
            @click="setHelper(item)"
          >
            <v-list-item-action>
              <v-icon>${{ item?.icon }}</v-icon></v-list-item-action
            >
            <v-list-item-content>{{ item?.title }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="$router.currentRoute.name?.includes('Shelter')"
        icon
        aria-label="dataset-overview-table"
        @click.stop="toggleOverviewData"
      >
        <v-icon> $mdiChartBarStacked </v-icon>
      </v-btn>
      <v-btn
        icon
        aria-label="dataset-reference-table"
        @click.stop="toggleReferenceData"
      >
        <v-icon> $mdiDatabaseArrowRight </v-icon>
      </v-btn>
      <v-progress-linear
        :active="loading"
        :indeterminate="progress === null"
        :value="progress"
        absolute
        bottom
        color="primary accent-3"
      />
    </v-app-bar>

    <v-main v-if="$userIs('LoggedOut')" class="unhcr-main">
      <notification-center />
      <template v-if="noGuardsRoutes.includes($route.name)">
        <router-view />
        <router-view :name="$route.name" />
      </template>

      <v-layout
        v-else
        align-center
        justify-center
        class="login"
        fluid
        fill-height
      >
        <v-flex xs10 sm8 md6 lg4>
          <login-component />
        </v-flex>
      </v-layout>
    </v-main>

    <v-main v-else class="unhcr-main">
      <reference-data />
      <overview-data />
      <notification-center />
      <helper-center />
      <v-fade-transition mode="out-in">
        <router-view />
        <router-view name="Login" />
        <router-view name="ForgotPassword" />
        <router-view name="Confirm" />
      </v-fade-transition>
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

import update from "@/mixins/update.js";
import { CouchUser } from "@/store/UserModule";
import { ghg, shelter } from "@/utils/apps";
import md5 from "@/utils/md5";
import { AxiosError, AxiosPromise } from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route, RouteRecordPublic } from "vue-router";
import { mapActions, mapGetters } from "vuex";
import { UnhcrNotification } from "./store";

import { env } from "@/config";

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
      getSessionStore: "getSession",
      refreshToken: "refreshToken",
    }),
    ...mapActions([
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
  toggleNotificationCenter!: () => void;
  setHelper!: () => void;

  // probably vuex Promise and not AxiosPromise
  logoutStore!: () => AxiosPromise;
  getSessionStore!: ({
    byPassLoading,
  }: Record<string, boolean>) => AxiosPromise;

  refreshToken!: () => AxiosPromise;
  user!: CouchUser;
  md5Function: (v: string) => string = md5;
  title = env.VUE_APP_TITLE ?? "UNHCR-TSS"; // use env variable,
  /** Drawer menu visibility */
  drawer = true;
  mini = true;
  /** Snackbar visibility */
  snackbar = false;
  unhcr_logo = unhcr_logo;
  intervalId!: number;
  rootRoute = {} as RouteRecordPublic;
  currentRouteName = "";
  rootRouteTitle = "";

  noGuardsRoutes = [
    "Login",
    "Apps",
    "ForgotPassword",
    "Register",
    "Confirm",
    "Unconfirm",
    "ResetPassword",
  ];

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
  get themeDark(): boolean {
    return false;
  }

  // /s3/2023-03-27/
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
        href: "/s3/2023-03-27/Viewing existing projects.mp4",
      },
      {
        title: "Creating new projects",
        icon: "mdiPlayCircle",
        type: "video",
        href: "/s3/2023-03-27/Creating new projects.mp4",
      },
      {
        title: "Entering project information",
        icon: "mdiPlayCircle",
        type: "video",
        href: "/s3/2023-03-27/Entering project information.mp4",
      },
      {
        title: "Uploading and downloading project files",
        icon: "mdiPlayCircle",
        type: "video",
        href: "/s3/2023-03-27/Uploading and downloading project files.mp4",
      },
      {
        title: "Entering geometry information",
        icon: "mdiPlayCircle",
        type: "video",

        href: "/s3/2023-03-27/Entering geometry information.mp4",
      },
      {
        title: "Entering Bill of Quantities information",
        icon: "mdiPlayCircle",
        type: "video",
        href: "/s3/2023-03-27/Entering BOQ information.mp4",
      },
      {
        title: "Assessing technical performance criteria",
        icon: "mdiPlayCircle",
        type: "video",
        href: "/s3/2023-03-27/Assessing technical performance.mp4",
      },
      {
        title: "Assessing habitability criteria",
        icon: "mdiPlayCircle",
        type: "video",
        href: "/s3/2023-03-27/Assessing Habitability.mp4",
      },
      {
        title: "Comparing projects",
        icon: "mdiPlayCircle",
        type: "video",

        href: "/s3/2023-03-27/Comparing projects.mp4",
      },
      {
        title: "Exporting reports",
        icon: "mdiPlayCircle",
        type: "video",

        href: "/s3/2023-03-27/Exporting reports.mp4",
      },
      {
        title: "Viewing overview data",
        icon: "mdiPlayCircle",
        type: "video",

        href: "/s3/2023-03-27/Viewing overview data.mp4",
      },
      {
        title: "Viewing reference data",
        icon: "mdiPlayCircle",
        type: "video",

        href: "/s3/2023-03-27/Viewing reference data.mp4",
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
        href: "/s3/2023-11-23/Introduction to GHG Calculation Tool.mp4",
      },
      {
        title: "GHG Databases and Creating Assessments",
        type: "video",
        icon: "mdiPlayCircle",
        href: "/s3/2023-11-23/GHG Databases and Creating Assessments.mp4",
      },
      {
        title: "Energy for Facilities Tutorial (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: "/s3/2023-11-23/{comingsoon}.mp4",}",
      },
      {
        title: "Energy for Cooking Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: "/s3/2023-11-23/Energy for Cooking Tutorial.mp4",
      },
      {
        title: "Energy for Lighting Tutorial (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: "/s3/2023-11-23/{comingsoon}.mp4",
      },
      {
        title: "Water Supply Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: "/s3/2023-11-23/Water Supply Tutorial.mp4",
      },
      {
        title: "Domestic Solid Waste Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: "/s3/2023-11-23/Domestic Solid Waste Tutorial.mp4",
      },
      {
        title: "Multiple Endlines (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: "/s3/2023-11-23/{comingsoon}.mp4",}",
      },
      {
        title: "Results and Printing (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: "/s3/2023-11-23/{comingsoon}.mp4",}",
      },
    ];
  }
  @Watch("themeDark")
  onthemeDarkChange(): void {
    this.$vuetify.theme.dark = false; // this.$store.getters["ConfigModule/themeDark"];
  }

  @Watch("$route", { immediate: true, deep: true })
  onRouteChanged(newRoute: Route): void {
    this.rootRoute = newRoute.matched[0];
    this.rootRouteTitle = this.rootRoute?.meta?.title ?? "Unknown title";
    this.currentRouteName = newRoute.name ?? "Unknown Route name";
    /** When route change, hide snackbar */
    this.snackbar = false;
  }
  @Watch("loading")
  onLoadingChange(): void {
    /** When loading */
    // console.log('loading:', this.loading);
    // change cursor
    document.body.style.cursor = this.loading ? "wait" : "auto";
  }
  @Watch("error")
  onError(): void {
    /** When error has occurred */
    if (this.currentRouteName !== "Error") {
      this.$router.push({ name: "Error" });
    }
  }

  login(): void {
    if (this.currentRouteName !== "Login") {
      this.$router.push({ name: "Login" });
    }
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

  public async checkAndRefresh(): Promise<void> {
    await this.getSessionStore({ byPassLoading: true });
    if (this.$userIs("OauthHasRefreshToken")) {
      await this.refreshToken();
    }
  }
  /** Run once. */
  async mounted(): Promise<void> {
    this.$vuetify.theme.dark = false; //this.$store.getters["ConfigModule/themeDark"];
    document.title = this?.title ?? "unknown";
    this.checkAndRefresh();
    this.intervalId = window.setInterval(() => {
      this.checkAndRefresh();
    }, 1000 * 10); // check every 10 seconds | every 15mn was not enough cf https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/542

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

@media print {
  * {
    -webkit-print-color-adjust: exact; /* Chrome, Safari 6 – 15.3, Edge */
    color-adjust: exact; /* Firefox 48 – 96 */
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
.shelter-title-tab {
  max-width: 100%;
  justify-content: left;
}
.custom-avatar {
  min-height: 48px;
  min-width: 52px;
  border-radius: 0px;
  margin-right: 10px;
}
</style>
