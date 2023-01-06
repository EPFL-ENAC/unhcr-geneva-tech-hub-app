<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <baseline-card
          :baseline="localValue.baseline"
          :baseline-mode.sync="baselineMode"
          :name="name"
          :headers="baselineHeaders"
          @update:baseline="updateBaseline"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <endline-card
          :baseline="localValue.baseline"
          :endline="localValue.endline"
          :baseline-mode.sync="baselineMode"
          sort-by="originIncrement"
          :diff-dimension="diffDimension"
          :name="name"
          :headers="endlineHeaders"
          @update:endline="updateEndline"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import BaselineCard from "@/components/green_house_gaz/generic/BaselineCard.vue";
import { computeChangeInEmission } from "@/components/green_house_gaz/generic/changeInEmission";
import EndlineCard from "@/components/green_house_gaz/generic/EndlineCard.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import {
  GenericBaseline,
  GenericEndline,
  GenericFormSurvey,
  SurveyInput,
  SurveyInputValue,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";
import { cloneDeep, get, maxBy, sumBy } from "lodash";
import { v4 as uuidv4 } from "uuid";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

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
    BaselineCard,
    EndlineCard,
    SurveyItemTitle,
  },
})
export default class BaselineEndlineWrapper<
  A extends SurveyItem,
  B extends SurveyResult,
  C extends SurveyItem,
  D extends SurveyResult
> extends Vue {
  @Prop([Object, Array])
  readonly value!: GenericFormSurvey<A, B, C, D>;

  @Prop([Array])
  readonly headers!: SurveyTableHeader[];

  @Prop([String])
  readonly name!: string;

  @Prop([String])
  readonly diffDimension!: keyof SurveyInput;

  @Prop([Function])
  readonly computeItem!: (
    localItemInput: SurveyInput,
    ghgMapRef: ItemReferencesMap
  ) => SurveyResult;

  baselineMode = true;
  syncDBGhg!: () => null;
  closeDBGhg!: () => Promise<null>;
  getAllDocsGhg!: () => Promise<ReferenceItemInterface[]>;

  ghgMapRef!: ItemReferencesMap;

  public get localValue(): GenericFormSurvey<A, B, C, D> {
    if (!this.value) {
      return this.generateNewValue();
    }
    // TODO: MIGRATION remove when data migration complete
    if (this.value?.baseline.items === undefined) {
      return this.generateNewValue();
    }
    // END OF TODO: MIGRATION
    return this.value;
  }

  private generateNewValue(): GenericFormSurvey<A, B, C, D> {
    return {
      baseline: {
        items: [],
        results: {} as B,
      },
      endline: {
        items: [],
        results: {} as D,
      },
    };
  }

  public get baselineHeaders(): SurveyTableHeader[] {
    return this.headers.filter(
      (header: SurveyTableHeader) => !header.endlineOnly
    );
  }

  public get endlineHeaders(): SurveyTableHeader[] {
    return this.headers.filter(
      (header: SurveyTableHeader) => !header.baselineOnly
    );
  }

  public updateBaseline(
    baseline: GenericBaseline<SurveyItem, SurveyResult>
  ): void {
    const newValue = JSON.parse(JSON.stringify(this.localValue));
    newValue.baseline = baseline;
    newValue.endline.items = this.updateEndlineInstancesWithBaseline(newValue);
    this.updateValue(newValue);
  }
  public updateEndline(
    endline: GenericEndline<SurveyItem, SurveyResult>
  ): void {
    const newValue = JSON.parse(JSON.stringify(this.localValue));
    newValue.endline = endline;
    this.updateValue(newValue);
  }
  private updateEndlineInstancesWithBaseline(
    value: GenericFormSurvey<A, B, C, D>
  ): SurveyItem[] {
    let results: SurveyItem[] = [];
    const baselineItems = value.baseline.items;
    const endlineItems = value.endline.items;

    // new baseline items to endline as deep copy
    const endlineItemOriginIds = endlineItems.map(
      (item: SurveyItem) => item.origin
    );
    let maxItem = maxBy(endlineItems, function (item) {
      return item.increment;
    })?.increment;
    const newEndlineItems = baselineItems
      // keep only new items
      .filter(
        (baselineItem: SurveyItem) =>
          !endlineItemOriginIds.includes(baselineItem._id)
      )
      // create the deep copy
      .map((baselineItem: SurveyItem) => {
        const newEndlineItem = cloneDeep(baselineItem);
        newEndlineItem.origin = newEndlineItem._id;
        newEndlineItem._id = uuidv4();
        newEndlineItem.originIncrement = newEndlineItem.increment;
        maxItem = (maxItem ?? -1) + 1; // increment
        newEndlineItem.increment = maxItem;
        return newEndlineItem;
      });
    // filter out removed baseline inputs in results
    const baselineItemIds = baselineItems.map((item: SurveyItem) => item._id);
    results = endlineItems.filter((endlineItem: SurveyItem) =>
      baselineItemIds.includes(endlineItem?.origin ?? "")
    );
    // add new baseline items to endline as deep copy
    results = results.concat(newEndlineItems);
    return results;
  }

  private updateValue(value: GenericFormSurvey<A, B, C, D>): void {
    const newForm = JSON.parse(JSON.stringify(value));
    newForm.baseline.items = this.computeItems(newForm.baseline.items);
    newForm.endline.items = this.computeItems(newForm.endline.items);
    newForm.endline.items = this.computeChangeInItemsWithRatio(
      newForm.baseline.items,
      newForm.endline.items
    );

    newForm.baseline.results = this.computeResults(newForm.baseline.items);
    newForm.endline.results = this.computeResults(newForm.endline.items);
    newForm.endline.results.changeInEmission = computeChangeInEmission(
      newForm.baseline.results.totalCO2Emission,
      newForm.endline.results.totalCO2Emission
    );
    this.$emit("input", newForm);
  }

  private computeItems(items: SurveyItem[]): SurveyItem[] {
    return items.map((item: SurveyItem) => {
      item.computed = this.computeItem(item.input, this.ghgMapRef);
      return item;
    });
  }

  private computeResults(items: SurveyItem[]): SurveyResult {
    // should look like {key: path}
    const keysToSumBy = this.headers
      .filter((header) => header.computeResults)
      .reduce((acc: Record<string, string>, el) => {
        acc[el.key] = el.value;
        return acc;
      }, {});

    return Object.entries(keysToSumBy).reduce(
      (acc: SurveyResult, [key, value]) => {
        acc[key] = sumBy(
          items,
          (item: SurveyItem) => get(item, value) as number
        );
        return acc;
      },
      {}
    );
  }

  private computeChangeInItemsWithRatio(
    items: SurveyItem[],
    interventions: SurveyItem[]
  ): SurveyItem[] {
    const washItemsByIncrement = items.reduce(
      (acc: Record<number, SurveyItem>, el: SurveyItem) => {
        acc[el.increment] = el;
        return acc;
      },
      {}
    );
    interventions.forEach((intervention: SurveyItem) => {
      const baselineItem =
        washItemsByIncrement[intervention.originIncrement ?? -1];
      const baselineCO2 = baselineItem.computed.totalCO2Emission as number;
      const endlineCO2 = intervention.computed.totalCO2Emission as number;
      const totalChangeInEmission = computeChangeInEmission(
        baselineCO2,
        endlineCO2
      );
      const ratio: number =
        (intervention.input[this.diffDimension] as number) /
        (baselineItem.input[this.diffDimension] as number);

      intervention.computed.changeInEmission = totalChangeInEmission * ratio;
    });
    return interventions;
  }

  public mounted(): void {
    this.syncDBGhg();
    this.getAllDocsGhg();
  }

  public destroyed(): void {
    this.closeDBGhg();
  }
}
export interface SurveyTableHeader {
  text: string; //.e.g "Intervention" description or text to display for input or table header
  value: string; // name of the field to use for table
  type: string; // number etc for text-field
  items: string[];
  isInput: boolean;
  key: string; // key of input or computed inside input field
  label?: string;
  category?: string; // example increment
  classFormatter?: (v: unknown) => string;
  customEventInput?: (v: SurveyInputValue, localInput: SurveyInput) => unknown;
  formatter?: (v: unknown) => unknown;
  conditional_value: string; // e.g "LITRES",
  conditional: string; // based on other SurveyTableHeader field "US_UNI", needs to have conditional_value set
  suffix: string; // "l", //if we need to have a suffix displayed in table or input
  endlineOnly?: boolean; // show only for enldine table true,
  baselineOnly?: boolean;
  hideFooterContent: boolean; // default to true only for table
  align: string; // "start"; // only for table
  sortable: boolean; // false,
  computeResults: boolean; // false,
}
</script>
