<template>
  <v-container fluid class="project">
    <router-view />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgItemModule", [
      "getDoc",
      "updateDoc",
      "syncDB",
      "closeDB",
    ]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  $route!: Route;

  mounted(): void {
    this.syncDB();
    this.getDoc(decodeURIComponent(this.$route.params.id));
  }
  destroyed(): void {
    console.log("DESTROYED view shelter item, closing DB");
    this.closeDB();
  }
}
</script>

<style lang="scss" scoped></style>
