<template>
  <router-view />
</template>

<script lang="ts">
import { GreenHouseGaz } from "@/store/GhgInterface.vue";
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
/** ProjectItem */
export default class ProjectItem extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  $route!: Route;
  project!: GreenHouseGaz;

  mounted(): void {
    this.syncDB();
    this.getDoc(decodeURIComponent(this.$route.params.site));
  }
  destroyed(): void {
    this.closeDB();
  }
}
</script>
