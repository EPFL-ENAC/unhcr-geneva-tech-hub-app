<template>
  <energy-scenario
    :initial-module="this.modules.scenario"
    @save="save"
  ></energy-scenario>
</template>

<script lang="ts">
import EnergyScenario from "@/components/energy/EnergyScenario.vue";
import { ScenarioModule } from "@/models/energyModel";
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyScenario,
  },
})
export default class EnergyScenarioView extends EnergyModuleMixin {
  save(module: ScenarioModule): void {
    this.$set(this.modules, "scenario", module);
  }
}
</script>
