<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @save="save"
  >
    <template v-slot>
      <energy-cooking-scenario v-model="module"></energy-cooking-scenario>
    </template>
  </energy-form>
</template>

<script lang="ts">
import EnergyCookingScenario from "@/components/energy/EnergyCookingScenario.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import { ScenarioModule } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";
@Component({
  components: {
    EnergyCookingScenario,
    EnergyForm,
  },
})
export default class EnergyScenario extends EnergyFormMixin<ScenarioModule> {
  module: ScenarioModule = {
    selectedId: "",
    scenarios: [
      {
        id: "usual",
        name: "Business as Usual",
        energyPriceTrend: "stable",
        investmentCostTrend: "stable",
        discountRate: 1,
        incomeRate: 1,
        demographicGrowth: 1,
        fuelPriceRate: 1,
      },
      {
        id: "optimistic",
        name: "Optimistic Scenario",
        energyPriceTrend: "stable",
        investmentCostTrend: "decrease",
        discountRate: 1,
        incomeRate: 1,
        demographicGrowth: 1,
        fuelPriceRate: 1,
      },
      {
        id: "pessimistic",
        name: "Pessimistic Scenario",
        energyPriceTrend: "increase",
        investmentCostTrend: "increase",
        discountRate: 1,
        incomeRate: 1,
        demographicGrowth: 1,
        fuelPriceRate: 1,
      },
    ],
  };
}
</script>
