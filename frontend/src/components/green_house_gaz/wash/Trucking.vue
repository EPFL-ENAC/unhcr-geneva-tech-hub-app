<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <baseline-endline-wrapper
      v-model="washForm"
      :headers="truckingHeaders"
      :diff-dimension="diffDimension"
      name="transport"
    />
  </v-container>
</template>

<script lang="ts">
import { computeChangeInEmission } from "@/components/green_house_gaz/changeInEmission";
import BaselineEndlineWrapper from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import { formatNumber } from "@/plugins/filters";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";
import { get as _get, sumBy } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

export const DIESEL = "DIESEL";
export const PETROL = "Petrol / Gaz";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
  methods: {
    ...mapActions("GhgReferenceModule", {
      syncDBGhg: "syncDB",
      closeDBGhg: "closeDB",
      getAllDocsGhg: "getAllDocs",
    }),
  },
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
})
export default class Trucking extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop([Object, Array])
  readonly form: WashTruckingSurvey | undefined;

  syncDBGhg!: () => null;
  closeDBGhg!: () => Promise<null>;
  getAllDocsGhg!: () => Promise<ReferenceItemInterface[]>;

  ghgMapRef!: ItemReferencesMap;

  diffDimension: keyof WashTruckingItemInput = "WACL";

  public get title(): string {
    return this.titleKey;
  }
  public get washForm(): WashTruckingSurvey {
    // migration code.
    if (!this.form) {
      return this.generateNewWashForm();
    }
    // TODO: MIGRATION remove when data migration complete
    if (this.form?.baseline.items === undefined) {
      return this.generateNewWashForm();
    }
    // END OF TODO: MIGRATION
    return this.form;
  }

  public set washForm(value: WashTruckingSurvey) {
    const newForm = JSON.parse(JSON.stringify(value));
    newForm.baseline.items = this.computeTotalCO2(newForm.baseline.items);
    newForm.baseline.results = this.computeResults(newForm.baseline.items);

    newForm.endline.items = this.computeTotalCO2(newForm.endline.items);
    newForm.endline.items = this.computeChangeInItemsWithRatio(
      newForm.baseline.items,
      newForm.endline.items
    );
    newForm.endline.results = this.computeResults(newForm.endline.items);
    // compute balance once endline results are computed
    // this could include also other diff like truck number or distance
    const changeInEmission = computeChangeInEmission(
      newForm.baseline.results.totalCO2Emission,
      newForm.endline.results.totalCO2Emission
    );
    newForm.endline.results.changeInEmission = changeInEmission;
    this.$emit("update:form", newForm);
  }

  private generateNewWashForm(): WashTruckingSurvey {
    return {
      baseline: {
        items: [],
        results: {
          TR_NUM: 0,
          TR_DIST: 0,
          WACL: 0,
          totalCO2Emission: 0,
        },
      },
      endline: {
        items: [],
        results: {
          TR_NUM: 0,
          TR_DIST: 0,
          WACL: 0,
          CO2_WSH_TRB: 0, // obsolete ?
          TR_NUM_DIFF: 0,
          TR_DIST_DIFF: 0,
          totalCO2Emission: 0,
          changeInEmission: 0,
        },
      },
    };
  }

  private truckingComputeCO2Cost(
    localItem: WashTruckingItem,
    REF_WSH_D: ReferenceItemInterface | undefined,
    REF_WSH_G: ReferenceItemInterface | undefined,
    REF_DIES_L: ReferenceItemInterface | undefined,
    REF_GAZ_L: ReferenceItemInterface | undefined,
    REF_WW_FS: ReferenceItemInterface | undefined
  ): WashTruckingItem {
    const { US_UNI, US_TYP, WACL, TR_TYP, TOT_WS, TR_VOL, LIT_WS } =
      localItem.input || {};
    try {
      /*
        When wastewater or faecal sludge is checked in the dropdown,
        So the input volume pumped must be multiplied by 0.85. or REF_WW_FS
      */
      const volumeCollected = ["WASTEWATER", "FAECAL SLUDGE"].includes(US_TYP)
        ? WACL * (REF_WW_FS?.value ?? 0.85)
        : WACL;
      // move to special function
      const washFactorKM =
        TR_TYP === DIESEL ? REF_WSH_D?.value : REF_WSH_G?.value;
      if (!washFactorKM) {
        throw new Error(`washFactorKM undefined`);
      }
      if (US_UNI === "KM" && washFactorKM) {
        localItem.computed.TR_NUM = Math.ceil(volumeCollected / TR_VOL);
        /*
        the distance should be checked that is it the one way distance which is converted
        into a roundtrip distance by multiplying by 2
        */
        localItem.computed.TR_DIST = localItem.computed.TR_NUM * TOT_WS * 2;
        localItem.computed.totalCO2Emission =
          (washFactorKM * localItem.computed.TR_DIST) / 1000;
      }

      const washFactorL =
        TR_TYP === DIESEL ? REF_DIES_L?.value : REF_GAZ_L?.value;
      if (!washFactorL) {
        throw new Error(`washFactorL undefined`);
      }
      if (US_UNI === "LITRES" && washFactorL) {
        localItem.computed.TR_NUM = Math.ceil(volumeCollected / TR_VOL);
        localItem.computed.TR_DIST = 0; // the DIST is unknown since we only have the number of litres
        localItem.computed.totalCO2Emission = (washFactorL * LIT_WS) / 1000;
      }
      return localItem;
    } catch (error) {
      throw new Error(`ghg wash input for trucking unknown unit type ${error}`);
    }
  }

  private computeTotalCO2(items: WashTruckingItem[]): WashTruckingItem[] {
    return items.map((item: WashTruckingItem) => {
      return this.truckingComputeCO2Cost(
        item,
        this.ghgMapRef?.REF_WSH_D,
        this.ghgMapRef?.REF_WSH_G,
        this.ghgMapRef?.REF_DIES_L,
        this.ghgMapRef?.REF_GAZ_L,
        this.ghgMapRef?.REF_WW_FS
      );
    });
  }

  private computeResults(
    washItems: WashTruckingItem[]
  ): WashTruckingItemResults {
    const res = {} as WashTruckingItemResults;
    res.totalCO2Emission = sumBy(
      washItems,
      (washItem) => washItem.computed.totalCO2Emission
    );
    res.WACL = sumBy(washItems, (washItem) => washItem.input.WACL);
    return res;
  }

  private computeChangeInItemsWithRatio(
    washItems: WashTruckingItem[],
    washInterventions: WashTruckingItem[]
  ): WashTruckingItem[] {
    const washItemsByIncrement = washItems.reduce(
      (acc: Record<number, WashTruckingItem>, el: WashTruckingItem) => {
        acc[el.increment] = el;
        return acc;
      },
      {}
    );
    washInterventions.forEach((intervention: WashTruckingItem) => {
      const baselineItem =
        washItemsByIncrement[intervention.originIncrement ?? -1];
      const baselineCO2 = baselineItem.computed.totalCO2Emission;
      const endlineCO2 = intervention.computed.totalCO2Emission;
      const totalChangeInEmission = computeChangeInEmission(
        baselineCO2,
        endlineCO2
      );
      const ratio: number =
        (intervention.input[this.diffDimension] as number) /
        (baselineItem.input[this.diffDimension] as number);
      intervention.computed.changeInEmission = totalChangeInEmission * ratio;
    });
    return washInterventions;
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
  readonly truckingHeaders = [
    // replace description by label
    // replace code by value
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
      text: "Litres between camp and water source",
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
      text: `Total volume pumped (m3)`,
      value: "input.WACL",
      hideFooterContent: false,
      style: {
        cols: "12",
      },
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
      formatter: (v: unknown) => v,
      classFormatter: () => "",
      options:
        item?.items?.map((item) => ({ text: item, value: item })) ?? undefined,
      ...item,
    };
  });

  public mounted(): void {
    this.syncDBGhg();
    this.getAllDocsGhg();
  }

  public destroyed(): void {
    this.closeDBGhg();
  }
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
