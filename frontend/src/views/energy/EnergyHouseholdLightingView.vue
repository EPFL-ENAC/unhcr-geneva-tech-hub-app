<template>
  <p>
    The user provides the information related to the lighting devices for the
    base year. The number of devices is provided per 10-household basis, other
    data include the type of technology, type of fuel, economic and
    environmental characteristics. The evolution is assumed in the scenario
    section.
  </p>
</template>

<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyHouseholdLightingView extends EnergyModuleMixin {}
</script>
