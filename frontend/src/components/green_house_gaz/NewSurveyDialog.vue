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
                  v-model="newCampSite.country_code"
                  :rules="rulesCountry"
                  required
                  @update="resetCampSiteName"
                />
              </v-col>
              <v-col cols="12">
                <v-divider />
              </v-col>
              <v-col cols="5">
                <v-select
                  ref="existingSites"
                  v-model="newCampSite.name"
                  :disabled="
                    existingSitesWithUnhcrSites.length === 0 || newName !== ''
                  "
                  tabindex="0"
                  :items="existingSitesWithUnhcrSites"
                  item-text="name"
                  :return-object="true"
                  label="Select an existing site"
                  :rules="rulesSelectExistingSite"
                  @input="onSelectExistingSite"
                >
                  <template #item="slotProps">
                    <div
                      class="d-flex justify-space-between"
                      style="width: 300px"
                    >
                      <country-flag
                        :country="slotProps.item.country_code"
                        size="small"
                      />
                      {{ slotProps.item.name }}
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
                  @input="$refs.newAssessmentForm.validate()"
                />
              </v-col>

              <v-col cols="12">
                <v-divider />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  tabindex="2"
                  required
                  name="description"
                  :rules="[
                    ruleADescriptionIsRequired,
                    ruleSurveyDescriptionAlreadyExist,
                  ]"
                  label="Assessment description"
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
  GreenHouseGaz,
  Site,
  Sites,
  Survey,
} from "@/store/GhgInterface.vue";
import { UNHCRLocation } from "@/store/UNHCRLocationModule";
import { AxiosError } from "axios";
import { cloneDeep, isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UNHCRLocationModule", ["items"]),
    ...mapGetters("GhgModule", ["countries", "project"]),
  },

  methods: {
    ...mapActions("GhgModule", [
      "addDoc",
      "updateDoc",
      "getDoc",
      "setDoc",
      "resetDoc",
    ]),
  },
  components: {
    CountrySelect,
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly open!: boolean;

  items!: UNHCRLocation[];

  addDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;
  updateDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;
  getDoc!: (id: string) => PromiseLike<void>;
  setDoc!: (obj: GreenHouseGaz) => PromiseLike<void>;
  resetDoc!: () => PromiseLike<void>;

  $refs!: {
    newAssessmentForm: Vue & { validate: () => boolean };
  };

  countries!: Country[];
  project!: GreenHouseGaz;
  newName = "";

  get dialogOpen(): boolean {
    return this.open;
  }
  set dialogOpen(v: boolean) {
    this.$emit("update:open", v);
  }

  public async onSelectExistingSite(site: Site): Promise<void> {
    try {
      await this.getDoc(site.id);
    } catch (error: AxiosError<unknown, any> | unknown) {
      console.log("the 404 is normal, we check if the site already exist");
      // TODO make the types working
      // if (axios.isAxiosError(error) && (error.status as unknown) !== 404) {
      //   throw error;
      // } else {
      // }
      // }
      // try to find it inside the existingUNHCR and call
      // "GhgModule/SET_PROJECT"; or a new action
      const foundUNHCR = this.unhcrProjects.find(
        (unhcrProject) => unhcrProject._id === site.id
      );
      if (!foundUNHCR) {
        throw error;
      }
      foundUNHCR.isUNHCR = true;
      this.setDoc(foundUNHCR);
    } finally {
      this.$refs.newAssessmentForm.validate();
    }
  }
  public onSelectCountry(): void {
    this.resetDoc();
  }

  private newDefaultCampSite(): GreenHouseGaz {
    return {
      _id: uuidv4(),
      name: "",
      country_code: "",
      pp_per_hh: 5, // 4.73 (based on the most recent values for average household size from Database on Household Size and Composition 2022
      hh: 1,
      created_at: new Date().toISOString(),
      created_by: this.$userName(),
      surveys: [] as Survey[],
    } as GreenHouseGaz;
  }

  newCampSite = this.newDefaultCampSite();

  editedIndex = -1;
  private newDefaultItem(): Survey {
    return {
      _id: uuidv4(),
      name: "", // current year
      created_at: new Date().toISOString(),
      created_by: this.$userName(),
    } as Survey;
  }
  editedItem = this.newDefaultItem();

  get existingSites(): Sites {
    const currentCountry = this.countries.find(
      (x) => x.key === this.newCampSite.country_code
    );
    if (!currentCountry) {
      return [] as Sites;
    }
    return currentCountry.value;
  }

  get unhcrLocations(): UNHCRLocation[] {
    return this.items.filter(
      (item) => item.Country === this.newCampSite.country_code
    );
  }

  // TODO: for unhcr SITES use location ID // for new site. use uuidv4
  get unhcrSites(): Sites {
    const result = this.unhcrLocations.map((x) => ({
      id: x["Location id"].toFixed(), // site unique identitier (name as first)
      name: x._id, // site name // location
      country_code: x.Country,
      created_by: this.$userName(),
      users: [this.$user()],
      lat: x.latitude,
      lon: x.longitude,
      solar: x["GHI/Daily_solar_peak_hours"],
      population: x.Population,
    }));
    return result;
  }
  get unhcrProjects(): GreenHouseGaz[] {
    return this.unhcrLocations.map(
      (x) =>
        ({
          ...this.newDefaultCampSite(),
          ...x,
          _id: x["Location id"].toFixed(),
          name: x._id, // site unique identitier (name as first)
          country_code: x.Country,
          solar: x["GHI/Daily_solar_peak_hours"],
          population: x.Population,
          created_by: this.$userName(), // hack to avoid rule in v-form
          users: [this.$user()], // hack to avoid rule in v-form
        } as GreenHouseGaz)
    );
  }
  get existingSitesWithUnhcrSites(): Sites {
    return this.unhcrSites.concat(this.existingSites);
  }

  public closeSiteDialog(): void {
    this.dialogOpen = false;
    this.$nextTick(() => {
      this.resetCampSite();
    });
  }

  public resetCampSite(): void {
    this.newCampSite = this.newDefaultCampSite();
  }

  public resetCampSiteName(): void {
    this.newCampSite._id = uuidv4();
    this.newCampSite.name = "";
    this.newName = "";
    this.editedItem._id = uuidv4();
    this.editedItem.name = "";
  }

  createProjectFormValid = false;
  // a name is required if current Site selected is null
  rulesCreateNewSite = [
    this.ruleANameShouldHaveLength,
    this.ruleSiteAlreadyExist,
  ];

  rulesCountry = [(v: string): boolean | string => !!v || `is required`];
  public ruleANameIsRequired(v: string): boolean | string {
    return !!v || !this.newCampSite.name || `A name is required`;
  }
  public ruleANameShouldHaveLength(v: string): boolean | string {
    return (
      !!this.newCampSite.name ||
      v?.length > 1 ||
      `Name should have a length >= 1`
    );
  }

  public ruleShouldHaveTheEditRights(): boolean | string {
    if (this.newName) {
      return true;
    } else {
      // if unhcr site.. it's not a project yet.. so we need to create it.
      if (isEmpty(this.project)) {
        return true;
      }
      return (
        this.$can("edit", this.project) ||
        `You're not on the list of authorized user for this existing site, please contact the creator of the site: ${
          this.project.name ?? ""
        } ${this.project.created_by ?? ""}`
      );
    }
  }

  rulesSelectExistingSite = [this.ruleShouldHaveTheEditRights];

  public ruleADescriptionIsRequired(value: string): boolean | string {
    return !!value || `A name is required`;
  }

  public ruleSurveyDescriptionAlreadyExist(value: string): boolean | string {
    if (this.newName) {
      return true;
    } else {
      const surveys =
        this.newCampSite?.surveys?.map((survey) => survey.name) ?? [];
      return (
        surveys.indexOf(value) === -1 ||
        `An assessment with this name already exist`
      );
    }
  }

  public ruleSiteAlreadyExist(value: string): boolean | string {
    const sites =
      this.existingSitesWithUnhcrSites?.map((survey) => survey.name) ?? [];
    return (
      sites.indexOf(value) === -1 ||
      `An assessment with this site already exist`
    );
  }

  async submit(): Promise<void> {
    // if does not exist
    // addDoc else
    // update doc with new survey
    // if it's unhcr.. then it's a new document
    const saveFn =
      this.newName || this.newCampSite.isUNHCR ? this.addDoc : this.updateDoc;
    this.newCampSite.surveys.push(this.editedItem);
    // newName has priority
    this.newCampSite.name = this.newName || this.newCampSite.name;

    // TODO: IMPORTANT When selecting an existing site; we need to retrieve the actual site
    // to avoid having to erase all surveys
    if (
      this.newCampSite.country_code &&
      this.newCampSite._id &&
      this.editedItem._id
    ) {
      const country_code = this.newCampSite.country_code;
      const siteId = this.newCampSite._id;
      const surveyId = this.editedItem._id;

      saveFn(this.newCampSite)
        .then(this.closeSiteDialog)
        .then(() => {
          this.navigateToNewSurvey(country_code, siteId, surveyId);
        });
    }
  }

  private navigateToNewSurvey(
    country_code: string,
    site: string,
    surveyId: string
  ): void {
    if (this.$route.name !== "GreenHouseGazItemSurveyId") {
      this.$router.push({
        name: "GreenHouseGazItemSurveyId",
        params: {
          country: country_code,
          site: encodeURIComponent(site),
          surveyId: encodeURIComponent(surveyId),
        },
        query: {
          category: "Info",
        },
      });
    }
  }

  public setLocalCampSite(project: GreenHouseGaz): void {
    // TODO: clean up _rev here also (maybe ?)
    this.newCampSite = project ? cloneDeep(project) : ({} as GreenHouseGaz);
  }

  public syncLocalCampSite(): void {
    // init function
    this.setLocalCampSite(this.project);

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalCampSite(mutation.payload);
      }
    });
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
    this.resetDoc().then(() => {
      this.syncLocalCampSite();
    });
    this.resetCampSite();
  }

  destroyed(): void {
    this.resetCampSite();
  }
}
</script>
