<template>
  <v-layout class="shelter__list" :style="computedGridTemplate">
    <v-dialog
      v-model="dialogDelete"
      max-width="500px"
      @keypress.enter="() => deleteItemConfirm()"
    >
      <v-form
        ref="form"
        v-model="deleteFormValid"
        @submit.prevent="() => deleteItemConfirm()"
      >
        <v-card>
          <v-card-title class="text-h5"
            >Confirm deletion of this shelter?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" tabindex="1" text @click="closeDialog"
              >Cancel</v-btn
            >
            <v-btn
              color="blue darken-1"
              type="submit"
              tabindex="0"
              text
              :disabled="!deleteFormValid"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-sheet class="country-list overflow-y-auto">
      <v-container fluid>
        <!-- Move to component, ShelterSustaibalityListHeader Search + create tooltip logic -->

        <v-row>
          <!-- search name and custom check-boxese-->
          <v-col cols="12" md="6">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="shelterFilters.searchName"
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
                  v-model="shelterFilters.selectedShelterTypes"
                  :label="shelterType"
                  :value="shelterType"
                  dense
                >
                  <template #label>
                    <div class="d-flex align-end">
                      <v-icon :class="`c-${shelterColors[shelterType].name}`">
                        {{ shelterIcons[shelterType] }}
                      </v-icon>
                      {{ shelterType }}
                    </div>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row>
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
            </v-row>

            <v-row>
              <!-- add new shelter -->
              <v-col>
                <v-row>
                  <v-col>
                    <v-data-footer
                      :pagination="pagination"
                      :items-per-page-options="[5, 10, 15, 25, -1]"
                      :options.sync="paginationOptions"
                    />
                  </v-col>
                  <v-col class="d-flex align-center justify-end">
                    <v-btn
                      class="float-right"
                      color="primary"
                      :disabled="!$can('create')"
                      text
                      @click="addProject"
                    >
                      <v-icon left>$mdiPlusBox</v-icon>
                      New shelter
                    </v-btn>
                    <v-btn
                      :disabled="selectedShelters.length === 0"
                      class="float-right"
                      color="primary"
                      text
                      :to="{
                        name: 'ShelterSustainabilityCompare',
                        query: { ids: selectedShelters.join('|') },
                      }"
                    >
                      <v-icon left>$mdiScale</v-icon>
                      Compare shelter
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="d-none d-md-block">
            <div class="separator"></div>
            <div class="map-countries mr-4">
              <territory-map
                :coordinates="coordinates"
                :default-zoom="2"
                @click:item="goToShelter"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet class="country-list-pagination">
      <v-row>
        <v-col justify="center">
          <v-row>
            <v-col
              v-for="(project, $index) in projectsWithPagination"
              :key="project._id"
              cols="12"
            >
              <v-card
                :to="{
                  name: 'ShelterSustainabilityEdit',
                  params: { id: encodeURIComponent(project._id) },
                }"
                class="project"
                min-width="100%"
                hover
                outlined
                :class="{
                  'project--editable': $can('edit', project),
                  'project--readonly': !$can('edit', project),
                }"
              >
                <v-row>
                  <v-col cols="1" class="d-flex justify-center align-center">
                    <div class="pa-8 d-flex">
                      <span class="mr-4">
                        {{
                          $index +
                          1 +
                          (paginationOptions.page - 1) *
                            paginationOptions.itemsPerPage
                        }}
                      </span>
                      <v-icon
                        :class="`c-${shelterColors[project.shelter_type].name}`"
                      >
                        {{ shelterIcons[project.shelter_type] }}
                      </v-icon>
                    </div>

                    <div class="d-none project__hidden-child float-right">
                      <span v-if="$can('edit', project)">Read and write</span>
                      <span v-else>Read only</span>
                    </div>
                  </v-col>
                  <v-col
                    class="d-flex justify-center align-center"
                    cols="3"
                    md="1"
                  >
                    <v-avatar
                      v-if="project.image?.url"
                      class="profile"
                      color="grey"
                      size="64"
                      tile
                    >
                      <v-img :src="`${env.BASE_URL_WITHOUT_SLASH}${project.image?.url}`" @error="onError"></v-img>
                    </v-avatar>
                    <v-avatar
                      v-else
                      class="profile"
                      color="grey"
                      size="64"
                      tile
                    >
                      <v-card-title class="white--text"></v-card-title>
                    </v-avatar>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-start align-center">
                    <v-card-title>
                      {{ project.name }}
                    </v-card-title>
                    <v-card-subtitle class="pb-0 ma-0">
                      <span v-if="project.location_name">
                        {{ project.location_name }}
                      </span>
                      <span
                        v-if="project.location_name && project.location_country"
                        >,</span
                      >
                      <span v-if="project.location_country">
                        {{ countriesMap[project.location_country].name }}
                      </span>
                    </v-card-subtitle>
                  </v-col>
                  <v-col
                    cols="4"
                    class="d-none justify-center align-center d-md-flex"
                  >
                    <v-row class="align-center d-flex">
                      <v-col cols="4" class="text-caption">
                        Created: {{ project.created_at | formatDate }}
                      </v-col>
                      <v-col cols="4" class="text-caption">
                        Updated: {{ project.updated_at | formatDate }}
                      </v-col>
                      <v-col
                        cols="4"
                        class="text-caption align-center d-flex font-italic"
                      >
                        Created by: {{ project.created_by }}
                        <v-icon v-if="!project.public">$mdiLock</v-icon>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="1">
                    <v-row>
                      <v-col :cols="12" class="d-flex align-center justify-end">
                        <v-tooltip bottom>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              icon
                              class="better-click mr-2"
                              small
                              v-on="on"
                              @click.stop.prevent="() => duplicateDoc(project)"
                            >
                              <v-icon small class="better-click">
                                $mdiContentCopy
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Duplicate shelter</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              v-if="$can('delete', project)"
                              v-bind="attrs"
                              icon
                              class="better-click mr-2"
                              small
                              v-on="on"
                              @click.stop.prevent="
                                () => deleteItem(project._id)
                              "
                            >
                              <v-icon small class="better-click">
                                $mdiDelete
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Delete shelter</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template #activator="{ on, attrs }">
                            <v-checkbox
                              v-model="selectedShelters"
                              :readonly="
                                selectedShelters.length >= 3 &&
                                !selectedShelters.includes(project._id)
                              "
                              :value="project._id"
                              v-bind="attrs"
                              class="better-click"
                              @change="updateQueryIds"
                              @click.stop.prevent=""
                              v-on="on"
                            ></v-checkbox>
                          </template>
                          <span>Select shelter for comparison</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>

    <new-shelter-dialog :open.sync="shelterDialog" />
  </v-layout>
</template>

<script lang="ts">
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import NewShelterDialog from "@/components/shelter_sustainability/NewShelterDialog.vue";
import { Paginate } from "@/store/SheltersMaterialModule";

import store from "@/store";
import {
  listOfShelterType,
  Shelter,
  ShelterType,
} from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import { countriesMap } from "@/utils/countriesAsList";
import {
  shelterColors,
  shelterIcons,
} from "@/views/shelter_sustainability/shelterTypeColors";
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";
import { env } from "@/config";

@Component({
  computed: {
    ...mapState("ShelterModule", ["shelters", "years", "countries", "db"]),
  },

  methods: {
    ...mapActions("ShelterModule", [
      "duplicateDoc",
      "removeDoc",
      "syncDB",
      "getShelters",
      "getYears",
      "getCountries",
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
  newName = "";

  env = env;
  shelterFilters: ShelterFilters = {
    searchName: "",
    selectedShelterTypes: [],
    selectedYears: [],
    selectedCountries: [],
  };

  shelters!: [];
  countries!: [];
  years!: [];
  shelterDialog = false;
  duplicateDoc!: (shelter: Shelter) => Promise<null>;
  removeDoc!: (id: string) => void;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getShelters!: (paginate?: Paginate) => Promise<null>;
  getYears!: () => Promise<null>;
  getCountries!: () => Promise<null>;
  db!: SyncDatabase<Shelter> | null;

  listOfShelterType = listOfShelterType;
  shelterColors = shelterColors;
  createProjectFormValid = true;
  deleteFormValid = true;
  selectedShelters: string[] = [];
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  countriesMap = countriesMap;

  shelterIcons = shelterIcons;

  dialogDelete = false;
  deleteId = "";
  paginationOptions = {
    page: 1,
    itemsPerPage: 25,
  };
  public get pagination(): {
    page: number;
    itemsPerPage: number;
    pageStart: number;
    pageStop: number;
    pageCount: number;
    itemsLength: number;
  } {
    return {
      page: this.paginationOptions.page,
      itemsPerPage: this.paginationOptions.itemsPerPage,
      pageStart:
        (this.paginationOptions.page - 1) * this.paginationOptions.itemsPerPage,
      pageStop:
        this.paginationOptions.page * this.paginationOptions.itemsPerPage,
      pageCount: 0,
      itemsLength: this.projects.length,
    };
  }
  public get numberOfPages(): number {
    return Math.floor(
      (this.projects?.length ?? 0) / this.paginationOptions.itemsPerPage + 1
    );
  }

  // getter for limit and skip

  deleteItem(id: string): void {
    this.deleteId = id;
    this.dialogDelete = true;
  }
  onError(event: UIEvent): void {
    // https://www.valentinog.com/blog/error/
    this.$store.dispatch("notifyUser", {
      type: "warning",
      message: `Image missing ${event}`,
    });
  }

  async deleteItemConfirm(): Promise<void> {
    if (this.deleteId) {
      await this.removeDoc(this.deleteId);
      await this.closeDialog();
    }
  }

  closeDialog(): void {
    this.dialogDelete = false;
    this.$nextTick().then(() => {
      this.deleteId = "";
    });
  }

  public goToShelter(item: Shelter): void {
    if (item?._id) {
      this.$router.push({
        name: "ShelterSustainabilityEdit",
        params: { id: encodeURIComponent(item?._id) },
      });
    }
  }

  public get coordinates(): (string | number | string | Shelter)[][] {
    return this.projects
      .filter((x: Shelter) => !!x.latitude)
      .map((x: Shelter) => [x.latitude, x.longitude, x.shelter_type, x]);
  }

  public get projects(): Shelter[] {
    function normalize(v: string): string {
      return v
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLocaleLowerCase()
        .trim();
    }
    // TODO replace by _find mango query when indexes work with couchdb bootstrap
    return this.shelters
      .filter((shelter: Shelter) => {
        // by name do a lexicographic search
        if (this.shelterFilters.searchName) {
          return normalize(shelter.name).includes(
            normalize(this.shelterFilters.searchName)
          );
        }
        return true;
      })
      .filter((shelter: Shelter) => {
        // shelter type
        if (this.shelterFilters.selectedShelterTypes.length > 0) {
          return (
            this.shelterFilters.selectedShelterTypes.indexOf(
              shelter.shelter_type
            ) !== -1
          );
        }
        return true;
      })
      .filter((shelter: Shelter) => {
        // year
        if (this.shelterFilters.selectedYears.length > 0) {
          return (
            this.shelterFilters.selectedYears.indexOf(
              shelter.created_at?.substring(0, 4)
            ) !== -1
          );
        }
        return true;
      })
      .filter((shelter: Shelter) => {
        // country
        if (this.shelterFilters.selectedCountries.length > 0) {
          return this.shelterFilters.selectedCountries.includes(
            shelter.location_country
          );
        }
        return true;
      });
  }

  public get projectsWithPagination(): Shelter[] {
    return this.projects.slice(
      (this.paginationOptions.page - 1) * this.paginationOptions.itemsPerPage,
      this.paginationOptions.page * this.paginationOptions.itemsPerPage
    );
  }

  get computedGridTemplate(): string {
    return "{ grid-template-columns: 50% 25px 50%; }";
  }

  public addProject(): void {
    this.shelterDialog = true;
  }
  public updateQueryIds(): void {
    this.$router.replace({
      path: this.$route.path,
      query: { ids: this.selectedShelters.join("|") },
    });
  }

  mounted(): void {
    this.syncDB();
    this.getShelters();

    // GET years and GET countries for v-select used by shelterFilters
    this.getYears();
    this.getCountries();

    // TODO: be responsive to change with a custom view
    // reload on db change
    // this.db?.onChange(this.getShelters);

    const queryIds = this.$route.query.ids;
    if (typeof queryIds === "string") {
      this.selectedShelters = queryIds.length > 0 ? queryIds.split("|") : [];
    }
  }

  destroyed(): void {
    this.closeDB();
  }

  beforeRouteEnter(to: unknown, from: unknown, next: any): void {
    store.dispatch("ShelterModule/resetDoc");
    next();
  }
  @Watch("shelterFilters", { deep: true })
  onShelterFiltersChange(): void {
    // reset pagination
    this.paginationOptions.page = 1;
  }
}

interface ShelterFilters {
  searchName: string | null;
  selectedShelterTypes: ShelterType[];
  selectedYears: string[];
  selectedCountries: string[];
}
</script>

<style lang="scss" scoped>
.shelter__list {
  $header_height: 64px;
  display: block;
}

.country-list {
  grid-area: a;
  position: fixed;
  top: 48px;
  height: 440px;
  z-index: 4;
  width: 100%;

  box-shadow: 0 4px 6px -6px #222;
  margin-left: -12px;
}

.country-list-pagination {
  position: relative;
  top: 440px;
  width: 100%;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  padding-bottom: 2rem;
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
  height: 400px;
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
.custom-checkboxes {
  gap: 12px;
  flex-direction: row;
  display: flex;
}
</style>
