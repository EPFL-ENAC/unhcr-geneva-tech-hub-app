<template>
  <p>
    The inputs of the base year include the number of heating & cooling degree
    days, and the thermal characteristics of the dwelling. In the case of a
    decentralized energy supply, data on the fuels, environmental and economic
    characteristic of the heaters and coolers are provided as well. The
    evolution is assumed in the scenario section.
  </p>
</template>

<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyHouseholdHeatingView extends EnergyModuleMixin {}
</script>
