<template>
  <v-form
    v-bind="$attrs"
    ref="formInfo"
    v-model="formValid"
    @submit.prevent="() => submitForm(localProject)"
  >
    <v-container v-if="project.users" fluid>
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn
            color="primary"
            :disabled="
              !formValid || $attrs.readonly || !$v.$dirty || saveInProgress
            "
            type="submit"
            :loading="saveInProgress"
            ><v-icon left>$mdiContentSave</v-icon>
            {{ $v.$dirty ? "Save" : "Saved" }}</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card elevation="2" rounded>
            <v-card-text>
              <v-row>
                <v-col cols="6" class="force-min-height-for-map">
                  <h2>General</h2>
                  <v-row>
                    <template v-for="(item, index) in generalItems">
                      <v-col
                        v-if="!item.hidden"
                        :key="index"
                        cols="12"
                        sm="6"
                        md="6"
                        lg="4"
                        xl="4"
                      >
                        <form-item-component
                          v-if="item.key !== 'country_code'"
                          v-model="localProject[item.key]"
                          v-bind="item"
                          @input="
                            (v) => {
                              $v.localProject[item.key].$touch();
                              $v.localProject.$touch();
                              item?.customEventInput?.(v, localProject);
                            }
                          "
                        ></form-item-component>
                        <country-select
                          v-else
                          id="location_country"
                          v-model="localProject.country_code"
                          label="Country"
                          type="text"
                          name="location_country"
                          @input="$v.localProject.$touch"
                          @update:latitude="updateLatitude"
                          @update:longitude="updateLongitude"
                        />
                      </v-col>
                    </template>
                  </v-row>
                  <v-row v-if="surveyIndex >= 0">
                    <template v-for="(item, index) in surveyItems">
                      <v-col
                        v-if="!item.hidden"
                        :key="index"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                      >
                        <form-item-component
                          v-model="localProject.surveys[surveyIndex][item.key]"
                          v-bind="item"
                          @input="updateSurveyValues"
                        ></form-item-component>
                      </v-col>
                    </template>
                  </v-row>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="6" class="map-countries">
                  <territory-map :value="latLng" @update:value="updateLatLng" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import { GreenHouseGaz, Survey } from "@/store/GhgInterface.vue";
import { CouchUser } from "@/store/UserModule";
import {
  attributionMap,
  defaultCoordinates,
  defaultZoom,
  urlMap,
} from "@/utils/mapWorld";
import { VForm } from "@/utils/vuetify";
import { LatLngExpression } from "leaflet";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { LControlScale, LMap, LMarker, LTileLayer } from "vue2-leaflet";
import { validationMixin } from "vuelidate";
import { Validations } from "vuelidate-property-decorators";
import { required } from "vuelidate/lib/validators";
import { Validation } from "vuelidate/vuelidate";
import { mapActions, mapGetters } from "vuex";

@Component({
  inheritAttrs: true,
  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  mixins: [validationMixin],
  methods: {
    ...mapActions("GhgModule", ["updateDoc"]),
  },
  components: {
    CountrySelect,
    FormItemComponent,
    LControlScale,
    LMap,
    LMarker,
    LTileLayer,
    TerritoryMap,
  },
})
/** ProjectItem */
export default class GhgInfo extends Vue {
  @Prop([Object, Array])
  readonly survey: Survey | undefined;

  @Prop([Number])
  readonly surveyIndex: number | undefined;

  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  project!: GreenHouseGaz;
  user!: CouchUser;
  @Validations()
  validations = {
    localProject: {
      name: { required },
      country_code: { required }, //string;
      latitude: { required }, //number;
      longitude: { required }, //number;
      surveys: { required }, //Survey[];
      solar: { required }, //number;
      population: { required }, //number; // total population
      pp_per_hh: { required }, //number; // ave people per hhtotalHH
      totalHH: { required }, //number;
      // what about surveys ?? HEELL
    },
  };

  localProject = {} as GreenHouseGaz;
  $refs!: {
    formInfo: VForm;
    $v: Validation;
  };
  textRules = [
    (v: string): boolean | string => !!v || `is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `should have a length >= 1`,
  ];

  readonly zoom = defaultZoom;
  readonly defaultCoordinates = defaultCoordinates;
  readonly url = urlMap;
  readonly attribution = attributionMap;
  formValid = false;

  saveInProgress = false;

  get latLng(): LatLngExpression {
    const { latitude, longitude } = this.localProject;
    if (latitude !== undefined) {
      return [latitude ?? 0, longitude ?? 0];
    }
    return defaultCoordinates as LatLngExpression;
  }

  get surveyItems(): FormItem[] {
    return [
      {
        type: "text",
        key: "name",
        label: "Assessment description",
      },
    ];
  }

  get generalItems(): (FormItem & {
    customEventInput?: (v: number, input: GreenHouseGaz) => GreenHouseGaz;
  })[] {
    return [
      {
        type: "text",
        key: "name",
        label: "Name of the site",
        disabled: false,
      },
      {
        type: "number",
        key: "latitude",
        label: "Latitude of the site",
        unit: "Decimal Degrees",
        min: -90,
        max: 90,
      },
      {
        type: "number",
        key: "longitude",
        label: "Longitude of the site",
        unit: "Decimal Degrees",
        min: -180,
        max: 180,
      },
      {
        type: "text",
        key: "country_code",
        label: "Country code",
      },
      {
        type: "number",
        key: "population",
        label: "Total population",
        min: 0,

        customEventInput: (population: number, localInput: GreenHouseGaz) => {
          localInput.population = population;
          localInput.totalHH = parseInt(
            (population / localInput.pp_per_hh).toFixed(0),
            10
          );
          return localInput;
        },
      },
      {
        type: "number",
        key: "solar",
        label: "Daily solar peak hours",
        min: 0,
        max: 12,
      },
      {
        type: "number",
        key: "pp_per_hh",
        label: "Ave. People per HH",
        min: 0,
        max: 10,
        customEventInput: (pp_per_hh: number, localInput: GreenHouseGaz) => {
          localInput.pp_per_hh = pp_per_hh;
          localInput.totalHH = parseInt(
            (localInput.population / pp_per_hh).toFixed(0),
            10
          );
          return localInput;
        },
      },
      {
        type: "number",
        key: "totalHH",
        label: "total HH",
        disabled: true,
      },
    ];
  }

  public async submitForm(value: GreenHouseGaz): Promise<void> {
    if (
      value.name !== "" &&
      this.survey &&
      this.surveyIndex !== undefined &&
      this.surveyIndex >= 0
    ) {
      this.saveInProgress = true;
      if (this.surveyIndex !== undefined) {
        const currentSurvey: Survey = value.surveys[this.surveyIndex];
        currentSurvey.updated_at = new Date().toISOString();
        currentSurvey.updated_by = this.$user().name ?? "user with no name";
        value.surveys[this.surveyIndex] = currentSurvey;
      }
      try {
        await this.updateDoc(value);
      } finally {
        this.$v.$reset();
        this.saveInProgress = false;
      }
    } else {
      throw new Error("please fill the new Name");
    }
  }

  public updateSurveyValues(): void {
    if (this.surveyIndex !== undefined) {
      const currentSurvey: Survey = this.localProject.surveys[this.surveyIndex];
      currentSurvey.updated_at = new Date().toISOString();
      currentSurvey.updated_by = this.$user().name ?? "user with no name";
      this.localProject.surveys[this.surveyIndex] = currentSurvey;
      this.localProject = Object.assign({}, this.localProject);
      // no vuelidate for descriptions and custom keys for now
      // but it works because we're using vuetify and vuelidate form validation
      this.$v.localProject.$touch();
    }
  }

  public updateLatitude(lat: number): void {
    this.$set(this.localProject, "latitude", parseFloat(lat.toFixed(3)));
  }

  public updateLongitude(lon: number): void {
    this.$set(this.localProject, "longitude", parseFloat(lon.toFixed(3)));
  }

  public updateLatLng(latLng: number[]): void {
    this.localProject.latitude = latLng[0];
    this.localProject.longitude = latLng[1];
    this.localProject = Object.assign({}, this.localProject);
    this.$v.$touch();
  }

  public setLocalShelter(project: GreenHouseGaz): void {
    this.localProject = project ? cloneDeep(project) : ({} as GreenHouseGaz);
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter(this.project);

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter(mutation.payload);
      }
    });
  }

  // hack to force revalidate on open
  @Watch("formValid", { immediate: true, deep: true })
  onFormValid(): void {
    this.$refs?.formInfo?.validate();
  }

  created(): void {
    this.syncLocalShelter();
  }
  mounted(): void {
    this.$refs.formInfo.validate();
  }
}
</script>

<style lang="scss" scoped>
.force-min-height-for-map {
  min-height: calc(100vh - 250px);
}
.map-countries {
  z-index: 1;
}
</style>
