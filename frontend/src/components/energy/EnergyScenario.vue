<template>
  <v-card flat>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(item, index) in scenarios" :key="index">
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-checkbox
                :value="open"
                hide-details="auto"
                :label="item.text"
              ></v-checkbox>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <form-item-component
              v-for="item in formItems"
              :key="item.key"
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
} from "@/components/commons/FormItemComponent.vue";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyScenario extends Vue {
  readonly scenarios: { text: string }[] = [
    {
      text: "Business as Usual",
    },
    {
      text: "Optimistic scenario",
    },
    {
      text: "Pessimistic scenario",
    },
  ];
  readonly formItems: FormItem[] = [
    {
      type: "select",
      key: "energyPrice",
      label: "Energy Price",
      options: [
        {
          text: "Stable",
          value: "stable",
        },
        {
          text: "Increase",
          value: "increase",
        },
      ],
    },
    {
      type: "select",
      key: "investmentCost",
      label: "Investment Cost",
      options: [
        {
          text: "Stable",
          value: "stable",
        },
        {
          text: "Increase",
          value: "increase",
        },
      ],
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
    {
      type: "number",
      key: "householdSize",
      label: "Average Household Size",
    },
  ];
}
</script>
