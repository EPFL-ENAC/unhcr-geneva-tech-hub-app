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
                          v-if="item.key !== 'countryCode'"
                          v-model="localProject[item.key]"
                          v-bind="item"
                          @input="
                            (v) => {
                              $v.localProject.$touch();
                              $v.localProject[item.key] &&
                                $v.localProject[item.key].$touch &&
                                $v.localProject[item.key].$touch();
                              item?.customEventInput?.(v, localProject);
                            }
                          "
                        ></form-item-component>
                        <country-select
                          v-else
                          id="location_country"
                          v-model="localProject.countryCode"
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
                  <v-row v-if="localProject.year">
                    <v-col> UNHCR data: {{ localProject.year }} </v-col>
                  </v-row>
                </v-col>

                <v-divider vertical></v-divider>
                <v-col cols="6" class="map-countries">
                  <territory-map
                    :default-zoom="zoom"
                    :value="latLng"
                    :mdi-icon-name="mdiIconName"
                    :aspect-ratio="16 / 9"
                    @update:value="updateLatLng"
                  />
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
import { formatNumberGhgRef } from "@/plugins/filters";
import { GHGfNRB } from "@/store/GHGReferencefNRB";

import ComputeGenericFormSurveyMixin from "@/components/green_house_gaz/generic/ComputeGenericFormSurveyMixin.vue";
import { GreenHouseGaz } from "@/store/GhgInterface";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";
import { GHGSolar } from "@/store/GHGReferenceSolarModule";
import { UNHCRLocation } from "@/store/UNHCRLocationModule";
import { CouchUser } from "@/store/UserModule";
import { ghg } from "@/utils/apps";
import { countriesMap } from "@/utils/countriesAsList";
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
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { LControlScale, LMap, LMarker, LTileLayer } from "vue2-leaflet";
import { validationMixin } from "vuelidate";
import { Validations } from "vuelidate-property-decorators";
import { required } from "vuelidate/lib/validators";
import { Validation } from "vuelidate/vuelidate";
import { mapActions, mapGetters } from "vuex";

@Component({
  inheritAttrs: true,
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
    ...mapGetters("UserModule", ["user"]),
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
    ...mapGetters("GHGReferencefNRB", ["items"]),
    ...mapGetters("UNHCRLocationModule", { unhcrLocationMap: "items" }),
    ...mapGetters("GhgReferenceSolarModule", {
      GhgReferenceSolarMap: "itemsMap",
    }),
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
/** GhgInfo */
export default class GhgInfo extends Mixins(ComputeGenericFormSurveyMixin) {
  @Prop([Number])
  readonly surveyIndex: number | undefined;

  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  project!: GreenHouseGaz;
  user!: CouchUser;
  items!: GHGfNRB[];
  GhgReferenceSolarMap!: Record<string, GHGSolar>;
  unhcrLocationMap!: UNHCRLocation[];
  project_REF_GRD!: ReferenceItemInterface;
  ghgMapRef!: ItemReferencesMap;

  @Validations()
  validations = {
    localProject: {
      name: { required },
      countryCode: { required }, //string;
      latitude: { required }, //number;
      longitude: { required }, //number;
      solar: {}, //number;
      population: { required }, //number; // total population
      pp_per_hh: { required }, //number; // ave people per hhtotalHH
      totalHH: { required }, //number;
    },
  };

  localProject = {} as GreenHouseGaz;
  $refs!: {
    formInfo: VForm;
    $v: Validation;
  };

  readonly defaultCoordinates = defaultCoordinates;
  readonly url = urlMap;
  readonly attribution = attributionMap;
  formValid = false;

  saveInProgress = false;

  get mdiIconName(): string {
    if (this.localProject?.latitude === undefined) {
      return "mdiMapMarkerOffOutline";
    }
    return "mdiMapMarkerCircle";
  }

  get existingLocation(): UNHCRLocation | undefined {
    return this.unhcrLocationMap.find(
      (v) => v.location_pcode === this.localProject.location_pcode
    );
  }

  zoomLevel = 5;
  get zoom(): number {
    if (this.localProject?.countryCode === undefined) {
      return defaultZoom;
    }
    return this.zoomLevel;
  }

  @Watch("localProject.countryCode", { immediate: true, deep: true })
  onProject(): void {
    this.zoomLevel = 4;
    this.zoomLevel = 5;
  }

  get defaultCoordinatesForCountry(): LatLngExpression {
    const { countryCode } = this.localProject;
    const lat = countriesMap[countryCode]?.lat ?? 0;
    const long = countriesMap[countryCode]?.lon ?? 0;
    return [lat, long] as LatLngExpression;
  }

  get latLng(): LatLngExpression {
    const { latitude, longitude } = this.localProject;
    if (latitude !== undefined) {
      return [latitude ?? 0, longitude ?? 0];
    }
    return this.defaultCoordinatesForCountry as LatLngExpression;
  }

  get defaultSolarPeak(): string {
    const key = this.localProject?.countryCode ?? "default";
    if (this.existingLocation) {
      return `${formatNumberGhgRef(this.existingLocation.solar_peak_hours, {
        suffix: "h",
      })} (from ${this.existingLocation?.year} site data)`;
    }
    const countrySolar = this.GhgReferenceSolarMap[key]?.c;
    const defaultSolar = this.GhgReferenceSolarMap?.default?.c;
    const suffix = countrySolar
      ? "(from country average)"
      : "(from default value)";
    return (
      formatNumberGhgRef(countrySolar ?? defaultSolar, { suffix: "h" }) +
      ` ${suffix}`
    );
  }

  get generalItems(): (FormItem & {
    customEventInput?: (v: number, input: GreenHouseGaz) => GreenHouseGaz;
  })[] {
    const iconPath = this.$vuetify.icons.values.mdiDatabaseArrowRight;
    const solarPeakPlaceholder = this.defaultSolarPeak;
    return [
      {
        type: "text",
        key: "siteName",
        label: "Name of the site",
        disabled: true,
      },
      {
        type: "text",
        key: "description",
        label: "Assessment description",
      },
      {
        type: "number",
        optional: true,
        key: "latitude",
        label: "Latitude of the site",
        unit: "Decimal Degrees",
        hint: "Please use the map to select the location",
        messages: [
          this.existingLocation?.latitude
            ? `default: ${this.existingLocation?.latitude}`
            : "",
        ],
        min: -90,
        max: 90,
      },
      {
        type: "number",
        optional: true,
        key: "longitude",
        label: "Longitude of the site",
        unit: "Decimal Degrees",
        hint: "Please use the map to select the location",
        messages: [
          this.existingLocation?.longitude
            ? `default: ${this.existingLocation?.longitude}`
            : "",
        ],
        min: -180,
        max: 180,
      },
      {
        type: "text",
        key: "countryCode",
        label: "Country code",
      },
      {
        type: "number",
        key: "population",
        label: "Total population",
        min: 0,
        persistentHint: true,
        hint: this.existingLocation?.year
          ? `original population (${this.existingLocation?.year}): ${this.existingLocation?.population}`
          : "",
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
        tooltipAttrs: {
          "open-on-click": true,
          "open-on-focus": false,
          "open-on-hover": false,
          "close-delay": 1000,
        },
        tooltipInfo: `
        Solar peak hours, together with the installed solar capacity, are used to calculate the energy delivered by solar panels.
        If you are not able to assign a value for the solar peak hours, a default value will be assigned from <a href="#reference-data_UNHCRLocation">the Reference Table (<svg
  version="1.1"
  viewBox="0 0 26 26"
  width="18"
    height="18"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:svg="http://www.w3.org/2000/svg"
>
      <path style="fill: white;"
      d="${iconPath}"
    />
</svg>)</a>. The solar peak hours value is used in the Energy for Facilities, Energy for Cooking, Lighting and Water Pumping modules.
To extract solar hours for a specific location please refer to the <a target="_blank" href="${ghg.link}">${ghg.linkName}</a>.`,
        optional: true,
        placeholder: solarPeakPlaceholder,
        hint: solarPeakPlaceholder,
        persistentHint: true,
        max: 8,
        min: 2,
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
    if (value.siteName !== "") {
      this.saveInProgress = true;
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
      const currentSurvey: GreenHouseGaz = this.localProject;
      currentSurvey.updated_at = new Date().toISOString();
      currentSurvey.updated_by = this.$user().name ?? "user with no name";
      this.localProject = Object.assign({}, currentSurvey);
      // no vuelidate for descriptions and custom keys for now
      // but it works because we're using vuetify and vuelidate form validation
      this.$v.localProject.$touch();
    }
  }

  public updateLatitude(): void {
    this.$set(this.localProject, "latitude", undefined);
  }

  public updateLongitude(): void {
    this.$set(this.localProject, "longitude", undefined);
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
    this.$refs?.formInfo?.validate();
  }
}
</script>

<style lang="scss" scoped>
.force-min-height-for-map {
  max-height: calc(100vh - 250px);
}
.map-countries {
  z-index: 1;
}
</style>
