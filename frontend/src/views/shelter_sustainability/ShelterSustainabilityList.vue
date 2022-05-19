<template>
  <main class="shelter__list" :style="computedGridTemplate">
    <v-sheet class="country-list overflow-y-auto">
      <v-container fluid>
        <!-- Move to component, ShelterSustaibalityListHeader Search + create tooltip logic -->

        <v-row>
          <v-col cols="9">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="searchName"
                  tabindex="2"
                  name="search name"
                  :clearable="true"
                  label="Search by Shelter Name"
                  type="text"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="custom-checkboxes">
                <v-checkbox
                  v-for="(shelterType, $index) in listOfShelterType"
                  :key="$index"
                  v-model="selectedShelters"
                  :label="shelterType"
                  :value="shelterType"
                  dense
                >
                  <template v-slot:label>
                    <div class="d-flex align-end">
                      <v-icon :class="`c-${shelterColors[shelterType].name}`">
                        mdi-{{ shelterIcons[shelterType] }}
                      </v-icon>
                      {{ shelterType }}
                    </div>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col class="d-flex align-center justify-end">
                <v-btn text :disabled="!$can('create')" @click="addProject">
                  <v-icon>mdi-plus-thick</v-icon>
                  New shelter
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col justify="center">
            <v-row>
              <v-col
                v-for="project in projects"
                :key="project._id"
                cols="12"
                sm="12"
                md="6"
                lg="6"
                xl="3"
              >
                <v-card
                  :to="{
                    name: 'ShelterSustainabilityEdit',
                    params: { id: encodeURIComponent(project._id) },
                  }"
                  class="project"
                  max-width="400"
                  min-height="200"
                  hover
                  outlined
                  :class="{
                    'project--editable': $can('edit', project),
                    'project--readonly': !$can('edit', project),
                  }"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-card-subtitle class="pb-0">
                        <v-icon
                          :class="`c-${
                            shelterColors[project.shelter_type].name
                          }`"
                        >
                          mdi-{{ shelterIcons[project.shelter_type] }}
                        </v-icon>
                        <div class="project__hidden-child float-right">
                          <span v-if="$can('edit', project)"
                            >Read and write</span
                          >
                          <span v-else>Read only</span>
                        </div>
                      </v-card-subtitle>
                      <v-card-title>
                        {{ project.name }}
                      </v-card-title>
                      <v-card-subtitle class="pb-0">
                        <span v-if="project.location_name">
                          {{ project.location_name }}
                        </span>
                        <span
                          v-if="
                            project.location_name && project.location_country
                          "
                          >,</span
                        >
                        <span v-if="project.location_country">
                          {{ countriesMap[project.location_country].name }}
                        </span>
                      </v-card-subtitle>
                      <v-card-subtitle class="pb-0">
                        <v-row class="align-center d-flex">
                          <v-col cols="4" class="text-caption">
                            Created: {{ project.created_at | formatDate }}
                          </v-col>
                          <v-col cols="4" class="text-caption">
                            Updated: {{ project.updated_at | formatDate }}
                          </v-col>
                          <v-col cols="4" class="d-flex justify-end">
                            <v-btn
                              title="Duplicate shelters"
                              icon
                              small
                              @click.stop.prevent="() => duplicateDoc(project)"
                            >
                              <v-icon small>mdi-content-copy</v-icon>
                            </v-btn>
                            <v-btn
                              v-if="$can('delete', project)"
                              title="Delete shelters"
                              icon
                              small
                              @click.stop.prevent="() => removeDoc(project._id)"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-subtitle>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <div class="separator"></div>
    <div class="map-countries">
      <territory-map :coordinates="coordinates" :default-zoom="2" />
    </div>
    <new-shelter-dialog :open.sync="shelterDialog" />
  </main>
</template>

<script lang="ts">
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import NewShelterDialog from "@/components/shelter_sustainability/NewShelterDialog.vue";
import { CountriesInfoMap } from "@/store/GhgInterface";
import {
  listOfShelterType,
  Shelter,
  ShelterType,
} from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import {
  countries as Countries,
  Country as CountryWithLat,
} from "@/utils/countriesAsList";
import flagEmoji from "@/utils/flagEmoji";
import { shelterColors } from "@/views/shelter_sustainability/shelterTypeColors";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("ShelterModule", ["shelters", "db"]),
  },

  methods: {
    ...mapActions("ShelterModule", [
      "duplicateDoc",
      "removeDoc",
      "syncDB",
      "getShelters",
      "closeDB",
    ]),
  },
  components: {
    NewShelterDialog,
    TerritoryMap,
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  /**
   * TODO: add colors for Territory Map [done]
   * Add filters for list of shelters
   * Add duplicate button // remove button in place
   */

  newName = "";
  searchName: string | null = "";
  selectedShelters: ShelterType[] = [];
  shelters!: [];
  shelterDialog = false;
  duplicateDoc!: (shelter: Shelter) => Promise<null>;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getShelters!: () => Promise<null>;
  db!: SyncDatabase<Shelter> | null;

  listOfShelterType = listOfShelterType;
  shelterColors = shelterColors;
  createProjectFormValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  countriesMap = Countries.reduce(
    (acc: CountriesInfoMap, country: CountryWithLat) => {
      acc[country.code] = { ...country, emoji: flagEmoji(country.code) };
      return acc;
    },
    {} as CountriesInfoMap
  );

  shelterIcons = {
    Emergency: "home-variant-outline",
    Transitional: "home-outline",
    Durable: "home",
  };

  public get coordinates(): (number | string)[][] {
    return this.shelters
      .filter((x: Shelter) => !!x.latitude)
      .map((x: Shelter) => [x.latitude, x.longitude, x.shelter_type]);
  }

  public get projects(): Record<string, string | number>[] {
    return this.shelters
      .filter((shelter: Shelter) => {
        if (this.searchName) {
          return shelter.name.indexOf(this.searchName) !== -1;
        }
        return true;
      })
      .filter((shelter: Shelter) => {
        if (this.selectedShelters.length > 0) {
          return this.selectedShelters.indexOf(shelter.shelter_type) !== -1;
        }
        return true;
      });
  }

  get computedGridTemplate(): string {
    return "{ grid-template-columns: 50% 25px 50%; }";
  }

  public addProject(): void {
    this.shelterDialog = true;
  }

  mounted(): void {
    this.syncDB();
    this.getShelters();

    this.db?.onChange(this.getShelters);
  }

  destroyed(): void {
    this.closeDB();
  }
}
</script>

<style lang="scss" scoped>
.shelter__list {
  $header_height: 64px;
  display: grid;
  grid-template-rows: calc(100vh - #{$header_height});
  grid-template-columns: 50% 25px 50%;
  grid-template-areas: "a b c";

  flex: 1 1 auto;
}

.country-list {
  grid-area: a;
}

.country-list__actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.country-list-header__title {
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

.country-list-header__tools {
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

.separator {
  grid-area: b;
  background-color: #e9ebec;
  cursor: col-resize;
  margin-left: 10px;
  margin-right: 10px;
}

.map-countries {
  grid-area: c;
  z-index: 1;
}

// https://css-tricks.com/using-sass-control-scope-bem-naming/
.project {
  height: 100%;
  $self: &;
  // background-color: blue;

  &--editable {
    // background-color: yellow;
    &:hover {
      // background-color: red;
      color: #444;
    }
  }

  &--readonly {
    // background-color: yellow;
    color: #999;
    &:hover {
      // background-color: red;
      color: inherit;
    }
  }

  #{ $self }__hidden-child {
    visibility: hidden;
    color: #ccc;
  }

  &:hover {
    // background-color: green;
    #{ $self }__hidden-child {
      visibility: visible;
    }
  }
}
</style>

<style scoped lang="scss">
::v-deep .c-blue {
  color: var(--c-blue);
}

::v-deep .c-brown {
  color: var(--c-brown);
}

::v-deep .c-grey {
  color: var(--c-grey);
}
.custom-checkboxes {
  gap: 12px;
  flex-direction: row;
  display: flex;
}
</style>
