<template>
  <main class="green-house-gaz__list" :style="computedGridTemplate">
    <v-sheet class="country-list overflow-y-auto">
      <v-container fluid>
        <!-- <v-row
          ><v-col
            :cols="12"
            class="country-list-header d-flex align-center justify-center"
          >
            <span class="country-list-header__title">
              Green House Gaz indicators summarized by location
            </span>
            <span class="country-list-header__tools">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-map-marker-question-outline</v-icon>
                  </v-btn>
                </template>
                <span>Data last updated on the 1st of March 2022</span>
              </v-tooltip>
              <v-btn icon @click="toggleExpandMap">
                <v-icon v-if="expandMap">mdi-unfold-more-vertical</v-icon>
                <v-icon v-else>mdi-unfold-less-vertical</v-icon>
              </v-btn>
            </span>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col class="country-list__actions d-flex justify-end align-center">
            <!-- @click="addSite" -->
            <v-btn
              text
              :to="{
                name: 'GreenHouseGazItemSurveyId',
                params: {
                  country: 'FR',
                  site: 'Lyon',
                  surveyId: encodeURIComponent('dafadf'),
                },
              }"
            >
              <v-icon>mdi-plus-thick</v-icon>
              New survey
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col justify="center">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <div class="separator"></div>
    <div class="map-countries">
      <v-img src="/ghg/map.png"></v-img>
    </div>

    <v-dialog v-model="siteDialog" max-width="500px">
      <v-form @submit.prevent="save" v-model="createProjectFormValid">
        <v-card>
          <v-card-title>
            <span class="text-h5">New location</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    tabindex="0"
                    v-model="newCampSite.country_code"
                    :items="countriesRef"
                    item-value="code"
                    item-text="name"
                    label="Select country"
                  >
                    <template v-slot:item="slotProps">
                      <div
                        class="d-flex justify-space-between"
                        style="width: 300px"
                      >
                        <span> {{ slotProps.item.emoji }} </span>
                        {{ slotProps.item.name }}
                      </div>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    tabindex="1"
                    v-model="newCampSite.name"
                    :rules="rules"
                    required
                    name="name"
                    label="Location"
                    type="text"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              tabindex="4"
              text
              @click="closeSiteDialog"
            >
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" tabindex="3" submit text @click="save">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </main>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface.js";
import Countries from "@/utils/countriesAsList";
import flagEmoji from "@/utils/flagEmoji";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("GhgListModule", ["countries"]),
  },

  methods: {
    ...mapActions("GhgListModule", [
      "syncDB",
      "addDoc",
      "closeDB",
      "getCountries",
    ]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  syncDB!: () => null;
  addDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;

  siteDialog = false;
  expandMap = true;
  closeDB!: () => Promise<null>;

  getCountries!: () => Promise<null>;

  // todo store in js outstide directly ?
  countriesRef = Countries.map((country) => ({
    ...country,
    emoji: flagEmoji(country.code),
  }));

  mounted(): void {
    this.syncDB();
    this.getCountries();
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view shelter list, closing DB");
    });
  }

  toggleExpandMap(): void {
    this.expandMap = !this.expandMap;
  }

  get computedGridTemplate(): string {
    if (this.expandMap) {
      return "{ grid-template-columns: 50% 25px 50%; }";
    }

    return "grid-template-columns: 100%;";
  }

  public download(): void {
    console.log("download data");
  }
  public compare(): void {
    console.log("compare surveys");
  }
  public statistics(): void {
    console.log("run statistics");
  }

  // todo: move to own component

  defaultCampSite = {
    name: "",
    country_code: "",
    surveys: [] as Survey[],
  } as GreenHouseGaz;

  newCampSite = Object.assign({} as GreenHouseGaz, this.defaultCampSite);

  public addSite(): void {
    this.newCampSite = Object.assign({} as GreenHouseGaz, this.defaultCampSite);
    // console.log("add site");
    this.siteDialog = true;
  }

  public closeSiteDialog(): void {
    this.siteDialog = false;
    this.$nextTick(() => {
      this.newCampSite = Object.assign(
        {} as GreenHouseGaz,
        this.defaultCampSite
      );
    });
  }

  createProjectFormValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  public save(): void {
    // directly create a new survey inside a new Camp site
    // not logical
    // todo: fix me
    // (new Date()).toISOString().split("T")[0]
    console.log("this is the new CampSite", this.newCampSite);
    if (this.newCampSite.name !== "") {
      this.addDoc(this.newCampSite).then(this.closeSiteDialog);
    } else {
      console.error("please fill the new Name");
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-header {
  justify-content: space-between;
  display: flex;
  padding-right: 15px;
}
.green-house-gaz__list {
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

// .country-list-header {
//   display: grid;
//   grid-template: "left" "center" "right";
// }

.country-list-header__title {
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  // grid-area: center;
}

.country-list-header__tools {
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  // grid-area: right;
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
}
</style>
