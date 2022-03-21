<template>
  <v-container fluid v-if="localProject.users">
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Results
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="6">
          <v-card flat>
            <v-card-title><h2>Energy</h2></v-card-title>
            <v-card-text>
              <v-card flat>
                <v-card-title><h4>Facilities</h4></v-card-title>
                <v-card-text> 10 tCO2/year </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-title><h4>Cooking</h4></v-card-title>
                <v-card-text> 100 tCO2/year </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-title><h4>Lighting</h4></v-card-title>
                <v-card-text> 4 tCO2/year </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-title><h4>Pumping</h4></v-card-title>
                <v-card-text> 3 tCO2/year </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-card flat>
            <v-card-title><h2>WASH</h2></v-card-title>
            <v-card-text>
              <v-card flat>
                <v-card-title><h4>Water</h4></v-card-title>
                <v-card-text> 10 tCO2/year </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-title><h4>Wastewater</h4></v-card-title>
                <v-card-text> 100 tCO2/year </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-title><h4>Transport</h4></v-card-title>
                <v-card-text> 4 tCO2/year </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-card flat>
            <v-card-title><h2>Materials</h2></v-card-title>
            <v-card-text>
              <v-card flat>
                <v-card-title><h4>CRI</h4></v-card-title>
                <v-card-text> 10 tCO2/year </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-title><h4>HH Waste</h4></v-card-title>
                <v-card-text> 100 tCO2/year </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-title><h4>Shelter</h4></v-card-title>
                <v-card-text> 4 tCO2/year </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-card flat>
            <v-card-title><h2>Offset</h2></v-card-title>
            <v-card-text>
              <v-card flat>
                <v-card-title><h4>Tree planting</h4></v-card-title>
                <v-card-text> 4 tCO2/year </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
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
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },
  methods: {
    ...mapActions("GhgItemModule", ["getDoc", "updateDoc"]),
  },
})
export default class Results extends Vue {
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
      const shouldUpdate = ["GhgItemModule/SET_PROJECT"];
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
