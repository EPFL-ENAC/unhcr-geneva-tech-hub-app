<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title v-text="title" />
      <v-spacer />
      <v-btn
        v-for="([title, linkk], i) in apps"
        :key="i"
        link
        :to="{ name: linkk }"
        >{{ title }}</v-btn
      >
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
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
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
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    /** Window title */
    title: "UNHCR-TSS", // use env variable,
    /** Drawer menu visibility */
    drawer: null,
    /** Snackbar visibility */
    snackbar: false,
    apps: [
      ["Green House Gaz", "GreenHouseGaz", "mdi-account-multiple-outline"],
      ["Shelter Sustainability", "ShelterSustainability", "mdi-cog-outline"],
      ["Energy", "Energy", "mdi-flash"],
    ],
  }),

  computed: {
    /** Theme dark mode */
    "$vuetify.theme.dark": {
      get: function getTheme() {
        return this.$store.getters["ConfigModule/toggleTheme"];
      },
    },
    /** Snackbar text */
    snackbarText() {
      return this.$store.getters.message;
    },
    /** Get progress percentage */
    progress: {
      get: function progressGetter() {
        return this.$store.getters.progress;
      },
      set: function progressSetter(value) {
        this.$store.dispatch("setProgress", value);
      },
    },
    loading: {
      get: function loadingGetter() {
        return this.$store.getters.loading;
      },
      set: function loadingSetter(value) {
        this.$store.dispatch("setLoading", value);
      },
    },
    error() {
      return this.$store.getters.error;
    },
    themeDark() {
      return this.$store.getters["ConfigModule/themeDark"];
    },
  },
  watch: {
    themeDark() {
      this.$vuetify.theme.dark = this.$store.getters["ConfigModule/themeDark"];
    },

    "$store.getters.message": function onSnackbarTextChanged() {
      this.snackbar = true;
    },
    $route: function onRouteChanged(): void {
      /** When route change, hide snackbar */
      this.snackbar = false;
    },
    loading: function onLoading() {
      /** When loading */
      // console.log('loading:', this.loading);
      // change cursor
      document.body.style.cursor = this.loading ? "wait" : "auto";
    },
    error: function onError() {
      /** When error has occurred */
      this.$router.push({ name: "Error" });
    },
  },
  methods: {
    logout() {
      window.alert("are you sure you want to be logged out ?");
    },
  },

  /** Run once. */
  mounted() {
    this.$vuetify.theme.dark = this.$store.getters["ConfigModule/themeDark"];
    document.title = this.title;
  },
});
</script>
