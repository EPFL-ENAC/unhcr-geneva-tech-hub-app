<template>
  <main class="shelter__list" :style="computedGridTemplate">
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Confirm deletion of this shelter?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                <v-btn
                  class="float-right"
                  color="primary"
                  :disabled="!$can('create')"
                  text
                  @click="addProject"
                >
                  <v-icon left>mdi-plus-box</v-icon>
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
                md="12"
                lg="6"
                xl="4"
              >
                <v-card
                  :to="{
                    name: 'ShelterSustainabilityEdit',
                    params: { id: encodeURIComponent(project._id) },
                  }"
                  class="project"
                  max-width="400"
                  min-width="290"
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
                          <v-col :xs="12" :sm="4" class="text-caption">
                            Created: {{ project.created_at | formatDate }}
                          </v-col>
                          <v-col :xs="12" :sm="4" class="text-caption">
                            Updated: {{ project.updated_at | formatDate }}
                          </v-col>
                          <v-col :xs="12" :sm="4" class="d-flex justify-end">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  v-bind="attrs"
                                  icon
                                  class="better-click mr-2"
                                  small
                                  v-on="on"
                                  @click.stop.prevent="
                                    () => duplicateDoc(project)
                                  "
                                >
                                  <v-icon small class="better-click">
                                    mdi-content-copy
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>Duplicate shelter</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
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
                                    mdi-delete
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>Delete shelter</span>
                            </v-tooltip>
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
      <territory-map
        :coordinates="coordinates"
        :default-zoom="2"
        @click:item="goToShelter"
      />
    </div>
    <new-shelter-dialog :open.sync="shelterDialog" />
  </main>
</template>

<script lang="ts">
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import NewShelterDialog from "@/components/shelter_sustainability/NewShelterDialog.vue";
import {
  listOfShelterType,
  Shelter,
  ShelterType,
} from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import { countriesMap } from "@/utils/countriesAsList";
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
  removeDoc!: (id: string) => void;
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

  countriesMap = countriesMap;

  shelterIcons = {
    Emergency: "home-variant-outline",
    Transitional: "home-outline",
    Durable: "home",
  };

  dialogDelete = false;
  deleteId = "";
  deleteItem(id: string): void {
    this.deleteId = id;
    this.dialogDelete = true;
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
