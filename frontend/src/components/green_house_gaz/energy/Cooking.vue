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

import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

import {
  computeCO2CostFacilities,
  computeDieselPower,
  computeKWHPerDayPerCountry,
  computeLitresPerDayDiesel,
  countryIrradianceKeys,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import { formatNumber } from "@/plugins/filters";
import {
  DieselItem,
  EnergyItem,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";
import { get as _get } from "lodash";

import { GreenHouseGaz, Survey } from "@/store/GhgInterface.vue";
import { GHGfNRB } from "@/store/GHGReferencefNRB";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

// START LEGACY -- moved to ~/components/ghg/fuelTypes.ts
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
// default consumption value
const fuelDefaultConsumption: Record<keyof typeof fuelTypes, number> = {
  FWD: 8.5,
  CHC: 4.5,
  PLTS: 5,
  BRQ: 5,
  ETH: 1,
  KRS: 1,
  PET: 1,
  DIES: 1,
  ELE_SOLAR: 0, // no eff
  ELE_GRID: 3,
  ELE_DIES: 1,
  ELE_HYB: 0,
  ELE_NONE: 0,
  THE: 0, // no eff
  LPG: 0.43,
  BGS: 0.43,
  PNG: 0.43,
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

// end legacy -- TODO import
interface CookstoveTech {
  _id: string;
  fuelTypes: string[];
  text: string;
  image: string | undefined;
}

const cookstoveTECHs: CookstoveTech[] = [
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
    image: "/images/energy/cookstoves/traditional-bricket.jpg",
  },
  {
    _id: "4",
    fuelTypes: biomassFuels,
    text: "Improved cookstove with solid biomass fuel",
    image: "/images/energy/cookstoves/improved-bricket.jpg",
  },
  {
    _id: "5",
    fuelTypes: biomassFulesWithoutCHC,
    text: "Gasifier stove",
    image: "/images/energy/cookstoves/gasifier.png",
  },
  {
    _id: "6",
    fuelTypes: liquidFuels,
    text: "Liquid fuel cookstove",
    image: "/images/energy/cookstoves/kerosene.png",
  },
  {
    _id: "7",
    fuelTypes: gasFuels,
    text: "Gas powered cookstove",
    image: "/images/energy/cookstoves/lpg.png",
  },
  {
    _id: "8",
    fuelTypes: electricFuels,
    text: "Electric cookstove",
    image: "/images/energy/cookstoves/induction.png",
  },
  {
    _id: "9",
    fuelTypes: thermalFuels,
    text: "Solar cooker",
    image: "/images/energy/cookstoves/solar-parabolic.png",
  },
];

const cookstoveTECHsWithAccess = cookstoveTECHs.slice(1);
const cookstoveIdsTECHsWithAccess = cookstoveTECHsWithAccess.map(
  (cookstove) => cookstove._id
);
const cookstoveIdWithoutAccess = "1";
const APPLIANCE_EFFICIENCY = 1;
const REF_DRY_WOOD = 1;
const REF_WET_WOOD = 0.15; // 15% less efficient\
const REF_SUSTAINED_WOOD = 0; // fNRB of sustained

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
    ...mapGetters("GHGReferencefNRB", ["items"]),
  },
})
export default class Cooking extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: EnergyCookingSurvey;

  @Prop([Object, Array])
  readonly survey: Survey | undefined;

  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: countryIrradianceKeys;

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;
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

  private applianceEfficiency(name: string): number {
    let app_eff = APPLIANCE_EFFICIENCY;
    switch (name) {
      case "Pressure cooker":
        app_eff = app_eff - 0.7;
        break;
      case "Heat retaining basket":
        app_eff = app_eff - 0.3;
        break;
      default:
        break;
    }
    return app_eff;
  }

  private getLocalFNRB(
    countryCode: string,
    default_fNRB: number | undefined,
    sustainablySourced: boolean | undefined
  ): number {
    if (default_fNRB == undefined) {
      const errorMessage = `there are default fNRB ${default_fNRB}`;
      throw new Error(errorMessage);
    }
    const countryfNRB = this.items.find((x) => x._id === countryCode);
    let localFNRB = countryfNRB?.value ?? default_fNRB;

    if (sustainablySourced) {
      localFNRB = REF_SUSTAINED_WOOD;
    }
    return localFNRB;
  }

  private computeItemElectric(
    localItemInput: EnergyCookingItemInput,
    ghgMapRef: ItemReferencesMap,
    hhUsingTheFuel: number,
    applianceEff: number
  ): number {
    let totalCO2Emission = 0;
    switch (localItemInput.fuelType) {
      case "ELE_HYB":
      case "ELE_GRID":
      case "ELE_DIES":
        totalCO2Emission =
          computeCO2CostFacilities(
            localItemInput,
            ghgMapRef?.REF_DIES_L,
            this.project_REF_GRD
          ) *
          hhUsingTheFuel *
          applianceEff *
          365.25;
        break;
      case "ELE_SOLAR":
      case "ELE_NONE":
      default:
        break;
    }
    return totalCO2Emission;
  }

  public computeItem(
    localItemInput: EnergyCookingItemInput,
    ghgMapRef: ItemReferencesMap
  ): EnergyCookingItemResults {
    if (this.project === undefined) {
      throw new Error("project undefined");
    }
    const {
      numberOfCookstove: percentageOfTotalCookstove,
      fuelUsage,
      fuelType,
      appliance,
    } = localItemInput;
    if (fuelType === undefined) {
      throw new Error("fuel type not defined");
    }
    if (percentageOfTotalCookstove === undefined) {
      throw new Error("number of cooktsove not defined");
    }
    if (appliance === undefined) {
      throw new Error("appliance not defined");
    }
    if (this.project.totalCookstoves === undefined) {
      throw new Error("Total cookstoves is undefined, please fill info page");
    }
    const hhUsingTheFuel =
      percentageOfTotalCookstove * this.project.totalCookstoves; // number of cookstoves
    let totalCO2Emission = 0;

    const applianceEff = this.applianceEfficiency(appliance);
    switch (true) {
      /* solid fuels "FWD", "CHC", "BRQ", "PLTS" */
      case biomassFuels.includes(fuelType): {
        /*
          - Three version for the fnrb factor
            - briket and pellets
            - wood same as bricket + dry factor
            - charcoal same as bricket but fnrb factor is combustion + production
         */
        if (fuelUsage === undefined) {
          throw new Error("fuel usage not defined");
        }
        let drynessFactor = REF_DRY_WOOD;
        if (!localItemInput.dryWood && fuelType === "FWD") {
          drynessFactor = drynessFactor + REF_WET_WOOD;
        }
        const localFNRB = this.getLocalFNRB(
          this.project.country_code,
          ghgMapRef?.REF_FNRB?.value,
          localItemInput.sustainablySourced
        );

        let efficiencyFactor = 1;
        if (fuelType === "CHC") {
          const fuelEfficiencyC = ghgMapRef?.[`REF_EFF_${fuelType}_C`]?.value;
          if (fuelEfficiencyC == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelType}_C`;
            throw new Error(errorMessage);
          }
          const fuelEfficiencyP = ghgMapRef?.[`REF_EFF_${fuelType}_P`]?.value;
          if (fuelEfficiencyP == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelType}_P`;
            throw new Error(errorMessage);
          }
          const nonCO2FractionC =
            ghgMapRef?.[`REF_NONCO2_${fuelType}_C`]?.value;
          if (nonCO2FractionC == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelType}_C`;
            throw new Error(errorMessage);
          }
          const nonCO2FractionP =
            ghgMapRef?.[`REF_NONCO2_${fuelType}_P`]?.value;
          if (nonCO2FractionP == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelType}_P`;
            throw new Error(errorMessage);
          }

          efficiencyFactor =
            (localFNRB + (1 - localFNRB) * nonCO2FractionC) * fuelEfficiencyC +
            (localFNRB + (1 - localFNRB) * nonCO2FractionP) * fuelEfficiencyP;
        } else {
          const fuelEfficiency = ghgMapRef?.[`REF_EFF_${fuelType}`]?.value;
          if (fuelEfficiency == undefined) {
            const errorMessage = `there are no emission factor REF_EFF_${fuelType}`;
            throw new Error(errorMessage);
          }
          const nonCO2Fraction = ghgMapRef?.[`REF_NONCO2_${fuelType}`]?.value;
          if (nonCO2Fraction == undefined) {
            const errorMessage = `there are no nonCO2Fraction factor REF_NONCO2_${fuelType}`;
            throw new Error(errorMessage);
          }
          // for "FWD", "BRQ", "PLTS"
          efficiencyFactor =
            (localFNRB + (1 - localFNRB) * nonCO2Fraction) * fuelEfficiency;
        }
        totalCO2Emission =
          hhUsingTheFuel *
          fuelUsage * // fuel consumed in kg / day
          applianceEff * // should be 1 for now (1 - 0.7 or 0.3 depending on appliances)
          drynessFactor * // only for wood but since it's 1 as default it's going to be okay
          0.001 * // 1t/1000kg
          365.25 * // days/yr
          efficiencyFactor;
        break;
      }
      case liquidFuels.includes(fuelType as string):
      case gasFuels.includes(fuelType as string): {
        if (fuelUsage === undefined) {
          throw new Error("fuel usage not defined");
        }
        const fuelEfficiency = ghgMapRef?.[`REF_EFF_${fuelType}`]?.value;
        if (fuelEfficiency == undefined) {
          const errorMessage = `there are no emission factor REF_EFF_${fuelType}`;
          throw new Error(errorMessage);
        }
        totalCO2Emission =
          hhUsingTheFuel *
          fuelUsage * // fuel consumed in kg / day
          applianceEff * // should be 1 for now (1 - 0.7 or 0.3 depending on appliances)
          0.001 * // 1t/1000kg
          365.25 * // days/yr
          fuelEfficiency;
        break;
      }
      case electricFuels.includes(fuelType):
        totalCO2Emission = this.computeItemElectric(
          localItemInput,
          ghgMapRef,
          hhUsingTheFuel,
          applianceEff
        );
        break;
      default:
        throw new Error(`unknown fuel type ${fuelType}`);
    }
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is NaN`);
    }
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
    const countryCode = this.countryCode;
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
        image: true,
        style: {
          cols: "12",
        },
        hideFooterContent: false,
        items: cookstoveTECHs,
        formatter: (_id: string) => {
          const cookStove =
            cookstoveTECHs.find((cookstove) => cookstove._id === _id) ??
            ({
              text: "Unknown",
            } as CookstoveTech);
          const name = cookStove?.text ?? "Unknown";

          return `
          <div class="d-flex justify-left align-center">
            ${
              cookStove?.image
                ? `<img width="64px" height="64px" src='${
                    cookStove?.image ?? ""
                  }'/>`
                : `<span class="ml-16"></span>`
            }
            <span class="ml-4">${name}</span>
          </div>
          `;
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
            localInput.image = currentStove.image;
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
          localInput.appliance = "default";
          // setup default value based on fueltype
          localInput.fuelUsage =
            fuelDefaultConsumption?.[fuelType as keyof typeof fuelTypes] ?? 0;

          return localInput;
        },
        isInput: true,
        type: "select",
        hideFooterContent: false,
      },
      {
        conditional_value: "",
        // conditional: ["fuelUsage", "dieselLiters"],
        conditional: ["fuelType"],
        text: "Cookstove appliance",
        value: "input.appliance",
        items: ["default", "Pressure cooker", "Heat retaining basket"],
        style: {
          cols: "12",
        },
        type: "select",
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
        text: "Number of litres of diesel known",
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
        value: "input.dieselLiters", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
        conditional_value: false,
        conditional: "disableDieselLiters",
        text: "Total litres of diesel used per day",
        suffix: "l",
        style: {
          cols: "12",
        },
        type: "number",
        customEventInput: (
          _: number,
          localInput: EnergyCookingItemInput,
          ghgMapRef: ItemReferencesMap
        ) => {
          localInput.dieselPower = computeDieselPower(
            localInput as EnergyItem,
            ghgMapRef?.REF_EFF_DIES_L
          );
          return localInput;
        },
      },
      {
        value: "input.generatorSize", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
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
        customEventInput: (
          _: number,
          localInput: EnergyCookingItemInput,
          ghgMapRef: ItemReferencesMap
        ) => {
          localInput.dieselLiters = computeLitresPerDayDiesel(localInput);
          localInput.dieselPower = computeDieselPower(
            localInput as EnergyItem,
            ghgMapRef?.REF_EFF_DIES_L
          );
          return localInput;
        },
      },
      {
        value: "input.generatorLoad", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
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
        value: "input.operatingHours", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
        conditional_value: true,
        conditional: "disableDieselLiters",
        text: "operating hours (hrs/day)",
        tooltipInfo:
          "from daily log and application will extrapolate this information to be annual",
        suffix: "hrs/day",
        min: 0,
        style: {
          cols: "12",
        },
        type: "number",
      },
      // end of diesel generators
      // begingin og national grid
      {
        value: "input.gridPower", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
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
        value: "input.solarInstalled", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_SOLAR", "ELE_HYB"],
        conditional: "fuelType",
        customEventInput: (
          solarInstalled: number,
          localInput: EnergyCookingItemInput
        ) => {
          localInput.renewablePower = computeKWHPerDayPerCountry(
            solarInstalled,
            countryCode,
            this.project.solar
          );
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
        value: "input.renewablePower", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
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
        text: "Percentage of total cookstoves",
        computeResults: true,
        value: "input.numberOfCookstove",
        conditional_value: ["", cookstoveIdWithoutAccess],
        conditional: ["appliance", "cookstove"],
        style: {
          cols: "12",
        },
        max: 100,
        subtype: "percent",
        type: "number",
        hideFooterContent: false,
        formatter: (v: number) => {
          return formatNumber(v, {
            style: "percent",
            maximumFractionDigits: 0,
          });
        },
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
            // items should not be string.
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

  items!: GHGfNRB[];
}

export interface SelectCustom<V> {
  text: string;
  _id: V;
}

export interface EnergyCookingItemInput
  extends SurveyInput,
    DieselItem,
    EnergyItem {
  numberOfCookstove?: number; // computed based on % of HH and stuffs
  cookstove: string; // type fo cookstove
  image?: string; // image of cookstove
  fuelUsage?: number; // [kg or L/day]
  fuelType?: string; // key
  fuelTypes?: string[]; // used only as a reference
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
