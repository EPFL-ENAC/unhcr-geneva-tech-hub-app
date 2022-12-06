<template>
  <v-card>
    <v-card-text>
      <div v-for="cat in categories" :key="cat">
        <v-icon :color="getColor(cat)">$mdiCheckboxBlank</v-icon>
        <span>{{ $t("energy." + cat) }}&nbsp;</span>
      </div>
      <div>
        <v-icon :color="totalColor">$mdiCheckboxBlank</v-icon>
        <span>Total&nbsp;</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { socioEconomicCategories } from "@/models/energyModel";
import { cccmColors } from "@/plugins/vuetify";
import { getColor } from "@/utils/energy";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EnergyLegend extends Vue {
  readonly categories = socioEconomicCategories;
  readonly getColor = getColor;
  readonly totalColor = cccmColors.primary();
}
</script>
