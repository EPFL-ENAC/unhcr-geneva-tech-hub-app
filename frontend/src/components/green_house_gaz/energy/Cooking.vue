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
import BaselineEndlineWrapper, {
  SurveyTableHeader,
} from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";

import { formatNumber } from "@/plugins/filters";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";
import { get as _get } from "lodash";

import { Survey } from "@/store/GhgInterface.vue";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

const fuelTypes = {
  FWD: "Wood",
  CHC: "Charcoal",
  PLTS: "Pellets",
  BRQ: "Briquette",
  ETH: "Ethanol/alcohol",
  KRS: "Kerosene/paraffin",
  PET: "Petrol", // same as wash
  DIES: "Diesel", // same as facilities for diesel gen
  ELE_SOLAR: "Solar", // no eff
  ELE_GRID: "Grid",
  ELE_DIES: "Diesel generators",
  ELE_HYB: "hybrid of multiple",
  THE: "Thermal solar", // no eff
  LPG: "LPG",
  BGS: "BIOGASS",
  PNG: "Piped Natural Gas",
};
// Emission factor for CO2 [ton/ton of fuel] from IPCC
// should be from the GHG_REFERENCE FACTOR
const fuelFactors = {
  FWD: 1.8948,
  CHC: 3.477,
  PLTS: 1.2697,
  BRQ: 1.2697,
  ETH: 1.2391,
  KRS: 2.5595,
  PET: 0, // TODO same as wash
  DIES: 0, // TODO same as facilities for diesel gen
  ELE_SOLAR: 0, // no eff
  ELE_GRID: 0,
  ELE_DIES: 0,
  ELE_HYB: 0,
  THE: 0, // no eff
  LPG: 1.616,
  BGS: 2.4842,
  PNG: 2.4842,
};

// no appliances for now
// const COOK_APP_Pressure = "Pressure cooke";
// const COOK_APP_Heat = "Heat retaining basket";
// const COOK_APP_Other = "Other";

const cookstoveTECHs = [
  {
    _id: "1",
    fuelTypes: [],
    text: "Without any access (no possibility to cook)",
    image: undefined,
  },
  {
    _id: "2",
    fuelTypes: ["FWD", "CHC", "BRQ", "PLTS"],
    text: "Traditional three stone fire",
    image: "/images/energy/cookstoves/traditional-wood.png",
  },
  {
    _id: "3",
    fuelTypes: ["FWD", "CHC", "BRQ", "PLTS"],
    text: "Traditional cookstove with solid biomass fuel",
    image: undefined,
  },
  {
    _id: "4",
    fuelTypes: ["FWD", "CHC", "BRQ", "PLTS"],
    text: "Improved cookstove with solid biomass fuel",
    image: undefined,
  },
  {
    _id: "5",
    fuelTypes: ["FWD", "BRQ", "PLTS"],
    text: "Gasifier stove",
    image: undefined,
  },
  {
    _id: "6",
    fuelTypes: ["ETH", "PET", "DIES", "KRS"],
    text: "Liquid fuel cookstove",
    image: undefined,
  },
  {
    _id: "7",
    fuelTypes: ["LPG", "BGS", "PNG"],
    text: "Gas powered cookstove",
    image: undefined,
  },
  {
    _id: "8",
    fuelTypes: ["ELE_SOLAR", "ELE_GRID", "ELE_DIES", "ELE_HYB"],
    text: "Electric cookstove",
    image: undefined,
  },
  { _id: "9", fuelTypes: ["THE"], text: "Solar cooker", image: undefined },
];
const APPLIANCE_EFFICIENCY = 1;
const REF_DRY_WOOD = 0.85; // weird; we're missing information
const fNRB = 1; // should be from GHG_RFERENCE TABLE

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

  @Prop([Object, Array])
  readonly survey: Survey | undefined;

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

  // should be a getter so it may be reactive for fuelTypes
  public get headers(): SurveyTableHeader[] {
    // public get headers(): any {
    return [
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
        formatter: (_id: string) => {
          return (
            cookstoveTECHs.find((cookstove) => cookstove._id === _id)?.text ??
            "Unknown"
          );
        },
        customEventInput: (
          cookstoveId: string,
          localInput: EnergyCookingItemInput
        ) => {
          console.log(cookstoveId, localInput);
          // does not work with reference ?
          // change the fuel types items dynamically
          const currentStove = cookstoveTECHs.find(
            (cookstove) => cookstove._id === cookstoveId
          );

          // // find cooktstove
          if (currentStove) {
            localInput.fuelTypes = currentStove.fuelTypes;
          }
          return localInput;
        },
      },
      {
        items: "input.fuelTypes",
        style: {
          cols: "12",
        },
        text: "Cookstove fuel",
        value: "input.fuelType",
        formatter: (v: keyof typeof fuelTypes) => {
          return fuelTypes[v];
        },
        isInput: true,
        type: "select",
        hideFooterContent: false,
      },
      // TODO: dynamic text depending on fuelType --> COMPLICATED
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
        text: "Cookstove appliance",
        value: "input.appliance",
        items: ["default", "Pressure cooker", "Heat retaining basket"],
        style: {
          cols: "12",
        },
        type: "select",
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
          return formatNumber(v, {
            style: "percent",
            signDisplay: "exceptZero",
          });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].map((item: any) => {
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
        options: (() => {
          const items = item?.items;
          if (typeof items === "string") {
            // todo find another thing.
            return [];
          }
          return (
            items?.map((item: string | SelectCustom<string>) => {
              if (typeof item === "string") {
                return { text: item, value: item };
              }
              return {
                text: item?.text,
                value: item?._id,
              };
            }) ?? undefined
          );
        })(),
        ...item,
      } as SurveyTableHeader;
    });
  }
}

export interface SelectCustom<V> {
  text: string;
  _id: V;
}

export interface EnergyCookingItemInput extends SurveyInput {
  numberOfCookstove: number; // computed based on % of HH and stuffs
  fuelUsage: number; // [kg or L/day]
  cookTechno: string;
  fuelType: string; // key
  fuelTypes: string[];
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
