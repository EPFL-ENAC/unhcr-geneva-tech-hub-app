<template>
  <app-list />
</template>

<script lang="ts">
import Vue from "vue";
import AppList from "../components/AppList.vue";

export default Vue.extend({
  name: "AppListView",

  components: {
    AppList,
  },
});
</script>
