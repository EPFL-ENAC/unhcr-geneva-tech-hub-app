<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title class="d-flex justify-center pr-10">
        <router-link :to="{ name: 'Apps' }" class="text-decoration-none">{{
          title
        }}</router-link>
      </v-app-bar-title>
      <v-spacer />
      <!-- <v-tabs>
        <v-tab
          v-for="([title, linkk], i) in apps"
          :key="i"
          :to="{ name: linkk }"
          >{{ title }}</v-tab
        >
      </v-tabs> -->
      <v-spacer />
      <!-- <v-avatar> {{ user.name }}</v-avatar> -->
      <v-btn icon @click="$store.dispatch('ConfigModule/toggleTheme')">
        <v-icon v-text="'mdi-invert-colors'" />
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
        <v-list-item class="px-2" :to="{ name: 'Apps' }" v-if="user.name">
          <v-list-item-avatar>
            <v-img v-if="gravatarImageUrl" :src="gravatarImageUrl"></v-img>
          </v-list-item-avatar>

          <v-list-item-title>{{ user.name }}</v-list-item-title>

          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-group
          :value="true"
          prepend-icon="mdi-briefcase"
          @click.stop="mini = true"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                {{ title }}
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, name, icon], i) in apps"
            :key="i"
            link
            :to="{ name }"
          >
            <v-list-item-icon @click.stop="mini = true">
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="title"></v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item link :to="{ name: 'About' }">
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="login" v-if="$user('isLoggedOut')">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout" v-if="$user('isLoggedIn')">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main v-if="$user('isLoggedOut')">
      <v-row v-if="$router.currentRoute.name !== 'Login'">
        <v-col :cols="12">
          <v-alert type="warning"> You are not logged in </v-alert>
        </v-col>
      </v-row>
      <v-container
        class="login"
        fluid
        fill-height
        v-if="$router.currentRoute.name !== 'Login'"
      >
        <v-layout align-content-start justify-center>
          <v-flex xs12 sm8 md4>
            <login-component />
          </v-flex>
        </v-layout>
      </v-container>
      <router-view name="Login" />
    </v-main>

    <v-main v-else class="d-flex">
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
        <v-btn color="primary" icon v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import LoginComponent from "@/components/LoginComponent.vue";
import { CouchUser } from "@/store/UserModule";
import md5 from "@/utils/md5";
import { AxiosError, AxiosPromise } from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("UserModule", {
      logoutStore: "logout",
      getSessionStore: "getSession",
    }),
  },
  components: {
    LoginComponent,
  },
})
/** ProjectList */
export default class App extends Vue {
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
  apps = [
    ["Green House Gaz", "GreenHouseGaz", "mdi-account-multiple-outline"],
    ["Shelter Sustainability", "ShelterSustainability", "mdi-cog-outline"],
    ["Energy", "Energy", "mdi-flash"],
  ];

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
    return this.$store.getters["ConfigModule/themeDark"];
  }

  get gravatarImageUrl(): string {
    if (this.user?.name) {
      const email_md5 = this.md5Function(this.user.name);
      return `https://www.gravatar.com/avatar/${email_md5}?d=mp`;
    }
    return "";
  }

  @Watch("themeDark")
  onthemeDarkChange(): void {
    this.$vuetify.theme.dark = this.$store.getters["ConfigModule/themeDark"];
  }

  @Watch("$store.getters.message")
  onSnackbarTextChanged(): void {
    this.snackbar = true;
  }
  @Watch("$route")
  onRouteChanged(): void {
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
    this.$router.push({ name: "Error" });
  }

  login(): void {
    if (this.$router.currentRoute.name !== "Login") {
      this.$router.push({ name: "Login" });
    }
  }

  logout(): void {
    this.logoutStore()
      .then(() => {
        if (this.$router.currentRoute.name !== "Login") {
          this.$router.push({ name: "Login" });
        }
      })
      .catch((error: AxiosError) => {
        console.log("error login", error);
        switch (error.response?.status) {
          case 401:
            this.$store.dispatch("setError", "Invalid credentials");
            break;
          default:
            this.$store.dispatch("setError", error.message);
        }
      });
  }

  /** Run once. */
  mounted(): void {
    this.$vuetify.theme.dark = this.$store.getters["ConfigModule/themeDark"];
    document.title = this.title;

    /// retrieve user
    this.getSessionStore();
  }
}
</script>
