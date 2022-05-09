<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h2 class="text-h4 project-shelter__h3 font-weight-medium">Results</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="survey.energy" :cols="6">
        <v-card flat>
          <v-card-title><h2>Energy</h2></v-card-title>
          <v-card-text>
            <v-card flat>
              <v-card-title><h4>Facilities</h4></v-card-title>
              <v-card-text v-if="survey.energy.facilities">
                {{ survey.energy.facilities.endline.results.totalCO2Emission }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-title><h4>Cooking</h4></v-card-title>
              <v-card-text v-if="survey.energy.cooking">
                {{ survey.energy.cooking.endline.results.totalCO2Emission }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-title><h4>Lighting</h4></v-card-title>
              <v-card-text v-if="survey.energy.lighting">
                {{ survey.energy.lighting.endline.results.totalCO2Emission }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-title><h4>Pumping</h4></v-card-title>
              <v-card-text v-if="survey.energy.pumping">
                {{ survey.energy.pumping.endline.results.totalCO2Emission }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="6">
        <v-card flat>
          <v-card-title><h2>WASH</h2></v-card-title>
          <v-card-text>
            <v-card flat>
              <v-card-title><h4>Trucking</h4></v-card-title>
              <v-card-text v-if="survey.wash.trucking">
                <!-- // CO2_WSH_TRB old way of doing totalCO2Emission -->
                {{ survey.wash.trucking.endline.results.CO2_WSH_TRB }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
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
              <v-card-text v-if="survey.material.cri">
                {{ survey.material.cri.endline.results.totalCO2Emission }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
            </v-card>

            <v-card flat>
              <v-card-title><h4>HH Waste</h4></v-card-title>
              <v-card-text v-if="survey.material.hhwaste">
                {{ survey.material.hhwaste.endline.results.totalCO2Emission }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-title><h4>Shelter</h4></v-card-title>
              <v-card-text v-if="survey.material.shelter">
                {{ survey.material.shelter.endline.results.totalCO2Emission }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
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
              <v-card-text v-if="survey.offset.treeplanting">
                {{
                  survey.offset.treeplanting.endline.results.totalCO2Emission
                }}
                tCO2/year
              </v-card-text>
              <v-card-text v-else>
                0 tCO2/year (module not filled in)
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Survey } from "@/store/GhgInterface";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
})
export default class Results extends Vue {
  @Prop([Object, Array])
  readonly survey: Survey | undefined;
}
</script>

<style></style>
