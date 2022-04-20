<template>
  <v-responsive aspect-ratio="1">
    <v-chart autoresize :option="option" />
  </v-responsive>
</template>

<script lang="ts">
import { SocioEconomicCategory } from "@/models/energyModel";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts/types/dist/shared";
import "vue-class-component/hooks";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
]);

@Component({
  components: {
    VChart,
  },
})
export default class EnergyChart extends Vue {
  @Prop(String)
  readonly title: string | undefined;
  @Prop({ type: Array as () => (string | number)[], default: () => [] })
  readonly xData!: (string | number)[];
  @Prop({
    type: Object as () => Record<SocioEconomicCategory, number[]>,
    default: () => ({}),
  })
  readonly yData!: Record<SocioEconomicCategory, number[]>;
  @Prop({ type: String, default: "Year" })
  readonly xLabel!: string;
  @Prop({ type: String, default: "" })
  readonly yLabel!: string;

  get option(): EChartsOption {
    return {
      title: {
        text: this.title,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        type: "scroll",
        top: 24,
      },
      grid: {
        containLabel: true,
        left: 32,
        right: 32,
      },
      xAxis: {
        type: "category",
        data: this.xData,
        axisTick: {
          alignWithLabel: true,
        },
        name: this.xLabel,
        nameLocation: "middle",
        nameGap: 24,
      },
      yAxis: {
        type: "value",
        name: this.yLabel,
        nameLocation: "middle",
        nameRotate: 90,
        nameGap: 82,
      },
      series: Object.entries(this.yData).map(([cat, data]) => ({
        name: this.$t(`energy.${cat}`).toString(),
        stack: "total",
        type: "bar",
        data: data,
      })),
    };
  }
}
</script>
