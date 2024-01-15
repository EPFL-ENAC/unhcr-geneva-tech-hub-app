<template>
  <v-card
    elevation="2"
    rounded
    :style="`--in-mode:${baselineMode ?? false ? 'white' : '#d3d3d37d'}`"
  >
    <v-card-title>
      <h3 class="baseline-title font-weight-medium">Baseline</h3>
    </v-card-title>
    <v-card-subtitle>
      <v-alert
        v-if="
          diffDimensionSubType === 'percent' &&
          baseline.results[diffDimension] > 1
        "
        dense
        outlined
        border="left"
        close-text="Close Alert"
        color="error"
        dark
      >
        <p>Baseline total is above 100%, please check your data.</p>
      </v-alert>
    </v-card-subtitle>
    <v-card-text>
      <instance-table
        :items="baseline.items"
        :results="baseline.results"
        :disabled="!baselineMode"
        :headers="headers"
        :compute-item="computeItem"
        :name="name"
        @update:items="updateBaselineItems"
      />
    </v-card-text>
    <v-card-actions>
      <v-container class="d-flex flex-column" fluid>
        <v-row v-if="baseline.results.totalCO2Emission !== undefined">
          <v-col cols="6" class="d-flex justify-end">
            <instance-pie-chart
              v-if="activatePie"
              :diff-dimension="diffDimension"
              :results="baseline.results"
            />
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col class="d-flex justify-end mx-2 mb-2">
                <h3>
                  Total CO2 Emissions (for indicated population):
                  {{
                    baseline.results.totalCO2Emission |
                      formatNumberGhg({
                        suffix: "tCO2e/year",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      })
                  }}
                </h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end mx-2 mb-2">
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
            <v-row>
              <v-col class="d-flex justify-end mx-2 mb-2 d-print-none">
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
</template>

<script lang="ts">
import InstancePieChart from "@/components/green_house_gaz/generic/InstancePieChart.vue";
import InstanceTable from "@/components/green_house_gaz/generic/InstanceTable.vue";
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";
import {
  GenericBaseline,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { scope1, scope2, scope3 } from "@/utils/apps";
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
export default class BaselineCard extends Vue {
  @Prop([Object, Array])
  readonly baseline!: GenericBaseline<SurveyItem, SurveyResult>;
  @Prop([Boolean])
  readonly baselineMode!: boolean;
  @Prop([String])
  readonly diffDimension!: keyof SurveyInput;
  @Prop([String])
  readonly name!: string;
  @Prop([Array])
  readonly headers!: SurveyTableHeader[];
  @Prop({ type: Boolean, default: false })
  readonly activatePie!: boolean;
  @Prop([Function])
  readonly computeItem!: (
    localItemInput: SurveyInput,
    ghgMapRef: ItemReferencesMap
  ) => SurveyResult;

  scope1 = scope1;
  scope2 = scope2;
  scope3 = scope3;

  public toggleBaselineMode(): void {
    this.$emit("update:baselineMode", !this.baselineMode);
  }
  public get baselineSwitchText(): string {
    return this.baselineMode ? "Save baseline" : "Edit baseline";
  }
  public updateBaselineItems(value: SurveyItem[]) {
    const newBaseline = cloneDeep(this.baseline);
    newBaseline.items = value;
    this.$emit("update:baseline", newBaseline);
  }

  public get diffHeader(): SurveyTableHeader | undefined {
    return this.headers?.find((header) => header.key === this.diffDimension);
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
}
</script>

<style lang="scss" scoped>
.baseline-title {
  color: rgba(32, 135, 200, 1);
}

::v-deep.v-card.v-sheet.theme--light.elevation-2.rounded {
  background-color: var(--in-mode);
}
</style>
