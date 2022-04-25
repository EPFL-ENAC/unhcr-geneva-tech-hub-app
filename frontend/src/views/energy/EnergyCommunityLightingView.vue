<template>
  <div>
    <h1>Lighting</h1>
    <p>
      The community lighting characterizes for the base year, the street
      lighting demand and supply. The supply may consist in solar lighting or
      public / mini-grid connected street lighting. The evolution of the
      sub-system is assumed in the scenario section.
    </p>
  </div>
</template>

<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyCommunityLightingView extends EnergyModuleMixin {}
</script>
