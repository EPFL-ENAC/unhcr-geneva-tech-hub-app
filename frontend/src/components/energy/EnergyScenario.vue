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
      .flatMap((scenario) => {
        if (!scenario.years) {
          scenario.years = [
            {
              yearIndex: 0,
              householdSize: {
                val: this.householdSize,
              },
              discountRate: scenario.discountRate ?? { val: 1 },
              incomeRate: scenario.incomeRate ?? { val: 1 },
              demographicGrowth: scenario.demographicGrowth ?? { val: 1 },
              fuelPriceRates: Object.fromEntries(
                cookingFuelIds.map((id) => [
                  id,
                  scenario.fuelPriceRate ?? { val: 1 },
                ])
              ) as Record<CookingFuelId, RangeModel>,
            },
          ];
        }
        return scenario.years;
      })
      .forEach((scenario) => {
        if (typeof scenario.householdSize === "number") {
          scenario.householdSize = {
            val: scenario.householdSize,
          };
        } else if (scenario.householdSize === undefined) {
          scenario.householdSize = {
            val: this.householdSize,
          };
        }
        if (typeof scenario.discountRate === "number") {
          scenario.discountRate = {
            val: scenario.discountRate,
          };
        } else if (scenario.discountRate === undefined) {
          scenario.discountRate = {
            val: 1,
          };
        }
        if (typeof scenario.incomeRate === "number") {
          scenario.incomeRate = {
            val: scenario.incomeRate,
          };
        } else if (scenario.incomeRate === undefined) {
          scenario.incomeRate = {
            val: 1,
          };
        }
        if (typeof scenario.demographicGrowth === "number") {
          scenario.demographicGrowth = {
            val: scenario.demographicGrowth,
          };
        } else if (scenario.demographicGrowth === undefined) {
          scenario.demographicGrowth = {
            val: 1,
          };
        }
        if (scenario.fuelPriceRates === undefined) {
          scenario.fuelPriceRates = Object.fromEntries(
            cookingFuelIds.map((id) => [id, { val: 1 }])
          ) as Record<CookingFuelId, RangeModel>;
        }
      });
  }
}
</script>
