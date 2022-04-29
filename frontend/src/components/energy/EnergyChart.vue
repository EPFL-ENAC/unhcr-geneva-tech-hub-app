<template>
  <v-responsive aspect-ratio="2">
    <v-chart autoresize :option="option" />
  </v-responsive>
</template>

<script lang="ts">
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  BarSeriesOption,
  EChartsOption,
  LineSeriesOption,
} from "echarts/types/dist/shared";
import "vue-class-component/hooks";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
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
  @Prop({
    type: Array as () => ChartItem[],
    default: () => [],
  })
  readonly items!: ChartItem[];
  @Prop({ type: Array as () => number[], default: () => [] })
  readonly years!: number[];
  @Prop({ type: String, default: "Year" })
  readonly yearLabel!: string;
  @Prop({ type: Array as () => string[] })
  readonly yLabels: string[] | undefined;

  get option(): EChartsOption {
    return {
      title: {
        text: this.title,
        left: "center",
      },
      tooltip: {
        trigger: this.items.every((item) => item.type === "bar")
          ? "item"
          : "axis",
        axisPointer: {
          type: "cross",
        },
        confine: true,
      },
      grid: {
        containLabel: true,
        left: 32,
        right: 32,
        top: 32,
        bottom: 32,
      },
      xAxis: {
        type: "category",
        data: this.years,
        axisTick: {
          alignWithLabel: true,
        },
        name: this.yearLabel,
        nameLocation: "middle",
        nameGap: 24,
      },
      yAxis: this.yLabels?.map((label) => ({
        type: "value",
        scale: true,
        name: label,
      })) ?? {
        type: "value",
        scale: true,
      },
      series: this.items.flatMap((item) => {
        const option: BarSeriesOption | LineSeriesOption = {
          name: item.name,
          stack: item.type === "bar" ? "total" : undefined,
          type: item.type,
          yAxisIndex: item.yAxisIndex,
          data: item.data,
        };
        return option;
      }),
      color: this.items.flatMap((item) => item.color),
    };
  }
}

export interface ChartItem {
  type: ChartItemType;
  name: string;
  data: number[];
  color: string;
  yAxisIndex?: number;
}

export type ChartItemType = "bar" | "line";
</script>
