<template>
  <p>
    This sector includes units such as: shops, small restaurants, and water
    pumping and distribution. For each sub-units, the productive energy use is
    assessed for the base year, and assumed for the future in the scenario
    section.
  </p>
</template>

<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyCommunityServicesView extends EnergyModuleMixin {}
</script>
