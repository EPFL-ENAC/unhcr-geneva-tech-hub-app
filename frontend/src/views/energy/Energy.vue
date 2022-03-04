<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { ActionTypes } from "@/store/EnergyModule";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Energy extends Vue {
  created(): void {
    this.$store.dispatch("energy/" + ActionTypes.Created);
  }

  destroyed(): void {
    this.$store.dispatch("energy/" + ActionTypes.Destroyed);
  }
}
</script>
