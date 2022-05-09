<template>
  <div>
    <h1>Cooking</h1>
    <energy-household-cooking
      :initial-module="modules.householdCooking"
      :general-module="modules.general"
      :scenario-module="modules.scenario"
      :intervention-module="modules.intervention"
      @save="save"
    ></energy-household-cooking>
  </div>
</template>

<script lang="ts">
import EnergyHouseholdCooking from "@/components/energy/EnergyHouseholdCooking.vue";
import { HouseholdCookingModule, Modules } from "@/models/energyModel";
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyHouseholdCooking,
  },
})
export default class EnergyHouseholdCookingView extends EnergyModuleMixin {
  save(module: HouseholdCookingModule): void {
    this.$set(this.modules, "householdCooking" as keyof Modules, module);
  }
}
</script>
