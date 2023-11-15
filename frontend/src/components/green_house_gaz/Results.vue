<template>
  <v-container fluid>
    <survey-item-title title-key="Results" />
    <v-row>
      <v-col class="about-first-column d-flex justify-center" :cols="12">
        <v-responsive aspect-ratio="4" min-height="200" max-height="100%">
          <v-chart autoresize :option="option"></v-chart>
        </v-responsive>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6" class="d-flex justify-center">
        <h3>
          Total Baseline CO2 Emissions:
          <span :title="String(totalBaseline)">{{
            totalBaseline |
              formatNumberGhg({
                suffix: "(tCO2e/year)",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })
          }}</span>
        </h3>
      </v-col>
      <v-col :cols="6" class="d-flex flex-column justify-center">
        <h3>
          Total Endline CO2 Emissions:
          <span :title="String(totalEndline)">{{
            totalEndline |
              formatNumberGhg({
                suffix: "(tCO2e/year)",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })
          }}</span>
        </h3>
        <br />
        <h3>
          <v-icon :class="iconClass" :color="color"> $mdiTriangle </v-icon>
          <span
            :class="{
              'result-positive': totalChange > 0,
              'result-negative': totalChange < 0,
            }"
          >
            {{
              totalChange |
                formatNumberGhg({
                  style: "percent",
                  signDisplay: "exceptZero",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })
            }}
            ({{
              (totalEndline - totalBaseline) |
                formatNumberGhg({
                  suffix: "tCO2e/year)",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })
            }}
          </span>
        </h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computeChangeInEmission } from "@/components/green_house_gaz/generic/changeInEmission";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import {
  EnergySurvey,
  FormSurvey,
  GreenHouseGaz,
  MaterialSurvey,
  OffsetSurvey,
  WashSurvey,
} from "@/store/GhgInterface";

import { BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  SingleAxisComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarSeriesOption, EChartsOption } from "echarts/types/dist/shared";
import "vue-class-component/hooks";
import VChart from "vue-echarts";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

use([
  CanvasRenderer,
  SingleAxisComponent,
  BarChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  MarkPointComponent,
]);

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  components: {
    VChart,
    SurveyItemTitle,
  },
})
export default class Results extends Vue {
  project!: GreenHouseGaz;

  public get totalChange(): number {
    return computeChangeInEmission(this.totalBaseline, this.totalEndline);
  }

  public totalResult(key: keyof FormSurvey): number {
    return this.items
      .map((item) => {
        const surveyCategory = this.project[item.category] ?? {};
        const subcat: FormSurvey =
          surveyCategory[item.subcategory as keyof typeof surveyCategory] ?? {};
        const results = subcat[key]?.results ?? {};
        const resultValue =
          (item.resultKey
            ? results?.[item.resultKey as keyof typeof results]
            : results?.totalCO2Emission) ?? 0;

        return resultValue * (item.sign === "neg" ? -1 : 1);
      })
      .reduce((acc: number, el: number) => acc + el, 0);
  }

  public get totalBaseline(): number {
    return this.totalResult("baseline");
  }

  public get totalEndline(): number {
    return this.totalResult("endline");
  }

  get iconClass(): string {
    if (this.totalChange > 0) {
      return "";
    } else if (this.totalChange < 0) {
      return "rotate-180";
    } else {
      return "rotate-90";
    }
  }

  get color(): string {
    if (this.totalChange > 0) {
      return "red";
    } else if (this.totalChange < 0) {
      return "green";
    } else {
      return "black";
    }
  }

  alpha = 0.4;
  beta = 0.6;
  delta = 0.8;
  omega = 1;

  public get items(): Config[] {
    return [
      {
        color: `rgba(157,72,56,${this.alpha})`,
        name: "Energy - Facilities",
        category: "energy",
        subcategory: "facilities",
        stack: "co2",
      },
      {
        color: `rgba(157,72,56,${this.beta})`,
        name: "Energy - Cooking",
        category: "energy",
        subcategory: "cooking",
        stack: "co2",
      },
      {
        color: `rgba(157,72,56,${this.delta})`,
        name: "Energy - Lighting",
        category: "energy",
        subcategory: "lighting",
        stack: "co2",
      },
      {
        color: `rgba(32,135,200,${this.omega})`,
        name: "WASH - Water Supply",
        resultKey: "totalCO2Emission",
        category: "wash",
        subcategory: "watersupply",
        stack: "co2",
      },
      {
        color: `rgba(1218,182,0,${this.delta})`,
        name: "Material - Domestic solid waste",
        category: "material",
        subcategory: "domesticsolidwaste",
        stack: "co2",
      },
    ];
  }

  public get option(): EChartsOption {
    const result: EChartsOption = {
      tooltip: {
        trigger: "item",
        renderMode: "html",
        confine: false,
        appendToBody: true,
        // formatter: '{a} {b} {c} {d} {e} ',
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          axisLabel: {
            fontSize: "1.5rem",
            fontWeight: "normal",
          },
          data: ["Baseline", "Endline"],
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: this.items.map((item: Config): BarSeriesOption => {
        let baseline = 0;
        let endline = 0;
        const surveyCategory = this.project[item.category] ?? {};
        const subcat: FormSurvey =
          surveyCategory[item.subcategory as keyof typeof surveyCategory] ?? {};
        const baseRes = subcat?.baseline?.results ?? {};
        const endRes = subcat?.endline?.results ?? {};
        baseline =
          (item.resultKey
            ? baseRes?.[item.resultKey as keyof typeof baseRes]
            : baseRes?.totalCO2Emission) ?? 0;
        endline =
          (item.resultKey
            ? endRes?.[item.resultKey as keyof typeof endRes]
            : endRes?.totalCO2Emission) ?? 0;

        return {
          data: [baseline, endline],
          emphasis: {
            focus: "series",
          },
          tooltip: {
            valueFormatter: (value): string => {
              return `${this.$options.filters?.formatNumberGhg(value, {
                suffix: '(tCO2e/year)',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })}`;
            },
          },
          type: "bar",
          color: item.color,
          name: item.name,
          stack: item.stack,
        };
      }),
    };
    return result;
  }
}

type Config = EnergyConfig | WashConfig | MaterialConfig | OffsetConfig;

interface ConfigBase {
  sign?: string;
  color: string;
  name: string;
  stack: string;
  resultKey?: string;
}

interface EnergyConfig extends ConfigBase {
  category: "energy";
  subcategory: keyof EnergySurvey;
}
interface WashConfig extends ConfigBase {
  category: "wash";
  subcategory: keyof WashSurvey;
}
interface MaterialConfig extends ConfigBase {
  category: "material";
  subcategory: keyof MaterialSurvey;
}
interface OffsetConfig extends ConfigBase {
  category: "offset";
  subcategory: keyof OffsetSurvey;
}
</script>

<style lang="scss" scoped>
::v-deep .result-negative {
  color: green;
}
::v-deep .result-positive {
  color: red;
}
</style>
