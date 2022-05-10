<template>
  <v-dialog v-model="dialogOpen" max-width="500px">
    <v-form v-model="createProjectFormValid" @submit.prevent="submit">
      <v-card>
        <v-card-title>
          <span class="text-h5">New assessment</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <country-select v-model="newCampSite.country_code" />
              </v-col>
              <v-col cols="12">
                <v-divider />
              </v-col>
              <v-col cols="5">
                <v-select
                  v-model="newCampSite.name"
                  :disabled="existingSites.length === 0 || newName !== ''"
                  tabindex="0"
                  :items="existingSites"
                  item-value="name"
                  item-text="name"
                  label="Select an existing site"
                  @input="onSelectExistingSite"
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
            @click="submit"
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
import { Country, GreenHouseGaz, Sites, Survey } from "@/store/GhgInterface.js";
import { countries as Countries } from "@/utils/countriesAsList";
import flagEmoji from "@/utils/flagEmoji";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["countries", "project"]),
  },

  methods: {
    // todo unified GHG database connection so we have only one store
    ...mapActions("GhgModule", ["addDoc", "updateDoc", "getDoc"]),
  },
  components: {
    CountrySelect,
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  @Prop(Boolean)
  readonly open: boolean = false;

  addDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;
  updateDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;
  getDoc!: (id: string) => null;

  countries!: Country[];
  project!: GreenHouseGaz;
  newName = "";

  get dialogOpen(): boolean {
    return this.open;
  }
  set dialogOpen(v: boolean) {
    this.$emit("update:open", v);
  }

  countriesRef = Countries.map((country) => ({
    ...country,
    emoji: flagEmoji(country.code),
  }));

  public onSelectExistingSite(site: string): void {
    this.getDoc(site);
  }

  private newDefaultCampSite(): GreenHouseGaz {
    return {
      name: "",
      country_code: "",
      created_at: new Date().toISOString(),
      created_by: this.$userName(),
      surveys: [] as Survey[],
    } as GreenHouseGaz;
  }

  newCampSite = this.newDefaultCampSite();

  editedIndex = -1;
  private newDefaultItem(): Survey {
    return {
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

  public closeSiteDialog(): void {
    this.dialogOpen = false;
    this.$nextTick(() => {
      this.newCampSite = this.newDefaultCampSite();
    });
  }

  createProjectFormValid = false;
  // a name is required if current Site selected is null
  rulesCreateNewSite = [
    this.ruleANameShouldHaveLength,
    this.ruleSiteAlreadyExist,
  ];
  public ruleANameIsRequired(v: string): boolean | string {
    return !!v || !this.newCampSite.name || `A name is required`;
  }
  public ruleANameShouldHaveLength(v: string): boolean | string {
    return (
      v?.length > 1 ||
      !this.newCampSite.name ||
      `Name should have a length >= 1`
    );
  }

  public ruleADescriptionIsRequired(value: string): boolean | string {
    return !!value || `A name is required`;
  }

  public ruleSurveyDescriptionAlreadyExist(value: string): boolean | string {
    if (this.newName) {
      return true;
    } else {
      const surveys =
        this.newCampSite.surveys?.map((survey) => survey.name) ?? [];
      return (
        surveys.indexOf(value) === -1 ||
        `An assessment with this name already exist`
      );
    }
  }

  public ruleSiteAlreadyExist(value: string): boolean | string {
    const sites = this.existingSites?.map((survey) => survey.name) ?? [];
    return (
      sites.indexOf(value) === -1 ||
      `An assessment with this site already exist`
    );
  }

  async submit(): Promise<void> {
    // if does not exist
    // addDoc else
    // update doc with new survey
    const saveFn = this.newName ? this.addDoc : this.updateDoc;
    this.newCampSite.surveys.push(this.editedItem);
    // newName has priority
    this.newCampSite.name = this.newName || this.newCampSite.name;

    // TODO When selecting an existing site; we need to retrieve the actual site
    // to avoid having to erase all surveys
    if (
      this.newCampSite.country_code &&
      this.newCampSite.name &&
      this.editedItem.name
    ) {
      const country_code = this.newCampSite.country_code;
      const siteName = this.newCampSite.name;
      const surveyId = this.editedItem.name;
      saveFn(this.newCampSite)
        .then(this.closeSiteDialog)
        .then(() => {
          this.navigateToNewSurvey(country_code, siteName, surveyId);
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
      this.newCampSite = this.newDefaultCampSite();
    }
  }
  created(): void {
    this.syncLocalCampSite();
  }

  mounted(): void {
    this.newCampSite = this.newDefaultCampSite();
  }
}
</script>
