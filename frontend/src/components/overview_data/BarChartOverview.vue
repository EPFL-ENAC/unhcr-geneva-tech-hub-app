<template>
  <v-responsive v-bind="{ ...$attrs, ...$props }" class="justify-center">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { BarChart, BoxplotChart } from "echarts/charts";

import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts/types/dist/shared";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";
use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  GridComponent,
  BoxplotChart,
  DatasetComponent,
  TransformComponent,
]);

@Component({
  components: {
    VChart,
  },
})
export default class BarChartOverview extends Vue {
  @Prop({ type: [Object], default: () => ({}) })
  readonly option!: EChartsOption;
  @Prop({ type: [String], default: "250px" })
  readonly minHeight!: string;
}
</script>

<style></style>
