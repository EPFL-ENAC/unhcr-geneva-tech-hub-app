<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <!-- <baseline-endline-wrapper
      v-model="localForm"
      :headers="headers"
      :diff-dimension="diffDimension"
      :compute-item="computeItem"
      :name="name"
    /> -->
  </v-container>
</template>

<script lang="ts">
import BaselineEndlineWrapper from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import { formatNumber } from "@/plugins/filters";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";

import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

// const Wood = "Wood";
// const Charcoal = "Charcoal";
// const Pellets = "Pellets";
// const Ethanol = "Ethanol";
// const Kerosene = "Kerosene";
// const Electric = "Electric";
// const Thermal = "Thermal solar";
// const LPG = "LPG";
// const BIOGAS = "BIOGAS";
// const UNKNOWN = "UNKNOWN";

// const COOK_APP_Pressure = "Pressure cooke";
// const COOK_APP_Heat = "Heat retaining basket";
// const COOK_APP_Other = "Other";

const COOK_APP_CONV = "CONVENTIONAL";
const COOK_APP_CLEAN = "Clean";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
})
export default class Trucking extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: EnergyCookingSurvey;

  diffDimension: keyof EnergyCookingItemInput = "cardinal";
  name = "cookstove";

  public get title(): string {
    return this.titleKey;
  }
  public get localForm(): EnergyCookingSurvey {
    return this.form;
  }

  public set localForm(value: EnergyCookingSurvey) {
    this.$emit("update:form", value);
  }

  public computeItem(
    localItemInput: EnergyCookingItemInput
  ): EnergyCookingItemResults {
    return {
      totalCO2Emission: localItemInput.cardinal * 30,
    };
  }

  n2sFormatter(n: number): string {
    // https://stackoverflow.com/a/30686832
    let s = "";
    if (!n) s = "a";
    else
      while (n) {
        s = String.fromCharCode(97 + (n % 26)) + s;
        n = Math.floor(n / 26);
      }
    return s;
  }

  readonly headers = [
    {
      text: "#", // unique name === dropdown of existant facilities
      value: "increment",
      type: "number",
      hideFooterContent: false,
      formatter: (value: number) => {
        // https://stackoverflow.com/a/30686832
        function n2s(n: number) {
          let s = "";
          if (!n) s = "a";
          else
            while (n) {
              s = String.fromCharCode(97 + (n % 26)) + s;
              n = Math.floor(n / 26);
            }
          return s;
        }
        return n2s(value);
      },
    },
    {
      text: "Intervention",
      value: "input.description",
      type: "text",

      endlineOnly: true,
      hideFooterContent: false,
    },
    {
      text: "Number of cookstove",
      value: "input.TR_VOL",
      conditional_value: "KM",
      conditional: "US_UNI",
      style: {
        cols: "12",
      },
      type: "number",
    },
    {
      text: "Cookstove techno",
      value: "input.cookTechno",
      type: "select",
      hideFooterContent: false,
      items: [COOK_APP_CONV, COOK_APP_CLEAN],
    },
    {
      text: "Cookstove fuel",
      value: "input.fuelType",
      type: "select",
      hideFooterContent: false,
      items: [],
    },
    {
      text: "Total CO2 Emissions (tCO2e/year)",
      value: "computed.totalCO2Emission",
      hideFooterContent: false,
      formatter: (v: number, { ...args }) => {
        return formatNumber(v, { suffix: args.suffix });
      },
      type: "number",
      disabled: true,
    },
    {
      text: "Change in Emissions",
      value: "computed.changeInEmission",
      type: "number",
      hideFooterContent: false,
      disable: true,
      readonly: true,
      endlineOnly: true,
      formatter: (v: number) => {
        return formatNumber(v, { style: "percent", signDisplay: "exceptZero" });
      },
      classFormatter: (v: number): string => {
        const classes: string[] = [];
        v > 0 ? classes.push("item-positive") : void 0;
        v < 0 ? classes.push("item-negative") : void 0;
        v === 0 ? classes.push("bold-table-content") : void 0;
        return classes.join(" ");
      },
    },
    {
      text: "",
      value: "actions",
      hidden: true,
      hideFooterContent: false,
      width: "140px",
    },
  ].map((item) => {
    const [category, key] = item.value.split(".");
    const isInput = category === "input";
    return {
      align: "start",
      sortable: false,
      hideFooterContent: item.hideFooterContent ?? true,
      label: item.text, // for form-item-component
      key, // for form-item-component
      isInput,
      category, // input or computed,
      formatter: (value: unknown) => value,
      classFormatter: () => "",
      options:
        item?.items?.map((item) => ({ text: item, value: item })) ?? undefined,
      ...item,
    };
  });
}

export interface EnergyCookingItemInput extends SurveyInput {
  cookTechno: string;
  fuelType: string;
  cardinal: number;
}

export interface EnergyCookingItemResults extends SurveyResult {
  totalCO2Emission: number;
}
export interface EnergyCookingItem extends SurveyItem {
  input: EnergyCookingItemInput;
  computed: EnergyCookingItemResults;
}

export interface EnergyCookingItemResultsBalance extends SurveyResult {
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface EnergyCookingItemResultsWithBalance
  extends EnergyCookingItemResults,
    EnergyCookingItemResultsBalance {}

export type EnergyCookingSurvey = GenericFormSurvey<
  EnergyCookingItem,
  EnergyCookingItemResults,
  EnergyCookingItem,
  EnergyCookingItemResultsWithBalance
>;
</script>
