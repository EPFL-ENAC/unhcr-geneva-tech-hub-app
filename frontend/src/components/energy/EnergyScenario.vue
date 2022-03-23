<template>
  <v-card flat>
    <v-card-text>
      <v-expansion-panels v-model="selectedIndex">
        <v-expansion-panel
          v-for="(scenarioItem, index) in scenarios"
          :key="index"
        >
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-checkbox
                :value="open"
                hide-details="auto"
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
  SelectOption,
} from "@/components/commons/FormItemComponent.vue";
import { Scenario, ScenarioModule, ScenarioTrend } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyScenario extends Vue {
  readonly defaultScenarios: Scenario[] = [
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
  ];
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

  @Prop({ type: Object as () => ScenarioModule })
  readonly module: ScenarioModule | undefined;

  selectedIndex: number | null = null;
  scenarios: Scenario[] = this.defaultScenarios;
}
</script>
