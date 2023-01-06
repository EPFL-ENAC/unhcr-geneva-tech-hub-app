<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <baseline-endline-wrapper
      v-model="localForm"
      :headers="headers"
      :diff-dimension="diffDimension"
      :compute-item="computeItem"
      :name="name"
    />
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
import { get as _get } from "lodash";

import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

const fuelTypes = {
  FWD: "Wood",
  CHC: "Charcoal",
  PLTS: "Pellets",
  BRQ: "Briquette",
  ETH: "ETHANOL",
  KRS: "KEROSENE",
  ELE: "Electric", // no eff
  THE: "Thermal solar", // no eff
  CNDL: "candle", // no use
  LPG: "LPG",
  BGS: "BIOGASS",
  UNK: "UNKNOWN",
};
// TODO: findout if it's ever used ?
const cookstoveTypes = {
  UNK: "UNKNOWN",
  CONV: "CONVENTIONAL",
  IMPR: "IMPROVED",
  TRAD: "Traditional",
};

// no appliances for now
// const COOK_APP_Pressure = "Pressure cooke";
// const COOK_APP_Heat = "Heat retaining basket";
// const COOK_APP_Other = "Other";

const cookstoveTECHs = [
  {
    _id: "1",
    text: "Without any access (no possibility to cook)",
    image: undefined,
    fuelType: "UNK",
    type: "UNK",
  },
  {
    _id: "2",
    text: "Using firewood traditional (three stone)",
    image: "/images/energy/cookstoves/traditional-wood.png",
    fuelType: "FWD",
    type: "TRAD",
  },
  {
    _id: "3",
    text: "Using charcoal (traditional)",
    image: undefined,
    fuelType: "CHC",
    type: "TRAD",
  },
  {
    _id: "4",
    text: "Using firewood improved cookstove",
    image: undefined,
    fuelType: "FWD",
    type: "IMPR",
  },
  {
    _id: "5",
    text: "Using charcoal improved cookstove",
    image: undefined,
    fuelType: "CHC",
    type: "IMPR",
  },
  {
    _id: "6",
    text: "Using briquettes and improved cookstove",
    image: undefined,
    fuelType: "BRQ",
    type: "IMPR",
  },
  {
    _id: "7",
    text: "Using pelets and improved cookstove",
    image: "/images/energy/cookstoves/gasifier.png",
    fuelType: "PLTS",
    type: "IMPR",
  },
  {
    _id: "8",
    text: "Using firewood with gasifier",
    image: undefined,
    fuelType: "FWD",
    type: "IMPR",
  },
  {
    _id: "9",
    text: "Using charcoal with gasifier",
    image: undefined,
    fuelType: "CHC",
    type: "IMPR",
  },
  {
    _id: "10",
    text: "Using briquette with gasifier",
    image: undefined,
    fuelType: "BRQ",
    type: "IMPR",
  },
  {
    _id: "11",
    text: "Using ethanol",
    image: "/images/energy/cookstoves/ethanol.png",
    fuelType: "ETH",
    type: "CONV",
  },
  {
    _id: "12",
    text: "Using LPG",
    image: "/images/energy/cookstoves/biogas.png",
    fuelType: "LPG",
    type: "CONV",
  },
  {
    _id: "13",
    text: "Using biogas",
    image: undefined,
    fuelType: "BGS",
    type: "CONV",
  },
  {
    _id: "14",
    text: "Using kerosene",
    image: undefined,
    fuelType: "KRS",
    type: "CONV",
  },
  {
    _id: "15",
    text: "Connected to the national grid",
    image: undefined,
    fuelType: "ELE",
    type: "CONV",
  },
  {
    _id: "16",
    text: "Using electricity from diesel generators",
    image: undefined,
    fuelType: "ELE", // TODO fixme with new fuel type ?
    type: "CONV",
  },
  {
    _id: "17",
    text: "Using electricity from 100% renewable minigrid (solar PV + batteries)",
    image: "/images/energy/cookstoves/solar-box.png",
    fuelType: "ELE", // TODO fixme with new fuel type efficiency ?
    type: "CONV",
  },
  {
    _id: "18",
    text: "Using electricity from hybrid micro-grid (DG+Solar PV+ grid)",
    image: undefined,
    fuelType: "ELE",
    type: "CONV",
  },
];
const APPLIANCE_EFFICIENCY = 1;
const REF_DRY_WOOD = 0.85; // weird; we're missing information
const fNRB = 1;

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

  diffDimension: keyof EnergyCookingItemInput = "numberOfCookstove";
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
    localItemInput: EnergyCookingItemInput,
    ghgMapRef: ItemReferencesMap
  ): EnergyCookingItemResults {
    const { numberOfCookstove, fuelUsage, fuelType } = localItemInput;
    /*
     **  CO2 Emissions =
     **      Number_of_Cookstove
     **    * FUEL_USAGE [kg or L/day]
     **    * 365,25 [Days/Yr]
     **    * REF_EF_{FUEL} // TODO have a matching table between fuel type and REF_EFF
     **    * TIME_EFFICIENCY
     **    * fNRB
     **    * REF_DRY_WOOD
     **    * (IF CHARCOAL=YES : Wood_to_charcoal factor a.k.a 6)
     **    / 1000 [kg/t]
     */
    const totalCO2Emission =
      (numberOfCookstove * // NEED FORMULA
        fuelUsage * // use selection
        365.25 *
        ghgMapRef?.[`REF_EFF_${fuelType}`]?.value ??
        1 *
          APPLIANCE_EFFICIENCY * // should be 1 for now (1 - 0.7 or 0.3 depending on appliances)
          fNRB * // country or default value of 0.76 or 0.85 who knows or 1 if not in list of fuel
          REF_DRY_WOOD * // should be 1 for now
          (fuelType === "CHC" ? 6 : 1)) / 1000;
    return {
      totalCO2Emission,
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
      baselineOnly: true,
      formatter: this.n2sFormatter,
    },
    {
      text: "#", // unique name === dropdown of existant facilities
      value: "originIncrement",
      endlineOnly: true,
      type: "number",
      hideFooterContent: false,
      formatter: (
        v: number,
        _: unknown,
        item: SurveyItem,
        items: SurveyItem[]
      ) => {
        const increment: number = _get(item, "increment");
        // todo finish custom increment function
        const increments = items
          .filter((item: SurveyItem) => item.originIncrement === v)
          .map((item: SurveyItem) => item.increment);
        const indexOf = increments.indexOf(increment);
        return `${this.n2sFormatter(v)}${"'".repeat(indexOf)}`;
      },
      formatterOrigin: (v: number) => {
        return `${this.n2sFormatter(v)}`;
      },
    },
    {
      text: "Cookstove",
      value: "input.cookstove",
      type: "select",
      style: {
        cols: "12",
      },
      hideFooterContent: false,
      items: cookstoveTECHs,
      customEventInput: (cookstoveId: string, localInput: SurveyInput) => {
        console.log(cookstoveId, localInput);
        // does not work with reference ?
        localInput.fuelType = "CHC";
        return localInput;
      },
    },
    {
      text: "Fuel per day (kg/day for biomass)",
      value: "input.fuelUsage",
      conditional_value: "",
      conditional: "cookstove",
      style: {
        cols: "12",
      },
      type: "number",
    },

    {
      text: "Number of cookstove",
      computeResults: true,
      value: "input.numberOfCookstove",
      conditional_value: "",
      conditional: "fuelUsage",
      style: {
        cols: "12",
      },
      type: "number",
    },
    {
      text: "Cookstove fuel",
      value: "input.fuelType",
      formatter: (v: keyof typeof fuelTypes) => {
        return fuelTypes[v];
      },
      isInput: false,
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
      computeResults: true,
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
    const isInput = item?.isInput ?? category === "input";
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
        item?.items?.map((item) => {
          if (typeof item === "string") {
            return { text: item, value: item };
          }
          return {
            text: item?.text,
            value: item?._id,
          };
        }) ?? undefined,
      ...item,
    };
  });
}

export interface EnergyCookingItemInput extends SurveyInput {
  numberOfCookstove: number; // computed based on % of HH and stuffs
  fuelUsage: number; // [kg or L/day]
  cookTechno: string;
  fuelType: string; // key
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
