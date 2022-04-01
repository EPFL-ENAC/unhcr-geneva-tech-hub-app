<template>
  <v-container fluid v-if="shelter">
    <v-row>
      <v-col>
        <h2 class="text-h4 project-shelter__h3 font-weight-medium">
          Scorecard
        </h2>
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
              <v-col class="about-first-column d-flex justify-center" lg="12">
                <v-responsive aspect-ratio="2.5" min-height="200">
                  <v-chart autoresize :option="option" @click="click"></v-chart>
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
import { ScoreCard, Shelter } from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import { ScatterChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  SingleAxisComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { CallbackDataParams, EChartsOption } from "echarts/types/dist/shared";
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
]);

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter", "scorecards", "db"]),
  },
  methods: {
    ...mapActions("ShelterModule", ["getScorecards"]),
  },
  components: {
    VChart,
  },
})
/** Project */
export default class Step8ScoreCard extends Vue {
  shelter!: Shelter;
  getScorecards!: (id: string) => Promise<ScoreCard[]>;
  db!: SyncDatabase<Shelter> | null;
  scorecards!: ScoreCard[];

  alpha = 0.2;
  alphaSecondary = 0.6;
  secondaryColor = `rgba(84,84,86,${this.alphaSecondary})`;

  configs = [
    {
      id: "weight",
      title: "Material efficiency",
      colors: {
        primary: `rgba(157,72,56,1)`, // secondary colour 2
        secondary: `rgba(157,72,56,${this.alpha})`,
      },
    },
    {
      id: "co2",
      title: "Embodied CO2",
      colors: {
        primary: `rgba(84,84,86,1)`, // secondary colour 1
        secondary: `rgba(84,84,86,${this.alpha})`,
      },
    },
    {
      id: "h2o",
      title: "Embodied water",
      colors: {
        primary: `rgba(32,135,200,1)`, // primary colour
        secondary: `rgba(32,135,200,${this.alpha})`,
      },
    },
    {
      id: "techPerf",
      title: "Technical performance",
      colors: {
        primary: `rgba(212,140,116)`, // secondary colour 3
        secondary: `rgba(212,140,116, ${this.alpha})`,
      },
    },
    {
      id: "habitability",
      title: "Habitability",
      colors: {
        primary: `rgba(240,184,158,1)`, // secondary colour 4
        secondary: `rgba(240,184,158,${this.alpha})`,
      },
    },
    {
      id: "affordability",
      title: "Affordability",
      colors: {
        primary: `rgba(248, 228, 210, 1)`, // seconday colour 5
        secondary: `rgba(248, 228, 210, ${this.alpha})`,
      },
    },
  ];
  get option(): EChartsOption {
    const scorecards = this.scorecards ?? [];
    const secondaryColor = this.secondaryColor;
    const title: Record<string, string | number>[] = [];
    const singleAxis: Record<
      string,
      string | number | boolean | Record<string, number>
    >[] = [];
    const series: Record<
      string,
      string | number | boolean | Serie[] | SymbSizeFn
    >[] = [];
    this.configs.forEach((config: Config, idx: number): void => {
      title.push({
        textBaseline: "middle",
        top: ((idx + 0.5) * 100) / 7 + "%",
        text: config.title,
      });
      singleAxis.push({
        left: 150,
        type: "value",
        boundaryGap: false,
        top: (idx * 100) / 7 + 5 + "%",
        height: 100 / 7 - 10 + "%",
        axisLabel: {
          interval: 2,
        },
      });
      series.push({
        singleAxisIndex: idx,
        coordinateSystem: "singleAxis",
        type: "scatter",
        data:
          scorecards?.map((item: ScoreCard) => {
            const scor = item as ScoreCardScatter;
            const key = config.id as ScoreCardsKey;
            return {
              value: [scor[key], 3],
              itemStyle: {
                color: scor.selected ? config.colors.primary : secondaryColor, //config.colors.secondary,
              },
            };
          }) ?? [],
        symbolSize: (dataItem: number[]) => dataItem[1] * 4,
      });
    });
    return {
      title,
      singleAxis,
      series,
      legend: {
        type: "scroll",
        top: 20,
      },
      grid: {
        bottom: 42,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
      },
    };
  }

  click(params: CallbackDataParams): void {
    console.log(params);
  }

  mounted(): void {
    // we don't init/close the db, it's handled by parent route component
    // frontend/src/views/shelter_sustainability/ShelterSustainabilityItem.vue
    const id = decodeURIComponent(this.$route.params.id);

    // this.getScorecards(id);
    this.db?.onChange(() => {
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
}

interface ScoreCardScatter extends ScoreCard {
  selected: boolean;
}
interface Config {
  id: string;
  title: string;
  colors: {
    primary: string;
    secondary: string;
  };
}
interface Serie {
  value: number[];
}

type SymbSizeFn = (a: number[]) => number;
type ScoreCardsKey =
  | "weight"
  | "co2"
  | "h2o"
  | "techPerf"
  | "affordability"
  | "habitability";
</script>
