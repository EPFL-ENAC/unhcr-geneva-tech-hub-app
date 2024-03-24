<template>
  <v-dialog v-model="dialogOpen" max-width="500px">
    <v-form
      ref="newAssessmentForm"
      v-model="createProjectFormValid"
      @submit.prevent="submit"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">New assessment</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <country-select
                  v-model="newCampSite.countryCode"
                  :rules="rulesCountry"
                  required
                  @update="(v) => resetOnCountrySelect(v)"
                />
              </v-col>
              <v-col cols="12">
                <v-divider />
              </v-col>
              <v-col cols="5">
                <v-select
                  ref="existingSites"
                  v-model="selectedSite"
                  :disabled="
                    existingSitesWithUnhcrSites.length === 0 || newName !== ''
                  "
                  tabindex="0"
                  :items="existingSitesWithUnhcrSites"
                  item-text="siteName"
                  :return-object="true"
                  label="Select an existing site"
                  :rules="rulesSelectExistingSite"
                  @input="onSelectExistingSite"
                >
                  <template #item="slotProps">
                    <div
                      class="d-flex justify-left align-center"
                      style="width: 300px; gap: 2rem"
                    >
                      <country-flag
                        :country="slotProps.item.countryCode"
                        size="small"
                      />
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          width: 260px;
                        "
                      >
                        <span>{{ slotProps.item.siteName }}</span>
                        <span
                          style="
                            font-size: 9px;
                            font-weight: lighter;
                            font-style: italic;
                          "
                          :title="slotProps.item.siteId"
                          >({{
                            (slotProps.item.siteId + "").substr(0, 8)
                          }} <span v-if="!slotProps.item.location_pcode"> User Created ID</span>)</span
                        >
                      </div>
                    </div>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="2" style="text-align: center">
                <span style="line-height: 64px">or</span>
              </v-col>

              <v-col cols="5">
                <v-text-field
                  v-model="newName"
                  tabindex="1"
                  required
                  name="name"
                  :rules="rulesCreateNewSite"
                  label="Create a new site"
                  type="text"
                  @input="onCreateNewSite"
                />
              </v-col>

              <v-col cols="12">
                <v-divider />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newCampSite.description"
                  tabindex="2"
                  required
                  name="description"
                  :rules="[
                    ruleADescriptionIsRequired,
                    ruleSurveyDescriptionAlreadyExist,
                  ]"
                  label="Assessment description"
                  type="text"
                  @change="$refs.newAssessmentForm.validate()"
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
          <v-btn
            color="blue darken-1"
            tabindex="3"
            submit
            type="submit"
            text
            :disabled="!createProjectFormValid"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
/*
 Expected behavior of the component (modal / form).
 1. Choose country
 2. Either choose existing site
 3. Or create new site
 4. Select a year

 When submiting form
  - create new site (project) and add new assessment
  - retrieve (already retrieved project) and add new assessment
  -> redirect to proper surveyId page edit
*/
import CountrySelect from "@/components/commons/CountrySelect.vue";
// TODO use generic Survey instead of Survey
import {
  Country,
  DEFAULT_PP_PER_HH,
  GreenHouseGaz,
  newDefaultCampSite,
  newSurveyForm,
} from "@/store/GhgInterface";
import { UNHCRLocation } from "@/store/UNHCRLocationModule";
import { countriesMap } from "@/utils/countriesAsList";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UNHCRLocationModule", ["items"]),
    ...mapGetters("GhgModule", ["countries", "project", "siteAssessments"]),
  },

  methods: {
    ...mapActions("GhgModule", ["addDoc", "getDoc", "getSite", "resetDoc"]),
  },
  components: {
    CountrySelect,
  },
})
/** ProjectList */
export default class NewSurveyDialog extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly open!: boolean;

  items!: UNHCRLocation[];
  selectedSite: GreenHouseGaz | Record<string, string> = {};
  siteAssessments!: GreenHouseGaz[];
  getSite!: (id: number | string) => null;
  addDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;
  getDoc!: (id: string) => PromiseLike<GreenHouseGaz>;
  resetDoc!: () => PromiseLike<void>;

  $refs!: {
    newAssessmentForm: Vue & { validate: () => boolean };
  };

  countries!: Country[];
  countriesMap = countriesMap;
  project!: GreenHouseGaz;
  newName = "";
  newCampSite = newDefaultCampSite(this.$userName());

  get dialogOpen(): boolean {
    return this.open;
  }
  set dialogOpen(v: boolean) {
    this.$emit("update:open", v);
  }

  public async onSelectExistingSite(site: GreenHouseGaz): Promise<void> {
    const foundUNHCR = this.unhcrSites.find(
      (assessment) => assessment.siteId === site.siteId
    );
    if (foundUNHCR) {
      foundUNHCR.isUNHCR = true;
      this.newCampSite = { ...this.newCampSite, ...foundUNHCR };
    } else {
      // we should retrieve the following data from the database
      // latitude, longitude, popuplation, siteId, siteName, countryCode,  solar, pp_per_hh, totalHH
      const existingSite = await this.getDoc(site.id);
      const {
        latitude,
        longitude,
        population,
        siteId,
        siteName,
        countryCode,
        solar,
        pp_per_hh,
        totalHH,
      } = existingSite;
      this.newCampSite = {
        ...this.newCampSite,
        latitude,
        longitude,
        population,
        siteId,
        siteName,
        countryCode,
        solar,
        pp_per_hh,
        totalHH,
      };
    }
    this.newCampSite.created_by = this.$userName();

    // get site retrieve all the assessment of the site, we need to check if the assessment description already exist
    this.getSite(site.siteId);
    this.$refs.newAssessmentForm.validate();
  }

  public onCreateNewSite(value: string | undefined): void {
    if (!value && this.selectedSite?.siteId) {
      this.newCampSite.siteId = this.selectedSite?.siteId;
    } else {
      this.newCampSite.siteId = uuidv4();
    }
    this.$refs.newAssessmentForm.validate();
  }

  get existingSites(): GreenHouseGaz[] {
    const currentCountry = this.countries.find(
      (x) => x.key[0] === this.newCampSite.countryCode
    );
    if (!currentCountry) {
      return [] as GreenHouseGaz[];
    }
    return currentCountry.value;
  }

  get unhcrLocations(): UNHCRLocation[] {
    return this.items.filter(
      (item) => item.country_code_2 === this.newCampSite.countryCode
    );
  }

  get unhcrSites(): GreenHouseGaz[] {
    const result = this.unhcrLocations.map((x): GreenHouseGaz => {
      return {
        ...newDefaultCampSite(this.$userName()),
        siteId: x.location_pcode, // should not be string should be number ?
        location_id: x.location_id,
        location_pcode: x.location_pcode,
        siteName: x._id, // site name // location
        countryCode: x.country_code_2,
        created_by: this.$userName(),
        users: [this.$user()],
        latitude: x.latitude,
        longitude: x.longitude,
        solar: x.solar_peak_hours,
        population: x.population,
        year: x.year,
        totalHH: parseInt((x.population / DEFAULT_PP_PER_HH).toFixed(0), 10),
        created_at: new Date().toISOString(),
        ...newSurveyForm(),
      };
    });
    return result;
  }
  get existingSitesWithUnhcrSites(): GreenHouseGaz[] {
    let result = this.unhcrSites;
    const unhcrLocationIds = this.unhcrLocations.map(
      (location) => location.location_pcode
    );
    const filteredExistingSite = this.existingSites.filter(
      (existingSite) => !unhcrLocationIds.includes(existingSite.siteId)
    );
    result = result.concat(filteredExistingSite);
    // add onlye existing sites that are not in unhcr
    result.sort((x, y) => (x.siteName < y.siteName ? -1 : 1));
    return result;
  }

  public closeSiteDialog(): void {
    this.dialogOpen = false;
    this.$nextTick(() => {
      this.resetCampSite();
    });
  }

  public resetCampSite(): void {
    this.newCampSite = newDefaultCampSite(this.$userName());
  }

  public resetOnCountrySelect(countryCode: string): void {
    this.newCampSite.id = uuidv4();
    this.newCampSite.siteId = uuidv4(); // default in case not in unhcr
    this.newCampSite.siteName = "";
    // const selectedCountry = this.countriesMap[countryCode];
    this.newCampSite.countryCode = countryCode;
    this.newCampSite.latitude = undefined; //selectedCountry?.lat ?? 0;
    this.newCampSite.longitude = undefined; //selectedCountry?.lon ?? 0;
    this.newName = "";
    this.newCampSite.description = "";
  }

  createProjectFormValid = false;
  // a name is required if current Site selected is null
  rulesCreateNewSite = [
    this.ruleANameShouldHaveLength,
    this.ruleSiteAlreadyExist,
  ];

  rulesCountry = [(v: string): boolean | string => !!v || `is required`];
  public ruleANameIsRequired(v: string): boolean | string {
    return !!v || !this.newCampSite.siteName || `A name is required`;
  }
  public ruleANameShouldHaveLength(v: string): boolean | string {
    return (
      !!this.newCampSite.siteName ||
      v?.length > 1 ||
      `Name should have a length >= 1`
    );
  }

  public ruleShouldHaveTheEditRights(): boolean | string {
    // no more, because every creation is unique to the user
    return true;
  }

  rulesSelectExistingSite = [this.ruleShouldHaveTheEditRights];

  public ruleADescriptionIsRequired(value: string): boolean | string {
    return !!value || `A description is required`;
  }

  public get currentAssessmentsDescriptions(): string[] {
    if (this.newCampSite?.siteId) {
      return (
        this.siteAssessments?.map(
          (assessment: GreenHouseGaz) => assessment.description
        ) ?? []
      );
    }
    return [];
  }

  public ruleSurveyDescriptionAlreadyExist(value: string): boolean | string {
    if (this.newName) {
      return true;
    } else {
      if (this.currentAssessmentsDescriptions.indexOf(value) === -1) {
        return true;
      } else {
        return `An assessment with this description already exist`;
      }
    }
  }

  public ruleSiteAlreadyExist(value: string): boolean | string {
    const siteNames =
      this.existingSitesWithUnhcrSites?.map((survey) => survey.siteName) ?? [];
    return (
      siteNames.indexOf(value) === -1 ||
      `An assessment with this site already exist`
    );
  }

  async submit(): Promise<void> {
    this.newCampSite.siteName = this.newName || this.newCampSite.siteName;
    if (
      this.newCampSite.countryCode &&
      this.newCampSite.id &&
      this.newCampSite.siteId
    ) {
      const countryCode = this.newCampSite.countryCode;
      const siteId = this.newCampSite.siteId;
      const surveyId = this.newCampSite.id;
      this.addDoc(this.newCampSite)
        .then(this.closeSiteDialog)
        .then(() => {
          this.navigateToNewSurvey(countryCode, siteId, surveyId);
        });
    }
  }

  private navigateToNewSurvey(
    countryCode: string,
    site: number | string,
    surveyId: string
  ): void {
    if (this.$route.name !== "GreenHouseGazItemSurveyId") {
      this.$router.push({
        name: "GreenHouseGazItemSurveyId",
        params: {
          country: countryCode,
          site: encodeURIComponent(site),
          surveyId: encodeURIComponent(surveyId),
        },
        query: {
          category: "Info",
        },
      });
    }
  }

  @Watch("open", { immediate: true })
  onOpenChange(value: boolean): void {
    // reset form on dialog open
    if (value === true) {
      this.resetCampSite();
    }
  }

  @Watch("project", { immediate: true })
  onProjectChange(value: GreenHouseGaz): void {
    if (value?.users) {
      this.$refs.newAssessmentForm?.validate();
    }
  }

  mounted(): void {
    this.resetDoc();
    // .then(() => {
    // this.syncLocalCampSite();
    // });
    this.resetCampSite();
  }

  destroyed(): void {
    this.resetCampSite();
  }
}
</script>
