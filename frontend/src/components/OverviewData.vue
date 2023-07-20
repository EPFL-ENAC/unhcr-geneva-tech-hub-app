<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    width="80%"
    right
    temporary
    style="`height: calc(100vh - 48px); width: ${drawer ? '80%' : '0px'}`"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between">
          <h2 class="text-h4 project__h3 font-weight-medium sticky">
            Overview data
          </h2>
          <v-btn icon @click="toggleOverviewData">
            <v-icon>$mdiClose</v-icon>
          </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <main class="overview__data">
      <overview-projects />
    </main>
  </v-navigation-drawer>
</template>

<script lang="ts">
import OverviewProjects from "@/components/overview_data/OverviewProjects.vue";
import OverviewUsers from "@/components/overview_data/OverviewUsers.vue";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters(["overviewDataDrawer"]),
  },
  methods: {
    ...mapActions(["toggleOverviewData", "setOverviewDataDrawer"]),
  },
  components: {
    OverviewUsers,
    OverviewProjects,
  },
})
/** ProjectList */
export default class App extends Vue {
  overviewDataDrawer!: boolean;
  toggleOverviewData!: () => Promise<void>;
  setOverviewDataDrawer!: (value: boolean) => void;

  set drawer(value: boolean) {
    this.setOverviewDataDrawer(value);
  }
  get drawer(): boolean {
    return this.overviewDataDrawer;
  }

  readonly menuItems: MenuSurveyItem[] = [
    // {
    //   tab: "projects",
    //   componentName: "OverviewProjects",
    // },
    // { tab: "users", componentName: "OverviewUsers" },
  ];
  tab = 1;
}

interface MenuSurveyItem {
  tab: string;
  componentName: string;
}
</script>

<style></style>
