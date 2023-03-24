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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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
      <v-menu v-if="$router.currentRoute.name?.includes('Shelter')" offset-y>
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
              <v-icon>${{ item.icon }}</v-icon></v-list-item-action
            >
            <v-list-item-content>{{ item.title }}</v-list-item-content>
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

    <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant.sync="mini"
      permanent
    >
      <v-list>
        <v-list-item
          v-if="user.name"
          class="px-2"
          @click.stop.prevent="() => toggleMini()"
        >
          <v-list-item-avatar>
            <v-avatar>
              <v-icon v-if="$can('admin')" large title="admin"
                >$mdiShieldAccount</v-icon
              >
              <v-icon v-else large class="account-color"
                >$mdiAccountCircle
              </v-icon>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-title>{{ user.name }} </v-list-item-title>

          <v-btn
            aria-label="toggle-left-panel"
            icon
            @click.stop.prevent="() => toggleMini()"
          >
            <v-icon>$mdiChevronLeft </v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-else
          class="px-2"
          @click.stop.prevent="() => toggleMini()"
        >
          <v-btn
            aria-label="toggle-left-panel"
            icon
            @click.stop.prevent="() => toggleMini()"
          >
            <v-icon
              :class="{
                'rotate-180': mini,
              }"
              >$mdiChevronLeft</v-icon
            >
          </v-btn>
        </v-list-item>
        <v-list-item link :to="{ name: 'Apps' }">
          <v-list-item-icon>
            <v-icon color="light"> $mdiBriefcase </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Apps</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(app, i) in apps"
          :key="i"
          link
          :to="{ name: app.to }"
        >
          <v-list-item-icon @click.stop>
            <v-img
              v-if="app.logoSvg"
              max-width="24px"
              :src="app.logoSvg"
            ></v-img>
            <v-icon v-if="app.logoIcon">
              {{ app.logoIcon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ app.title }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{ name: 'About' }">
          <v-list-item-icon>
            <v-icon> $mdiInformation </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
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

        <v-list-item>
          <v-list-item-icon>
            <v-btn
              v-if="notificationsLength"
              icon
              small
              style="width: 24px; height: 24px"
              aria-label="notification-center"
              @click.stop="toggleNotificationCenter"
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
    </v-navigation-drawer>

    <v-main v-if="$userIs('LoggedOut')" class="unhcr-main">
      <notification-center />
      <router-view v-if="$route.name === 'About'" />
      <v-layout
        v-else-if="$router.currentRoute.name !== 'Login'"
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
      <router-view v-else name="Login" />
    </v-main>

    <v-main v-else class="unhcr-main">
      <reference-data />
      <overview-data />
      <notification-center />
      <helper-center />
      <v-fade-transition mode="out-in">
        <router-view />
        <router-view name="Login" />
      </v-fade-transition>
    </v-main>

    <v-overlay v-model="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

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

import { CouchUser } from "@/store/UserModule";
import Apps from "@/utils/apps";
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
  title = "UNHCR-TSS"; // use env variable,
  /** Drawer menu visibility */
  drawer = true;
  mini = true;
  /** Snackbar visibility */
  snackbar = false;
  // TODO: use meta.title for apps name
  apps = Apps;
  unhcr_logo = unhcr_logo;
  intervalId!: number;

  rootRoute = {} as RouteRecordPublic;
  currentRouteName = "";
  rootRouteTitle = "";

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
  get shelterHelpers(): ShelterHelpers[] {
    return [
      {
        title: "Instruction manual",
        icon: "mdiFileDocumentOutline",
        type: "pdf",
        href: "https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-03-15/Shelter & Sustainability Manual_230312.pdf",
      },
      {
        title: "Viewing existing projects",
        icon: "mdiPlayCircle",
        type: "video",
        href: "https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-03-10/20210610_montage-homepage.mp4",
      },
      { title: "Creating new projects", icon: "mdiPlayCircle" },
      { title: "Entering project information", icon: "mdiPlayCircle" },
      {
        title: "Uploading and downloading project files",
        icon: "mdiPlayCircle",
      },
      { title: "Entering geometry information", icon: "mdiPlayCircle" },
      {
        title: "Entering Bill of Quantities information",
        icon: "mdiPlayCircle",
      },
      {
        title: "Assessing technical performance criteria",
        icon: "mdiPlayCircle",
      },
      { title: "Assessing habitability criteria", icon: "mdiPlayCircle" },
      { title: "Comparing projects", icon: "mdiPlayCircle" },
      { title: "Exporting reports", icon: "mdiPlayCircle" },
      { title: "Viewing overview data", icon: "mdiPlayCircle" },
      { title: "Viewing reference data", icon: "mdiPlayCircle" },
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
    document.title = this.title;
    this.checkAndRefresh();
    this.intervalId = window.setInterval(() => {
      this.checkAndRefresh();
    }, 1000 * 60 * 45); // check every 45 minutes: 1000 * 60 * 5

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["storeMessage"];
      if (shouldUpdate.includes(mutation.type)) {
        this.snackbar = true;
      }
    });
  }
  beforeDestroy(): void {
    clearInterval(this.intervalId);
  }
}

interface ShelterHelpers {
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
</style>
