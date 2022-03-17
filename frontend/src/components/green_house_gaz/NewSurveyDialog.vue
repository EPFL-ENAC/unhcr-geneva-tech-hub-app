<template>
  <v-dialog v-model="dialogOpen" max-width="500px">
    <v-form @submit.prevent="submit" v-model="createProjectFormValid">
      <v-card>
        <v-card-title>
          <span class="text-h5">New survey</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <!-- {{ newCampSite }}
            {{ editedItem }} -->
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
                <v-select
                  :disabled="existingSites.length === 0 || newName !== ''"
                  tabindex="0"
                  v-model="newCampSite.name"
                  :items="existingSites"
                  item-value="name"
                  item-text="name"
                  label="Select an existing site"
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

              <v-divider />

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  tabindex="1"
                  v-model="newName"
                  :rules="rules"
                  required
                  name="name"
                  label="Create a new site"
                  type="text"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  tabindex="3"
                  v-model="editedItem.name"
                  :items="['2019', '2020', '2021', '2022']"
                  label="Select an existing year"
                >
                </v-select>
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
  - create new site (project) and add new survey
  - retrieve (already retrieved project) and add new survey
  -> redirect to proper surveyId page edit
*/
import { Country, GreenHouseGaz, Sites, Survey } from "@/store/GhgInterface.js";
import Countries from "@/utils/countriesAsList";
import flagEmoji from "@/utils/flagEmoji";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgListModule", ["countries"]),
  },

  methods: {
    ...mapActions("GhgListModule", ["addDoc", "updateDoc"]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  @Prop(Boolean)
  readonly open: boolean = false;

  addDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;
  updateDoc!: (obj: GreenHouseGaz) => PromiseLike<GreenHouseGaz>;

  countries!: Country[];
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
      name: "2022", // current year
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

  mounted(): void {
    this.newCampSite = this.newDefaultCampSite();
  }

  public closeSiteDialog(): void {
    this.dialogOpen = false;
    this.$nextTick(() => {
      this.newCampSite = this.newDefaultCampSite();
    });
  }

  createProjectFormValid = true;
  // a name is required if current Site selected is null
  rules = [
    (v: string): boolean | string =>
      !!v || !this.newCampSite.name || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 ||
      !this.newCampSite.name ||
      `Name should have a length >= 1`,
  ];

  async submit(): Promise<void> {
    // if does not exist
    // addDoc else
    // update doc with new survey
    const saveFn = this.newName ? this.addDoc : this.updateDoc;
    this.newCampSite.surveys.push(this.editedItem);
    this.newCampSite.name = this.newCampSite.name || this.newName;

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
    this.$router.push({
      name: "GreenHouseGazItemSurveyId",
      params: {
        country: country_code,
        site: encodeURIComponent(site),
        surveyId: encodeURIComponent(surveyId),
      },
    });
  }
}
</script>
