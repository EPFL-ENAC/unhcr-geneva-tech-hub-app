<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <baseline-card
          :baseline="value.baseline"
          :baseline-mode.sync="baselineMode"
          :name="name"
          :headers="baselineHeaders"
          @update:baseline="updateBaseline"
        />
        <!-- baselineCard -->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <endline-card /> -->
        <endline-card
          :baseline="value.baseline"
          :endline="value.endline"
          :endline-mode.sync="baselineMode"
          sort-by="originIncrement"
          :diff-dimension="diffDimension"
          :name="name"
          :headers="endlineHeaders"
          @update:endline="updateEndline"
        />
        <!-- endlineCard -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import BaselineCard from "@/components/green_house_gaz/generic/BaselineCard.vue";
import EndlineCard from "@/components/green_house_gaz/generic/EndlineCard.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import {
  GenericBaseline,
  GenericEndline,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface.vue";
import { cloneDeep, maxBy } from "lodash";

import { v4 as uuidv4 } from "uuid";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
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

  baselineMode = true;

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
    const newValue = JSON.parse(JSON.stringify(this.value));
    newValue.baseline = baseline;
    newValue.endline.items = this.updateEndlineInstancesWithBaseline(newValue);
    this.$emit("input", newValue);
  }
  public updateEndline(
    endline: GenericEndline<SurveyItem, SurveyResult>
  ): void {
    const newValue = JSON.parse(JSON.stringify(this.value));
    newValue.endline = endline;
    this.$emit("input", newValue);
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
  formatter?: (v: unknown) => unknown;
  conditional_value: string; // e.g "LITRES",
  conditional: string; // based on other SurveyTableHeader field "US_UNI", needs to have conditional_value set
  suffix: string; // "l", //if we need to have a suffix displayed in table or input
  endlineOnly?: boolean; // show only for enldine table true,
  baselineOnly?: boolean;
  hideFooterContent: boolean; // default to true only for table
  align: string; // "start"; // only for table
  sortable: boolean; // false,
}
</script>
