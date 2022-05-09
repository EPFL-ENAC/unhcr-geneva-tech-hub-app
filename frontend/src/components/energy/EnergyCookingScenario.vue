<template>
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

<script lang="ts">
import FormItemComponent, {
  FormItem,
  SelectOption,
} from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import {
  HouseholdCookingModule,
  Scenario,
  ScenarioTrend,
} from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, VModel, Vue } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
    EnergyForm,
  },
})
export default class EnergyCookingScenario extends Vue {
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
    } as FormItem<keyof Scenario, ScenarioTrend>,
    {
      type: "select",
      key: "investmentCostTrend",
      label: "Investment Cost",
      options: this.trendOptions,
    } as FormItem<keyof Scenario, ScenarioTrend>,
    {
      type: "number",
      key: "discountRate",
      label: "Discount Rate",
      subtype: "rate",
    },
    {
      type: "number",
      key: "incomeRate",
      label: "Average Income Rate per household",
      subtype: "rate",
    },
    {
      type: "number",
      key: "demographicGrowth",
      label: "Demographic Increase Rate",
      subtype: "rate",
    },
    {
      type: "number",
      key: "fuelPriceRate",
      label: "Fuel Price Increase Rate",
      subtype: "rate",
    },
  ];

  @VModel({ type: Object as () => HouseholdCookingModule })
  module!: HouseholdCookingModule;

  get selectedIndex(): number | undefined {
    return this.module.scenarios.findIndex(
      (item) => item.id === this.module.scenarioId
    );
  }

  set selectedIndex(value: number | undefined) {
    this.module.scenarioId =
      value !== undefined ? this.module.scenarios[value].id : "";
  }
}
</script>
