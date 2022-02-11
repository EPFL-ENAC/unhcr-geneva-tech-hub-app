<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="project-shelter__header">Materials</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-divider></v-divider>
    </v-row>
    <v-spacer />
    <v-row v-if="project"
      ><v-col>
        <form @submit.prevent="() => submitForm(project)">
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
          <v-row>
            <v-col>
              <v-btn type="submit"> Save changes </v-btn>
            </v-col>
          </v-row>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState, mapActions } from "vuex";
import Shelter from "@/store/ShelterInterface";

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
