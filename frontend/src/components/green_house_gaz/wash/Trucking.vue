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
import {
  WashTruckingItemInput,
  WashTruckingItemResults,
  WashTruckingSurvey,
} from "@/components/green_house_gaz/wash/Trucking";
import { formatNumber } from "@/plugins/filters";
import { SurveyInput } from "@/store/GhgInterface";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

export const DIESEL = "Diesel";
export const PETROL = "Petrol / Gaz";
export const KM = "km";
export const LITERS = "liters";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
})
export default class Trucking extends Vue {
  @Prop({ type: String, required: true })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
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
    const { REF_WSH_D, REF_WSH_G, REF_EFF_DIES, REF_EFF_PET } = ghgMapRef;
    try {
      /*
        When wastewater or faecal sludge is checked in the dropdown,
        So the input volume pumped must be multiplied by 0.85. or REF_WW_FS
      */
      const itemComputed = {} as WashTruckingItemResults;

      // const volumeCollected = ["WASTEWATER", "FAECAL SLUDGE"].includes(US_TYP)
      //   ? WACL * (REF_WW_FS?.value ?? 0.85)
      //   : WACL;
      const volumeCollected = WACL;
      if (US_UNI === KM) {
        const washFactorKM =
          TR_TYP === DIESEL ? REF_WSH_D?.value : REF_WSH_G?.value;
        if (!washFactorKM) {
          throw new Error(`washFactorKM undefined`);
        }
        itemComputed.TR_NUM = Math.ceil(volumeCollected / TR_VOL);
        /* roundtrip distance by multiplying by 2 */
        itemComputed.TR_DIST = itemComputed.TR_NUM * TOT_WS * 2;
        itemComputed.totalCO2Emission =
          washFactorKM *
          itemComputed.TR_DIST *
          12 * // number of months
          0.001; // 1/1000 (kg)
      }

      if (US_UNI === LITERS) {
        const washFactorL =
          TR_TYP === DIESEL ? REF_EFF_DIES?.value : REF_EFF_PET?.value;
        if (!washFactorL) {
          throw new Error(`washFactorL undefined`);
        }
        itemComputed.totalCO2Emission =
          washFactorL *
          LIT_WS *
          12 * // number of months
          0.001; // 1/1000 (kg)
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

      items: [KM, LITERS],
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
      text: "Distance between water source or treatment",
      value: "input.TOT_WS",
      conditional_value: KM,
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
      text: "Liters of fuel consumed per month (l/month)",
      value: "input.LIT_WS",
      conditional_value: LITERS,
      conditional: "US_UNI",
      style: {
        cols: "12",
      },
      type: "number",
      hideFooterContent: false,
      suffix: "l/month",
      formatter: (v: number, { ...args }) => {
        return formatNumber(v, { suffix: args.suffix });
      },
    },
    {
      text: `Total volume transported (m³/month)`,
      value: "input.WACL",
      hideFooterContent: false,
      style: {
        cols: "12",
      },
      suffix: "m³/month",
      computeResults: true,
      type: "number",
      formatter: (v: number, { ...args }) => {
        return formatNumber(v, { suffix: args.suffix });
      },
    },
    {
      text: "Volume of one water truck (m³)",
      value: "input.TR_VOL",
      conditional_value: KM,
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
</script>
