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
            <form @submit.prevent="submitForm">
              <v-text-field
                tabindex="1"
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
            <v-btn outlined rounded text type="submit" tabindex="2">
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

import { required } from "vuelidate/lib/validators";


@Component({
  computed: {
    ...mapState("ShelterSustainabilityModule", {
      shelters: "shelters",
    }),
  },

  methods: {
    ...mapActions("ShelterSustainabilityModule", [
      "addDoc",
      "removeDoc",
      "syncDB",
      "getDB",
    ]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  newName = "";
  shelters!: [];
  addDoc!: (name: string) => null;
  syncDB!: () => null;
  getDB!: () => null;
  $v!: any;
  
  public get projects(): Record<string, string | number>[] {
    return this.shelters;
  }
  public submitForm(): void {
    if (this.newName !== "") {
      this.addDoc(this.newName);
    } else {
      console.error("please fill the new Name");
    }
  }

  validations() {
    return {
      newName: { required },
    };
  }
  mounted() {
    this.syncDB();
    this.getDB();
  }
}
</script>
