<template>
  <energy-general
    :initial-module="this.modules.general"
    @save="save"
  ></energy-general>
</template>

<script lang="ts">
import EnergyGeneral from "@/components/energy/EnergyGeneral.vue";
import { GeneralModule } from "@/models/energyModel";
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyGeneral,
  },
})
export default class EnergyGeneralView extends EnergyModuleMixin {
  save(module: GeneralModule): void {
    this.modules.general = module;
  }
}
</script>
