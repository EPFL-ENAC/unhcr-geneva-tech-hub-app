<template>
  <v-container v-if="shelter" fluid>
    <v-row>
      <v-col class="d-flex">
        <h2 class="text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet elevation="2" rounded>
          <v-container fluid>
            <v-row>
              <v-col>
                <h2>Environmental performance</h2>
              </v-col>
            </v-row>
            <v-row v-for="(option, idx) in options" :key="idx">
              <v-col :cols="3">
                <v-layout class="align-center">
                  <span v-if="option.config.subpart" class="ml-4">
                    {{ option.config.title }}:</span
                  >
                  <h2 v-else>{{ option.config.title }}:</h2>
                  <span class="ml-4">
                    <span v-if="option.config.unit === '%'">
                      {{
                        scorecard[option.config.id] |
                          formatNumber(0, 0, false, "percent")
                      }}
                    </span>
                    <span v-else>
                      {{ scorecard[option.config.id] | formatNumber() }}
                      {{ option.config.unit }}
                    </span>
                  </span>
                  <v-tooltip right :max-width="300">
                    <template #activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon> $mdiInformation </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ option.config.description }}</span>
                  </v-tooltip>
                </v-layout>
              </v-col>
              <v-col class="about-first-column d-flex justify-center" :cols="9">
                <v-responsive aspect-ratio="5" min-height="20" max-height="120">
                  <v-chart autoresize :option="options[idx]"></v-chart>
                </v-responsive>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { ScoreCard, Shelter } from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import {
  alpha,
  alphaSecondary,
  shelterColors,
} from "@/views/shelter_sustainability/shelterTypeColors";
import { ScatterChart } from "echarts/charts";
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
import { CallbackDataParams, EChartsOption } from "echarts/types/dist/shared";
import PouchDB from "pouchdb";
import VChart from "vue-echarts";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
use([
  CanvasRenderer,
  SingleAxisComponent,
  ScatterChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  MarkPointComponent,
]);

@Component({
  computed: {
    ...mapGetters("ShelterModule", [
      "shelter",
      "scorecards",
      "scorecard",
      "db",
    ]),
  },
  methods: {
    ...mapActions("ShelterModule", ["getScorecards"]),
  },
  components: {
    VChart,
    InfoTooltip,
  },
})
/** Project */
export default class Step8ScoreCard extends Vue {
  shelter!: Shelter;
  getScorecards!: (id: string) => Promise<ScoreCard[]>;
  db!: SyncDatabase<Shelter> | null;
  scorecards!: ScoreCard[];

  alpha = alpha;
  alphaSecondary = alphaSecondary;
  colors = shelterColors;
  infoTooltipText = infoTooltipText;
  configs = [
    {
      id: "co2",
      min: 0,
      max: function (): undefined {
        return undefined; // don't know why but it truncates properly at . 2 decimals
      },
      title: "Embodied CO2",
      unit: "kg-CO2/year/m²",
      subpart: true,
      description:
        "Embodied CO2 score describes kg-CO2 per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
      colors: {
        primary: `rgba(84,84,86,1)`, // secondary colour 1
        secondary: `rgba(84,84,86,${this.alpha})`,
      },
    },
    {
      id: "h2o",
      min: 0,
      max: function (): undefined {
        return undefined; // don't know why but it truncates properly at . 2 decimals
      },
      title: "Embodied water",
      subpart: true,
      unit: "L/year/m²",
      description:
        "Embodied H2O score describes litres-H2O per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
      colors: {
        primary: `rgba(32,135,200,1)`, // primary colour
        secondary: `rgba(32,135,200,${this.alpha})`,
      },
    },

    {
      id: "weight",
      title: "Material efficiency",
      subpart: true,
      min: 0,
      max: function (): undefined {
        return undefined; // don't know why but it truncates properly at . 2 decimals
      },
      unit: "kg/year/m²",
      description:
        "Material efficiency score describes total weight (kg) per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
      colors: {
        primary: `rgba(157,72,56,1)`, // secondary colour 2
        secondary: `rgba(157,72,56,${this.alpha})`,
      },
    },

    {
      id: "affordability",
      title: "Affordability",
      min: 0,
      // max: 100,
      unit: "$/year/m²",
      description:
        "Affordability score describes shelter cost (USD) per year (of intended use) per square meter (of habitable space), enabling comparison across shelters of differing size and durability.",
      colors: {
        primary: `rgba(248, 228, 210, 1)`, // seconday colour 5
        secondary: `rgba(248, 228, 210, ${this.alpha})`,
      },
    },
    {
      id: "techPerf",
      min: 0,
      max: 100,
      title: "Technical performance",
      unit: "%",
      description:
        "Technical performance score is calculated from shelter characteristics identified in relation to: hazard-related structural performance, internal comfort, safety and security, and construction techniques.",
      colors: {
        primary: `rgba(212,140,116)`, // secondary colour 3
        secondary: `rgba(212,140,116, ${this.alpha})`,
      },
    },
    {
      id: "habitability",
      min: 0,
      max: 100,
      unit: "%",
      title: "Habitability",
      description:
        "Habitability score is calculated from shelter characteristics identified in relation to: floor area, accessibility, privacy, artificial lighting, and complimentary facilities.",
      colors: {
        primary: `rgba(240,184,158,1)`, // secondary colour 4
        secondary: `rgba(240,184,158,${this.alpha})`,
      },
    },
  ];

  get scorecard(): ScoreCard {
    return this.shelter?.scorecard ?? ({} as ScoreCard);
  }

  get options(): EChartsOption[] {
    const scorecards = this.scorecards ?? [];
    const title: Record<string, string | number>[] = [];
    const singleAxis: Record<
      string,
      | string
      | number
      | boolean
      | Record<string, number>
      | ((v: MinMax) => undefined)
    >[] = [];
    const series: Record<
      string,
      string | number | boolean | Serie[] | SymbSizeFn
    >[] = [];
    this.configs.forEach((config: Config): void => {
      singleAxis.push({
        left: 100,
        type: "value",
        boundaryGap: false,
        height: "10%",
        axisLabel: {
          interval: 2,
        },
        min: config.min ?? "dataMin",
        max: config.max ?? "dataMax",
      });
      series.push({
        singleAxisIndex: 0,
        coordinateSystem: "singleAxis",
        type: "scatter",
        data:
          scorecards?.map((item: ScoreCard) => {
            const scor = item as ScoreCardScatter;
            const key = config.id as ScoreCardsKey;
            const shelter_type = scor.shelter_type as colorType;
            const colors = this.colors[shelter_type];
            let firstValue = parseFloat(scor[key].toFixed(3));
            if (key === "habitability" || key === "techPerf") {
              firstValue = firstValue * 100;
            }
            scor[key] = firstValue;
            return {
              value: [firstValue, scor.selected ? 4 : 2, key, scor, config],
              itemStyle: {
                color: scor.selected ? colors.primary : colors.secondary, //config.colors.secondary,
              },
              symbol: scor.selected ? "diamond" : "circle",
              symbolSize: scor.selected ? 24 : 8,
            };
          }) ?? [],
        symbolSize: (dataItem: number[]) => dataItem[1] * 4,
      });
    });
    return this.configs.map((config, idx) => ({
      title: title[idx],
      singleAxis: singleAxis[idx],
      series: series[idx],
      config,
      legend: {
        type: "scroll",
        top: 20,
      },
      grid: {
        bottom: 12,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any): string => {
          const formatNumber = this.$options.filters?.formatNumber;
          if (!formatNumber) {
            return "error: format number undefined";
          }
          return params.reduce((acc: string, param: Serie) => {
            acc = acc ? `${acc}<br/>` : "";
            const key = param.value[2] as ScoreCardsKey;
            const scorecard = param.value[3] as ScoreCardScatter;
            const name = scorecard.name;
            return `${acc}</div>${name}: ${formatNumber(scorecard[key])} ${
              config.unit
            }</div>`;
          }, "");
        },
      },
    }));
  }

  click(params: CallbackDataParams): void {
    console.log(params);
  }

  changes!: PouchDB.Core.Changes<Shelter> | undefined;
  mounted(): void {
    // we don't init/close the db, it's handled by parent route component
    // frontend/src/views/shelter_sustainability/ShelterSustainabilityItem.vue
    const id = decodeURIComponent(this.$route.params.id);

    this.getScorecards(id);
    this.changes = this.db?.onChange(() => {
      this.getScorecards(id);
    });
    this.$store.subscribe((mutation) => {
      // if Shelter not set probably mean db is not initiliazed yet
      const shouldUpdate = ["ShelterModule/SET_SHELTER"];
      if (shouldUpdate.includes(mutation.type)) {
        this.getScorecards(id);
      }
    });
  }

  destroyed(): void {
    this.changes?.cancel();
  }
}

interface ScoreCardScatter extends ScoreCard {
  selected: boolean;
  shelter_type: string;
  id: string;
  name: string;
}

interface Config {
  id: string;
  title: string;
  unit: string;
  min?: number;
  max?: number | ((v: MinMax) => undefined);
  colors: {
    primary: string;
    secondary: string;
  };
}
interface Serie {
  value: (number | string | ScoreCardScatter | Config)[];
}

type colorType = "Emergency" | "Transitional" | "Durable" | "";

type SymbSizeFn = (a: number[]) => number;
type ScoreCardsKey =
  | "weight"
  | "co2"
  | "h2o"
  | "techPerf"
  | "affordability"
  | "habitability";
interface MinMax {
  min: number;
  max: number;
}
</script>
