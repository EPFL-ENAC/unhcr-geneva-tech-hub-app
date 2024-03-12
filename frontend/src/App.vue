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
        "
        @click="drawer = !drawer"
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

      <v-navigation-drawer
        v-model="drawer"
        :app="true"
        temporary
        style="z-index: 5"
      >
        <header>
          <v-toolbar flat
            >x
            <v-toolbar-title>tims</v-toolbar-title>
          </v-toolbar>
        </header>
        <v-list nav>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>$mdiHome</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>$mdiAccount</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>$mdiAccount</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Indicators Analysis</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>$mdiAccount</v-icon>
              </v-list-item-icon>
              <v-list-item-title>GIS visualization</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <img
        data-cy="logo"
        :src="`${env.BASE_URL_WITHOUT_SLASH}/logo-e45dc393.png`"
        alt="Logo"
        style="margin: 5px; margin-top: 11px; height: 60px"
      />
      <span
        v-if="env.VUE_APP_ENVIRONEMENT === 'developement'"
        class="ant-tag ant-tag-orange"
        style="margin-top: 6px"
      >
        ENV: DEV
      </span>
      <v-app-bar-nav-icon
        :to="{ name: 'Apps' }"
        link
        class="theme-light app-home-icon"
      >
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
          <v-btn
            color="white"
            icon
            v-bind="attrs"
            aria-label="shelter-help"
            v-on="on"
          >
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
          <v-btn
            color="white"
            icon
            v-bind="attrs"
            aria-label="shelter-help"
            v-on="on"
          >
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
        color="white"
        aria-label="dataset-overview-table"
        @click.stop="toggleOverviewData"
      >
        <v-icon> $mdiChartBarStacked </v-icon>
      </v-btn>
      <v-btn
        icon
        color="white"
        aria-label="dataset-reference-table"
        @click.stop="toggleReferenceData"
      >
        <v-icon> $mdiDatabaseArrowRight </v-icon>
      </v-btn>
      <!-- <v-spacer /> -->
      <ul
        v-if="$userIs('LoggedOut') || $userIs('Guest')"
        class="ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-dark"
        dir="ltr"
        role="menu"
        tabindex="0"
        data-menu-list="true"
        data-cy="menu"
        style="
          float: right;
          padding-right: 10px;
          background-color: rgb(0, 114, 188);
          margin-right: -30px;
        "
      >
        <li
          v-if="$userIs('Guest')"
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          style="opacity: 1; order: 0; padding: 0px 0.5rem"
        >
          <span class="ant-menu-title-content"
            ><span
              style="
                color: rgb(255, 255, 255);
                background-color: transparent;
                border-radius: 20px;
                padding: 0.5rem 0.75rem;
                font-size: 0.9rem;
                border: 0px solid rgba(255, 255, 255, 0.267);
                cursor: pointer;
              "
              >Guest</span
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          data-menu-id="rc-menu-uuid-46916-1-/signup"
          style="opacity: 1; order: 0; padding: 0px 0.5rem"
        >
          <span class="ant-menu-title-content"
            ><a href="/signup"
              ><span
                style="
                  color: rgb(0, 114, 188);
                  background-color: rgb(255, 255, 255);
                  border-radius: 20px;
                  padding: 0.5rem 0.75rem;
                  font-size: 0.9rem;
                "
                >Sign up</span
              ></a
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          style="opacity: 1; order: 1; padding: 0px 0.5rem"
          data-menu-id="rc-menu-uuid-46916-1-/signin"
        >
          <span class="ant-menu-title-content"
            ><!-- <a href="https://dev.tims.unhcr.org/api/auth/authorize/login/" -->
            <a @click="authModule.login('loginRedirect')">
              <span
                style="
                  color: rgb(255, 255, 255);
                  background-color: transparent;
                  border-radius: 20px;
                  padding: 0.5rem 0.75rem;
                  font-size: 0.9rem;
                  border: 1px solid rgba(255, 255, 255, 0.267);
                "
                >Sign in</span
              ></a
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-overflow-item-rest ant-menu-submenu ant-menu-submenu-horizontal ant-menu-submenu-disabled"
          aria-hidden="true"
          role="none"
          style="
            opacity: 0;
            height: 0px;
            overflow-y: hidden;
            order: 2147483647;
            pointer-events: none;
            position: absolute;
          "
        >
          <div
            role="menuitem"
            class="ant-menu-submenu-title"
            aria-expanded="false"
            aria-haspopup="true"
            data-menu-id="rc-menu-uuid-46916-1-rc-menu-more"
            aria-controls="rc-menu-uuid-46916-1-rc-menu-more-popup"
            aria-disabled="true"
          >
            <span
              role="img"
              aria-label="ellipsis"
              class="anticon anticon-ellipsis"
              ><svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="ellipsis"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
                ></path></svg></span
            ><i class="ant-menu-submenu-arrow"></i>
          </div>
        </li>
      </ul>
      <ul
        v-if="$userIs('LoggedIn') && !$userIs('Guest')"
        class="ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-dark"
        dir="ltr"
        role="menu"
        tabindex="0"
        data-menu-list="true"
        data-cy="menu"
        style="
          float: right;
          padding-right: 10px;
          background-color: rgb(0, 114, 188);
          margin-right: -30px;
          line-height: normal;
        "
      >
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          data-menu-id="rc-menu-uuid-45730-1-/me"
          style="opacity: 1; order: 0"
        >
          <span class="ant-menu-title-content"
            ><a href="/me"
              ><span
                role="img"
                aria-label="user"
                class="anticon anticon-user"
                style="font-size: 20px; color: white"
                ><svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="user"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
                  ></path></svg></span></a
          ></span>
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          style="opacity: 1; order: 1; line-height: 26px"
          data-menu-id="rc-menu-uuid-45730-1-/signout"
        >
          <span class="ant-menu-title-content"
            ><span
              style="
                color: rgb(255, 255, 255);
                background-color: transparent;
                border-radius: 20px;
                padding: 0.5rem 0.75rem;
                font-size: 0.9rem;
                border: 1px solid rgba(255, 255, 255, 0.267);
              "
              @click="logout"
              >Sign out</span
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-overflow-item-rest ant-menu-submenu ant-menu-submenu-horizontal ant-menu-submenu-disabled"
          aria-hidden="true"
          role="none"
          style="
            opacity: 0;
            height: 0px;
            overflow-y: hidden;
            order: 2147483647;
            pointer-events: none;
            position: absolute;
          "
        >
          <div
            role="menuitem"
            class="ant-menu-submenu-title"
            aria-expanded="false"
            aria-haspopup="true"
            data-menu-id="rc-menu-uuid-45730-1-rc-menu-more"
            aria-controls="rc-menu-uuid-45730-1-rc-menu-more-popup"
            aria-disabled="true"
          >
            <span
              role="img"
              aria-label="ellipsis"
              class="anticon anticon-ellipsis"
              ><svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="ellipsis"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
                ></path></svg></span
            ><i class="ant-menu-submenu-arrow"></i>
          </div>
        </li>
      </ul>
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

import { env } from "@/config";
import update from "@/mixins/update.js";
import { CouchUser, removeAllOauthTokens } from "@/store/UserModule";
import { ghg, shelter } from "@/utils/apps";
import md5 from "@/utils/md5";
import { EventMessage, EventPayload, EventType } from "@azure/msal-browser";
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
      getSessionStore: "getSession",
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
  getSessionStore!: ({
    byPassLoading,
  }: Record<string, boolean>) => AxiosPromise;
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
        title: "Energy for Facilities Tutorial (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,},
      },
      {
        title: "Energy for Cooking Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Energy for Cooking Tutorial.mp4`,
      },
      {
        title: "Energy for Lighting Tutorial (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,
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
        title: "Multiple Endlines (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,}",
      },
      {
        title: "Results and Printing (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,}",
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

  public async firstToken(payload: EventPayload): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((payload as any)?.account) {
      window.authModule.myMSALObj.setActiveAccount(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload as any)?.account
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((payload as any)?.idToken) {
      await this.loginToken({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token: (payload as any)?.idToken,
        byPassLoading: true,
      });
      await this.getSessionStore({ byPassLoading: true });
    } else {
      removeAllOauthTokens();
    }
  }
  /** Run once. */
  async mounted(): Promise<void> {
    // add listener to msal browser https:/
    //github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/events.md
    window.authModule.myMSALObj.addEventCallback((message: EventMessage) => {
      // Update UI or interact with EventMessage here
      if (message.eventType === EventType.LOGIN_SUCCESS) {
        this.firstToken(message.payload);
      }
      if (message.eventType === EventType.SSO_SILENT_SUCCESS) {
        this.firstToken(message.payload);
      }
      if (message.eventType === EventType.SSO_SILENT_FAILURE) {
        console.log("not logged in, we should behave as guest", message);
        this.loginAsGuest();
      }
    });
    this.$vuetify.theme.dark = false;
    document.title = this?.title ?? "unknown";

    window.authModule.attemptSsoSilent();

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
  cursor: pointer;
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
.menu-icon {
  margin-left: -30px;
  font-size: 20px;
  color: white;
}
.v-application .v-app-bar {
  text-rendering: auto;
  -webkit-font-smoothing: auto;
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
  box-shadow: 0 2px 8px #00000026;
  transition: background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
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
