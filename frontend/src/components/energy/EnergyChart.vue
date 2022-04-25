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
import { EChartsOption } from "echarts/types/dist/shared";
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
      yAxis: {
        type: "value",
        scale: true,
      },
      series: this.items.flatMap((item) => {
        return {
          name: item.name,
          stack: item.type === "bar" ? "total" : undefined,
          type: item.type,
          data: item.data,
        };
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
}

export type ChartItemType = "bar" | "line";
</script>
