<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <!-- <baseline-endline-wrapper
      v-model="cookstoveForm"
      :headers="cookstoveHeaders"
      :diff-dimension="diffDimension"
      :name="name"
    /> -->
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
import { sumBy } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

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
  readonly form: EnergyCookingSurvey | undefined;

  syncDBGhg!: () => null;
  closeDBGhg!: () => Promise<null>;
  getAllDocsGhg!: () => Promise<ReferenceItemInterface[]>;

  ghgMapRef!: ItemReferencesMap;

  diffDimension: keyof EnergyCookingItemInput = "cardinal";
  name = "cookstove";

  public get title(): string {
    return this.titleKey;
  }
  public get cookstoveForm(): EnergyCookingSurvey {
    // migration code.
    if (!this.form) {
      return this.generateNewForm();
    }
    // TODO: MIGRATION remove when data migration complete
    if (this.form?.baseline.items === undefined) {
      return this.generateNewForm();
    }
    // END OF TODO: MIGRATION
    return this.form;
  }

  public set cookstoveForm(value: EnergyCookingSurvey) {
    // compute result for every item!
    const newForm = JSON.parse(JSON.stringify(value));
    newForm.baseline.items = this.computeTotalCO2(newForm.baseline.items);
    newForm.baseline.results = this.computeResults(newForm.baseline.items);
    newForm.endline.items = this.computeTotalCO2(newForm.endline.items);
    newForm.endline.items = this.computeChangeInItemsWithRatio(
      newForm.baseline.items,
      newForm.endline.items
    );
    newForm.endline.results = {
      ...this.computeEndlineResults(
        newForm.baseline.items,
        newForm.endline.items
      ),
    };
    // compute balance once endline results are computed
    const changeInEmission = computeChangeInEmission(
      newForm.baseline.results.totalCO2Emission,
      newForm.endline.results.totalCO2Emission
    );
    // res.TR_NUM_DIFF =
    //   Math.abs(baselineRes.TR_NUM - endlineRes.TR_NUM) / baselineRes.TR_NUM;
    // res.TR_DIST_DIFF =
    //   Math.abs(baselineRes.TR_DIST - endlineRes.TR_DIST) / baselineRes.TR_DIST;
    // res.totalCO2Emission =
    newForm.endline.results.changeInEmission = changeInEmission;
    this.$emit("update:form", newForm);
  }

  private generateNewForm(): EnergyCookingSurvey {
    return {
      baseline: {
        items: [],
        results: {
          totalCO2Emission: 0,
        },
      },
      endline: {
        items: [],
        results: {
          totalCO2Emission: 0,
          changeInEmission: 0,
        },
      },
    };
  }

  private computeCO2Cost(
    localItem: EnergyCookingItem
    // REF_WSH_D: ReferenceItemInterface | undefined,
    // REF_WSH_G: ReferenceItemInterface | undefined,
    // REF_WSH_D_L: ReferenceItemInterface | undefined,
    // REF_WSH_G_L: ReferenceItemInterface | undefined
  ): EnergyCookingItem {
    // const { US_UNI, US_TYP, WACL, TR_TYP, TOT_WS, TR_VOL, LIT_WS } =
    //   localItem.input || {};
    try {
      // localItem.computed.TR_NUM = Math.ceil(volumeCollected / TR_VOL);
      // localItem.computed.TR_DIST = 0; // the DIST is unknown since we only have the number of litres
      localItem.computed.totalCO2Emission = 0; // (44 * LIT_WS) / 1000;
      return localItem;
    } catch (error) {
      throw new Error(`ghg wash input for ${name} unknown unit type ${error}`);
    }
  }

  private computeTotalCO2(items: EnergyCookingItem[]): EnergyCookingItem[] {
    return items.map((item: EnergyCookingItem) => {
      return this.computeCO2Cost(
        item
        // this.ghgMapRef?.REF_WSH_D,
        // this.ghgMapRef?.REF_WSH_G,
        // this.ghgMapRef?.REF_WSH_D_L,
        // this.ghgMapRef?.REF_WSH_G_L
      );
    });
  }

  private computeResults(
    washItems: EnergyCookingItem[]
  ): EnergyCookingItemResults {
    const res = {} as EnergyCookingItemResults;
    res.totalCO2Emission = sumBy(
      washItems,
      (washItem) => washItem.computed.totalCO2Emission
    );
    // res.WACL = sumBy(washItems, (washItem) => washItem.input.WACL);
    return res;
  }
  private getMerged(
    baselineItems: EnergyCookingItem[],
    endlineItems: EnergyCookingItem[]
  ): EnergyCookingItem[] {
    // replace item in washItems by corresponding intervention in origin.
    return baselineItems.reduce(
      (acc: EnergyCookingItem[], item: EnergyCookingItem) => {
        const foundInterventions = endlineItems.filter((intervention) => {
          return intervention.increment === item.increment;
        });
        if (foundInterventions.length > 0) {
          acc = acc.concat(foundInterventions);
        } else {
          acc.push(item);
        }
        return acc;
      },
      []
    );
  }

  private computeEndlineResults(
    washItems: EnergyCookingItem[],
    washInterventions: EnergyCookingItem[]
  ): EnergyCookingItemResultsWithBalance {
    const merged = this.getMerged(washItems, washInterventions);
    return {
      totalCO2Emission: sumBy(
        merged,
        (washItem) => washItem.computed.totalCO2Emission
      ),
      // WACL: sumBy(merged, (washItem) => washItem.input.WACL),
      // TR_NUM: sumBy(merged, (washItem) => washItem.computed.TR_NUM),
      // TR_DIST: sumBy(merged, (washItem) => washItem.computed.TR_DIST),
      // TR_NUM_DIFF: 0, // useless TODO: remove
      // TR_DIST_DIFF: 0, // useless TODO: remove
      changeInEmission: 0,
    };
  }

  private computeChangeInItemsWithRatio(
    washItems: EnergyCookingItem[],
    washInterventions: EnergyCookingItem[]
  ): EnergyCookingItem[] {
    // const merged = this.getMerged(washItems, washInterventions);
    const washItemsByIncrement = washItems.reduce(
      (acc: Record<number, EnergyCookingItem>, el: EnergyCookingItem) => {
        acc[el.increment] = el;
        return acc;
      },
      {}
    );
    washInterventions.forEach((intervention: EnergyCookingItem) => {
      const baselineItem = washItemsByIncrement[intervention.increment];
      const baselineCO2 = baselineItem.computed.totalCO2Emission;
      const endlineCO2 = intervention.computed.totalCO2Emission;
      const totalChangeInEmission = computeChangeInEmission(
        baselineCO2,
        endlineCO2
      );
      // ask @blueur how to make it not ugly
      const ratio: number =
        (intervention.input[this.diffDimension] as number) /
        (baselineItem.input[this.diffDimension] as number);
      intervention.computed.changeInEmission = totalChangeInEmission * ratio;
    });
    return washInterventions;
  }

  readonly cookstoveHeaders = [
    // replace description by label
    // replace code by value
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

  public mounted(): void {
    this.syncDBGhg();
    this.getAllDocsGhg();
  }

  public destroyed(): void {
    this.closeDBGhg();
  }
}

export interface EnergyCookingItemInput extends SurveyInput {
  // US_TYP: string;
  // US_UNI: string;
  // TOT_WS: number;
  // LIT_WS: number;
  // WACL: number;
  // TR_VOL: number;
  // TR_TYP: string;
  cookTechno: string;
  fuelType: string;
}

export interface EnergyCookingItemResults extends SurveyResult {
  // TR_NUM: number;
  // TR_DIST: number;
  // WACL: number; // total of collected volume
  totalCO2Emission: number;
}
export interface EnergyCookingItem extends SurveyItem {
  input: EnergyCookingItemInput;
  computed: EnergyCookingItemResults;
}

export interface EnergyCookingItemResultsBalance extends SurveyResult {
  // TR_NUM_DIFF: number;
  // TR_DIST_DIFF: number;
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
