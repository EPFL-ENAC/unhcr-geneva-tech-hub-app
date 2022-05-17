<template>
  <v-responsive aspect-ratio="2">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { formatNumber } from "@/plugins/filters";
import { TooltipFormatterParams } from "@/utils/echarts";
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
  TopLevelFormatterParams,
  YAXisOption,
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
  @Prop({ type: Boolean, default: false })
  readonly yInverse!: boolean;

  get option(): EChartsOption {
    return {
      title: {
        text: this.title,
        left: "center",
      },
      tooltip: {
        trigger: "item",
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
      yAxis: ((this.yLabels ?? [undefined]) as (string | undefined)[]).map(
        (label?: string) => {
          const option: YAXisOption = {
            type: "value",
            scale: true,
            name: label,
            nameLocation: this.yInverse ? "start" : "end",
            axisLabel: {
              formatter: (value: number) => formatNumber(value),
            },
            inverse: this.yInverse,
          };
          return option;
        }
      ),
      series: this.items.flatMap((item) => {
        const tooltips = item.tooltips;
        const decimal = 0;
        const option: BarSeriesOption | LineSeriesOption = {
          name: item.name,
          stack: item.type === "bar" ? "total" : undefined,
          type: item.type,
          yAxisIndex: item.yAxisIndex,
          data: item.data,
          tooltip: {
            formatter: tooltips
              ? (params: TopLevelFormatterParams) => {
                  const p = params as TooltipFormatterParams<
                    Record<string, number>
                  >;
                  const unitText = item.unit ? ` [${item.unit}]` : "";
                  const text = tooltips
                    .map(
                      (t) =>
                        `<span>${
                          t.name
                        }:&nbsp;</span><span style="float:right"><b>${formatNumber(
                          p.data[t.key],
                          0,
                          decimal
                        )}${unitText}</b></span>`
                    )
                    .join("<br>");
                  return `${p.seriesName}<br>${text}`;
                }
              : undefined,
            valueFormatter: item.unit
              ? (value) =>
                  `${formatNumber(value as number, 0, decimal)} [${item.unit}]`
              : (value) => formatNumber(value as number, 0, decimal),
          },
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
  data: (number | Record<string, number>)[];
  color: string;
  yAxisIndex?: number;
  unit?: string;
  tooltips?: {
    name: string;
    key: string;
  }[];
}

export type ChartItemType = "bar" | "line";
</script>
