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
  DIESEL,
  KM,
  LITERS,
  PETROL,
  WashTruckingItem,
  WashTruckingItemInput,
  WashTruckingItemResults,
  WashTruckingSurvey,
} from "@/components/green_house_gaz/wash/Trucking";
import { formatNumberGhg } from "@/plugins/filters";
import { GreenHouseGaz, SurveyInput } from "@/store/GhgInterface";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";

import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import {
  computeCO2costElectric,
  computeTotalPower,
  poweredByInputs,
} from "../energy/poweredBy";
import { CountryIrradianceKeys } from "../energy/solarInputs";

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
    const { US_UNI, /* US_TYP, */ WACL, TR_TYP, TOT_WS, TR_VOL, fuelUsage } =
      localItemInput || {};
    const { REF_WSH_D, REF_WSH_G, REF_EFF_DIES, REF_EFF_PET } = ghgMapRef;
    try {
      /*
        When wastewater or faecal sludge is checked in the dropdown,
        So the input volume pumped must be multiplied by 0.85. or REF_WW_FS
        // const volumeCollected = ["WASTEWATER", "FAECAL SLUDGE"].includes(US_TYP)
        //   ? WACL * (REF_WW_FS?.value ?? 0.85)
        //   : WACL;
      */
      const itemComputed = {} as WashTruckingItemResults;

      const volumeCollected = WACL;

      if (localItemInput.WASH_TYPE === "Pumping") {
        itemComputed.totalCO2Emission = computeCO2costElectric(
          localItemInput,
          ghgMapRef,
          this.project_REF_GRD
        );
        itemComputed.totalPower = computeTotalPower(localItemInput);
        return itemComputed;
      } else {
        const emissionFactor =
          TR_TYP === DIESEL ? REF_EFF_DIES?.value : REF_EFF_PET?.value;
        const emissionFactorPerKm =
          TR_TYP === DIESEL ? REF_WSH_D?.value : REF_WSH_G?.value;

        // to convert km / L to L / 100km we need to be divided by 100
        const defaultFuelEfficiency = parseFloat(
          (100 / (emissionFactor / emissionFactorPerKm)).toFixed(1)
        );

        const fuelEfficiency =
          (localItemInput?.fuelEfficiency as number) ?? defaultFuelEfficiency;

        let totalFuel = fuelUsage;

        if (US_UNI === KM) {
          itemComputed.TR_NUM = Math.ceil(volumeCollected / TR_VOL);
          /* roundtrip distance by multiplying by 2 */
          itemComputed.TR_DIST = itemComputed.TR_NUM * TOT_WS * 2;

          // estimated
          itemComputed.fuelUsage = itemComputed.TR_DIST * fuelEfficiency * 0.01;
          totalFuel = itemComputed.fuelUsage;
        }

        itemComputed.totalCO2Emission =
          emissionFactor * (totalFuel ?? 0) * 0.001; // 1/1000 (kg)
      }

      return itemComputed;
    } catch (error) {
      throw new Error(
        `ghg wash input for water supply unknown unit type ${error}`
      );
    }
  }

  // for the energy..do like issue 385: https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/385
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
      // conditional_function: (input: SurveyInput) => {
      //   return input.WASH_TYPE === "Pumping";
      // },
      style: {
        cols: "12",
      },
      hideFooterContent: false,
    },
    {
      text: `Water volume (m³/year)`,
      textWarning: "total water volume",
      textWarningDescription:
        "If more or less water is intended to be provided to the camp over time, this warning can be ignored.",
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
        return formatNumberGhg(v, { suffix: args.suffix });
      },
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
      customEventInput: (WASH_TYPE: string, localInput: SurveyInput) => {
        // does not work with reference ?
        // reset all values
        // localInput.fuelType = "CHC";
        // delete localInput.TOT_WS;
        // delete localInput.TR_VOL;
        // delete localInput.fuelUsage;
        localInput = {
          WASH_TYPE,
          WACL: localInput.WACL,
          name: localInput.name,
        };
        // delete localInput.WACL;
        return localInput;
      },
      formatterTableComponent: (
        fuelType: string,
        _: unknown,
        localItem: WashTruckingItem
      ) => {
        const result = [];
        const washType = localItem?.input?.WASH_TYPE as string;
        if (washType === "Pumping") {
          result.push({
            icon: "$mdiWaterPump",
            description: "Pumping from a water source",
            fill: "blue",
          });
        }
        if (washType === "Trucking") {
          result.push({
            icon: "$mdiTankerTruck",
            description: "Trucking from a water source",
            fill: "blue",
          });
        }
        return result;
      },
      items: ["Pumping", "Trucking"],
    },
    // start of pumping
    ...poweredByInputs("Year", this.countryCode, this.project?.solar, {
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Pumping";
      },
      hideFooterContent: true,
    }),

    {
      text: "Trucking unit",
      value: "input.US_UNI",
      type: "select",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking";
      },
      items: [KM, LITERS],
      hideFooterContent: true,
      customEventInput: (
        truckUnit: string,
        localInput: SurveyInput,
        ghgMapRef: ItemReferencesMap
      ) => {
        // does not work with reference ?
        // reset all values
        // localInput.fuelType = "CHC";
        delete localInput.TOT_WS;
        delete localInput.TR_VOL;
        delete localInput.fuelUsage;
        // delete localInput.WACL;

        const emissionFactor =
          localInput.truckType === DIESEL
            ? ghgMapRef.REF_EFF_DIES?.value
            : ghgMapRef.REF_EFF_PET?.value;
        const emissionFactorPerKm =
          localInput.truckType === DIESEL
            ? ghgMapRef.REF_WSH_D?.value
            : ghgMapRef.REF_WSH_G?.value;

        localInput.fuelEfficiency = parseFloat(
          (100 / (emissionFactor / emissionFactorPerKm)).toFixed(1)
        );
        return localInput;
      },
    },
    {
      text: "Distance between the water source and the distribution point",
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
        return formatNumberGhg(v, { suffix: args.suffix });
      },
    },
    {
      text: "Liters of fuel consumed during the year (L/yr)",
      value: "input.fuelUsage",
      tooltipInfo:
        "Even if the duration of use extends to three months, it will still be calculated on an annual basis.",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking" && input.US_UNI === LITERS;
      },
      style: {
        cols: "12",
      },
      type: "number",
      hideFooterContent: true,
      suffix: "L/yr",
      formatter: (v: number, { ...args }) => {
        return formatNumberGhg(v, { suffix: args.suffix });
      },
    },
    {
      text: "Truck fuel effiency (L/100km)",
      value: "input.fuelEfficiency",
      style: {
        cols: "12",
      },
      type: "number",
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking" && input.US_UNI === KM;
      },
      hint: `default fuel efficiency: 8.5L/100km for diesel and 9.1L/100km for petrol`,
      persisenteHint: true,
      hideFooterContent: true,
      suffix: "L/100km",
      formatter: (v: number, { ...args }) => {
        return formatNumberGhg(v, {
          suffix: args.suffix,
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
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
      hideFooterContent: true,
      items: [DIESEL, PETROL],
      conditional_function: (input: SurveyInput) => {
        return input.WASH_TYPE === "Trucking";
      },
      customEventInput: (
        truckType: string,
        localInput: SurveyInput,
        ghgMapRef: ItemReferencesMap
      ) => {
        const emissionFactor =
          truckType === DIESEL
            ? ghgMapRef.REF_EFF_DIES?.value
            : ghgMapRef.REF_EFF_PET?.value;
        const emissionFactorPerKm =
          truckType === DIESEL
            ? ghgMapRef.REF_WSH_D?.value
            : ghgMapRef.REF_WSH_G?.value;

        localInput.fuelEfficiency = parseFloat(
          (100 / (emissionFactor / emissionFactorPerKm)).toFixed(1)
        );
        // 100 / (emissionFactor / emissionFactorPerKm);
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

    ...surveyTableHeaderCO2,
  ].map(ensureSurveyTableHeaders);
}
</script>
