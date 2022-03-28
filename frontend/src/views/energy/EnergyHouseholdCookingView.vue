<template>
  <energy-household-cooking
    :initial-module="modules.householdCooking"
    @save="save"
  ></energy-household-cooking>
</template>

<script lang="ts">
import EnergyHouseholdCooking from "@/components/energy/EnergyHouseholdCooking.vue";
import { HouseholdCookingModule } from "@/models/energyModel";
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
    this.modules.householdCooking = module;
  }
}
</script>
