<template>
  <v-app>
    <v-app-bar app dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-tabs>
        <v-tab v-if="rootRoute" :to="{ name: rootRoute.name }">{{
          rootRouteTitle
        }}</v-tab>
      </v-tabs>
      <v-spacer />
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
              <v-icon class="account-color">$mdiAccountCircle </v-icon>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-title>{{ user.name }}</v-list-item-title>

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
        <v-list-item v-if="$user('isLoggedOut')" @click="login">
          <v-list-item-icon>
            <v-icon> $mdiLogin </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$user('isLoggedIn')" @click="logout">
          <v-list-item-icon>
            <v-icon>$mdiLogout </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main v-if="$user('isLoggedOut')">
      <v-layout
        v-if="$router.currentRoute.name !== 'Login'"
        align-center
        justify-center
        class="login"
        fluid
        fill-height
      >
        <v-flex xs12 sm8 md4>
          <login-component />
        </v-flex>
      </v-layout>
      <router-view name="Login" />
    </v-main>

    <v-main v-else>
      <reference-data />
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
import LoginComponent from "@/components/LoginComponent.vue";
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
    ...mapGetters(["referenceDataDrawer"]),
  },
  methods: {
    ...mapActions("UserModule", {
      logoutStore: "logout",
      getSessionStore: "getSession",
    }),
    ...mapActions(["toggleReferenceData"]),
  },
  components: {
    LoginComponent,
    ReferenceData,
  },
})
/** ProjectList */
export default class App extends Vue {
  referenceDataDrawer!: boolean;
  toggleReferenceData!: () => AxiosPromise;
  // probably vuex Promise and not AxiosPromise
  logoutStore!: () => AxiosPromise;
  getSessionStore!: () => AxiosPromise;
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

  rootRoute = {} as RouteRecordPublic;
  currentRouteName = "";
  rootRouteTitle = "";

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

  @Watch("$store.getters.message")
  onSnackbarTextChanged(): void {
    this.snackbar = true;
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
            this.$store.dispatch("setGlobalError", "Invalid credentials");
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
  mounted(): void {
    this.$vuetify.theme.dark = false; //this.$store.getters["ConfigModule/themeDark"];
    document.title = this.title;
    /// retrieve user
    this.getSessionStore();
  }
}
</script>

<style lang="scss">
:root {
  --c-shelter: var(--v-primary-base);
  --c-unhcr: var(--v-primary-base);
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
