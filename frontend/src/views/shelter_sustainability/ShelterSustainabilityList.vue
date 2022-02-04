<template>
  <v-container class="project">
    <v-row>
      <v-col>
        <h1>Existing projects</h1>
        <v-card
          v-for="project in projects"
          :key="project._id"
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
                params: { id: project._id },
              }"
            >
              Edit project
            </v-btn>
            <v-btn outlined rounded @click="() => removeDoc(project._id)">
              Delete project
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <h1>New Project</h1>
        <v-card class="mx-auto" max-width="344" outlined>
          <v-card-text>
            <form
              @submit.prevent="submitForm"
            >
              <v-text-field
                v-model="newName"
                name="name"
                label="Name"
                type="text"
              />
            </form>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn
              outlined
              rounded
              text
              :to="{ name: 'ProjectNew', query: { name: newName } }"
            > Create new project url</v-btn> -->
            <v-btn outlined rounded text type="submit">
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

import { mapState, mapActions } from "vuex";
@Component({
  computed: {
    ...mapState("ShelterSustainabilityModule", {
      shelters: "shelters",
    }),
  },

  methods: {
    ...mapActions("ShelterSustainabilityModule", ["addDoc", "removeDoc"]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  newName = "";
  shelters!: [];
  addDoc!: (name: string ) => null;

  public get projects(): Record<string, string | number>[] {
    return this.shelters;
  }
  public submitForm() : void {
    console.log("submitForm");
    this.addDoc(this.newName);
  }
}
</script>
