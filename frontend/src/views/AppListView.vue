<template>
  <main class="app-list-view">
    <app-list />
    <about-card />
    <app-logo />
  </main>
</template>

<script lang="ts">
import AppList from "@/components/AppList.vue";
import AboutCard from "@/components/commons/AboutCard.vue";
import AppLogo from "@/components/commons/AppLogo.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {
    AppList,
    AppLogo,
    AboutCard,
  },
})
export default class AppListView extends Vue {}
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
