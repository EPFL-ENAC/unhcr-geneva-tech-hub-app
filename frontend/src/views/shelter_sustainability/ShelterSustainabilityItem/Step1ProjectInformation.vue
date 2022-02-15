<template>
  <form v-if="project" @submit.prevent="() => submitForm(project)">
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
        <v-col>
          <v-sheet elevation="2" rounded v-if="project">
            <v-container fluid>
              <v-row>
                <v-col class="about-first-column" lg="6" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="project.name"
                    name="name"
                    label="name"
                    type="text"
                  />
                  <v-text-field
                    id="organisation"
                    v-model="project.organisation"
                    name="organisation"
                    label="organisation"
                    type="text"
                  />
                  <v-divider />
                  <v-text-field
                    v-model="project.shelter_total"
                    name="shelter_total"
                    label="shelter_total"
                    type="text"
                  />
                  <v-text-field
                    v-model="project.shelter_occupants"
                    name="shelter_occupants"
                    label="shelter_occupants"
                    type="text"
                  />
                  <v-text-field
                    v-model="project.shelter_lifespan"
                    name="shelter_lifespan"
                    label="shelter_lifespan"
                    type="text"
                  />
                  <v-divider />
                  <v-text-field
                    v-model="project.setup_people"
                    name="setup_people"
                    label="setup_people"
                    type="text"
                  />
                  <v-text-field
                    v-model="project.setup_time"
                    name="setup_time"
                    label="setup_time"
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
                    v-model="project.location_name"
                    name="location_name"
                    label="location_name"
                    type="text"
                  />
                  <v-text-field
                    id="location_country"
                    v-model="project.location_country"
                    name="location_country"
                    label="location_country"
                    type="text"
                  />
                  <v-text-field
                    id="location_distance_from_capital"
                    v-model="project.location_distance_from_capital"
                    name="location_distance_from_capital"
                    label="location_distance_from_capital"
                    type="text"
                  />
                  <v-text-field
                    id="location_lat"
                    v-model="project.location_lat"
                    name="location_lat"
                    label="location_lat"
                    type="text"
                  />
                  <v-text-field
                    id="location_lon"
                    v-model="project.location_lon"
                    name="location_lon"
                    label="location_lon"
                    type="text"
                  />
                  <v-divider />
                  <v-select
                    v-model="project.risk_flood"
                    :items="risks"
                    label="Flood risk"
                    :hint="`Flood risk`"
                    persistent-hint
                    single-line
                  />
                  <v-select
                    v-model="project.risk_seismic"
                    :hint="`Seismic risk`"
                    :items="risks"
                    label="Flood risk"
                    persistent-hint
                    single-line
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<script lang="ts">
import { Shelter } from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("ShelterItemModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterItemModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step1 extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  risks: string[] = ["low", "medium", "high"];
  get project(): Shelter {
    return { ...this.shelter };
  }

  public submitForm(value: Shelter): void {
    if (value.name !== "") {
      console.log("setter shelter", value);
      this.updateDoc(value);
    } else {
      console.error("please fill the new Name");
    }
  }
}
</script>
