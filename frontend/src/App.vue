<template>
  <v-app>
    <header class="justify-space-between align-center d-none d-print-flex ma-4">
      <h4 class="font-weight-bold primary--text pa-4">
        {{ rootRouteTitle }}
        <span v-if="currentRouteId">: {{ currentRouteId }}</span>
      </h4>
      <figure class="pa-4">
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
      <v-btn
        v-if="'ShelterSustainabilityList' === $router.currentRoute.name"
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

    <v-navigation-drawer v-model="drawer" app :mini-variant.sync="mini">
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
      </v-list>
    </v-navigation-drawer>

    <v-main v-if="$userIs('LoggedOut')" class="unhcr-main">
      <v-layout
        v-if="$router.currentRoute.name !== 'Login'"
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
      <router-view name="Login" />
    </v-main>

    <v-main v-else class="unhcr-main">
      <reference-data />
      <overview-data />
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
      app
      timeout="5000"
      transition="scroll-y-transition"
    >
      {{ snackbarText }}
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
import LoginComponent from "@/components/LoginComponent.vue";
import OverviewData from "@/components/OverviewData.vue";
import ReferenceData from "@/components/ReferenceData.vue";
import { CouchUser } from "@/store/UserModule";
import Apps from "@/utils/apps";
import md5 from "@/utils/md5";
import { AxiosError, AxiosPromise } from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route, RouteRecordPublic } from "vue-router";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
    ...mapGetters(["referenceDataDrawer", "overviewDataDrawer"]),
  },
  methods: {
    ...mapActions("UserModule", {
      logoutStore: "logout",
      getSessionStore: "getSession",
      refreshToken: "refreshToken",
    }),
    ...mapActions(["toggleReferenceData", "toggleOverviewData"]),
  },
  components: {
    LoginComponent,
    ReferenceData,
    OverviewData,
  },
})
/** ProjectList */
export default class App extends Vue {
  referenceDataDrawer!: boolean;
  overviewDataDrawer!: boolean;
  toggleReferenceData!: () => AxiosPromise;
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

  get snackbarText(): string {
    return this.$store.getters.message;
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
    // return this.$store.getters["ConfigModule/themeDark"];
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

  /** Run once. */
  async mounted(): Promise<void> {
    this.$vuetify.theme.dark = false; //this.$store.getters["ConfigModule/themeDark"];
    document.title = this.title;
    this.getSessionStore({ byPassLoading: true });

    this.intervalId = window.setInterval(() => {
      this.getSessionStore({ byPassLoading: true });
      this.refreshToken();
    }, 1000 * 60 * 5); // check every 10 minutes: 1000 * 60 * 5
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
  }

  @page {
    size: A4;
    margin: -1em;
    padding: 20px;
    width: 100%;
  }
  .pagebreak {
    page-break-before: always;
  }
  .project__header,
  .project__h3 {
    font-size: 1.5rem;
  }
  .container {
    padding: 6px !important;
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
</style>

<style lang="scss" scoped>
.shelter-title-tab {
  max-width: 100%;
  justify-content: left;
}
</style>
