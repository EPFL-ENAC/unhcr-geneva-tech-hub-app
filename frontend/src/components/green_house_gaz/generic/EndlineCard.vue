<template>
  <v-card
    elevation="2"
    rounded
    :style="`--in-mode:${!baselineMode ?? false ? 'white' : '#d3d3d37d'}`"
  >
    <v-card-title>
      <h3 class="endline-title font-weight-medium">Endline</h3>
    </v-card-title>
    <v-card-subtitle>
      <v-col :cols="12" class="d-flex justify-center">
        <warning-survey-dialog
          :dialog-open.sync="dialogs['warning-survey-dialog']"
          :show="isDiffNull"
          :text="diffDimensionText"
          :text-warning="diffDimensionTextWarning"
          :description="diffDimensionDescription"
          :subtype="diffDimensionSubType"
          :baseline="baseline.results[diffDimension]"
          :endline="endline.results[diffDimension]"
        />
        <warning-message-alert
          :show="isDiffNull"
          :text="diffDimensionText"
          :text-warning="diffDimensionTextWarning"
          :description="diffDimensionDescription"
          :subtype="diffDimensionSubType"
          :baseline="baseline.results[diffDimension]"
          :endline="endline.results[diffDimension]"
        />
      </v-col>
    </v-card-subtitle>
    <div :class="`${showEndLines ? '' : 'd-none d-print-block'}`">
      <v-card-text>
        <instance-table
          :items="endline.items"
          :reference-items="baseline.items"
          :intervention="true"
          :results="endline.results"
          :disabled="baselineMode"
          :headers="headers"
          :compute-item="computeItem"
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
                  <span :title="endline.results.totalCO2Emission">
                    {{
                      endline.results.totalCO2Emission |
                        formatNumberGhg({
                          suffix: "tCO2e/year",
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        })
                    }}
                  </span>
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
                    <span :title="endline.results.changeInEmission">{{
                      endline.results.changeInEmission |
                        formatNumberGhg({
                          style: "percent",
                          signDisplay: "exceptZero",
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        })
                    }}</span>
                    <span
                      :title="
                        endline.results.totalCO2Emission -
                        baseline.results.totalCO2Emission
                      "
                    >
                      ({{
                        (endline.results.totalCO2Emission -
                          baseline.results.totalCO2Emission) |
                          formatNumberGhg({
                            suffix: "tCO2e/year",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          })
                      }})
                    </span>
                  </span>
                </h3>
              </v-col>
              <v-col :cols="12" class="d-flex justify-end mx-2 mb-2">
                <h4>
                  Unless indicated with an S3 icon (Scope
                  <v-tooltip
                    class="d-print-none"
                    :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
                    :max-width="
                      'max-width' in $attrs ? $attrs['max-width'] : 512
                    "
                  >
                    <template #activator="{ on, attrs }">
                      <span v-bind="attrs" class="scope-decoration" v-on="on"
                        >3</span
                      >
                    </template>
                    <span>{{ scope3 }}</span> </v-tooltip
                  >), these calculations are limited to Scope
                  <v-tooltip
                    class="d-print-none"
                    :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
                    :max-width="
                      'max-width' in $attrs ? $attrs['max-width'] : 512
                    "
                  >
                    <template #activator="{ on, attrs }">
                      <span v-bind="attrs" class="scope-decoration" v-on="on"
                        >1</span
                      >
                    </template>
                    <span>{{ scope1 }}</span>
                  </v-tooltip>
                  and Scope
                  <v-tooltip
                    class="d-print-none"
                    :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
                    :max-width="
                      'max-width' in $attrs ? $attrs['max-width'] : 512
                    "
                  >
                    <template #activator="{ on, attrs }">
                      <span v-bind="attrs" class="scope-decoration" v-on="on"
                        >2</span
                      >
                    </template>
                    <span>{{ scope2 }}</span>
                  </v-tooltip>
                  sources of emissions for purposes of simplicity.
                </h4>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div
      class="container container--fluid"
      :class="`${showEndLines ? 'd-none' : 'd-block d-print-none'}`"
    >
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
import WarningMessageAlert from "@/components/green_house_gaz/generic/WarningMessageAlert.vue";
import { scope1, scope2, scope3 } from "@/utils/apps";

import WarningSurveyDialog from "@/components/green_house_gaz/generic/WarningSurveyDialog.vue";
import {
  GenericBaseline,
  GenericEndline,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { cloneDeep } from "lodash";
import Vue from "vue";
import "vue-class-component/hooks";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    InstanceTable,
    InstancePieChart,
    WarningMessageAlert,
    WarningSurveyDialog,
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
  @Prop([Function])
  readonly computeItem!: (
    localItemInput: SurveyInput,
    ghgMapRef: ItemReferencesMap
  ) => SurveyResult;

  dialogs = { "warning-survey-dialog": false } as Record<string, boolean>;

  scope1 = scope1;
  scope2 = scope2;
  scope3 = scope3;
  @Watch("isDiffNull", { immediate: false })
  onDiffNullChange(newIsDiffNull: boolean): void {
    this.dialogs["warning-survey-dialog"] = !newIsDiffNull;
  }
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
    if (baselineResult[this.diffDimension] === undefined) {
      return true; // no warning for undefined
    }
    const baseValue = baselineResult[this.diffDimension] as number;
    const endValue = endlineResult[this.diffDimension] as number;
    const precision = 0.001;
    return Math.abs(baseValue - endValue) <= precision;
  }

  public get diffHeader(): SurveyTableHeader | undefined {
    return this.headers.find((header) => header.key === this.diffDimension);
  }

  public get diffDimensionTextWarning(): string {
    return this.diffHeader?.textWarning ?? this.diffDimensionText;
  }
  public get diffDimensionText(): string {
    return this.diffHeader?.label ?? "no dimension selected";
  }

  public get diffDimensionDescription(): string {
    return this.diffHeader?.textWarningDescription ?? "";
  }

  public get diffDimensionSubType(): string {
    return this.diffHeader?.subtype ?? "number";
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
::v-deep.v-card.v-sheet.theme--light.elevation-2.rounded {
  background-color: var(--in-mode);
}

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
