<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />

    <v-row>
      <v-col>
        <v-alert v-if="diffInTotalKwh" dense outlined type="warning">
          This comparison is not valid because baseline and endline have
          different energy demands.
        </v-alert>
        <v-card elevation="2" rounded>
          <v-card-title>
            <h3 class="baseline-title font-weight-medium">Baseline</h3>
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
                <v-col cols="8" class="d-flex justify-end">
                  <facilities-pie-chart
                    :option="getChartOption(facilityForm.baseline.results)"
                  />
                </v-col>
                <v-col cols="4">
                  <v-row>
                    <v-col class="d-flex justify-end mx-2 mb-2">
                      <h3>
                        Total CO2 Emissions:
                        {{
                          facilityForm.baseline.results.totalCO2Emission |
                            formatNumber
                        }}
                        (tCO2e/year)
                      </h3>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-end mx-2 mb-2">
                      <v-btn @click="toggleBaselineMode">
                        {{ baselineSwitchText }}
                      </v-btn>
                    </v-col>
                  </v-row>
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
          <v-card-title>
            <h3 class="endline-title font-weight-medium">Endline</h3>
          </v-card-title>
          <div v-if="showEndLines">
            <v-card-text>
              <endline-facilities-table
                :facilities="facilityForm.baseline.inputs"
                :items.sync="facilityForm.endline.inputs"
                :results="facilityForm.endline.results"
                :disabled="baselineMode"
                @update:items="computeEndlineResults"
              />
            </v-card-text>
            <v-container class="d-flex flex-column" fluid>
              <v-row>
                <v-col cols="5" class="d-flex justify-end">
                  <facilities-pie-chart
                    :option="getChartOption(facilityForm.endline.results)"
                  />
                </v-col>
                <v-col cols="7">
                  <v-row>
                    <v-col class="d-flex justify-end">
                      <h3>
                        Total CO2 Emissions:
                        {{
                          facilityForm.endline.results.totalCO2Emission |
                            formatNumber
                        }}
                        (tCO2e/year)
                        <span
                          :class="{
                            'facilities-positive': changeInEmissionPositive,
                            'facilities-negative': changeInEmissionNegative,
                          }"
                        >
                          <v-icon :class="iconClass" :color="color">
                            $mdiTriangle
                          </v-icon>
                          {{
                            facilityForm.endline.results.changeInEmission |
                              formatNumber(0, 0, true, "percent")
                          }}

                          ({{
                            (facilityForm.endline.results.totalCO2Emission -
                              facilityForm.baseline.results.totalCO2Emission) |
                              formatNumber
                          }}
                          tCO2e/year)
                        </span>
                      </h3>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </div>

          <div v-else>
            <v-row>
              <v-col class="d-flex justify-end mx-2 mb-2">
                <h3>{{ endlineText }}</h3>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computeChangeInEmission } from "@/components/green_house_gaz/changeInEmission";
import BaselineFacilitiesTable from "@/components/green_house_gaz/energy/BaselineFacilitiesTable.vue";
import EndlineFacilitiesTable from "@/components/green_house_gaz/energy/EndlineFacilitiesTable.vue";
import FacilitiesPieChart from "@/components/green_house_gaz/energy/FacilitiesPieChart.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import { cccmColors } from "@/plugins/vuetify";
import {
  EnergyFacilityInterventionItem,
  EnergyFacilityInterventionItemResult,
  EnergyFacilityItem,
  EnergyFacilityItemResult,
  EnergyFacilitySurvey,
} from "@/store/GhgInterface";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { EChartsOption } from "echarts/types/dist/shared";
import { sumBy } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
  components: {
    BaselineFacilitiesTable,
    EndlineFacilitiesTable,
    SurveyItemTitle,
    FacilitiesPieChart,
  },
})
export default class Facilities extends Vue {
  @Prop([Object, Array])
  readonly form: EnergyFacilitySurvey | undefined;
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  ghgMapRef!: ItemReferencesMap;
  baselineMode = true;

  public get title(): string {
    return this.titleKey;
  }

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
          let changeInEmission: number | null = null;
          if (baselineInput) {
            // FAC_TCOT_E
            const endline = endlineInput.totalCO2Emission;
            // FAC_TCOT_B
            const baseline = baselineInput.totalCO2Emission;
            //
            changeInEmission = computeChangeInEmission(baseline, endline);
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

    const baselineResults: EnergyFacilityItemResult =
      this.facilityForm.baseline.results;
    // sum all rows into one object
    const endlineResults: EnergyFacilityInterventionItemResult = {
      gridPower: sumBy(inputs, (el) => el.gridPower),
      dieselLiters: sumBy(inputs, (el) => el.dieselLiters),
      renewablePower: sumBy(inputs, (el) => el.renewablePower),
      totalCO2Emission: sumBy(inputs, (el) => el.totalCO2Emission),
      changeInEmission: 0, // need to compute totalCO2 first
    };
    const changeInEmission = computeChangeInEmission(
      baselineResults.totalCO2Emission,
      endlineResults.totalCO2Emission
    );
    endlineResults.changeInEmission = changeInEmission;
    this.facilityForm.endline.results = endlineResults;
    this.facilityForm = Object.assign({}, this.facilityForm);
  }

  public get changeInEmissionPositive(): boolean {
    if (this.facilityForm.endline.results.changeInEmission)
      return this.facilityForm.endline.results.changeInEmission > 0;
    return false;
  }

  public get changeInEmissionNegative(): boolean {
    if (this.facilityForm.endline.results.changeInEmission)
      return this.facilityForm.endline.results.changeInEmission < 0;
    return false;
  }
  public get changeInEmissionSign(): string {
    // minus sign is already shown
    return this.changeInEmissionPositive ? "+" : "";
  }

  get iconClass(): string {
    const change = this.facilityForm.endline.results.changeInEmission;
    if (change == null) {
      return "rotate-90";
    }
    if (change > 0) {
      return "";
    } else if (change < 0) {
      return " rotate-180";
    } else {
      return "rotate-90";
    }
  }

  get color(): string {
    const change = this.facilityForm.endline.results.changeInEmission;
    if (change == null) {
      return "black";
    }
    if (change > 0) {
      return "red";
    } else if (change < 0) {
      return "green";
    } else {
      return "black";
    }
  }

  public computeBaselineResults(baselineInputs: EnergyFacilityItem[]): void {
    const inputs: EnergyFacilityItem[] = baselineInputs; // this.facilityForm.baseline.inputs;
    const results: EnergyFacilityItemResult = {
      gridPower: sumBy(inputs, (el) => el.gridPower),
      dieselLiters: sumBy(inputs, (el) => el.dieselLiters),
      renewablePower: sumBy(inputs, (el) => el.renewablePower),
      totalCO2Emission: sumBy(inputs, (el) => el.totalCO2Emission),
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
      },
    };
  }

  public get diffInTotalKwh() {
    const baselineKWH = sumBy(
      this.kwhData(this.facilityForm.baseline.results),
      (el) => el.value
    );
    const endlineKWH = sumBy(
      this.kwhData(this.facilityForm.endline.results),
      (el) => el.value
    );

    return baselineKWH - endlineKWH !== 0;
  }

  private kwhData(
    item: EnergyFacilityItemResult | EnergyFacilityInterventionItemResult
  ): EchartDataSerie[] {
    const data: EchartDataSerie[] = [];
    if (item.gridPower) {
      data.push({
        id: "gridPower",
        name: "Grid",
        value: item.gridPower,
      });
    }
    if (item.dieselLiters) {
      let dieselLitersKWH = 0;
      if (item.generatorSize && item.operatingHours) {
        dieselLitersKWH = item.generatorSize * item.operatingHours;
      } else {
        dieselLitersKWH =
          item.dieselLiters * this.ghgMapRef?.REF_EFF_DIES?.value;
      }
      data.push({
        id: "dieselLiters",
        name: "Diesel",
        value: dieselLitersKWH,
      });
    }
    if (item.renewablePower) {
      data.push({
        id: "renewablePower",
        name: "Solar",
        value: item.renewablePower,
      });
    }
    return data;
  }

  public getChartOption(
    item: EnergyFacilityItemResult | EnergyFacilityInterventionItemResult
  ): EChartsOption {
    // "Distribution of tCO2e/year per facilities"
    const data = this.kwhData(item);
    // energy mix

    return {
      title: {
        text: "Energy Mix (kWh)", //"Distribution of tCO2e/year per facilities",
        textStyle: {
          fontSize: 12,
          width: "500px",
        },
        left: "center",
      },

      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "pie",
          radius: "25%",
          tooltip: {
            valueFormatter: (value) =>
              this.$options.filters?.formatNumber(value) + " (kWh)",
          },
          label: {
            overflow: "break",
          },
          data,
        },
      ],
      color: [
        cccmColors.primary(),
        cccmColors.secondary1(),
        cccmColors.green(),
      ],
    };
  }
}

interface EchartDataSerie {
  id: string;
  name: string;
  value: number;
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
  color: green;
}
::v-deep .facilities-positive {
  color: red;
}
</style>
