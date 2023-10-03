<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <baseline-endline-wrapper
      v-model="washForm"
      :headers="waterSupplyHeaders"
      :diff-dimension="diffDimension"
      :compute-item="waterSupplyComputeCO2Cost"
      name="water supply"
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
import { GreenHouseGaz, SurveyInput } from "@/store/GhgInterface";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";

import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { poweredByInputs } from "../energy/poweredBy";
import { CountryIrradianceKeys } from "../energy/solarInputs";

export const DIESEL = "Diesel";
export const PETROL = "Petrol / Gaz";
export const KM = "km";
export const LITERS = "liters of fuel";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
  },
})
export default class WaterSupply extends Vue {
  @Prop({ type: String, required: true })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: WashTruckingSurvey;

  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: CountryIrradianceKeys;

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;

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

  public waterSupplyComputeCO2Cost(
    localItemInput: WashTruckingItemInput,
    ghgMapRef: ItemReferencesMap
  ): WashTruckingItemResults {
    // TODO: merge compute CO2 of trucking and pumping
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
          // 12 * // number of months
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
          // 12 * // number of months
          0.001; // 1/1000 (kg)
      }
      return itemComputed;
    } catch (error) {
      throw new Error(`ghg wash input for water supply unknown unit type ${error}`);
    }
  }

  // TODO: merge typeof truck and  powered by
  // Diesel should become Diesel truck
  // Petrol should become Petrol Truck
  // and voilà
  // for the energy..do like issue 385: https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/385
  // rename to : Annual fuel / Energy consumption
  // Use truck consumption fuel by year and not by month anymore

  readonly waterSupplyHeaders = [
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
      text: "Name", // We keep the name for pumping and trucking
      value: "input.name",
      type: "text",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Pumping";
      },
      style: {
        cols: "12",
      },
      hideFooterContent: false,
    },
    // {
    //   text: "Fluid transported", // named "Trucking type",
    //   value: "input.US_TYP",
    //   type: "select",
    //   hideFooterContent: false,
    //   items: ["WATER", "WASTEWATER", "FAECAL SLUDGE"],
    // },
    {
      text: "Water supplied by", // named "Trucking type",
      value: "input.WASH_TYPE",
      type: "select",
      hideFooterContent: false,
      items: ["Pumping", "Trucking"], // should be dynamic ? // todo: maybe dissplay only when it's WATER ? what are the rules ?
    },
    {
      text: "Trucking unit",
      value: "input.US_UNI",
      type: "select",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking";
      },
      items: [KM, LITERS],
      hideFooterContent: true,
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
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking" && input.US_UNI === KM;
      },
      value: "input.TOT_WS",
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
      text: "Liters of fuel consumed during the year (l/year)",
      value: "input.LIT_WS",
      tooltipInfo:
        "Even if the duration of use extends to three months, it will still be calculated on an annual basis.",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking" && input.US_UNI === LITERS;
      },
      style: {
        cols: "12",
      },
      type: "number",
      hideFooterContent: false,
      suffix: "l/year",
      formatter: (v: number, { ...args }) => {
        return formatNumber(v, { suffix: args.suffix });
      },
    },
    {
      text: `Water volume (m³/year)`,
      tooltipInfo:
        "Even if the duration of use extends to three months, it will still be calculated on an annual basis.",

      value: "input.WACL",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE !== undefined;
      },
      hideFooterContent: false,
      style: {
        cols: "12",
      },
      suffix: "m³/year",
      computeResults: true,
      type: "number",
      formatter: (v: number, { ...args }) => {
        return formatNumber(v, { suffix: args.suffix });
      },
    },
    {
      text: "Volume of one water truck (m³)",
      value: "input.TR_VOL",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking" && input.US_UNI === KM;
      },
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
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking";
      },
    },

    {
      text: "Approximate number of trucks used",
      value: "computed.TR_NUM",
      type: "number",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking";
      },
      disabled: true,
    },
    {
      text: "Total distance travelled",
      value: "computed.TR_DIST",
      type: "number",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking";
      },
      suffix: "km",
      disabled: true,
    },

    // start of pumping
    ...poweredByInputs("Year", this.countryCode, this.project?.solar, {
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Pumping";
      },
    }),
    ...surveyTableHeaderCO2,
  ].map(ensureSurveyTableHeaders);
}
</script>
