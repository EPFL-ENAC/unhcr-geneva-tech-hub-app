<template>
  <v-container v-if="project.users" fluid>
    <v-row>
      <v-col>
        <h2 class="text-h4 project-shelter__h3 font-weight-medium">
          Energy - Facilities
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="2" rounded>
          <v-card-title>
            <h3 class="baseline-title">Baseline</h3>
          </v-card-title>
          <v-card-text>
            <baseline-facilities-table
              :items.sync="facilityForm.baseline.inputs"
              :results="facilityForm.baseline.results"
              :disabled="!baselineMode"
              @update:items="computeBaselineResults"
            />
          </v-card-text>
          <v-card-actions>
            <v-container class="d-flex flex-column" fluid>
              <v-row>
                <v-col class="d-flex justify-end mx-2 mb-2">
                  <h3>
                    Total CO2 Emissions:
                    {{
                      facilityForm.baseline.results.totalCO2Emission
                        | formatNumber
                    }}
                    tCO2/year
                  </h3>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-end mx-2 mb-2">
                  <v-btn
                    @click="toggleBaselineMode"
                    v-text="baselineSwitchText"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="2" rounded>
          <v-card-title> <h3 class="endline-title">Endline</h3> </v-card-title>
          <v-card-text v-if="showEndLines">
            <endline-facilities-table
              :facilities="facilityForm.baseline.inputs"
              :items.sync="facilityForm.endline.inputs"
              :results="facilityForm.endline.results"
              :balance="facilityForm.endline.resultsBalance"
              :disabled="baselineMode"
              @update:items="computeEndlineResults"
            />
            <v-container class="d-flex flex-column" fluid>
              <v-row>
                <v-col class="d-flex justify-end mx-2 mb-2">
                  <h3>
                    Total CO2 Emissions:
                    {{
                      facilityForm.endline.results.totalCO2Emission
                        | formatNumber
                    }}
                    tCO2/year
                    <span
                      :class="{
                        'facilities-positive': changeInEmissionPositive,
                        'facilities-negative': changeInEmissionNegative,
                      }"
                    >
                      <v-icon :color="color">
                        {{ icon }}
                      </v-icon>
                      {{ changeInEmissionSign }}
                      {{
                        facilityForm.endline.results.changeInEmission
                          | formatNumber
                      }}%
                    </span>
                  </h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-text v-else>
            <h4>{{ endlineText }}</h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import BaselineFacilitiesTable from "@/components/green_house_gaz/energy/BaselineFacilitiesTable.vue";
import EndlineFacilitiesTable from "@/components/green_house_gaz/energy/EndlineFacilitiesTable.vue";
import {
  EnergyFacilityInterventionItem,
  EnergyFacilityInterventionItemResult,
  EnergyFacilityItem,
  EnergyFacilityItemResult,
  EnergyFacilitySurvey,
  GreenHouseGaz,
} from "@/store/GhgInterface";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  components: {
    BaselineFacilitiesTable,
    EndlineFacilitiesTable,
  },
})
export default class Facilities extends Vue {
  @Prop([Object, Array])
  readonly form: EnergyFacilitySurvey | undefined;

  project!: GreenHouseGaz;
  baselineMode = false; // should be true in production

  public get facilityForm(): EnergyFacilitySurvey {
    return this.form || this.generateNewFacilitiesForm();
  }

  public set facilityForm(newForm: EnergyFacilitySurvey) {
    this.$emit("update:form", newForm);
  }

  public get showEndLines(): boolean {
    return this.facilityForm.baseline.inputs.length > 0 && !this.baselineMode;
  }

  public get baselineSwitchText(): string {
    return this.baselineMode ? "Save baseline" : "Edit baseline";
  }

  public get endlineText(): string {
    if (this.baselineMode) {
      return "Save baseline to edit Endline";
    }
    if (this.facilityForm.baseline.inputs.length == 0) {
      return "Please add facilities to baseline to edit Endline";
    }
    return "Please edit baseline to edit Endline";
  }

  public toggleBaselineMode(): void {
    this.baselineMode = !this.baselineMode;
  }

  public computeEndlineChangeInEmission(): void {
    /// for every item
    if (this.facilityForm) {
      const endlineInputs = this.facilityForm.endline.inputs;
      const baselineInputs = this.facilityForm.baseline.inputs;

      // modifying outside variable form.endline.inputs
      this.facilityForm.endline.inputs = endlineInputs.map(
        (endlineInput: EnergyFacilityInterventionItem) => {
          const baselineInput =
            baselineInputs.find(
              (baselineInput: EnergyFacilityItem) =>
                baselineInput.name === endlineInput.name
            ) ?? null;
          let changeInEmission = 0;
          if (baselineInput) {
            const localCO2 = endlineInput.totalCO2Emission;
            const refCO2 = baselineInput.totalCO2Emission;
            if (refCO2 !== 0) {
              // if refCO2 is 0 it's not valid
              changeInEmission = ((refCO2 - localCO2) / refCO2) * 100;
            }
          }
          return {
            ...endlineInput,
            changeInEmission,
          };
        }
      );
    }

    // compute endline results after modifying endline inputs
  }
  public computeEndlineResults(): void {
    // compute changeInEmission again
    this.computeEndlineChangeInEmission();
    // alias
    const inputs: EnergyFacilityInterventionItem[] =
      this.facilityForm.endline.inputs;

    // sum all rows into one object
    const results: EnergyFacilityInterventionItemResult = {
      gridPower: inputs.reduce((acc, el) => acc + el.gridPower, 0),
      dieselLiters: inputs.reduce((acc, el) => acc + el.dieselLiters, 0),
      renewablePower: inputs.reduce((acc, el) => acc + el.renewablePower, 0),
      totalCO2Emission: inputs.reduce(
        (acc, el) => acc + el.totalCO2Emission,
        0
      ),
      changeInEmission: inputs.reduce(
        (acc, el) => acc + el.changeInEmission,
        0
      ),
    };
    this.facilityForm.endline.results = results;
    this.facilityForm = Object.assign({}, this.facilityForm);
  }

  public get changeInEmissionPositive(): boolean {
    return this.facilityForm.endline.results.changeInEmission > 0;
  }

  public get changeInEmissionNegative(): boolean {
    return this.facilityForm.endline.results.changeInEmission < 0;
  }
  public get changeInEmissionSign(): string {
    // minus sign is already shown
    return this.changeInEmissionPositive ? "+" : "";
  }

  get icon(): string {
    const change = this.facilityForm.endline.results.changeInEmission;
    if (change > 0) {
      return "mdi-triangle";
    } else if (change < 0) {
      return "mdi-triangle mdi-rotate-180";
    } else {
      return "mdi-triangle mdi-rotate-90";
    }
  }

  get color(): string {
    const change = this.facilityForm.endline.results.changeInEmission;
    if (change > 0) {
      return "green";
    } else if (change < 0) {
      return "red";
    } else {
      return "black";
    }
  }

  public computeBaselineResults(baselineInputs: EnergyFacilityItem[]): void {
    const inputs: EnergyFacilityItem[] = baselineInputs; // this.facilityForm.baseline.inputs;
    const results: EnergyFacilityItemResult = {
      gridPower: inputs.reduce((acc, el) => acc + el.gridPower, 0),
      dieselLiters: inputs.reduce((acc, el) => acc + el.dieselLiters, 0),
      renewablePower: inputs.reduce((acc, el) => acc + el.renewablePower, 0),
      totalCO2Emission: inputs.reduce(
        (acc, el) => acc + el.totalCO2Emission,
        0
      ),
    };
    this.facilityForm.baseline.results = results;
    this.facilityForm.endline.inputs = this.copyBaselineToEndline();
    /// compute endline results
    this.computeEndlineResults();
    this.facilityForm = Object.assign({}, this.facilityForm);
  }

  public getFacilitiesName(
    inputs: (EnergyFacilityItem | EnergyFacilityInterventionItem)[]
  ): string[] {
    return inputs.map(
      (item: EnergyFacilityItem | EnergyFacilityInterventionItem) =>
        item.name ?? ""
    );
  }

  private copyBaselineToEndline(): EnergyFacilityInterventionItem[] {
    let results: EnergyFacilityInterventionItem[] = [];
    if (this.facilityForm) {
      const baselineInputsName = this.getFacilitiesName(
        this.facilityForm.baseline.inputs
      );
      const endlineInputsName = this.getFacilitiesName(
        this.facilityForm.endline.inputs
      );
      const newEndlineInputs = this.facilityForm.baseline.inputs
        .filter(
          (baselineInput: EnergyFacilityItem) =>
            endlineInputsName.indexOf(baselineInput.name) === -1
        )
        .map((input: EnergyFacilityItem) => {
          const {
            name,
            gridPower,
            dieselLiters,
            renewablePower,
            totalCO2Emission,
          } = input;
          const newEndlineInput: EnergyFacilityInterventionItem = {
            name,
            description: "",
            gridPower,
            dieselLiters,
            renewablePower,
            totalCO2Emission,
            changeInEmission: 0, // recompute
          };
          return newEndlineInput;
        });
      // filter out removed baseline inputs in results
      results = this.facilityForm.endline.inputs.filter(
        (endlineInput: EnergyFacilityInterventionItem) =>
          baselineInputsName.indexOf(endlineInput.name) !== -1
      );
      // add to endline inputs new baseline inputs copy
      results = results.concat(newEndlineInputs);
    }

    return results;
  }
  private generateNewFacilitiesForm(): EnergyFacilitySurvey {
    return {
      baseline: {
        inputs: [],
        results: {
          gridPower: 0,
          dieselLiters: 0,
          renewablePower: 0,
          totalCO2Emission: 0,
        },
      },
      endline: {
        inputs: [],
        results: {
          gridPower: 0,
          dieselLiters: 0,
          renewablePower: 0,
          totalCO2Emission: 0,
          changeInEmission: 0,
        },
        resultsBalance: {
          TR_NUM_DIFF: 0,
          TR_DIST_DIFF: 0,
          CO2_WSH_TRB_DIFF: 0,
          CO2_WSH_TRB_PER: 0,
        },
      },
    };
  }
}
</script>

<style lang="scss" scoped>
.baseline-title {
  color: rgba(32, 135, 200, 1); // blue unhcr
}
.endline-title {
  color: rgba(32, 135, 200, 1);
}

::v-deep .facilities-negative {
  color: red;
}
::v-deep .facilities-positive {
  color: green;
}
</style>
