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
    <v-row class="d-none d-print-flex">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="resultTable"
          :search="search"
          dense
        >
          <template #[`item.value`]="props">
            <span :title="props.item.value"
              >{{
                props.item.value |
                  formatNumberGhg({
                    style: "percent",
                  })
              }}
            </span>
          </template>
          <template #[`item._id`]="props">
            <span :title="props.item._id"
              >{{ countriesMap?.[props.item._id]?.name ?? "default" }}
              <country-flag
                v-if="props.item._id !== 'default'"
                :country="props.item._id"
                size="small"
              />
            </span>
          </template>
        </v-data-table>
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
import { get as _get } from "lodash";
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
    // FOR color blindness we don't use UNHCR color anymore
    return [
      {
        color: `rgba(111,222,110,${this.alpha})`,
        name: "Energy - Facilities",
        category: "energy",
        subcategory: "facilities",
        stack: "co2",
      },
      {
        color: `rgba(255,66,66,${this.beta})`,
        name: "Energy - Cooking",
        category: "energy",
        subcategory: "cooking",
        stack: "co2",
      },
      {
        color: `rgba(166,145,174,${this.delta})`,
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
        name: "Domestic solid waste",
        category: "wash",
        subcategory: "domesticsolidwaste",
        stack: "co2",
      },
    ];
  }

  public get resultTable(): Record<
    string,
    number | boolean | undefined | string
  >[] {
    return this.items.map((item) => ({
      name: item.name,
      baseline: this.$options.filters?.formatNumberGhg(
        _get(
          this.project,
          `${item.category}.${String(
            item.subcategory
          )}.baseline.results.totalCO2Emission`
        ),
        {
          suffix: "(tCO2e/year)",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }
      ),

      endline: this.$options.filters?.formatNumberGhg(
        _get(
          this.project,
          `${item.category}.${String(
            item.subcategory
          )}.endline.results.totalCO2Emission`
        ),
        {
          suffix: "(tCO2e/year)",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }
      ),
    }));
  }

  search = "";

  public get headers(): HeaderInterface[] {
    return [
      {
        text: "Type",
        value: "name",
      },
      {
        text: "Baseline",
        value: "baseline",
      },
      {
        text: "Endline",
        value: "endline",
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
                suffix: "(tCO2e/year)",
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

type Config = EnergyConfig | WashConfig;

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

interface HeaderInterface {
  text: string;
  value: string;
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
