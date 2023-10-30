<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <baseline-endline-wrapper
      v-model="localForm"
      :headers="headers"
      :activate-pie="true"
      :diff-dimension="diffDimension"
      :compute-item="computeItem"
      :name="name"
    />
  </v-container>
</template>

<script lang="ts">
import BaselineEndlineWrapper from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";

import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

import { CountryIrradianceKeys } from "@/components/green_house_gaz/energy/solarInputs";

import {
  ensureSurveyTableHeaders,
  SurveyTableHeader,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";
import {
  EnergyItem,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

import {
  ElectricFuel,
  electricFuels,
} from "@/components/green_house_gaz/fuelTypes";

import { GreenHouseGaz } from "@/store/GhgInterface";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import {
  computeCO2costElectric,
  computeTotalPower,
  poweredByInputs,
} from "./poweredBy";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
  },
})
export default class Facilities extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: EnergyFacilitySurvey;

  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: CountryIrradianceKeys;

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;
  diffDimension: keyof EnergyFacilityItemInput = "totalPower";
  name = "Facility";

  public get title(): string {
    return this.titleKey;
  }
  public get localForm(): EnergyFacilitySurvey {
    return this.form;
  }
  public set localForm(value: EnergyFacilitySurvey) {
    this.$emit("update:form", value);
  }

  public computeItem(
    localItemInput: EnergyFacilityItemInput,
    ghgMapRef: ItemReferencesMap
  ): EnergyFacilityItemResults {
    if (this.project === undefined) {
      throw new Error("project undefined");
    }
    const { fuelType } = localItemInput;
    if (fuelType === undefined) {
      throw new Error("fuel type not defined");
    }
    if (!electricFuels.includes(fuelType as ElectricFuel)) {
      throw new Error(`unknown fuel type ${fuelType}`);
    }
    const totalCO2Emission = computeCO2costElectric(
      localItemInput,
      ghgMapRef,
      this.project_REF_GRD
    );
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is Not a Number`);
    }
    const totalPower = computeTotalPower(localItemInput);
    return {
      totalCO2Emission,
      totalPower,
    };
  }

  // should be a getter so it may be reactive for fuelTypes
  public get headers(): SurveyTableHeader[] {
    return [
      ...surveyTableHeaderIncrements,
      {
        text: "Name",
        value: "input.name",
        type: "text",
        style: {
          cols: "12",
        },
        hideFooterContent: false,
      },
      // start of pumping
      ...poweredByInputs("Year", this.countryCode, this.project?.solar, {
        hideFooterContent: true,
      }),
      ...surveyTableHeaderCO2,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].map(ensureSurveyTableHeaders);
  }
}

export interface EnergyFacilityItemInput extends EnergyItem, SurveyInput {}

export interface EnergyFacilityItemResults extends SurveyResult {
  totalCO2Emission: number;
}
export interface EnergyFacilityItem extends SurveyItem {
  input: EnergyFacilityItemInput;
  computed: EnergyFacilityItemResults;
}

export interface EnergyFacilityItemResultsBalance extends SurveyResult {
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface EnergyFacilityItemResultsWithBalance
  extends EnergyFacilityItemResults,
    EnergyFacilityItemResultsBalance {}

export type EnergyFacilitySurvey = GenericFormSurvey<
  EnergyFacilityItem,
  EnergyFacilityItemResults,
  EnergyFacilityItem,
  EnergyFacilityItemResultsWithBalance
>;
</script>
