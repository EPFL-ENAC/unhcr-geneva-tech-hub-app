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
              :to="{ name: 'ProjectEdit', params: { id: project.id } }"
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
  projects: Record<string, string | number>[] = [];
}
</script>
