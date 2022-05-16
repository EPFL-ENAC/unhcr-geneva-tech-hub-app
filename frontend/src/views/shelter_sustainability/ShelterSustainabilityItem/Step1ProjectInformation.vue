<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h2 class="text-h4 project-shelter__h3 font-weight-medium">
          Project information
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="col-auto">
        <user-manager
          v-model="localShelter.users"
          @change="updateFormInput"
        ></user-manager>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat>
          <v-row>
            <v-col>
              <v-sheet v-if="localShelter" elevation="2" rounded>
                <v-container fluid>
                  <v-row>
                    <v-col
                      class="about-first-column"
                      lg="6"
                      md="6"
                      sm="12"
                      xs="12"
                    >
                      <v-text-field
                        v-model="localShelter.name"
                        name="name"
                        label="Project name"
                        type="text"
                        required
                        :rules="textRules"
                      />
                      <v-text-field
                        id="organisation"
                        v-model="localShelter.organisation"
                        name="organisation"
                        label="Organisation"
                        type="text"
                        required
                        :rules="textRules"
                      />
                      <v-divider />
                      <v-text-field
                        v-model.number="localShelter.shelter_total"
                        name="shelter_total"
                        label="Number of shelters"
                        type="number"
                        required
                        :rules="shelterTotalRules"
                      />
                      <v-select
                        v-model.number="localShelter.shelter_occupants"
                        :items="occupantsOptions"
                        label="Intended Occupants per shelter"
                        name="shelter_occupants"
                        type="number"
                        required
                        :rules="shelterOccupantRules"
                      ></v-select>
                      <v-select
                        v-model="localShelter.shelter_type"
                        :items="shelterTypes"
                        label="Shelter type"
                        name="shelter_type"
                        required
                        :rules="shelterTypeRules"
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
                      ></v-select>

                      <v-divider />
                      <v-text-field
                        v-model="localShelter.setup_people"
                        name="setup_people"
                        label="Number of people for setup"
                        type="text"
                      />
                      <v-text-field
                        v-model="localShelter.setup_time"
                        name="setup_time"
                        label="Time for setup"
                        type="text"
                      />
                    </v-col>
                    <v-col
                      class="about-second-column"
                      lg="6"
                      md="6"
                      sm="12"
                      xs="12"
                    >
                      <v-text-field
                        id="location_name"
                        v-model="localShelter.location_name"
                        name="location_name"
                        label="Site name"
                        type="text"
                      />
                      <country-select
                        id="location_country"
                        v-model.number="localShelter['location_country']"
                        required
                        label="Country"
                        type="text"
                        name="location_country"
                        @update:latitude="updateLatitude"
                        @update:longitude="updateLongitude"
                      />
                      <v-text-field
                        id="latitude"
                        v-model.number="localShelter.latitude"
                        name="latitude"
                        label="latitude"
                        :rules="latitudeRules"
                        min="-90"
                        max="90"
                        type="number"
                      />
                      <v-text-field
                        id="longitude"
                        v-model.number="localShelter.longitude"
                        name="longitude"
                        label="longitude"
                        min="-180"
                        :rules="longitudeRules"
                        max="180"
                        type="number"
                      />
                      <form-item-component
                        v-model="localShelter.img_url"
                        v-bind="img_url"
                      ></form-item-component>
                      <v-divider />
                      <input-with-info
                        v-model="localShelter.risk_flood"
                        :info="riskFlood"
                        :depth="2"
                      />
                      <input-with-info
                        v-model="localShelter.risk_seismic"
                        :info="riskSeismic"
                        :depth="2"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn @click="updateFormInput"> Save changes </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import UserManager from "@/components/commons/UserManager.vue";
import InputWithInfo from "@/components/shelter_sustainability/InputWithInfo.vue";
import { listOfShelterType, Shelter } from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    CountrySelect,
    InputWithInfo,
    UserManager,
    FormItemComponent,
  },
})
/** Project */
export default class Step1 extends Vue {
  @Prop({ type: [Object], required: true })
  shelter!: Shelter;
  localShelter = cloneDeep(this.shelter);

  @Watch("shelter", { immediate: true, deep: true })
  onShelterChange(newShelter: Shelter): void {
    this.localShelter = cloneDeep(newShelter);
  }

  public updateFormInput(): void {
    const newShelter = Object.assign({}, this.localShelter);
    this.$emit("update:shelter", newShelter);
  }

  occupantsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  shelterTypes = listOfShelterType;
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

  textRules = [
    (v: string): boolean | string => !!v || `is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `should have a length >= 1`,
  ];
  shelterTypeRules = this.textRules;

  shelterTotalRules = [
    (v: number): boolean | string => !!v || `is required`,
    (v: number): boolean | string => v > 1 || `should have a length >= 1`,
    (v: number): boolean | string =>
      v < 1000000 || `should not be more than 1 000 000 shelters`,
  ];
  shelterOccupantRules = [
    (v: number): boolean | string => !!v || `is required`,
    (v: number): boolean | string =>
      v < 10 || `should not be more than 10 occupants`,
    (v: number): boolean | string => v > 0 || `should be more than 0 occupant`,
  ];
  shelterLifespanRules = [
    (v: number): boolean | string => !!v || `is required`,
    (v: number): boolean | string =>
      v < 10 || `should not be more than ten years`,
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
    this.$set(this.localShelter, "latitude", lat);
  }

  public updateLongitude(lon: number): void {
    this.$set(this.localShelter, "longitude", lon);
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
