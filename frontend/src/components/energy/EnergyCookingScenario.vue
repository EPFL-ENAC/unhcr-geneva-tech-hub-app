<template>
  <v-row justify="center">
    <v-col cols="auto">
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
    </v-col>
  </v-row>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
  SelectOption,
} from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import { Scenario, ScenarioModule, ScenarioTrend } from "@/models/energyModel";
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
      readonly: true,
    } as FormItem<keyof Scenario, ScenarioTrend>,
    {
      type: "select",
      key: "investmentCostTrend",
      label: "Investment Cost",
      options: this.trendOptions,
      readonly: true,
    } as FormItem<keyof Scenario, ScenarioTrend>,
    {
      type: "range",
      key: "discountRate",
      label: "Discount Rate",
      subtype: "rate",
    },
    {
      type: "range",
      key: "incomeRate",
      label: "Average Income Rate per household",
      subtype: "rate",
    },
    {
      type: "range",
      key: "demographicGrowth",
      label: "Growth rate of the population",
      subtype: "rate",
    },
    {
      type: "range",
      key: "fuelPriceRate",
      label: "Fuel Price Increase Rate",
      subtype: "rate",
    },
  ];

  @VModel({ type: Object as () => ScenarioModule })
  module!: ScenarioModule;

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
