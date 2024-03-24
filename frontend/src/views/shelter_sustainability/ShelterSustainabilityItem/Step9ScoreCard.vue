<template>
  <v-container v-if="shelter" fluid class="step-9-scorecard">
    <v-row v-if="$route.name === 'ShelterSustainabilityStep9'">
      <v-col class="d-flex align-center">
        <h2 class="d-flex align-center text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
      <v-col class="d-print-none">
        <v-row>
          <v-col>
            <v-select
              v-model="shelterFilters.selectedShelters"
              clearable
              :items="listOfShelterType"
              label="Filter Shelter types"
              name="type"
              type="string"
              multiple
            />
          </v-col>
          <v-col>
            <v-select
              v-model="shelterFilters.selectedCountries"
              :items="countries"
              clearable
              :menu-props="{ maxHeight: '300' }"
              label="Filter countries"
              multiple
              persistent-hint
            >
              <template #item="{ item }">
                {{ countriesMap[item].name }} ({{ countriesMap[item].code }}
                )
              </template>
              <template #selection="{ item }">
                {{ countriesMap[item].name }} ({{ countriesMap[item].code }}
                )
              </template>
            </v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="shelterFilters.selectedYears"
              clearable
              :items="years"
              label="Filter years"
              name="type"
              type="string"
              multiple
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-btn class="d-print-none" :to="{ name: 'ShelterReportStep10' }"
              >Assessment report</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="d-print-none">
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
              <v-col :cols="3" class="scorecard-first-column">
                <v-layout
                  class="align-center justify-space-between scorecard-title-with-value"
                >
                  <span v-if="option.config.subpart" class="ml-4">
                    {{ option.config.title }}:</span
                  >
                  <h2 v-else>{{ option.config.title }}:</h2>
                  <span class="ml-4">
                    <span v-if="option.config.unit === '%'">
                      {{
                        scorecard[option.config.id] |
                          formatNumber({
                            style: "percent",
                            maximumFractionDigits: 0,
                          })
                      }}
                    </span>
                    <span v-else>
                      {{
                        scorecard[option.config.id] |
                          formatNumber({
                            suffix: option.config.unit,
                          })
                      }}
                    </span>
                  </span>
                  <v-tooltip right :max-width="300" class="d-print-none">
                    <template #activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" class="d-print-none" v-on="on">
                        <v-icon> $mdiInformation </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ option.config.description }}</span>
                  </v-tooltip>
                </v-layout>
              </v-col>
              <v-col
                class="scorecard-second-column d-flex justify-center"
                :cols="9"
              >
                <v-responsive
                  aspect-ratio="5"
                  class="scorecard-responsive-container"
                >
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
import {
  listOfShelterType,
  ScoreCard,
  ScoreCardWithShelterInfo,
  Shelter,
  ShelterType,
} from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import { countriesMap } from "@/utils/countriesAsList";
import { affordabilities } from "@/views/shelter_sustainability/ShelterSustainabilityItem/affordabilities";
import { constructionImpacts } from "@/views/shelter_sustainability/ShelterSustainabilityItem/constructionImpacts";
import { environmentalImpacts } from "@/views/shelter_sustainability/ShelterSustainabilityItem/environmentalImpacts";
import {
  generateScorecardOptions,
  ScorecardConfig,
} from "@/views/shelter_sustainability/ShelterSustainabilityItem/generateScorecardOptions";
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
import { EChartsOption } from "echarts/types/dist/shared";
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
    ]),
  },
  components: {
    VChart,
    InfoTooltip,
  },
})
/** Project */
export default class Step8ScoreCard extends Vue {
  shelter!: Shelter;
  countries!: [];
  years!: [];
  getScorecards!: (id: string) => Promise<ScoreCardWithShelterInfo[]>;
  getYears!: () => Promise<null>;
  getCountries!: () => Promise<null>;
  db!: SyncDatabase<Shelter> | null;
  scorecards!: ScoreCardWithShelterInfo[];

  listOfShelterType = listOfShelterType;
  shelterFilters: ShelterFilters = {
    searchName: "",
    selectedShelters: [],
    selectedYears: [],
    selectedCountries: [],
  };

  countriesMap = countriesMap;
  alpha = alpha;
  alphaSecondary = alphaSecondary;
  colors = shelterColors;
  infoTooltipText = infoTooltipText;
  environmentalImpacts = environmentalImpacts;
  affordabilities = affordabilities;
  constructionImpacts = constructionImpacts;

  configs: ScorecardConfig[] = [
    ...environmentalImpacts,
    ...affordabilities,
    ...constructionImpacts,
  ];

  get options(): EChartsOption[] {
    return generateScorecardOptions(
      this.configs,
      this.scorecardsFiltered,
      this.colors
    );
  }

  get scorecard(): ScoreCard {
    return this.shelter?.scorecard ?? ({} as ScoreCard);
  }

  get scorecardsFiltered(): ScoreCardWithShelterInfo[] {
    const { selectedShelters, selectedYears, selectedCountries } =
      this.shelterFilters;
    return this.scorecards
      .filter((scoreCard: ScoreCardWithShelterInfo) => {
        return (
          selectedShelters.length == 0 ||
          selectedShelters.includes(scoreCard.shelter_type) ||
          scoreCard.id == this.shelter._id
        );
      })
      .filter((scoreCard: ScoreCardWithShelterInfo) => {
        return (
          selectedYears.length == 0 ||
          selectedYears.includes(
            scoreCard?.created_at?.substring(0, 4) ?? ""
          ) ||
          scoreCard.id == this.shelter._id
        );
      })
      .filter((scoreCard: ScoreCardWithShelterInfo) => {
        return (
          selectedCountries.length == 0 ||
          selectedCountries.includes(scoreCard?.location_country ?? "") ||
          scoreCard.id == this.shelter._id
        );
      });
  }

  mounted(): void {
    // we don't init/close the db, it's handled by parent route component
    // frontend/src/views/shelter_sustainability/ShelterSustainabilityItem.vue
    const id = decodeURIComponent(this.$route.params.id);

    this.getScorecards(id);

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
}

interface ShelterFilters {
  searchName: string | null;
  selectedShelters: ShelterType[];
  selectedYears: string[];
  selectedCountries: string[];
}
</script>

<style lang="scss" scoped>
.scorecard-responsive-container {
  min-height: 20px;
  max-height: 120px;
}
@media print {
  @page {
    size: landscape;
  }
  .step-9-scorecard {
    h2 {
      font-size: 1rem;
    }
    page-break-before: avoid;
    page-break-inside: auto;
    .elevation-2 {
      box-shadow: none !important;
    }
    .scorecard-responsive-container {
      min-height: 32px;
      max-height: 32px;
    }
    .scorecard-title-with-value {
      font-size: 0.7rem;
    }
    .scorecard-second-column {
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .scorecard-first-column {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
}
</style>
