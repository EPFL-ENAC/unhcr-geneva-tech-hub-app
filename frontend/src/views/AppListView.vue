<template>
  <main class="app-list-view">
    <app-list />
    <app-logo />
  </main>
</template>

<script lang="ts">
import AppList from "@/components/AppList.vue";
import AppLogo from "@/components/commons/AppLogo.vue";
import Vue from "vue";

export default Vue.extend({
  name: "AppListView",

  components: {
    AppList,
    AppLogo,
  },
});
</script>

<style lang="scss" scoped>
.app-list-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 auto;
  height: 100%;
}
</style>
