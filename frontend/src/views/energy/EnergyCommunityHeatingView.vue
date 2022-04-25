<template>
  <div>
    <h1>Heating & Cooling</h1>
    <p>
      The community is divided in different units such as: camp management,
      schools, medical centers, and administrative facilities. For each unit,
      the demand and supply of thermal energy (heating & cooling) are assessed
      from energy, environmental, and economic point of view. For each unit, the
      demand and supply of thermal energy are evaluated for the base year and
      assumed in the scenario section for the future.
    </p>
  </div>
</template>

<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyCommunityHeatingView extends EnergyModuleMixin {}
</script>
