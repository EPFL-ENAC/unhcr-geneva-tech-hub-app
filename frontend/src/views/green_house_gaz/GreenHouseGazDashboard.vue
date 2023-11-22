<template>
  <main class="green-house-gaz__list" :style="computedGridTemplate">
    <v-sheet class="country-list overflow-y-auto">
      <v-container fluid>
        <v-row>
          <v-col
            v-if="$can('admin')"
            class="country-list__actions d-flex justify-end align-center"
          >
            <v-btn
              class="float-right"
              color="error"
              :disabled="!$can('admin')"
              text
              @click.stop.prevent="deleteDrafts"
            >
              <v-icon left>$mdiDelete</v-icon>
              delete all drafts
            </v-btn>
          </v-col>
          <v-col class="country-list__actions d-flex justify-end align-center">
            <v-btn
              class="float-right"
              color="primary"
              :disabled="!$can('create')"
              text
              @click="addSurvey"
            >
              <v-icon left>$mdiPlusBox</v-icon>
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
      <territory-map :coordinates="coordinates" @click:item="openSite" />
    </div>
    <new-survey-dialog :open.sync="siteDialog" />
    <v-dialog v-model="dialogDeleteDraft" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Confirm deletion of all the drafts? this will be
          permanent</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteDraftsConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script lang="ts">
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import NewSurveyDialog from "@/components/green_house_gaz/NewSurveyDialog.vue";
import { GreenHouseGaz } from "@/store/GhgInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    // sites is set by vuex in getCountries
    ...mapGetters("GhgModule", ["sites", "siteAssessmentsLoading"]),
  },
  methods: {
    ...mapActions("GhgModule", [
      "syncDB",
      "closeDB",
      "getCountries",
      "removeDrafts",
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
  removeDrafts!: () => Promise<null>;
  siteAssessmentsLoading!: boolean;

  siteDialog = false;

  sites!: GreenHouseGaz[];

  dialogDeleteDraft = false;

  deleteDrafts(): void {
    this.dialogDeleteDraft = true;
  }

  async deleteDraftsConfirm(): Promise<void> {
    await this.removeDrafts().then(() => {
      this.$store.dispatch("notifyUser", {
        type: "info",
        message: `successfuly removing all drafts`,
      });
    });
    await this.closeDialog();
  }

  closeDialog(): void {
    this.dialogDeleteDraft = false;
  }

  public get coordinates(): (number | undefined | GreenHouseGaz)[][] {
    return this.sites
      .filter((site: GreenHouseGaz) => site.latitude !== undefined)
      .map((site: GreenHouseGaz): (number | undefined | GreenHouseGaz)[] => [
        site.latitude ?? 0,
        site.longitude ?? 0,
        undefined,
        site,
      ]);
  }

  mounted(): void {
    this.syncDB();
    this.getCountries();
    this.listenToSetProjectAndRetrieveAssessments();
  }

  public listenToSetProjectAndRetrieveAssessments(): void {
    this.$store.subscribe((mutation) => {
      const shouldUpdate = [
        "GhgModule/NEW_ASSESSEMENT",
        "GhgModule/REMOVE_ASSESSEMENT",
        "GhgModule/UPDATE_ASSESSEMENT",
        "GHGModule/REMOVE_ASSESSMENTS",
      ];
      if (shouldUpdate.includes(mutation.type)) {
        this.getCountries();
      }
    });
  }

  destroyed(): void {
    this.closeDB();
  }

  get computedGridTemplate(): string {
    return "{ grid-template-columns: 50% 25px 50%; }";
  }

  public openSite(item: GreenHouseGaz): void {
    if (item?.countryCode) {
      let hash = "";
      if (this.$route.hash !== `#${item?.countryCode}`) {
        hash = item?.countryCode;
      }
      this.$router.push({ hash });
    }
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
