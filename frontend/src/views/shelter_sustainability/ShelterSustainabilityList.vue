<template>
  <v-container class="project">
    <v-row>
      <v-col>
        <h1 style="display: flex; justify-content: center">Projects</h1>
      </v-col>
      <v-col>
        <h1 style="display: flex; justify-content: center">New Project</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row v-for="project in projects" :key="project._id">
          <v-col>
            <v-card class="mx-auto" max-width="344" outlined>
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
        </v-row>
      </v-col>
      <v-col>
        <v-form @submit.prevent="submitForm" v-model="createProjectFormValid">
          <v-card class="mx-auto" max-width="344" outlined>
            <v-card-text>
              <v-text-field
                tabindex="1"
                v-model="newName"
                :rules="rules"
                required
                name="name"
                label="Name"
                type="text"
              />
            </v-card-text>
            <v-card-actions>
              <!-- <v-btn
              outlined
              rounded
              text
              :to="{ name: 'ProjectNew', query: { name: newName } }"
            > Create new project url</v-btn> -->
              <v-btn
                outlined
                rounded
                text
                type="submit"
                tabindex="2"
                :disabled="!createProjectFormValid"
              >
                Create new project
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
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
    ...mapActions("ShelterSustainabilityModule", [
      "addDoc",
      "removeDoc",
      "syncDB",
      "getDB",
      "closeDB",
    ]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  newName = "";
  shelters!: [];
  addDoc!: (name: string) => null;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getDB!: () => Promise<null>;

  createProjectFormValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

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

  mounted(): void {
    this.syncDB();
    this.getDB();
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view shelter list, closing DB");
    });
  }
}
</script>
