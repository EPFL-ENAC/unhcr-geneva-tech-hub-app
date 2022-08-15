<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @after-sync="migrate"
    @save="save"
  >
    <template #default>
      <energy-cooking-scenario
        v-model="module"
        :general-module="generalModule"
      ></energy-cooking-scenario>
    </template>
  </energy-form>
</template>

<script lang="ts">
import EnergyCookingScenario from "@/components/energy/EnergyCookingScenario.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import {
  CookingFuelId,
  cookingFuelIds,
  GeneralModule,
  RangeModel,
  ScenarioModule,
} from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    EnergyCookingScenario,
    EnergyForm,
  },
})
export default class EnergyScenario extends EnergyFormMixin<ScenarioModule> {
  @Prop({ type: Object as () => GeneralModule })
  generalModule!: GeneralModule;

  module: ScenarioModule = {
    selectedId: "",
    scenarios: [],
  };

  get householdSize(): number {
    return (
      this.generalModule.totalPopulation / this.generalModule.familiesCount
    );
  }

  created(): void {
    if (!this.initialModule) {
      this.module.scenarios = [
        {
          id: "usual",
          name: "Business as Usual",
          energyPriceTrend: "stable",
          investmentCostTrend: "stable",
          years: [
            {
              yearIndex: 0,
              householdSize: {
                val: this.householdSize,
              },
              discountRate: {
                val: 1,
              },
              incomeRate: {
                val: 1,
              },
              demographicGrowth: {
                val: 1,
              },
              fuelPriceRates: Object.fromEntries(
                cookingFuelIds.map((id) => [id, { val: 1 }])
              ) as Record<CookingFuelId, RangeModel>,
            },
          ],
        },
        {
          id: "optimistic",
          name: "Optimistic Scenario",
          energyPriceTrend: "stable",
          investmentCostTrend: "decrease",
          years: [
            {
              yearIndex: 0,
              householdSize: {
                val: this.householdSize,
              },
              discountRate: {
                val: 1,
              },
              incomeRate: {
                val: 1,
              },
              demographicGrowth: {
                val: 1,
              },
              fuelPriceRates: Object.fromEntries(
                cookingFuelIds.map((id) => [id, { val: 1 }])
              ) as Record<CookingFuelId, RangeModel>,
            },
          ],
        },
        {
          id: "pessimistic",
          name: "Pessimistic Scenario",
          energyPriceTrend: "increase",
          investmentCostTrend: "increase",
          years: [
            {
              yearIndex: 0,
              householdSize: {
                val: this.householdSize,
              },
              discountRate: {
                val: 1,
              },
              incomeRate: {
                val: 1,
              },
              demographicGrowth: {
                val: 1,
              },
              fuelPriceRates: Object.fromEntries(
                cookingFuelIds.map((id) => [id, { val: 1 }])
              ) as Record<CookingFuelId, RangeModel>,
            },
          ],
        },
      ];
    }
  }

  migrate(): void {
    this.module.scenarios
      .flatMap((scenario) => scenario.years)
      .forEach((scenario) => {
        this.migrateRange(scenario.discountRate);
        this.migrateRange(scenario.incomeRate);
        this.migrateRange(scenario.demographicGrowth);
        cookingFuelIds.map((id) =>
          this.migrateRange(scenario.fuelPriceRates[id])
        );
      });
  }

  private migrateRange(range: RangeModel): void {
    if (range.val >= 1) {
      range.val -= 1;
      if (range.min !== undefined) {
        range.min -= 1;
      }
      if (range.max !== undefined) {
        range.max -= 1;
      }
    }
  }
}
</script>
