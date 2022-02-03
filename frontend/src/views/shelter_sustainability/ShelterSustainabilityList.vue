<template>
  <v-container class="project">
    <v-row>
      <v-col>
        <h1>Existing projects</h1>
        <v-card
          v-for="project in projects"
          :key="project.id"
          class="mx-auto"
          max-width="344"
          outlined
        >
          <v-card-title>
            {{ project.name }}
          </v-card-title>
          <v-card-text>
            <span>{{ project.location_name }}</span>
          </v-card-text>

          <v-card-actions>
            <v-btn
              outlined
              rounded
              text
              :to="{
                name: 'ShelterSustainabilityEdit',
                params: { id: project.id },
              }"
            >
              Edit project
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <h1>New Project</h1>
        <v-card class="mx-auto" max-width="344" outlined>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="newName"
                name="name"
                label="Name"
                type="text"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              outlined
              rounded
              text
              :to="{ name: 'ProjectNew', query: { name: newName } }"
            >
              Create new project
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
/** ProjectList */
export default class ProjectList extends Vue {
  newName = "";
  projects: Record<string, string | number>[] = [
    {
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
    },
    {
      id: "_2",
      name: "project 2",
      organisation: "WHO",
      shelter_total: 300, // number of shelters
      shelter_occupants: 2, // people
      shelter_lifespan: 6, // years
      setup_people: 2, // 2 people necessary for setup
      setup_time: 2, // days,
      location_name: "Berlin",
      location_country: "USA", // iso code ?
      location_distance_from_capital: 100, // km
      location_lat: 2, // option
      location_lon: 10, // option
      risk_flood: "low", // high, medium, low
      risk_seismic: "high", // high, medium, low
    },
  ];
}
</script>
