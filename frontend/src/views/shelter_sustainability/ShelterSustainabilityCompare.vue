<template>
  <v-container>
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
    <v-row v-else>
      <v-col>
        <v-row>
          <v-col cols="3"></v-col>
          <v-col>
            <v-row>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                <v-row>
                  <v-col>
                    {{ shelter.name }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-icon
                      :class="`c-${shelterColors[shelter.shelter_type].name}`"
                    >
                      {{ shelterIcons[shelter.shelter_type] }}
                    </v-icon>
                  </v-col>
                </v-row>
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
              <v-col cols="3" class="ml-4">Intended occupants</v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
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
              <v-col cols="3" class="ml-4">Intended lifespan</v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                {{ shelter.shelter_lifespan }} year(s)
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="ml-4">Setup</v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                <div class="flex align-center">
                  <!-- todo: use filter for plural for day(s) -->
                  {{ shelter.setup_people }} ppl x
                  {{ shelter.setup_time }} day(s)
                </div>
              </v-col>
            </v-row>
            <v-row
              v-for="affordability in affordabilities"
              :key="affordability.id"
            >
              <v-col cols="3" class="ml-4">
                {{ affordability.title }}:
                <v-tooltip right :max-width="300">
                  <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon> $mdiInformation </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ affordability.description }}</span>
                </v-tooltip>
              </v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                <v-layout class="align-center">
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
        <v-row
          ><v-col><b>CONSTRUCTION</b></v-col></v-row
        >
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="3" class="ml-4">Shape</v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                <v-img
                  max-width="150px"
                  max-height="150px"
                  class="d-flex justify-center white-background"
                  :src="geometriesUrl[shelter.geometry.shelter_geometry_type]"
                  :aria-label="shelter.geometry.shelter_geometry_type"
                  :title="shelter.geometry.shelter_geometry_type"
                >
                </v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="ml-4">Volume</v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                {{ shelter.geometry.floorArea }} m<sup>2</sup>,
                {{ shelter.geometry.volume }} m<sup>3</sup>
              </v-col>
            </v-row>
            <v-row
              v-for="constructionImpact in constructionImpacts"
              :key="constructionImpact.id"
            >
              <v-col cols="3" class="ml-4"
                >{{ constructionImpact.title }}:
                <v-tooltip right :max-width="300">
                  <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon> $mdiInformation </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ constructionImpact.description }}</span>
                </v-tooltip>
              </v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                <v-layout class="align-center">
                  <span>
                    {{
                      shelter.scorecard[constructionImpact.id] |
                        formatNumber(0, 0, false, "percent")
                    }}
                  </span>
                </v-layout>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- END OF CONSTRUCTION -->

        <!-- BEGIN ENVIRONMENTAL IMPACT -->
        <v-row
          ><v-col><b>ENVIRONMENTAL IMPACT</b></v-col></v-row
        >
        <v-row>
          <v-col>
            <v-row
              v-for="environmentalImpact in environmentalImpacts"
              :key="environmentalImpact.id"
            >
              <v-col cols="3" class="ml-4"
                >{{ environmentalImpact.title }}:
                <v-tooltip right :max-width="300">
                  <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon> $mdiInformation </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ environmentalImpact.description }}</span>
                </v-tooltip>
              </v-col>
              <v-col v-for="shelter in shelters" :key="shelter._id">
                <v-layout class="align-center">
                  <span>
                    {{
                      shelter.scorecard[environmentalImpact.id] | formatNumber()
                    }}
                    {{ environmentalImpact.unit }}
                  </span>
                </v-layout>
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
import { Shelter } from "@/store/ShelterInterface";
import { isString } from "lodash";
import { Component, Vue } from "vue-property-decorator";

import { SyncDatabase } from "@/utils/couchdb";
import affordabilities from "@/views/shelter_sustainability/ShelterSustainabilityItem/affordabilities";
import constructionImpacts from "@/views/shelter_sustainability/ShelterSustainabilityItem/constructionImpacts";
import environmentalImpacts from "@/views/shelter_sustainability/ShelterSustainabilityItem/environmentalImpacts";
import { geometriesUrl } from "@/views/shelter_sustainability/ShelterSustainabilityItem/geometries";
import {
  shelterColors,
  shelterIcons,
} from "@/views/shelter_sustainability/shelterTypeColors";
import PouchDB from "pouchdb";
import { Route } from "vue-router";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["db"]),
  },
  methods: {
    ...mapActions("ShelterModule", ["getDoc", "syncDB", "closeDB"]),
  },
})
/** ProjectList */
export default class ShelterSustainabilityCompare extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => Promise<Shelter>;
  closeDB!: () => null;
  $route!: Route;
  db!: SyncDatabase<Shelter> | null;
  changes!: PouchDB.Core.Changes<Shelter> | undefined;

  newName = "";
  shelters: Shelter[] = [];
  affordabilities = affordabilities;
  constructionImpacts = constructionImpacts;
  environmentalImpacts = environmentalImpacts;
  geometriesUrl = geometriesUrl;
  shelterColors = shelterColors;
  shelterIcons = shelterIcons;
  loaded = false;

  public async retrieveData(): Promise<void> {
    const queryIds = this.$route.query.ids;
    this.loaded = false;
    try {
      if (isString(queryIds)) {
        const shelterIds = queryIds.length > 0 ? queryIds.split("|") : [];

        const promises: PromiseSettledResult<Shelter>[] =
          await Promise.allSettled(shelterIds.map(this.getDoc));

        const resolvedPromises = promises.filter(
          ({ status }: { status: string }) => status === "fulfilled"
        );
        this.shelters = resolvedPromises.map(
          (p: PromiseSettledResult<Shelter>) =>
            (p as PromiseFulfilledResult<Shelter>).value
        );
      }
      this.loaded = true;
    } catch (e) {
      console.log(e);
    }
  }

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
</script>

<style scoped lang="scss">
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
