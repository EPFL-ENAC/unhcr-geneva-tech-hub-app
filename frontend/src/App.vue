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
      <v-tabs>
        <v-tab
          v-for="([title, linkk], i) in apps"
          :key="i"
          :to="{ name: linkk }"
          >{{ title }}</v-tab
        >
      </v-tabs>
      <v-spacer />
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

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-group
          :value="true"
          prepend-icon="mdi-briefcase"
          :to="{ name: 'Apps' }"
        >
          <template v-slot:activator>
            <v-list-item-title>Apps</v-list-item-title>
          </template>

          <v-list-item
            v-for="([title, name, icon], i) in apps"
            :key="i"
            link
            :to="{ name }"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
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
        <v-list-item @click="login" v-hide-if-user="user.name">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout" v-show-if-user="user.name">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
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
import { CouchUser } from "@/store/UserModule";
import { AxiosError, AxiosPromise } from "axios";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("UserModule", {
      logoutStore: "logout",
    }),
  },
})
/** ProjectList */
export default class App extends Vue {
  logoutStore!: () => AxiosPromise;
  user!: CouchUser;

  title = "UNHCR-TSS"; // use env variable,
  /** Drawer menu visibility */
  drawer = null;
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

  // @Watch
  // themeDark() {
  //   this.$vuetify.theme.dark = this.$store.getters["ConfigModule/themeDark"];
  // },

  // @Watch
  // "$store.getters.message": function onSnackbarTextChanged() {
  //   this.snackbar = true;
  // },
  // @Watch
  // $route: function onRouteChanged(): void {
  //   /** When route change, hide snackbar */
  //   this.snackbar = false;
  // },
  // @Watch
  // loading: function onLoading() {
  //   /** When loading */
  //   // console.log('loading:', this.loading);
  //   // change cursor
  //   document.body.style.cursor = this.loading ? "wait" : "auto";
  // },
  // @Watch
  // error: function onError() {
  //   /** When error has occurred */
  //   this.$router.push({ name: "Error" });
  // },

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
        alert("Logout successful ");
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
  }
}
</script>
