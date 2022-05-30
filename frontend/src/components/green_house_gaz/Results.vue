<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h2 class="text-h4 project__h3 font-weight-medium">Results</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
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
          {{ totalBaseline | formatNumber }} (tCO2e/year)
        </h3>
      </v-col>
      <v-col :cols="6" class="d-flex justify-center">
        <h3>
          Total Endline CO2 Emissions:
          {{ totalEndline | formatNumber }} (tCO2e/year)

          <v-icon :color="color">
            {{ icon }}
          </v-icon>
          <span
            :class="{
              'result-positive': totalChange > 0,
              'result-negative': totalChange < 0,
            }"
          >
            {{ totalChange > 0 ? "+" : "" }}
            {{ totalChange | formatNumber(0, 0, true, "percent") }}
          </span>
        </h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computeChangeInEmission } from "@/components/green_house_gaz/changeInEmission";
import {
  EnergySurvey,
  FormSurvey,
  MaterialSurvey,
  OffsetSurvey,
  Survey,
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
import { Component, Prop, Vue } from "vue-property-decorator";
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
  },
})
export default class Results extends Vue {
  @Prop([Object, Array])
  readonly survey: Survey | undefined;

  public get totalChange(): number {
    return computeChangeInEmission(this.totalBaseline, this.totalEndline);
  }

  public totalResult(key: keyof FormSurvey): number {
    if (this.survey) {
      const survey = this.survey;
      return this.items
        .map((item) => {
          const surveyCategory = survey[item.category] ?? {};
          const subcat: FormSurvey =
            surveyCategory[item.subcategory as keyof typeof surveyCategory] ??
            {};
          const results = subcat[key]?.results ?? {};
          const resultValue =
            (item.resultKey
              ? results?.[item.resultKey as keyof typeof results]
              : results?.totalCO2Emission) ?? 0;

          return resultValue * (item.sign === "neg" ? -1 : 1);
        })
        .reduce((acc: number, el: number) => acc + el, 0);
    }
    return 0;
  }

  public get totalBaseline(): number {
    return this.totalResult("baseline");
  }

  public get totalEndline(): number {
    return this.totalResult("endline");
  }

  get icon(): string {
    if (this.totalChange > 0) {
      return "mdi-triangle";
    } else if (this.totalChange < 0) {
      return "mdi-triangle mdi-rotate-180";
    } else {
      return "mdi-triangle mdi-rotate-90";
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
        color: `rgba(157,72,56,${this.omega})`,
        name: "Energy - Pumping",
        category: "energy",
        subcategory: "pumping",
        stack: "co2",
      },
      {
        color: `rgba(32,135,200,${this.omega})`,
        name: "Wash - Trucking",
        resultKey: "CO2_WSH_TRB",
        category: "wash",
        subcategory: "trucking",
        stack: "co2",
      },
      /*
      248, 237, 98
      218,182,0
      169,134,0
      */
      {
        color: `rgba(218,182,0, ${this.alpha})`,
        name: "Material - Shelter",
        category: "material",
        subcategory: "shelter",
        stack: "co2",
      },
      {
        color: `rgba(218,182,0,${this.beta})`,
        name: "Material - CRI",
        category: "material",
        subcategory: "cri",
        stack: "co2",
      },
      {
        color: `rgba(1218,182,0,${this.delta})`,
        name: "Material - HH Waste",
        category: "material",
        subcategory: "hhwaste",
        stack: "co2",
      },
      // https://unhcr-web.github.io/unhcRstyle/docs/reference/unhcr_green.html
      {
        sign: "neg",
        color: `rgba(1,178,152,${this.omega})`,
        name: "Offset - Tree planting",
        category: "offset",
        subcategory: "treeplanting",
        stack: "offset",
      },
    ];
  }

  public get option(): EChartsOption {
    const result: EChartsOption = {
      tooltip: {
        trigger: "axis",
        renderMode: "html",
        confine: false,
        appendToBody: true,
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
        if (this.survey) {
          const surveyCategory = this.survey[item.category] ?? {};
          const subcat: FormSurvey =
            surveyCategory[item.subcategory as keyof typeof surveyCategory] ??
            {};
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
        }

        return {
          data: [baseline, endline],
          emphasis: {
            focus: "series",
          },
          tooltip: {
            valueFormatter: (value): string => {
              return `${this.$options.filters?.formatNumber(
                value
              )} (tCO2e/year)`;
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
