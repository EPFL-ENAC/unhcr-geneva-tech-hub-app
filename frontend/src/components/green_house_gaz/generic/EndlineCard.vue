<template>
  <v-card elevation="2" rounded>
    <v-card-title>
      <h3 class="endline-title font-weight-medium">Endline</h3>
    </v-card-title>
    <v-card-subtitle>
      <v-col :cols="12" class="d-flex justify-center">
        <v-alert
          v-if="!isDiffNull"
          dense
          outlined
          border="left"
          close-text="Close Alert"
          color="error"
          dark
        >
          Please note that the baseline and endline
          {{ diffDimensionText }} do not match.
          <br />
          Baseline:
          {{ baseline.results[diffDimension] | formatNumber }}
          {{ diffDimensionText }}
          <br />
          Endline:
          {{ endline.results[diffDimension] | formatNumber }}
          {{ diffDimensionText }}
        </v-alert>
      </v-col>
    </v-card-subtitle>
    <div v-if="showEndLines">
      <v-card-text>
        <instance-table
          :items="endline.items"
          :reference-items="baseline.items"
          :intervention="true"
          :results="endline.results"
          :disabled="baselineMode"
          :headers="headers"
          :sort-by="sortBy"
          :name="name"
          :diff-dimension="diffDimension"
          @update:items="updateEndlineInputs"
        />
      </v-card-text>
      <v-container class="d-flex flex-column" fluid>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="6" class="d-flex justify-end">
                <instance-pie-chart
                  v-if="activatePie"
                  :diff-dimension="diffDimension"
                  :results="endline.results"
                />
              </v-col>
              <v-col :cols="6" class="d-flex flex-column justify-end">
                <h3>
                  Total CO2 Emissions:
                  {{
                    endline.results.totalCO2Emission |
                      formatNumber({ suffix: "tCO2e/year" })
                  }}
                </h3>

                <h3>
                  <span
                    :class="{
                      'item-positive': changeInEmissionPositive,
                      'item-negative': changeInEmissionNegative,
                    }"
                  >
                    <v-icon :class="iconClass" :color="color">
                      $mdiTriangle
                    </v-icon>
                    {{
                      endline.results.changeInEmission |
                        formatNumber({
                          maximumFractionDigits: 0,
                          style: "percent",
                          signDisplay: "exceptZero",
                        })
                    }}

                    ({{
                      (endline.results.totalCO2Emission -
                        baseline.results.totalCO2Emission) |
                        formatNumber({ suffix: "tCO2e/year" })
                    }})
                  </span>
                </h3>
              </v-col>
              <v-col :cols="12" class="d-flex justify-end mx-2 mb-2">
                <h4>
                  These calculations are limited to Scope 1 and Scope 2 sources
                  of emissions for purposes of simplicity.
                </h4>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-else class="container container--fluid">
      <v-row>
        <v-col class="d-flex justify-end mx-2 mb-2">
          <h3>{{ endlineText }}</h3>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
import InstancePieChart from "@/components/green_house_gaz/generic/InstancePieChart.vue";
import InstanceTable from "@/components/green_house_gaz/generic/InstanceTable.vue";
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";

import {
  GenericBaseline,
  GenericEndline,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";
import { cloneDeep } from "lodash";
import Vue from "vue";
import "vue-class-component/hooks";
import { Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    InstanceTable,
    InstancePieChart,
  },
})
export default class EndlineCard extends Vue {
  @Prop([Object, Array])
  readonly baseline!: GenericBaseline<SurveyItem, SurveyResult>;
  @Prop([Object, Array])
  readonly endline!: GenericEndline<SurveyItem, SurveyResult>;
  @Prop([Boolean])
  readonly baselineMode!: boolean;
  @Prop([String])
  readonly name!: string;
  @Prop([Array])
  readonly headers!: SurveyTableHeader[];
  @Prop([String])
  readonly diffDimension!: keyof SurveyInput;
  @Prop({ type: Boolean, default: false })
  readonly activatePie!: boolean;

  @Prop({ type: String, default: "increment" })
  readonly sortBy!: string;

  public get showEndLines(): boolean {
    return this.baseline.items.length > 0 && !this.baselineMode;
  }

  public get baselineSwitchText(): string {
    return this.baselineMode ? "Save baseline" : "Edit baseline";
  }

  public get endlineText(): string {
    if (this.baselineMode) {
      return "Save baseline to edit Endline";
    }
    if (this.baseline.items.length == 0) {
      return `Please add ${this.name} to baseline to edit Endline`;
    }
    return "Please edit baseline to edit Endline";
  }

  public get isDiffNull(): boolean {
    if (!this.baseline.results || !this.endline.results) {
      return false;
    }
    const baselineResult = this.baseline.results;
    const endlineResult = this.endline.results;
    return (
      (baselineResult[this.diffDimension] as number) -
        (endlineResult[this.diffDimension] as number) ===
      0
    );
  }

  public get diffDimensionText(): string {
    return (
      this.headers.find((header) => header.key === this.diffDimension)?.label ??
      "no dimension selected"
    );
  }

  public updateEndlineInputs(value: SurveyItem[]) {
    const newEndline = cloneDeep(this.endline);
    newEndline.items = value;
    this.$emit("update:endline", newEndline);
  }

  public updateEndlineDismissed(value: boolean) {
    this.endline.alertDismissed = value;
    this.$emit("update:endline", this.endline);
  }

  public get changeInEmissionPositive(): boolean {
    return (this.endline.results.changeInEmission ?? 0) > 0;
  }
  public get changeInEmissionNegative(): boolean {
    return (this.endline.results.changeInEmission ?? 0) < 0;
  }

  get iconClass(): string {
    const change = this.endline.results.changeInEmission;
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
    const change = this.endline.results.changeInEmission;
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
}
</script>

<style lang="scss" scoped>
.endline-title {
  color: rgba(32, 135, 200, 1);
}
.bold-table-content {
  font-size: 0.875rem;
  font-weight: bold;
}

::v-deep .item-negative {
  color: green;
}
::v-deep .item-positive {
  color: red;
}
</style>
