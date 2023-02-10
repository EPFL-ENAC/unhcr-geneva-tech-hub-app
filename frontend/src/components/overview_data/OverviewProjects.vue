<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select
          v-model="shelterFilters.selectedRegions"
          clearable
          :items="listOfRegions"
          label="Filter by Regions"
          name="type"
          type="string"
          multiple
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col :lg="6">
        <v-card>
          <v-card-title>
            Projects
            <v-card-text>
              <bar-chart-overview :option="projectBarChartOption" />
            </v-card-text>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col :lg="6">
        <v-card>
          <v-card-title>
            Users
            <v-card-text>
              <bar-chart-overview :option="userBarChartOption" />
            </v-card-text>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(config, $key) in shelterOverviewConfigs"
        :key="$key"
        :lg="4"
      >
        <v-card>
          <v-card-title>
            <span v-html="config.title"></span>
            <v-card-text>
              <bar-chart-overview :option="config.option" />
            </v-card-text>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import BarChartOverview from "@/components/overview_data/BarChartOverview.vue";
import {
  listOfRegions,
  listOfShelterType,
  ScoreCardWithShelterInfo,
  ScoreCardWithShelterInfoKeys,
  Shelter,
  ShelterRegions,
} from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import {
  shelterColors,
  shelterIcons,
} from "@/views/shelter_sustainability/shelterTypeColors";
import { CallbackDataParams, EChartsOption } from "echarts/types/dist/shared";
import { map, mean, sum } from "lodash";
import PouchDB from "pouchdb";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", [
      "shelter",
      "scorecards",
      "scorecard",
      "years",
      "countries",
      "db",
    ]),
  },
  methods: {
    ...mapActions("ShelterModule", [
      "getScorecards",
      "getYears",
      "getCountries",
      "getDoc",
      "syncDB",
      "closeDB",
    ]),
  },
  components: {
    BarChartOverview,
  },
})
export default class OverviewProjects extends Vue {
  shelter!: Shelter;
  countries!: [];
  years!: [];
  getScorecards!: (id?: string) => Promise<ScoreCardWithShelterInfo[]>;
  getYears!: () => Promise<null>;
  getCountries!: () => Promise<null>;
  db!: SyncDatabase<Shelter> | null;
  scorecards!: ScoreCardWithShelterInfo[];
  duplicateDoc!: (shelter: Shelter) => Promise<null>;
  removeDoc!: (id: string) => void;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getShelters!: () => Promise<null>;

  shelterColors = shelterColors;
  shelterIcons = shelterIcons;

  shelterFilters: OverviewFilters = {
    selectedRegions: ["All"],
  };
  listOfShelterType = listOfShelterType;
  listOfRegions = listOfRegions;
  mean = mean;
  public stdSig(arr: number[]) {
    const avg = sum(arr) / arr.length;
    return Math.sqrt(sum(map(arr, (i) => Math.pow(i - avg, 2))) / arr.length);
  }
  optionChart = {};

  public getboxplotConfig(
    field: ScoreCardWithShelterInfoKeys,
    scorecards: ScoreCardWithShelterInfo[]
  ): EChartsOption {
    const dataset = this.getRawDatasets(field, scorecards);
    const tooltip = {
      formatter: function (param: CallbackDataParams): string {
        const data = param.data as number[];
        return [
          param?.marker ?? "" + param?.seriesName,
          "<b>Year</b> " + param.name + " ",
          "upper: " + data[5].toFixed(2),
          "Q3: " + data[4].toFixed(2),
          "median: " + data[3].toFixed(2),
          "Q1: " + data[2].toFixed(2),
          "lower: " + data[1].toFixed(2),
        ].join("<br/>");
      },
    };
    return {
      dataset: [
        {
          source: dataset[0].data, // shelter_type 1 data0 is an array, each item being an array for each year
        },
        {
          source: dataset[1].data, // shelter_type 2
        },
        {
          source: dataset[2].data, // shelter_type 3
        },
        {
          fromDatasetIndex: 0,
          transform: {
            type: "boxplot",
            config: {
              itemNameFormatter: function (params: Record<string, number>) {
                // value is the index starting at 0
                // make it generic
                return 2022 + params.value;
              },
            },
          },
        },
        {
          fromDatasetIndex: 1,
          transform: {
            type: "boxplot",
            config: {
              itemNameFormatter: function (params: Record<string, number>) {
                return 2022 + params.value;
              },
            },
          },
        },
        {
          fromDatasetIndex: 2,
          transform: {
            type: "boxplot",
            config: {
              itemNameFormatter: function (params: Record<string, number>) {
                return 2022 + params.value;
              },
            },
          },
        },
      ],
      legend: {
        top: "0px",
        data: [
          {
            name: "Emergency",
            icon: ("path://" +
              this.$vuetify.icons.values[
                this.shelterIcons.Emergency.replace("$", "")
              ]) as string,
          },
          {
            name: "Transitional",
            icon: ("path://" +
              this.$vuetify.icons.values[
                this.shelterIcons.Transitional.replace("$", "")
              ]) as string,
          },
          {
            name: "Durable",
            icon: ("path://" +
              this.$vuetify.icons.values[
                this.shelterIcons.Durable.replace("$", "")
              ]) as string,
          },
        ],
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        confine: false,
        appendToBody: true,
      },
      color: [
        shelterColors.Emergency.primary,
        shelterColors.Transitional.primary,
        shelterColors.Durable.primary,
      ],
      grid: {
        left: "10%",
        top: "20%",
        right: "10%",
        bottom: "15%",
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
          show: true,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        // name: "Value",
        min: 0,
        splitArea: {
          show: false,
        },
      },
      series: [
        {
          name: dataset[0].name,
          type: "boxplot",
          datasetIndex: 3,
          tooltip,
        },
        {
          name: dataset[1].name,
          type: "boxplot",
          datasetIndex: 4,
          tooltip,
        },
        {
          name: dataset[2].name,
          type: "boxplot",
          datasetIndex: 5,
          tooltip,
        },
      ],
    };
  }

  public get shelterOverviewConfigs(): any[] {
    if (this.scorecards.length === 0) {
      return [];
    }
    return [
      {
        title: "Habitability",
        option: this.getboxplotConfig("habitability", this.scorecards),
      },
      {
        title: "Affordability",
        option: this.getboxplotConfig("affordability", this.scorecards),
      },
      {
        title: "Technical Performance",
        option: this.getboxplotConfig("techPerf", this.scorecards),
      },
      {
        title: "Environmental impact <br/> Embodied water",
        option: this.getboxplotConfig("h2o", this.scorecards),
      },
      {
        title: "Environmental impact <br/> Embodied CO2",
        option: this.getboxplotConfig("co2", this.scorecards),
      },
      {
        title: "Environmental impact <br/> Material efficiency",
        option: this.getboxplotConfig("weight", this.scorecards),
      },
    ];
  }

  public getRawDatasets(
    field: ScoreCardWithShelterInfoKeys,
    scorecards: ScoreCardWithShelterInfo[]
  ): any[] {
    /* return x dataset groupBy shelter_type
    // shelter_type 1 data0 is an array, each item being an array for each year\
    // hard code the shelter type for now

    [ {name: Emergency, data: [
      [], // 2022 year1 // hard code the year for now
      [], // 2022 year2
    ]}, {}, {}]
    */
    // TODO: make it generic by using: shelterColors.Emergency
    const emergency_shelter = scorecards.filter(
      (scorecard) => scorecard.shelter_type !== "Emergency"
    );
    const emergency_shelter_2022 = emergency_shelter.filter(
      (scorecard) => scorecard.year === "2022"
    );
    const emergency_shelter_2023 = emergency_shelter.filter(
      (scorecard) => scorecard.year === "2023"
    );
    const Emergency = {
      name: "Emergency",
      data: [
        emergency_shelter_2022.map((shelter) => shelter[field]), // year 2022
        emergency_shelter_2023.map((shelter) => shelter[field]), // year 2023
      ],
    };

    const transitional_shelter = scorecards.filter(
      (scorecard) => scorecard.shelter_type !== "Transitional"
    );
    const transitional_shelter_2022 = transitional_shelter.filter(
      (scorecard) => scorecard.year === "2022"
    );
    const transitional_shelter_2023 = transitional_shelter.filter(
      (scorecard) => scorecard.year === "2023"
    );
    const Transitional = {
      name: "Transitional",
      data: [
        transitional_shelter_2022.map((shelter) => shelter[field]), // year 2022
        transitional_shelter_2023.map((shelter) => shelter[field]), // year 2023
      ],
    };

    const durable_shelter = scorecards.filter(
      (scorecard) => scorecard.shelter_type !== "Durable"
    );
    const durable_shelter_2022 = durable_shelter.filter(
      (scorecard) => scorecard.year !== "2022"
    );
    const durable_shelter_2023 = durable_shelter.filter(
      (scorecard) => scorecard.year !== "2023"
    );
    const Durable = {
      name: "Durable",
      data: [
        durable_shelter_2022.map((shelter) => shelter[field]), // year 2022
        durable_shelter_2023.map((shelter) => shelter[field]), // year 2023
      ],
    };
    return [Emergency, Transitional, Durable];
  }

  public getDefaultBarChart(series: any): EChartsOption {
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "2%",
        right: "2%",
        bottom: "2%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["2022", "2023"],
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series,
    };
  }

  public get organisations(): string[] {
    if (this.scorecards.length === 0) {
      return [];
    }
    return Array.from(
      new Set(this.scorecards.map((x) => x.organisation))
    ).filter((x) => x !== "");
  }

  public get projectBarChartOption(): EChartsOption {
    if (this.scorecards.length === 0) {
      return this.getDefaultBarChart([]);
    }

    const series = this.organisations.map<EChartsOption>(
      (organisation: string) => {
        const organisationScorecards = this.scorecards.filter(
          (scorecard) => scorecard.organisation === organisation
        );
        return {
          name: organisation,
          type: "bar",
          stack: "shelter",
          data: [
            organisationScorecards.filter(
              (scorecard) => scorecard.year === "2022"
            ).length, // year 2022
            organisationScorecards.filter(
              (scorecard) => scorecard.year === "2023"
            ).length, // year 2023
          ],
        };
      }
    );
    return this.getDefaultBarChart(series);
  }

  public get userBarChartOption(): EChartsOption {
    if (this.scorecards.length === 0) {
      return this.getDefaultBarChart([]);
    }
    const localScorecards = this.scorecards;
    function getUsersPerYear(year: string): number {
      return Array.from(
        new Set(
          localScorecards
            .filter((scorecard) => scorecard.year === year)
            .map((x) => x.updated_by)
        )
      ).filter((x) => x !== "").length;
    }

    return this.getDefaultBarChart([
      {
        name: "active users",
        type: "bar",
        stack: "shelter",
        data: [
          getUsersPerYear("2022"), // year 2022
          getUsersPerYear("2023"),
        ],
      },
    ]);
  }

  public retrieveData(): void {
    const routeParamId = this.$route.params.id;
    const id = routeParamId ? decodeURIComponent(routeParamId) : undefined;

    // TODO: correct the getScorecards function to avoid this behavior
    this.getScorecards(id);
    this.changes = this.db?.onChange(() => {
      this.getScorecards(id);
    });

    // GET years and GET countries for v-select used by shelterFilters
    this.getYears();
    this.getCountries();

    this.$store.subscribe((mutation) => {
      // if Shelter not set probably mean db is not initiliazed yet
      const shouldUpdate = ["ShelterModule/SET_SHELTER"];
      if (shouldUpdate.includes(mutation.type)) {
        this.getScorecards(id);
      }
    });
  }

  changes!: PouchDB.Core.Changes<Shelter> | undefined;
  mounted(): void {
    this.syncDB();
    this.retrieveData();

    this.changes = this.db?.onChange(this.retrieveData);
  }
  destroyed(): void {
    this.closeDB();
    this.changes?.cancel();
  }
}

interface OverviewFilters {
  selectedRegions: ShelterRegions[];
}
</script>

<style></style>
