<template>
  <main class="green-house-gaz__list" :style="computedGridTemplate">
    <v-sheet class="country-list overflow-y-auto">
      <v-container fluid>
        <v-row>
          <v-col class="country-list__actions d-flex justify-end align-center">
            <v-btn text :disabled="!$can('create')" @click="addSurvey">
              <v-icon>mdi-plus-thick</v-icon>
              New assessment
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
      <territory-map />
    </div>
    <new-survey-dialog :open.sync="siteDialog" />
  </main>
</template>

<script lang="ts">
import NewSurveyDialog from "@/components/green_house_gaz/NewSurveyDialog.vue";
import TerritoryMap from "@/components/green_house_gaz/TerritoryMap.vue";
import { Component, Vue } from "vue-property-decorator";
import { mapActions } from "vuex";

@Component({
  methods: {
    ...mapActions("GhgModule", [
      "syncDB",
      "addDoc",
      "closeDB",
      "getCountries",
      "getSites",
    ]),
  },
  components: {
    TerritoryMap,
    NewSurveyDialog,
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getCountries!: () => Promise<null>;
  getSites!: () => Promise<null>;

  siteDialog = false;

  mounted(): void {
    this.syncDB();
    this.getCountries();
    this.getSites();
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view shelter list, closing DB");
    });
  }

  get computedGridTemplate(): string {
    return "{ grid-template-columns: 50% 25px 50%; }";
  }

  public addSurvey(): void {
    this.siteDialog = true;
  }
}
</script>

<style lang="scss" scoped>
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
</style>
