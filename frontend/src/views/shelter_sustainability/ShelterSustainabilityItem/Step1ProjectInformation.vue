<template>
  <v-container fluid v-if="localShelter.users">
    <v-form
      :readonly="!$can('edit', localShelter)"
      @submit.prevent="() => submitForm(localShelter)"
    >
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
            @change="submitForm"
          ></user-manager>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <v-row>
              <v-col>
                <v-sheet elevation="2" rounded v-if="localShelter">
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
                          :items="occupantsOptions"
                          label="Intended Occupants per shelter"
                          v-model.number="localShelter.shelter_occupants"
                          name="shelter_occupants"
                          type="number"
                          required
                          :rules="shelterOccupantRules"
                        ></v-select>
                        <v-select
                          :items="shelterTypes"
                          label="Shelter type"
                          v-model="localShelter.shelter_type"
                          name="shelter_type"
                          required
                          :rules="shelterTypeRules"
                        ></v-select>
                        <v-select
                          :items="lifeExpectancy"
                          v-model.number="localShelter.shelter_lifespan"
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
                          v-model="localShelter.location_country"
                          required
                          :rules="rules"
                          label="Country"
                          type="text"
                          name="location_country"
                          id="location_country"
                        />
                        <v-divider />
                        <input-with-info
                          :info="riskFlood"
                          v-model="localShelter.risk_flood"
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
            <v-row v-if="$can('edit', localShelter)">
              <v-col class="d-flex justify-end">
                <v-btn type="submit"> Save changes </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
import UserManager from "@/components/commons/UserManager.vue";
import InputWithInfo from "@/components/shelter_sustainability/InputWithInfo.vue";
import { Shelter } from "@/store/ShelterInterface";
import { CouchUser } from "@/store/UserModule";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters, mapState } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapState("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("ShelterModule", ["updateDoc"]),
  },
  components: {
    CountrySelect,
    InputWithInfo,
    UserManager,
  },
})
/** Project */
export default class Step1 extends Vue {
  shelter!: Shelter;
  user!: CouchUser;
  updateDoc!: (doc: Shelter) => void;

  tab = 0;
  newUser = "";
  occupantsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  shelterTypes = ["Emergency", "Transitional", "Durable"];
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

  localShelter = {} as Shelter;

  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

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
  public setLocalShelter(): void {
    if (!this.shelter) {
      this.localShelter = {} as Shelter;
    } else {
      this.localShelter = cloneDeep(this.shelter);
    }
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["ShelterModule/SET_SHELTER"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter();
      }
    });
  }

  public created(): void {
    this.syncLocalShelter();
  }

  public submitForm(value: Shelter = this.localShelter): void {
    if (value.name !== "") {
      this.updateDoc(value);
    } else {
      console.error("please fill the new Name");
    }
  }
}
</script>
