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
import { GHGSolarState } from "@/store/GHGReferenceSolarModule";

import {
  computeCO2Cost,
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

import {
  ElectricFuel,
  electricFuels,
  electricFuelWithText,
} from "@/components/green_house_gaz/fuelTypes";

import { GreenHouseGaz, Survey } from "@/store/GhgInterface.vue";
import { GHGfNRB } from "@/store/GHGReferencefNRB";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
    ...mapGetters("GHGReferencefNRB", ["items"]),
  },
  methods: {
    ...mapActions("GHGReferencefNRB", [
      "syncDB",
      "getAllDocs",
      "updateDoc",
      "closeDB",
    ]),
    ...mapActions("GhgReferenceSolarModule", {
      syncSolarDB: "syncDB",
      getSolarAllDocs: "getAllDocs",
      updateSolarDoc: "updateDoc",
      closeSolarDB: "closeDB",
    }),
  },
})
export default class Trucking extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: EnergyFacilitySurvey;

  @Prop([Object, Array])
  readonly survey: Survey | undefined;

  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: countryIrradianceKeys;

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;
  diffDimension: keyof EnergyFacilityItemInput = "kWh";
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

  private computeItemElectric(
    localItemInput: EnergyFacilityItemInput,
    ghgMapRef: ItemReferencesMap
  ): number {
    let totalCO2Emission = 0;
    switch (localItemInput.fuelType) {
      case "ELE_HYB":
      case "ELE_GRID":
      case "ELE_DIES":
        totalCO2Emission =
          computeCO2Cost(
            localItemInput,
            ghgMapRef?.REF_DIES_L,
            this.project_REF_GRD
          ) * 365.25;
        break;
      case "ELE_SOLAR":
      case "ELE_NONE":
      default:
        break;
    }
    return totalCO2Emission;
  }

  private computeTotalPower(localItemInput: EnergyFacilityItemInput): number {
    let totalPower =
      (localItemInput?.gridPower ?? 0) +
      (localItemInput?.dieselPower ?? 0) +
      (localItemInput?.renewablePower ?? 0);
    totalPower = parseFloat(totalPower.toFixed(0));
    return totalPower;
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
    if (!electricFuels.includes(fuelType)) {
      throw new Error(`unknown fuel type ${fuelType}`);
    }
    const totalCO2Emission = this.computeItemElectric(
      localItemInput,
      ghgMapRef
    );
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is Not a Number`);
    }

    const totalPower = this.computeTotalPower(localItemInput);
    return {
      totalCO2Emission,
      totalPower,
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

  resetSurveyInput(
    localInput: EnergyFacilityItemInput
  ): EnergyFacilityItemInput {
    delete localInput.fuelUsage;

    localInput.disableDieselLiters = false; // do I know the total litres of diesels
    localInput.generatorLoad = 0.6; // default factor of 60%
    delete localInput.generatorSize;
    delete localInput.operatingHours;
    delete localInput.dieselLiters;

    delete localInput.solarInstalled;

    delete localInput.gridPower;

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
        text: "Name",
        value: "input.name",
        type: "text",
        style: {
          cols: "12",
        },
        hideFooterContent: false,
      },
      {
        text: "Powered by",
        value: "input.fuelType", // facilityType
        type: "select",
        style: {
          cols: "12",
        },
        hideFooterContent: false,
        items: electricFuelWithText,
        formatter: (_id: string) => {
          const electricFuel = electricFuelWithText.find(
            (electricFuel) => electricFuel._id === _id
          );
          const name = electricFuel?.text ?? "Unknown";
          return `${name}`;
        },
        customEventInput: (_: string, localInput: EnergyFacilityItemInput) => {
          this.resetSurveyInput(localInput);
          return localInput;
        },
      },
      {
        text: "Total diesel (kWh/yr)",
        computeResults: true,
        value: "input.dieselPower",
        hideFooterContent: false,
      },
      // begingin og national grid
      {
        value: "input.gridPower", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_GRID", "ELE_HYB"],
        computeResults: true,
        hideFooterContent: false,
        conditional: "fuelType",
        // text: "Total kWh used per year",
        text: "Grid power (kWh/yr)",
        suffix: "kWh/yr",
        style: {
          cols: "12",
        },
        formatter: (v: number, { ...args }) => {
          return formatNumber(v, { suffix: args.suffix });
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
          localInput: EnergyFacilityItemInput
        ) => {
          localInput.solarPower = computeKWHPerDayPerCountry(
            solarInstalled,
            countryCode,
            this.project.solar
          );
          return localInput;
        },
        text: "Total kW of solar installed",
        suffix: "Kw",
        style: {
          cols: "12",
        },
        type: "number",
      },
      {
        value: "input.solarPower", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_SOLAR", "ELE_HYB"],
        disabled: true,
        text: "Solar kWh/yr produced (estimated)",
        // text: "Solar (kWh/yr)",
        conditional: "fuelType",
        suffix: "Kwh/yr",
        style: {
          cols: "12",
        },
        type: "number",
        computeResults: true,
        hideFooterContent: false,
      },
      // end of solar
      {
        text: "Total Power (kWh/yr)",
        value: "computed.totalPower",
        hideFooterContent: false,
        formatter: (v: number, { ...args }) => {
          return formatNumber(v, { suffix: args.suffix });
        },
        computeResults: true,
        type: "number",
        disabled: true,
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
        value: "input.dieselLiters", // maybe use dieselLitres like in DieselGeneratorWithoutLitres
        conditional_value: false,
        conditional: "disableDieselLiters",
        text: "Litres of diesel used per year",
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
        customEventInput: (_: number, localInput: EnergyFacilityItemInput) => {
          localInput.dieselLiters = computeLitresPerDayDiesel(localInput);
          localInput.dieselPower = computeDieselPower(
            localInput as EnergyItem,
            {
              value: 0.267,
              description: "fake (kWh/litre),",
              _id: "REF_EFF_DIES_L",
            }
          );
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
        min: 0,
        style: {
          cols: "12",
        },
        type: "number",
      },
      // end of diesel generators
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
      // todo: externalize this map function in the generic component to make it DRY
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

  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<GHGfNRB[]>;

  syncSolarDB!: () => null;
  closeSolarDB!: () => Promise<null>;
  getSolarAllDocs!: () => Promise<GHGSolarState[]>;
  items!: GHGfNRB[];
  mounted(): void {
    this.syncDB();
    this.getAllDocs();

    this.syncSolarDB();
    this.getSolarAllDocs();
  }

  destroyed(): void {
    this.closeDB();
    this.closeSolarDB();
  }
}

export interface SelectCustom<V> {
  text: string;
  _id: V;
}

export interface EnergyFacilityItemInput
  extends SurveyInput,
    DieselItem,
    EnergyItem {
  fuelUsage?: number; // [L/year] // dieselLiters: 0,
  fuelType?: ElectricFuel; // key
}

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
