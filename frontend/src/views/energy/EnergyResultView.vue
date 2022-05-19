<template>
  <div>
    <p>
      The results comprise the following: energy needs and demand, global energy
      efficiency, environmental, social, and economic indicators. Three
      categories of results are provided:
    </p>
    <ul>
      <li>The outputs related to a chosen year</li>
      <li>
        The yearly evolution of the key performance indicators over the study
        period
      </li>
      <li>The comparison between an alternative case and a reference case.</li>
    </ul>
    <p>
      In the case of central energy supply facilities, the results are the net
      present value, the energy affordability index, CO2 emissions.
    </p>
    <p>The results are provided in tables or/and graphs.</p>
  </div>
</template>

<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyResultView extends EnergyModuleMixin {}
</script>
