<template>
  <router-view />
</template>

<script lang="ts">
import { GreenHouseGaz } from "@/store/GhgInterface";
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgModule", ["getDoc", "syncDB", "closeDB"]),
  },
})
/** GreenHouseGazItem */
export default class GreenHouseGazItem extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  $route!: Route;
  project!: GreenHouseGaz;

  mounted(): void {
    this.syncDB();
    this.getDoc(decodeURIComponent(this.$route.params.surveyId));
  }
  destroyed(): void {
    this.closeDB();
  }
}
</script>
