<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @after-sync="migrate"
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
        discountRate: {
          val: 1,
        },
        incomeRate: {
          val: 1,
        },
        demographicGrowth: {
          val: 1,
        },
        fuelPriceRate: {
          val: 1,
        },
      },
      {
        id: "optimistic",
        name: "Optimistic Scenario",
        energyPriceTrend: "stable",
        investmentCostTrend: "decrease",
        discountRate: {
          val: 1,
        },
        incomeRate: {
          val: 1,
        },
        demographicGrowth: {
          val: 1,
        },
        fuelPriceRate: {
          val: 1,
        },
      },
      {
        id: "pessimistic",
        name: "Pessimistic Scenario",
        energyPriceTrend: "increase",
        investmentCostTrend: "increase",
        discountRate: {
          val: 1,
        },
        incomeRate: {
          val: 1,
        },
        demographicGrowth: {
          val: 1,
        },
        fuelPriceRate: {
          val: 1,
        },
      },
    ],
  };

  migrate(): void {
    this.module.scenarios.forEach((scenario) => {
      if (typeof scenario.discountRate === "number") {
        scenario.discountRate = {
          val: scenario.discountRate,
        };
      }
      if (typeof scenario.incomeRate === "number") {
        scenario.incomeRate = {
          val: scenario.incomeRate,
        };
      }
      if (typeof scenario.demographicGrowth === "number") {
        scenario.demographicGrowth = {
          val: scenario.demographicGrowth,
        };
      }
      if (typeof scenario.fuelPriceRate === "number") {
        scenario.fuelPriceRate = {
          val: scenario.fuelPriceRate,
        };
      }
    });
  }
}
</script>
