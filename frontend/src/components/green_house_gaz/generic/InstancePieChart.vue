<template>
  <v-responsive height="200px" width="128px">
    <v-chart autoresize :option="getChartOption(results)"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { cccmColors } from "@/plugins/vuetify";
import {
  EnergyFacilityInterventionItemResult,
  EnergyFacilityItemResult,
  SurveyResult,
} from "@/store/GhgInterface";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts/types/dist/shared";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";

use([CanvasRenderer, PieChart, TooltipComponent, TitleComponent]);

@Component({
  components: {
    VChart,
  },
})
export default class InstancePieChart extends Vue {
  @Prop({ type: [Object], default: () => ({}) })
  readonly results!: SurveyResult;

  private kWhDataFacilities(
    item: EnergyFacilityItemResult | EnergyFacilityInterventionItemResult
  ): EchartDataSerie[] {
    const data: EchartDataSerie[] = [];
    if (item.gridPower) {
      data.push({
        id: "gridPower",
        name: "Grid",
        value: item.gridPower,
        colorBy: "series",
        itemStyle: {
          color: cccmColors.primary(),
        },
      });
    }
    if (item.dieselPower) {
      data.push({
        id: "fuelUsage", // TODO: not sure if it works it was dieselLiters
        name: "Diesel",
        value: item.dieselPower,
        colorBy: "series",
        itemStyle: {
          color: cccmColors.secondary1(),
        },
      });
    }
    if (item.renewablePower) {
      data.push({
        id: "renewablePower",
        name: "Solar",
        value: item.renewablePower,
        colorBy: "series",
        color: cccmColors.green(),
        itemStyle: {
          color: cccmColors.green(),
        },
      });
    }
    return data;
  }

  public getChartOption(
    item: EnergyFacilityItemResult | EnergyFacilityInterventionItemResult
  ): EChartsOption {
    // "Distribution of tCO2e/year per facilities"
    const data = this.kWhDataFacilities(item);
    // energy mix
    return {
      title: {
        text: `Energy Mix (${this.$options.filters?.formatNumberGhg(
          item.totalPower,
          {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }
        )} kWh)`, //"Distribution of tCO2e/year per facilities",
        textStyle: {
          fontSize: 12,
          width: "500px",
          lineHeight: 12,
        },
        top: "auto",
        padding: 0,
        left: "center",
      },

      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "pie",
          radius: "60%",
          tooltip: {
            valueFormatter: (value) =>
              this.$options.filters?.formatNumberGhg(value, {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }) + " (kWh)",
          },
          label: {
            overflow: "break",
          },
          data,
        },
      ],
    };
  }
}

interface EchartDataSerie {
  id: string;
  name: string;
  value: number;
  color?: string;
  colorBy?: string;
  itemStyle?: {
    color: string;
  };
}
</script>

<style></style>
