<template>
  <v-container fluid v-if="localProject.users">
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Energy - Cooking
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="4">
          <v-card flat>
            <v-card-title><h2>Inputs</h2></v-card-title>
            <v-card-text> </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card flat>
            <v-card-title><h2>Results</h2></v-card-title>
            <v-card-text> </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4"></v-col>
      </v-row>
      <v-row v-if="$can('edit', localProject)">
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import {
  GreenHouseGaz,
  GreenHouseGazReference,
  Survey,
} from "@/store/GhgInterface";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },
  methods: {
    ...mapActions("GhgModule", ["getDoc", "updateDoc"]),
  },
})
export default class Cooking extends Vue {
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;
  reference!: GreenHouseGazReference;

  configuration = {};
  localSurvey = {} as Survey;
  localSurveyIndex = -1;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  public setLocalProject(): void {
    if (!this.project) {
      this.localProject = {} as GreenHouseGaz;
    } else {
      this.localProject = cloneDeep(this.project);
    }
  }

  public syncLocalProject(): void {
    // init function
    this.setLocalProject();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalProject();
      }
    });
  }

  public created(): void {
    this.syncLocalProject();
  }
}
</script>

<style></style>