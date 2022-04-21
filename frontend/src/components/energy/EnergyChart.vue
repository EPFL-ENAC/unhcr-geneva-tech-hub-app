<template>
  <v-responsive aspect-ratio="2">
    <v-chart autoresize :option="option" />
  </v-responsive>
</template>

<script lang="ts">
import { SocioEconomicCategory } from "@/models/energyModel";
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
      yAxis: {
        type: "value",
      },
      series: this.items.flatMap((item) => {
        return Object.entries(item.data).map(([cat, data]) => {
          const name = this.$t(`energy.${cat}`).toString();
          return {
            name: item.prefix ? `${item.prefix} ${name}` : name,
            stack: item.type === "bar" ? "total" : undefined,
            type: item.type,
            data: data,
          };
        });
      }),
      color: this.items.flatMap(() => {
        // https://data2.unhcr.org/en/documents/download/60115
        return ["#f8e4d2", "#f0b89e", "#d48c74", "#9d4838", "#545456"];
      }),
    };
  }
}

export interface ChartItem {
  type: "bar" | "line";
  data: Record<SocioEconomicCategory, number[]>;
  prefix?: string;
}
</script>
