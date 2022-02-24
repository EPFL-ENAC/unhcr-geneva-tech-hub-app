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
      <v-tabs v-model="tab">
        <v-tab>
          <v-icon left> mdi-briefcase </v-icon>
          information
        </v-tab>
        <v-tab>
          <v-icon left> mdi-account </v-icon>
          Users
        </v-tab>

        <v-tab-item>
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
                          label="Location name"
                          type="text"
                        />
                        <v-text-field
                          id="location_country"
                          v-model="localShelter.location_country"
                          name="location_country"
                          label="Country"
                          type="text"
                        />
                        <v-text-field
                          id="location_distance_from_capital"
                          v-model.number="
                            localShelter.location_distance_from_capital
                          "
                          name="location_distance_from_capital"
                          label="Distance from capital (km)"
                          type="number"
                        />
                        <v-text-field
                          id="location_lat"
                          v-model.number="localShelter.location_lat"
                          name="location_lat"
                          label="Latitude"
                          type="number"
                          step="0.001"
                          :rules="latitudeRules"
                        />
                        <v-text-field
                          id="location_lon"
                          v-model.number="localShelter.location_lon"
                          name="location_lon"
                          label="Longitude"
                          :rules="longitudeRules"
                          type="number"
                          step="0.001"
                        />
                        <v-divider />
                        <!-- hover: Flood risk depends on various factors including site elevation and slope, as well as rainfall and proximity to water courses. Consult project site risk analyses if available. -->
                        <v-select
                          v-model="localShelter.risk_flood"
                          :items="risks"
                          label="Local flood risk"
                          :hint="`Local flood risk`"
                          persistent-hint
                          single-line
                        />
                        <!-- [hover: Seismic risk factors depend on geological conditions. Consult project site risk analyses if available.] -->
                        <v-select
                          v-model="localShelter.risk_seismic"
                          :hint="`Local seismic risk`"
                          :items="risks"
                          label="Local seismic risk"
                          persistent-hint
                          single-line
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
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-row>
              <v-col>
                <v-sheet elevation="2" rounded v-if="localShelter">
                  <v-container fluid>
                    <v-row
                      v-for="(userEmail, $userKey) in localShelter.users"
                      :key="$userKey"
                    >
                      <v-col>{{ userEmail }}</v-col>
                      <v-col>
                        <v-btn
                          @click="() => removeUser(userEmail)"
                          :disabled="
                            user.name === userEmail ||
                            localShelter.users.length === 1
                          "
                          >remove user</v-btn
                        ></v-col
                      >
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-form
                          @submit.prevent="addUser"
                          v-model="addUserValid"
                        >
                          <v-card class="mx-auto" max-width="344" outlined>
                            <v-card-text>
                              <v-text-field
                                tabindex="1"
                                v-model="newUser"
                                :rules="rules"
                                required
                                name="email"
                                label="Email"
                                type="text"
                              />
                            </v-card-text>
                            <v-card-actions class="justify-end">
                              <v-btn
                                outlined
                                rounded
                                text
                                type="submit"
                                tabindex="2"
                                :disabled="!addUserValid"
                              >
                                New shelter
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Shelter } from "@/store/ShelterInterface";
import { CouchUser } from "@/store/UserModule";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters, mapState } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterItemModule", ["shelter"]),
    ...mapState("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("ShelterItemModule", ["updateDoc"]),
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

  addUserValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

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
      const shouldUpdate = ["ShelterItemModule/SET_SHELTER"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter();
      }
    });
  }

  public created(): void {
    this.syncLocalShelter();
  }

  public addUser(value: string): void {
    console.log("add new user", value, this.tab);
    this.localShelter.users.push(this.newUser);
    this.newUser = "";
    this.submitForm(this.localShelter);
  }

  public removeUser(value: string): void {
    if (value === this.user.name) {
      throw new Error("cannot remove yourself from the list");
    }
    const indexToRemove = this.localShelter.users.findIndex(
      (el: string): boolean => el === value
    );
    this.localShelter.users.splice(indexToRemove, 1);
    this.submitForm(this.localShelter);
  }

  public submitForm(value: Shelter): void {
    console.log("setter shelter", value, this.tab);
    if (value.name !== "") {
      this.updateDoc(value);
    } else {
      console.error("please fill the new Name");
    }
  }
}
</script>
