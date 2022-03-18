<template>
  <v-card flat>
    <v-card-text>
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="(item, index) in interventions" :key="index">
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
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import FormItemComponent, { FormItem } from "../commons/FormItemComponent.vue";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyIntervention extends Vue {
  readonly interventions: { text: string }[] = [
    {
      text: "Diffusion of improved cookstoves TIER 2",
    },
    {
      text: "Diffusion of improved cookstoves TIER 3",
    },
    {
      text: "Diffusion of clean energy TIER 3",
    },
    {
      text: "Diffusion of clean energy TIER 4",
    },
    {
      text: "Diffusion of solar cookers",
    },
  ];
  readonly formItems: FormItem[] = [
    {
      type: "number",
      key: "yearStart",
      label: "Starting year of the diffusion",
    },
    {
      type: "number",
      key: "yearEnd",
      label: "Ending year of the diffusion",
    },
    {
      type: "number",
      key: "cookstovesCount",
      label: "Number of cookstoves per year",
    },
    {
      type: "number",
      key: "replaceTarget",
      label: "Targeted households and coostoves to replace",
    },
    {
      type: "number",
      key: "cost",
      label: "Total cost per year",
    },
    {
      type: "number",
      key: "subsidies",
      label: "Share of subsidies by the donnor",
    },
  ];
}
</script>
