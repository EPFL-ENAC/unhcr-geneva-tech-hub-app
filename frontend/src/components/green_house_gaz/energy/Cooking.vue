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

import { computeLitresPerDayDiesel } from "@/components/green_house_gaz/energy/computeCO2cost";
import { formatNumber } from "@/plugins/filters";
import {
  DieselItem,
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
  ELE_DIES: "Diesel generators",
  ELE_GRID: "National Grid",
  ELE_SOLAR: "Solar Energy", // no eff
  ELE_HYB: "Hybrid Mix",
  ELE_NONE: "Not powered",
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

const biomassFuels = ["FWD", "CHC", "BRQ", "PLTS"];
const biomassFulesWithoutCHC = ["FWD", "BRQ", "PLTS"];
const liquidFuels = ["ETH", "PET", "DIES", "KRS"];
const gasFuels = ["LPG", "BGS", "PNG"];
const electricFuels = [
  "ELE_DIES",
  "ELE_GRID",
  "ELE_SOLAR",
  "ELE_HYB",
  "ELE_NONE",
];
const thermalFuels = ["THE"];

const allFuelsButElectric = biomassFuels
  .concat(liquidFuels)
  .concat(gasFuels)
  .concat(thermalFuels);

const cookstoveTECHs = [
  {
    _id: "1",
    fuelTypes: [],
    text: "Without any access (no possibility to cook)",
    image: undefined,
  },
  {
    _id: "2",
    fuelTypes: biomassFuels,
    text: "Traditional three stone fire",
    image: "/images/energy/cookstoves/traditional-wood.png",
  },
  {
    _id: "3",
    fuelTypes: biomassFuels,
    text: "Traditional cookstove with solid biomass fuel",
    image: undefined,
  },
  {
    _id: "4",
    fuelTypes: biomassFuels,
    text: "Improved cookstove with solid biomass fuel",
    image: undefined,
  },
  {
    _id: "5",
    fuelTypes: biomassFulesWithoutCHC,
    text: "Gasifier stove",
    image: undefined,
  },
  {
    _id: "6",
    fuelTypes: liquidFuels,
    text: "Liquid fuel cookstove",
    image: undefined,
  },
  {
    _id: "7",
    fuelTypes: gasFuels,
    text: "Gas powered cookstove",
    image: undefined,
  },
  {
    _id: "8",
    fuelTypes: electricFuels,
    text: "Electric cookstove",
    image: undefined,
  },
  { _id: "9", fuelTypes: thermalFuels, text: "Solar cooker", image: undefined },
];

const cookstoveTECHsWithAccess = cookstoveTECHs.slice(1);
const cookstoveIdsTECHsWithAccess = cookstoveTECHsWithAccess.map(
  (cookstove) => cookstove._id
);
const cookstoveIdWithoutAccess = "1";
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
      ((numberOfCookstove ?? 0) * // TODO: NEED FORMULA to be implemented
        (fuelUsage ?? 0) * // use selection --> there wiill be a type of formula oer type of fuel
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

  resetSurveyInput(localInput: EnergyCookingItemInput): EnergyCookingItemInput {
    delete localInput.fuelType;
    delete localInput.numberOfCookstove; // percentage of percentage
    return this.resetSurveyFuelOption(localInput);
  }

  resetSurveyFuelOption(
    localInput: EnergyCookingItemInput
  ): EnergyCookingItemInput {
    delete localInput.fuelUsage;
    delete localInput.sustainablySourced;
    localInput.chcProcessingFactor = 6; // default factor of 6.
    delete localInput.dryWood;
    delete localInput.carbonized;
    delete localInput.appliance;

    delete localInput.disableDieselLiters; // do I know the total litres of diesels
    localInput.generatorLoad = 0.6; // default factor of 60%
    delete localInput.generatorSize;
    delete localInput.operatingHours;
    delete localInput.dieselLiters;

    delete localInput.solarInstalled;

    return localInput;
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
          const currentStove = cookstoveTECHs.find(
            (cookstove) => cookstove._id === cookstoveId
          );

          // // find cooktstove
          if (currentStove) {
            localInput.fuelTypes = currentStove.fuelTypes;
          }
          this.resetSurveyInput(localInput);
          return localInput;
        },
      },
      {
        conditional_value: cookstoveIdsTECHsWithAccess,
        conditional: "cookstove",
        items: "input.fuelTypes",
        style: {
          cols: "12",
        },
        text: "Cookstove fuel",
        value: "input.fuelType",
        formatter: (v: keyof typeof fuelTypes) => {
          return fuelTypes[v];
        },
        customEventInput: (
          fuelType: string,
          localInput: EnergyCookingItemInput
        ) => {
          this.resetSurveyFuelOption(localInput);
          return localInput;
        },
        isInput: true,
        type: "select",
        hideFooterContent: false,
      },
      {
        text: (localInput: EnergyCookingItemInput) => {
          let result = "Fuel per day (kg/day for biomass)";
          // original text: "Fuel per day (kg/day for biomass)"
          const biomassFuelsText =
            "Biomass used per HH per day (kg/day for biomass)";
          const liquidFuelsText = "Fuel use per HH per day  (L/day)";
          const gasFuelsText = "Fuel use per HH per day (m3/day)";
          const electricFuelsText = "Estimated Kwh/day/HH";
          const thermalFuelsText = "Estimated Kwh/day/HH";

          const refTexts = [
            { fuelTypes: biomassFuels, text: biomassFuelsText },
            { fuelTypes: liquidFuels, text: liquidFuelsText },
            { fuelTypes: gasFuels, text: gasFuelsText },
            { fuelTypes: electricFuels, text: electricFuelsText },
            { fuelTypes: thermalFuels, text: thermalFuelsText },
          ];
          refTexts.every((refText) => {
            if (refText.fuelTypes.includes(localInput.fuelType ?? "")) {
              result = refText.text;
              return false;
            }
            return true;
          });
          return result;
        },
        value: "input.fuelUsage",
        conditional_value: allFuelsButElectric,
        conditional: "fuelType",
        style: {
          cols: "12",
        },
        type: "number",
      },
      // beginning of diesel generators
      {
        value: "input.disableDieselLiters",
        conditional_value: ["ELE_DIES", "ELE_HYB"],
        text: "I do know the total litres of diesel used",
        conditional: "fuelType",
        style: {
          cols: "12",
        },
        options: {
          false: "yes",
          true: "no",
        },
        type: "boolean",
      },
      {
        value: "input.dieselLiters", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: false,
        conditional: "disableDieselLiters",
        text: "Total litres of diesel used per day",
        suffix: "l",
        style: {
          cols: "12",
        },
        type: "number",
      },
      {
        value: "input.generatorSize", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: true,
        conditional: "disableDieselLiters",
        text: "generator size (kW)",
        tooltipInfo: "read from nameplate",
        suffix: "kW",
        min: 0,
        style: {
          cols: "12",
        },
        type: "number",
        customEventInput: (_: number, localInput: EnergyCookingItemInput) => {
          localInput.dieselLiters = computeLitresPerDayDiesel(localInput);
          return localInput;
        },
      },
      {
        value: "input.generatorLoad", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: true,
        conditional: "disableDieselLiters",
        text: "generator load (percentage)",
        tooltipInfo:
          "default average load of 60% per year will be used if not overwritten",
        style: {
          cols: "12",
        },
        type: "number",
        subtype: "percent",
      },
      {
        value: "input.operatingHours", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: true,
        conditional: "disableDieselLiters",
        text: "operating hours (hrs/day)",
        tooltipInfo:
          "from daily log and application will extrapolate this information to be annual",
        suffix: "hrs/day",
        style: {
          cols: "12",
        },
        type: "number",
      },
      // end of diesel generators
      // begingin og national grid
      {
        value: "input.fuelUsage", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_GRID", "ELE_HYB"],
        conditional: "fuelType",
        text: "Estimated Kwh/day/HH for national grid",
        suffix: "Kwh/day/HH",
        style: {
          cols: "12",
        },
        type: "number",
      },
      // end of national grid
      // begingin of solar
      {
        value: "input.solarInstalled", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_SOLAR", "ELE_HYB"],
        conditional: "fuelType",
        customEventInput: (
          solarInstalled: number,
          localInput: EnergyCookingItemInput
        ) => {
          localInput.fuelUsage = solarInstalled * 5.6; // TODO: better formula to be given
          return localInput;
        },
        text: "Total kW of solar installed per HH",
        suffix: "Kw/HH",
        style: {
          cols: "12",
        },
        type: "number",
      },
      {
        value: "input.fuelUsage", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_SOLAR", "ELE_HYB"],
        disabled: true,
        text: "Total kWh/day produced (estimated)",
        conditional: "fuelType",
        suffix: "Kwh/day/HH",
        style: {
          cols: "12",
        },
        type: "number",
      },
      // end of solar
      {
        conditional_value: biomassFulesWithoutCHC,
        conditional: "fuelType",
        text: "Sustainably sourced biomass",
        style: {
          cols: "12",
        },
        value: "input.sustainablySourced",
        type: "boolean",
      },
      {
        conditional_value: "CHC",
        conditional: "fuelType",
        text: "Processing factor for charcoal",
        style: {
          cols: "12",
        },
        default_value: "6", // TODO fix to number
        value: "input.chcProcessingFactor",
        type: "number",
      },
      {
        conditional_value: "FWD",
        conditional: "fuelType",
        text: "Dry wood",
        style: {
          cols: "12",
        },
        value: "input.dryWood",
        type: "boolean",
      },
      {
        conditional_value: "BRQ",
        conditional: "fuelType",
        text: "carbonized or non-carbonized", // toggle button ?
        value: "input.carbonized",
        options: {
          true: "carbonized",
          false: "non-carbonized",
        },
        type: "boolean",
      },
      {
        conditional_value: "",
        conditional: ["fuelUsage", "dieselLiters"],
        text: "Cookstove appliance",
        value: "input.appliance",
        items: ["default", "Pressure cooker", "Heat retaining basket"],
        style: {
          cols: "12",
        },
        type: "select",
      },
      {
        text: "Percentage of total cookstove of this type",
        computeResults: true,
        value: "input.numberOfCookstove",
        conditional_value: ["", cookstoveIdWithoutAccess],
        conditional: ["appliance", "cookstove"],
        style: {
          cols: "12",
        },
        max: 100,
        subtype: "percent",
        type: "number", // TODO should be able to use percentage type
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
          if (item.options) {
            return item.options;
          }
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

export interface EnergyCookingItemInput extends SurveyInput, DieselItem {
  numberOfCookstove?: number; // computed based on % of HH and stuffs
  fuelUsage?: number; // [kg or L/day]
  fuelType?: string; // key
  fuelTypes?: string[]; // used only as a reference // TODO should not be stored in input
  appliance?: string; // type of appliance heating retaining basket for instance
  carbonized?: boolean;
  sustainablySourced?: boolean;
  chcProcessingFactor?: number; // default to 6
  dryWood?: boolean;
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
