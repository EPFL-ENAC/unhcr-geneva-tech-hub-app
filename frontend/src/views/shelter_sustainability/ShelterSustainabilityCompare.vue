<template>
  <v-container>
    <v-row class="d-print-none">
      <v-col class="d-flex justify-space-between">
        <v-btn
          :to="{ name: 'ShelterSustainabilityList', query: $route.query }"
          class="ma-2"
          outlined
          small
          fab
          color="primary"
        >
          <v-icon>$mdiArrowLeftCircle</v-icon>
        </v-btn>
        <v-btn
          class="d-print-none"
          @click="
            window.print();
            return false;
          "
          >Export Comparison report</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="loaded && shelters.length === 0">
      <v-col>
        <v-alert type="warning">
          <i
            ><v-icon>$mdiWrench</v-icon> Please go back to 'All Shelters' screen
            and select some Shelter</i
          >
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else class="shelter-page-compare">
      <v-col>
        <v-row>
          <v-col cols="3"> </v-col>
          <v-col
            v-for="shelter in shelters"
            :key="shelter._id"
            :cols="Math.floor(9 / shelters.length)"
          >
            <v-row class="justify-center">
              <v-avatar
                v-if="shelter.image?.url"
                class="profile"
                color="grey"
                size="64"
                tile
              >
                <v-img :src="shelter.image?.url"></v-img>
              </v-avatar>
              <v-avatar v-else class="profile" color="grey" size="64" tile>
                <v-card-title class="white--text"></v-card-title>
              </v-avatar>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center">
                <h2 class="text-center">{{ shelter.name }}</h2>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center flex-column align-center">
                <v-icon
                  :class="`c-${shelterColors[shelter.shelter_type].name}`"
                >
                  {{ shelterIcons[shelter.shelter_type] }}
                </v-icon>
                <span class="text-body"
                  >{{ shelter.shelter_type }} shelter</span
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- BEGIN SHELTER INFO -->
        <v-row
          ><v-col><b>SHELTER INFO</b></v-col></v-row
        >
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="3" class="ml-screen-4">Intended occupants</v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                <v-icon
                  v-for="n in shelter.shelter_occupants"
                  :key="n"
                  style="margin: -6px"
                >
                  $mdiHumanMale
                </v-icon>
                ({{ shelter.shelter_occupants }})
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="ml-screen-4">Intended lifespan</v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                {{ shelter.shelter_lifespan }} year(s)
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="ml-screen-4">Setup</v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                {{ shelter.setup_people }} ppl x {{ shelter.setup_time }} day(s)
              </v-col>
            </v-row>
            <v-row
              v-for="(affordability, idx) in affordabilities"
              :key="affordability.id"
            >
              <v-col cols="3" class="ml-screen-4">
                <v-row
                  ><v-col>
                    {{ affordability.title }}:
                    <info-tooltip right :max-width="300" :bottom="false"
                      >{{ affordability.description }}
                    </info-tooltip>
                  </v-col></v-row
                >
                <v-row>
                  <v-col>
                    <v-responsive
                      aspect-ratio="5"
                      min-height="20"
                      max-height="120"
                      max-width="80%"
                    >
                      <v-chart
                        autoresize
                        :option="optionsAffordabilities[idx]"
                      ></v-chart>
                    </v-responsive>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                <v-layout class="align-center d-flex justify-center">
                  <span>
                    {{ shelter.scorecard[affordability.id] | formatNumber() }}
                    {{ affordability.unit }}
                  </span>
                </v-layout>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- END OF SHELTER INFO -->
        <!-- BEGIN CONSTRUCTION -->
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="3" class="ml-screen-4 col col-3 d-flex align-center"
                >Geometry</v-col
              >
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center flex-column align-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                <v-img
                  v-if="shelter.geometry.shelter_geometry_type"
                  height="40px"
                  contain
                  :src="
                    geometriesUrl[
                      shelter.geometry.shelter_geometry_type
                    ].replace('_new', '_clean')
                  "
                  :aria-label="shelter.geometry.shelter_geometry_type"
                  :title="
                    geometriesName[shelter.geometry.shelter_geometry_type]
                  "
                >
                </v-img>
                <span class="text-center">{{
                  geometriesName[shelter.geometry.shelter_geometry_type]
                }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="ml-screen-4">Floor area</v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                <div>
                  {{ shelter.geometry.floorArea | formatNumber }} m<sup>2</sup>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="ml-screen-4">Volume</v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                <div>
                  {{ shelter.geometry.volume | formatNumber }} m<sup>3</sup>
                </div>
              </v-col>
            </v-row>
            <v-row
              v-for="(constructionImpact, idx) in constructionImpacts"
              :key="constructionImpact.id"
            >
              <v-col cols="3" class="ml-screen-4">
                <v-row>
                  <v-col>
                    <b class="text-uppercase">{{ constructionImpact.title }}</b
                    >:
                    <info-tooltip right :max-width="300" :bottom="false"
                      >{{ constructionImpact.description }}
                    </info-tooltip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-responsive
                      aspect-ratio="5"
                      min-height="40"
                      max-height="120"
                      max-width="80%"
                    >
                      <v-chart
                        autoresize
                        :option="optionsConstructionImpacts[idx]"
                      ></v-chart>
                    </v-responsive>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                class="d-flex justify-center align-center"
                :cols="Math.floor(9 / shelters.length)"
              >
                <span>
                  {{
                    shelter.scorecard[constructionImpact.id] |
                      formatNumber({
                        style: "percent",
                        maximumFractionDigits: 0,
                      })
                  }}
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- END OF CONSTRUCTION -->

        <!-- BEGIN ENVIRONMENTAL IMPACT -->
        <v-row class=""
          ><v-col
            ><b class="text-uppercase">ENVIRONMENTAL IMPACT</b></v-col
          ></v-row
        >
        <v-row>
          <v-col>
            <v-row
              v-for="(environmentalImpact, idx) in environmentalImpacts"
              :key="environmentalImpact.id"
              class="envronmentalImpactRows"
            >
              <v-col
                cols="3"
                class="ml-screen-4 d-flex flex-column justify-center"
              >
                <div>
                  {{ environmentalImpact.title }}:
                  <info-tooltip right :max-width="300" :bottom="false"
                    >{{ environmentalImpact.description }}
                  </info-tooltip>
                </div>
                <div>
                  <v-responsive
                    aspect-ratio="5"
                    min-height="20"
                    max-height="120"
                    max-width="80%"
                  >
                    <v-chart
                      autoresize
                      :option="optionsEnvironmentalImpacts[idx]"
                    ></v-chart>
                  </v-responsive>
                </div>
              </v-col>
              <v-col
                v-for="shelter in shelters"
                :key="shelter._id"
                :cols="Math.floor(9 / shelters.length)"
              >
                <v-row>
                  <v-col
                    cols="12"
                    class="text-center d-flex justify-center align-center flex-column"
                  >
                    <div>
                      {{
                        shelter.scorecard[environmentalImpact.id] |
                          formatNumber()
                      }}
                    </div>

                    <div>
                      {{ environmentalImpact.unit }}
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="d-flex justify-center align-center">
                    <graph-tree
                      max-height="110px"
                      min-height="110px"
                      :selected-field="environmentalImpact.selectedField"
                      graph-type="treemap"
                      :unit-name="environmentalImpact.selectedFieldUnit"
                      :items="shelter.envPerfItems"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- END OF ENVIRONMENTAL IMPACT -->
  </v-container>
</template>

<script lang="ts">
import {
  ImageShelter,
  ScoreCardWithShelterInfo,
  Shelter,
} from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";

import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import GraphTree from "@/components/shelter_sustainability/billOfQuantities/graphTree.vue";
import { SyncDatabase } from "@/utils/couchdb";
import { affordabilities } from "@/views/shelter_sustainability/ShelterSustainabilityItem/affordabilities";
import { constructionImpacts } from "@/views/shelter_sustainability/ShelterSustainabilityItem/constructionImpacts";
import { environmentalImpacts } from "@/views/shelter_sustainability/ShelterSustainabilityItem/environmentalImpacts";
import { generateScorecardOptions } from "@/views/shelter_sustainability/ShelterSustainabilityItem/generateScorecardOptions";

import {
  geometriesName,
  geometriesUrl,
} from "@/views/shelter_sustainability/ShelterSustainabilityItem/geometries";
import {
  shelterColors,
  shelterIcons,
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
import PouchDB from "pouchdb";
import VChart from "vue-echarts";
import { Route } from "vue-router";
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

function findShelterImage(images: ImageShelter[]): ImageShelter | undefined {
  if (!images || typeof images !== "object" || !Array.isArray(images)) {
    return;
  }
  const firstImage = images.find(function (image) {
    return image.type === "Image";
  });
  if (!firstImage) {
    return;
  }
  return firstImage;
}

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["db", "scorecards"]),
  },
  methods: {
    ...mapActions("ShelterModule", [
      "getDoc",
      "getScorecards",
      "syncDB",
      "closeDB",
    ]),
    ...mapActions("SheltersMaterialModule", {
      syncDBSheltersMaterial: "syncDB",
      getAllDocsSheltersMaterial: "getAllDocs",
      closeDBSheltersMaterial: "closeDB",
    }),
  },
  components: {
    VChart,
    InfoTooltip,
    GraphTree,
  },
})
/** ProjectList */
export default class ShelterSustainabilityCompare extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => Promise<Shelter>;
  closeDB!: () => null;

  syncDBSheltersMaterial!: () => null;
  closeDBSheltersMaterial!: () => Promise<null>;
  getAllDocsSheltersMaterial!: () => Promise<null>;
  $route!: Route;
  db!: SyncDatabase<Shelter> | null;
  scorecards!: ScoreCardWithShelterInfo[];
  getScorecards!: (id: string[]) => Promise<ScoreCardWithShelterInfo[]>;

  changes!: PouchDB.Core.Changes<Shelter> | undefined;

  newName = "";
  shelters: Shelter[] = [];
  affordabilities = affordabilities;
  constructionImpacts = constructionImpacts;
  environmentalImpacts = environmentalImpacts;
  geometriesName = geometriesName;
  geometriesUrl = geometriesUrl;
  shelterColors = shelterColors;
  shelterIcons = shelterIcons;
  loaded = false;

  get optionsAffordabilities(): EChartsOption[] {
    return generateScorecardOptions(
      affordabilities,
      this.scorecards,
      shelterColors
    );
  }
  get optionsConstructionImpacts(): EChartsOption[] {
    return generateScorecardOptions(
      constructionImpacts,
      this.scorecards,
      shelterColors
    );
  }
  get optionsEnvironmentalImpacts(): EChartsOption[] {
    return generateScorecardOptions(
      environmentalImpacts,
      this.scorecards,
      shelterColors
    );
  }

  public async retrieveData(): Promise<void> {
    const queryIds = this.$route.query.ids;
    this.loaded = false;
    try {
      if (typeof queryIds === "string") {
        const shelterIds = queryIds.length > 0 ? queryIds.split("|") : [];

        const promises: PromiseSettledResult<Shelter>[] =
          await Promise.allSettled(shelterIds.map(this.getDoc));

        const resolvedPromises = promises.filter(
          ({ status }: { status: string }) => status === "fulfilled"
        );
        this.shelters = resolvedPromises
          .map(
            (p: PromiseSettledResult<Shelter>) =>
              (p as PromiseFulfilledResult<Shelter>).value
          )
          .map((shelter: Shelter) => {
            shelter.image = findShelterImage(shelter.images) ?? undefined;
            return shelter;
          });
        await this.getAllDocsSheltersMaterial();
        await this.getScorecards(shelterIds);
      }
      this.loaded = true;
    } catch (e) {
      console.log(e);
    }
  }

  mounted(): void {
    this.syncDB();
    this.syncDBSheltersMaterial();
    this.retrieveData();
    this.changes = this.db?.onChange(this.retrieveData);
  }
  destroyed(): void {
    this.closeDB();
    this.closeDBSheltersMaterial();
    this.changes?.cancel();
  }
}
</script>

<style scoped lang="scss">
.envronmentalImpactRows {
  border-bottom: 1px solid grey;
  &:last-of-type {
    border-bottom: 0px;
  }
}
@media print {
  .shelter-page-compare {
    font-size: 3mm;
    .col {
      padding-top: 4px;
      padding-bottom: 4px;
      align-items: center;
    }
  }
}
::v-deep .c-blue {
  color: var(--c-blue);
  fill: var(--c-blue);
}

::v-deep .c-brown {
  color: var(--c-brown);
  fill: var(--c-brown);
}

::v-deep .c-grey {
  color: var(--c-grey);
  fill: var(--c-grey);
}
</style>
