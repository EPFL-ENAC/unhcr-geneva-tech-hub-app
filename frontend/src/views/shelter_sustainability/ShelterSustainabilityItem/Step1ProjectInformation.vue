<template>
  <v-container fluid>
    <v-row v-if="$router.currentRoute.name === 'ShelterSustainabilityStep1'">
      <v-col class="d-flex align-center">
        <h2 class="text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="col-auto d-flex align-center">
        <user-manager
          v-model="localShelter.users"
          @change="updateFormInput"
        ></user-manager>
        <!-- Make project public -->
        <v-switch
          v-model="localShelter.public"
          :label="`${localShelter?.public ? 'Public' : 'Private'} project`"
          @change="updateFormInput"
        ></v-switch>
        <info-tooltip>
          Public projects are visible for all users, enabling dissemination of
          shelter designs and assessments. Private projects are visible to the
          project owner only.
        </info-tooltip>
        <span v-if="localShelter.completed_info" class="mr-4">
          <v-icon class="green--text text--lighten-3">$mdiCheck</v-icon>
          complete</span
        >
        <span v-else class="mr-4">
          <v-icon class="red--text text--lighten-3">$mdiClose</v-icon>
          incomplete</span
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet v-if="localShelter" elevation="2" rounded>
          <v-container fluid>
            <v-form v-model="localShelter.completed_info">
              <v-row>
                <v-col class="about-first-column" cols="6">
                  <v-text-field
                    v-model="localShelter.name"
                    name="name"
                    label="Project name"
                    type="text"
                    required
                    :rules="textRules"
                    @change="updateFormInput"
                  />

                  <v-text-field
                    id="location_name"
                    v-model="localShelter.location_name"
                    name="location_name"
                    label="Site name"
                    type="text"
                    required
                    :rules="textRules"
                    @change="updateFormInput"
                  />
                  <country-select
                    id="Country"
                    :value.sync="localShelter.location_country"
                    required
                    label="Country"
                    type="text"
                    name="Country"
                    @change="updateFormInput"
                    @update:latitude="updateLatitude"
                    @update:longitude="updateLongitude"
                    @update:region="updateRegion"
                  />
                  <v-text-field
                    id="region"
                    :value="localShelter.region"
                    name="region"
                    label="region"
                    required
                    :disabled="true"
                    type="text"
                  />
                  <v-text-field
                    id="organisation"
                    v-model="localShelter.organisation"
                    name="organisation"
                    label="Implementing organisation"
                    type="text"
                    required
                    :rules="textRules"
                    @change="updateFormInput"
                  />

                  <v-row>
                    <v-col class="d-flex info-map">
                      <territory-map
                        :value="latLng"
                        @update:value="updateLatLng"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="about-second-column" cols="6">
                  <v-select
                    v-model.number="localShelter.shelter_occupants"
                    :items="occupantsOptions"
                    label="Intended Occupants per shelter"
                    name="shelter_occupants"
                    type="number"
                    required
                    :rules="shelterOccupantRules"
                    @change="updateFormInput"
                  ></v-select>
                  <v-select
                    v-model="localShelter.shelter_type"
                    :items="shelterTypes"
                    label="Shelter type"
                    name="shelter_type"
                    required
                    :rules="shelterTypeRules"
                    @change="updateFormInput"
                  ></v-select>
                  <v-select
                    v-model.number="localShelter.shelter_lifespan"
                    :items="lifeExpectancy"
                    name="shelter_lifespan"
                    label="Expected average shelter lifespan"
                    item-text="label"
                    item-value="value"
                    type="number"
                    required
                    :rules="shelterLifespanRules"
                    @change="updateFormInput"
                  ></v-select>

                  <v-divider />
                  <v-text-field
                    v-model.number="localShelter.setup_people"
                    name="setup_people"
                    required
                    :rules="numberRules"
                    label="Number of people for setup"
                    @change="updateFormInput"
                  />
                  <v-text-field
                    v-model.number="localShelter.setup_time"
                    name="setup_time"
                    required
                    :rules="numberRules"
                    label="Time for setup (days)"
                    @change="updateFormInput"
                  />
                  <v-divider />
                  <input-with-info
                    v-model="localShelter.risk_flood"
                    :info="riskFlood"
                    required
                    :depth="2"
                    @change="updateFormInput"
                  />
                  <input-with-info
                    v-model="localShelter.risk_seismic"
                    :info="riskSeismic"
                    required
                    :depth="2"
                    @change="updateFormInput"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row class="d-print-none">
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="d-print-none">
      <v-col class="d-flex justify-center">
        <v-btn
          class="my-4"
          width="33%"
          :disabled="localShelter.images.length >= 10"
          @click="uploadDialog = true"
        >
          upload files
        </v-btn>
        <span
          :class="{
            'warning--text': localShelter.images.length >= 10,
            'd-none': localShelter.images.length < 10,
          }"
        >
          (Max limit of 10 files per shelter)
        </span>
        <upload-images
          :dialog.sync="uploadDialog"
          :multiple="true"
          :loading.sync="uploadLoading"
          @filesUploaded="processUpload($event)"
        />
      </v-col>
    </v-row>
    <v-row class="d-print-none">
      <v-col>
        <template v-for="image in localShelter.images">
          <v-card :key="image.url" class="my-4" color="white">
            <v-row class="d-flex align-center">
              <!-- todo: move to modal -->
              <!-- thumbnail, name, input:image_type, input_description then edit/download/delete,-->
              <v-col>
                <v-avatar
                  v-if="['Image', 'Drawing'].includes(image.type)"
                  class="profile"
                  color="grey"
                  size="164"
                  tile
                >
                  <v-img
                    :src="`${env.VUE_APP_AZURE_CONTAINER_PREFIX}${image.url}`"
                  ></v-img>
                </v-avatar>
                <v-avatar v-else class="profile" color="grey" size="164" tile>
                  <v-card-title class="white--text">
                    Thumbnail not available
                  </v-card-title>
                </v-avatar>
              </v-col>
              <v-col>
                <div v-if="$can('edit', localShelter)" aria-label="image name">
                  <a
                    v-if="toggledImage != image.url"
                    :href="`${env.VUE_APP_AZURE_CONTAINER_PREFIX}${image?.origin_url ?? image?.url}`"
                    target="_blank"
                  >
                    <span style="text-overflow: ellipsis">
                      {{ image.name }}
                    </span>
                  </a>
                  <v-text-field
                    v-else
                    v-model="image.name"
                    append-icon="$mdiCheck"
                    append-class="text-primary"
                    hint="Press escape or enter when finished"
                    @keypress.enter="toggleImage"
                    @keypress.escape="toggleImage"
                    @click:append="toggleImage"
                    @change="updateFormInput"
                  ></v-text-field>
                  <v-btn
                    v-if="toggledImage != image.url"
                    small
                    icon
                    @click="toggleImage(image.url)"
                  >
                    <v-icon small>$mdiPencil</v-icon>
                  </v-btn>
                </div>
                <div v-else>
                  <a
                    :href="`${env.VUE_APP_AZURE_CONTAINER_PREFIX}${image?.origin_url ?? image?.url}`"
                    target="_blank"
                    class="text"
                  >
                    {{ image.name }}
                  </a>
                </div>
              </v-col>
              <v-col>
                <div v-if="$can('edit', localShelter)" aria-label="asset name">
                  <v-select
                    v-model="image.type"
                    :items="imageShelterTypes"
                    label="Select type of asset"
                    outlined
                    @change="updateFormInput"
                  ></v-select>
                </div>
                <div v-else>
                  {{ image.type }}
                </div>
              </v-col>
              <v-col>
                <div v-if="$can('edit', localShelter)" aria-label="asset name">
                  <v-textarea
                    v-model="image.description"
                    label="Description"
                    outlined
                    counter
                    :single-line="true"
                    :no-resize="true"
                    rows="2"
                    :rules="rulesCounter"
                    @change="updateFormInput"
                  />
                </div>
                <div v-else>
                  {{ image.description }}
                </div>
              </v-col>
              <v-col>
                <v-row v-if="$can('edit', localShelter)" class="row">
                  <v-col class="d-flex justify-end">
                    <v-btn
                      v-if="toggledImage != image.url"
                      big
                      :href="`${env.VUE_APP_AZURE_CONTAINER_PREFIX}${
                        image?.origin_url ?? image?.url
                      }`"
                      target="_blank"
                    >
                      download
                      <v-icon small>$mdiDownload</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="toggledImage != image.url"
                      class="mr-8"
                      color="red"
                      :loading="uploadLoadingUrl === image.url"
                      :disabled="uploadLoadingUrl === image.url"
                      icon
                      big
                      @click="removeAsset(image)"
                    >
                      <v-icon small>$mdiDelete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-else class="row d-flex align-center">
                  <v-col :cols="2" class="mr-8">
                    <v-btn
                      v-if="toggledImage != image.url"
                      big
                      :href="`${env.VUE_APP_AZURE_CONTAINER_PREFIX}${image?.origin_url ?? image?.url}`"
                      target="_blank"
                    >
                      download
                      <v-icon small>$mdiDownload</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";

import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import UploadImages from "@/components/commons/UploadImages.vue";
import UserManager from "@/components/commons/UserManager.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import InputWithInfo from "@/components/shelter_sustainability/InputWithInfo.vue";
import {
  attributionMap,
  defaultCoordinates,
  defaultZoom,
  urlMap,
} from "@/utils/mapWorld";
import { LatLngExpression } from "leaflet";

import { env } from "@/config";
import {
  ImageShelter,
  imageShelterTypes,
  listOfShelterType,
  Shelter,
} from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component({
  components: {
    CountrySelect,
    InputWithInfo,
    UserManager,
    FormItemComponent,
    TerritoryMap,
    InfoTooltip,
    UploadImages,
  },
})
/** Project */
export default class Step1 extends Vue {
  @VModel({ type: [Object], required: true }) localShelter!: Shelter;

  @Prop({ type: Boolean, default: false }) loading!: boolean;

  readonly zoom = defaultZoom;
  readonly defaultCoordinates = defaultCoordinates;
  readonly url = urlMap;
  readonly attribution = attributionMap;

  public updateFormInput(): void {
    const newShelter = cloneDeep(this.localShelter);
    this.$emit("update:shelter", newShelter);
    this.$emit("input", newShelter); // for v-model
  }

  env = env;
  infoTooltipText = infoTooltipText;
  occupantsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  shelterTypes = listOfShelterType;
  imageShelterTypes = imageShelterTypes;
  uploadDialog = false;
  uploadLoadingUrl = "";
  uploadLoading: string | boolean = false;
  toggledImage = "";
  public toggleImage(url: string): void {
    this.toggledImage = url;
  }
  public removeAsset(asset: ImageShelter): void {
    // call delete
    this.uploadLoadingUrl = asset.url;
    const assetUrlsFiltered = [asset.url, asset.origin_url].filter(
      (x) => x !== undefined
    );
    const options = {
      method: "DELETE",
      body: JSON.stringify({
        paths: assetUrlsFiltered,
      }),
      headers: {
        Authorization: `Bearer ${this.$store.getters["UserModule/token"]}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    fetch(`${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_API_URL}/files`, options)
      .then(async (response) => {
        if (response.ok && response.status === 204) {
          return response;
        }
        throw new Error(`${response.status} ${response.statusText}`);
      })
      .then(() => {
        this.$set(
          this.localShelter,
          "images",
          this.localShelter?.images.filter(
            (image: ImageShelter) => !assetUrlsFiltered.includes(image.url)
          ) ?? []
        );
        this.updateFormInput();
        this.$store.dispatch("notifyUser", {
          message: "Successfull deletion of assets from server",
          type: "success",
        });
        // just to be sure purge nginx cache of the previous location!
      })
      .catch((error: Error) => {
        this.$store.dispatch("notifyUser", {
          message: `Could not delete assets ${error}`,
          type: "error",
        });
      })
      .finally(() => {
        this.uploadLoadingUrl = "";
      });
  }

  lifeExpectancy = [
    { label: "6 months or less", value: 0.5 },
    { label: "1 year", value: 1 },
    { label: "2 years", value: 2 },
    { label: "3 years", value: 3 },
    { label: "4 years", value: 4 },
    { label: "5 years", value: 5 },
    { label: "6 years", value: 6 },
    { label: "7 years", value: 7 },
    { label: "8 years", value: 8 },
    { label: "9 years", value: 9 },
    { label: "10 years", value: 10 },
  ];

  rulesCounter = [(v: string) => v?.length <= 200 || "Max 200 characters"];

  textRules = [
    (v: string): boolean | string => !!v || `is required`,
    (v: string): boolean | string =>
      v?.length >= 1 || `should have a length >= 1`,
  ];
  numberRules = [
    (v: string | number): boolean | string => {
      return (v !== undefined && v !== "") || `is required`;
    },
  ];

  shelterTypeRules = this.textRules;

  shelterTotalRules = [
    (v: number): boolean | string => !!v || `is required`,
    (v: number): boolean | string => v >= 1 || `should have a length >= 1`,
    (v: number): boolean | string =>
      v <= 10000000 || `should not be more than 10 000 000 shelters`,
  ];
  shelterOccupantRules = [
    (v: number): boolean | string => !!v || `is required`,
    (v: number): boolean | string =>
      v <= 10 || `should not be more than 10 occupants`,
    (v: number): boolean | string => v > 0 || `should be more than 0 occupant`,
  ];
  shelterLifespanRules = [
    (v: number): boolean | string => !!v || `is required`,
    (v: number): boolean | string =>
      v <= 10 || `should not be more than ten years`,
    (v: number): boolean | string => v > 0 || `should be more than 0 years`,
  ];

  latitudeRules = [
    (lat: number): boolean | string =>
      (isFinite(lat) && Math.abs(lat) <= 90) || `should be > -90 and < 90`,
  ];
  longitudeRules = [
    (lng: number): boolean | string =>
      (isFinite(lng) && Math.abs(lng) <= 180) || `should be > -180 and < 180`,
  ];
  risks: string[] = ["low", "medium", "high"];

  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string => {
      return v?.length > 1 || `Name should have a length >= 1`;
    },
  ];

  urlRules = [
    (value: string): boolean | string =>
      !value || this.isURL(value) || "URL is not valid",
  ];

  public isURL(value = ""): boolean {
    let url!: URL;
    try {
      url = new URL(value);
    } catch {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  public processUpload(files: File[]) {
    if (files.length > 0) {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const options = {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${this.$store.getters["UserModule/token"]}`,
        },
      };
      fetch(
        `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_API_URL}/files`,
        options
      )
        .then(async (response) => {
          let responseJson;
          try {
            responseJson = await response.json();
          } catch (e) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          if (response.ok && response.status === 200) {
            return responseJson;
          }
          throw new Error(
            `${response.status} ${response.statusText}: ${responseJson.detail}`
          );
        })
        .then((data) => {
          if (this.localShelter.images === undefined) {
            this.localShelter.images = [];
          }
          this.localShelter.images.push(...data.filenames);
          // add files instead of replacing them
          this.updateFormInput();
          this.$store.dispatch("notifyUser", {
            message: "Successful upload to server",
            type: "info",
          });
        })
        .catch((error: Error) => {
          this.$store.dispatch("notifyUser", {
            type: "error",
            message: `Could not upload images ${error}`,
          });
        })
        .finally(() => {
          this.uploadDialog = false;
          this.uploadLoading = false;
        });
    } else {
      this.$store.dispatch("notifyUser", {
        message: "No file to upload",
        type: "warning",
      });
      this.uploadDialog = false;
      this.uploadLoading = false;
    }
  }

  riskFlood = {
    id: "Local flood risk",
    description:
      "Local flood risk at shelter sites depends on numerous factors including: general area flood risk, local topography, local soil type, ground coverage/permeability, natural drainage patterns, drainage infrastructure, density of shelter and other building construction, etc. In defining shelter-specific flood risk, refer to broader settlement flood risk assessments and take into account immediate conditions around shelter sites.",
  };
  riskSeismic = {
    id: "Local seismic risk",
    description:
      "Local seismic risk depends on numerous factors incuding: general area seismic risk (taking into account geological conditions), local soil type, density of shelter and other building construction, shelter and surrounding building heights, shelter and surrounding building construction techniques, etc. In defining shelter-specific seismic risk, refer to broader settlement seismic risk assessments and take into account immediate conditions around shelter sites.",
  };

  latitude: FormItem = {
    type: "number",
    key: "latitude",
    label: "Latitude of the site",
    unit: "Decimal Degrees",
    min: -90,
    max: 90,
  };
  longitude: FormItem = {
    type: "number",
    key: "longitude",
    label: "Longitude of the site",
    unit: "Decimal Degrees",
    min: -180,
    max: 180,
  };

  public updateLatitude(lat: number): void {
    this.$set(this.localShelter, "latitude", parseFloat(lat.toFixed(3)));
  }

  public updateLongitude(lon: number): void {
    this.$set(this.localShelter, "longitude", parseFloat(lon.toFixed(3)));
  }
  public updateLatLng(latLng: number[]): void {
    this.updateLatitude(latLng[0]);
    this.updateLongitude(latLng[1]);
    this.updateFormInput();
  }

  public updateRegion(region: string): void {
    this.$set(this.localShelter, "region", region);
  }
  get latLng(): LatLngExpression {
    const { latitude, longitude } = this.localShelter;
    if (latitude !== undefined) {
      return [latitude ?? 0, longitude ?? 0];
    }
    return defaultCoordinates as LatLngExpression;
  }

  public img_url = {
    type: "text",
    key: "img_url",
    label: "Shelter image url",
    rules: this.urlRules,
    optional: true,
  };
}
</script>

<style scoped lang="scss">
// RATIONAL: André ask to removed the arrows for number inputs
/* Chrome, Safari, Edge, Opera */
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
::v-deep input[type="number"] {
  -moz-appearance: textfield;
}

.info-map {
  height: 317px;
}
</style>
