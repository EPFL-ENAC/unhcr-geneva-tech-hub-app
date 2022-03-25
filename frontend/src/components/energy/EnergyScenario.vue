<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @save="save"
  >
    <template v-slot:append>
      <v-expansion-panels v-model="selectedIndex" mandatory>
        <v-expansion-panel
          v-for="scenarioItem in module.scenarios"
          :key="scenarioItem.id"
        >
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-checkbox
                hide-details="auto"
                :input-value="open"
                :label="scenarioItem.name"
                readonly
              ></v-checkbox>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <form-item-component
              v-for="item in formItems"
              :key="item.key"
              v-model="scenarioItem[item.key]"
              v-bind="item"
            ></form-item-component>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </energy-form>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
  SelectOption,
} from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import { Scenario, ScenarioModule, ScenarioTrend } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";
import EnergyFormMixin from "./EnergyFormMixin.vue";

@Component({
  components: {
    FormItemComponent,
    EnergyForm,
  },
})
export default class EnergyScenario extends EnergyFormMixin<ScenarioModule> {
  readonly trendOptions: SelectOption<ScenarioTrend>[] = [
    {
      text: "Stable",
      value: "stable",
    },
    {
      text: "Increase",
      value: "increase",
    },
    {
      text: "Decrease",
      value: "decrease",
    },
  ];
  readonly formItems: FormItem<keyof Scenario>[] = [
    {
      type: "select",
      key: "energyPriceTrend",
      label: "Energy Price",
      options: this.trendOptions,
    },
    {
      type: "select",
      key: "investmentCostTrend",
      label: "Investment Cost",
      options: this.trendOptions,
    },
    {
      type: "number",
      key: "discountRate",
      label: "Discount Rate",
    },
    {
      type: "number",
      key: "incomeRate",
      label: "Average Income Rate per household",
    },
    {
      type: "number",
      key: "demographicGrowth",
      label: "Demographic Growth",
    },
  ];

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
      },
      {
        id: "optimistic",
        name: "Optimistic Scenario",
        energyPriceTrend: "stable",
        investmentCostTrend: "decrease",
        discountRate: 1,
        incomeRate: 1,
        demographicGrowth: 1,
      },
      {
        id: "pessimistic",
        name: "Pessimistic Scenario",
        energyPriceTrend: "increase",
        investmentCostTrend: "increase",
        discountRate: 1,
        incomeRate: 1,
        demographicGrowth: 1,
      },
    ],
  };

  get selectedIndex(): number | undefined {
    return this.module.scenarios.findIndex(
      (item) => item.id === this.module.selectedId
    );
  }

  set selectedIndex(value: number | undefined) {
    this.module.selectedId =
      value !== undefined ? this.module.scenarios[value].id : "";
  }
}
</script>
