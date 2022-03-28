<template>
  <energy-intervention></energy-intervention>
</template>

<script lang="ts">
import EnergyIntervention from "@/components/energy/EnergyIntervention.vue";
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyIntervention,
  },
})
export default class EnergInterventionView extends EnergyModuleMixin {}
</script>
