<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <baseline-endline-wrapper
      v-model="washForm"
      :headers="truckingHeaders"
      :diff-dimension="diffDimension"
      :compute-item="truckingComputeCO2Cost"
      name="transport"
    />
  </v-container>
</template>

<script lang="ts">
import BaselineEndlineWrapper from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import {
  ensureSurveyTableHeaders,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import { formatNumber } from "@/plugins/filters";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

export const DIESEL = "DIESEL";
export const PETROL = "Petrol / Gaz";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
})
export default class Trucking extends Vue {
  @Prop({ type: String, required: true })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array], required: true })
  readonly form!: WashTruckingSurvey;

  diffDimension: keyof WashTruckingItemInput = "WACL";

  public get title(): string {
    return this.titleKey;
  }
  public get washForm(): WashTruckingSurvey {
    return this.form;
  }

  public set washForm(value: WashTruckingSurvey) {
    this.$emit("update:form", value);
  }

  public truckingComputeCO2Cost(
    localItemInput: WashTruckingItemInput,
    ghgMapRef: ItemReferencesMap
  ): WashTruckingItemResults {
    const { US_UNI, US_TYP, WACL, TR_TYP, TOT_WS, TR_VOL, LIT_WS } =
      localItemInput || {};
    const { REF_WSH_D, REF_WSH_G, REF_DIES_L, REF_GAZ_L, REF_WW_FS } =
      ghgMapRef;
    try {
      /*
        When wastewater or faecal sludge is checked in the dropdown,
        So the input volume pumped must be multiplied by 0.85. or REF_WW_FS
      */
      const itemComputed = {} as WashTruckingItemResults;

      const volumeCollected = ["WASTEWATER", "FAECAL SLUDGE"].includes(US_TYP)
        ? WACL * (REF_WW_FS?.value ?? 0.85)
        : WACL;
      if (US_UNI === "KM") {
        const washFactorKM =
          TR_TYP === DIESEL ? REF_WSH_D?.value : REF_WSH_G?.value;
        if (!washFactorKM) {
          throw new Error(`washFactorKM undefined`);
        }
        itemComputed.TR_NUM = Math.ceil(volumeCollected / TR_VOL);
        /* roundtrip distance by multiplying by 2 */
        itemComputed.TR_DIST = itemComputed.TR_NUM * TOT_WS * 2;
        itemComputed.totalCO2Emission =
          (washFactorKM * itemComputed.TR_DIST) / 1000;
      }

      if (US_UNI === "LITRES") {
        const washFactorL =
          TR_TYP === DIESEL ? REF_DIES_L?.value : REF_GAZ_L?.value;
        if (!washFactorL) {
          throw new Error(`washFactorL undefined`);
        }
        itemComputed.totalCO2Emission = (washFactorL * LIT_WS) / 1000;
      }
      return itemComputed;
    } catch (error) {
      throw new Error(`ghg wash input for trucking unknown unit type ${error}`);
    }
  }

  readonly truckingHeaders = [
    // replace description by label
    // replace code by value
    ...surveyTableHeaderIncrements,
    {
      text: "Intervention",
      value: "input.description",
      type: "text",

      endlineOnly: true,
      hideFooterContent: false,
    },
    {
      text: "Fluid transported", // named "Trucking type",
      value: "input.US_TYP",
      type: "select",
      hideFooterContent: false,
      items: ["WATER", "WASTEWATER", "FAECAL SLUDGE"],
    },
    {
      text: "Trucking unit",
      value: "input.US_UNI",
      type: "select",

      items: ["KM", "LITRES"],
      hideFooterContent: false,
      customEventInput: (truckId: string, localInput: SurveyInput) => {
        // does not work with reference ?
        // reset all values
        // localInput.fuelType = "CHC";
        delete localInput.TOT_WS;
        delete localInput.TR_VOL;
        delete localInput.LIT_WS;
        // delete localInput.WACL;
        return localInput;
      },
    },
    {
      text: "Distance between camp and water source",
      value: "input.TOT_WS",
      conditional_value: "KM",
      conditional: "US_UNI",
      style: {
        cols: "12",
      },
      type: "number",
      hideFooterContent: false,
      suffix: "km",
      formatter: (v: number, { ...args }) => {
        return formatNumber(v, { suffix: args.suffix });
      },
    },
    {
      text: "Liters of fuel consumed",
      value: "input.LIT_WS",
      conditional_value: "LITRES",
      conditional: "US_UNI",
      style: {
        cols: "12",
      },
      type: "number",
      hideFooterContent: false,
      suffix: "l",
      formatter: (v: number, { ...args }) => {
        return formatNumber(v, { suffix: args.suffix });
      },
    },
    {
      text: `Total volume transported (m3)`,
      value: "input.WACL",
      hideFooterContent: false,
      style: {
        cols: "12",
      },
      computeResults: true,
      type: "number",
    },
    {
      text: "Volume of one water truck",
      value: "input.TR_VOL",
      conditional_value: "KM",
      conditional: "US_UNI",
      style: {
        cols: "12",
      },
      type: "number",
    },
    {
      text: "Type of truck",
      value: "input.TR_TYP",
      type: "select",
      hideFooterContent: false,
      items: [DIESEL, PETROL],
    },

    {
      text: "Approximate number of trucks used",
      value: "computed.TR_NUM",
      type: "number",
      disabled: true,
    },
    {
      text: "Total distance travelled",
      value: "computed.TR_DIST",
      type: "number",

      suffix: "km",
      disabled: true,
    },
    ...surveyTableHeaderCO2,
  ].map(ensureSurveyTableHeaders);
}

export interface WashTruckingItemInput extends SurveyInput {
  US_TYP: string;
  US_UNI: string;
  TOT_WS: number;
  LIT_WS: number;
  WACL: number;
  TR_VOL: number;
  TR_TYP: string;
}

export interface WashTruckingItemResults extends SurveyResult {
  TR_NUM: number;
  TR_DIST: number;
  WACL: number; // total of collected volume
  totalCO2Emission: number;
}
export interface WashTruckingItem extends SurveyItem {
  input: WashTruckingItemInput;
  computed: WashTruckingItemResults;
}

export interface WashTruckingItemResultsBalance extends SurveyResult {
  TR_NUM_DIFF: number;
  TR_DIST_DIFF: number;
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface WashTruckingItemResultsWithBalance
  extends WashTruckingItemResults,
    WashTruckingItemResultsBalance {}

export type WashTruckingSurvey = GenericFormSurvey<
  WashTruckingItem,
  WashTruckingItemResults,
  WashTruckingItem,
  WashTruckingItemResultsWithBalance
>;
</script>
