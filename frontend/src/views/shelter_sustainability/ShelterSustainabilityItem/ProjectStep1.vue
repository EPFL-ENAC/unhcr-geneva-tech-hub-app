<template>
  <v-container>
    <v-main>
      <v-form>
        <v-row>
          <v-col>
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
          <v-col>
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
      </v-form>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
/** Project */
export default class Step1 extends Vue {
  risks: string[] = ["low", "medium", "high"];
  project: Record<string, string | number> = {
    id: "_1",
    name: "project 1",
    organisation: "UNHCR",
    shelter_total: 100, // number of shelters
    shelter_occupants: 5, // people
    shelter_lifespan: 6, // years
    setup_people: 2, // 2 people necessary for setup
    setup_time: 10, // days,
    location_name: "Paris",
    location_country: "France", // iso code ?
    location_distance_from_capital: 100, // km
    location_lat: 2, // option
    location_lon: 10, // option
    risk_flood: "low", // high, medium, low
    risk_seismic: "high", // high, medium, low
  };
}
</script>
