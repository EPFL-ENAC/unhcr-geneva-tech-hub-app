<template>
  <energy-intervention
    :initial-module="this.modules.intervention"
    @save="save"
  ></energy-intervention>
</template>

<script lang="ts">
import EnergyIntervention from "@/components/energy/EnergyIntervention.vue";
import { InterventionModule } from "@/models/energyModel";
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyIntervention,
  },
})
export default class EnergInterventionView extends EnergyModuleMixin {
  save(module: InterventionModule): void {
    this.$set(this.modules, "intervention", module);
  }
}
</script>
