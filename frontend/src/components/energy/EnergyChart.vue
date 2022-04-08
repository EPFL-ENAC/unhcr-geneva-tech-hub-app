<template>
  <v-responsive aspect-ratio="1">
    <v-chart autoresize :option="option" />
  </v-responsive>
</template>

<script lang="ts">
import { SocioEconomicCategory } from "@/models/energyModel";
import { LineChart } from "echarts/charts";
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
  LineChart,
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
        left: 24,
        right: 24,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: this.xData,
      },
      yAxis: {
        type: "value",
      },
      series: Object.entries(this.yData).map(([cat, data]) => ({
        name: this.$t(`energy.${cat}`).toString(),
        stack: "total",
        type: "line",
        areaStyle: {},
        data: data,
      })),
    };
  }
}
</script>
