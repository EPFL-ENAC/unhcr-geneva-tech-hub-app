<template>
  <v-container class="project">
    <v-row>
      <v-col>
        <h1>This is the project item page {{ $route.name }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-stepper non-linear vertical alt-labels :value="$route.meta.step">
          <v-stepper-header>
            <router-link :to="{ name: 'ProjectEditStep1' }">
              <v-stepper-step editable step="1">
                Project information
              </v-stepper-step>
            </router-link>

            <v-divider />

            <router-link :to="{ name: 'ProjectEditStep2' }">
              <v-stepper-step editable step="2">Geometry</v-stepper-step>
            </router-link>

            <v-divider />

            <v-stepper-step step="3" editable>Materials</v-stepper-step>
            <v-divider />
            <v-stepper-step step="4" editable>Labour</v-stepper-step>
            <v-divider />
            <v-stepper-step step="5" editable>
              Environmental performance
            </v-stepper-step>
            <v-divider />
            <v-stepper-step step="6" editable>
              Technical performance
            </v-stepper-step>
            <v-divider />
            <v-stepper-step step="6" editable>Habitability</v-stepper-step>
            <v-divider />
            <v-stepper-step step="7" editable>Affordability</v-stepper-step>
            <v-divider />
            <v-stepper-step step="8" editable>Scorecard</v-stepper-step>
            <v-divider />
            <v-stepper-step step="9" editable>BackgroundData</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content :step="$route.meta.step">
              <router-view />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
/** ProjectItem */
export default class ProjectItem extends Vue {}
</script>

<style scoped>
a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  color: inherit;
}
</style>
