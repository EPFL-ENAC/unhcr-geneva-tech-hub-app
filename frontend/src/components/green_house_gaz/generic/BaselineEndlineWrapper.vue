<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <baseline-card
          :baseline="localValue.baseline"
          :baseline-mode.sync="baselineMode"
          :activate-pie="activatePie"
          :diff-dimension="diffDimension"
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
          :activate-pie="activatePie"
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
import EndlineCard from "@/components/green_house_gaz/generic/EndlineCard.vue";

import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import {
  GenericBaseline,
  GenericEndline,
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import ComputeGenericFormSurveyMixin from "@/components/green_house_gaz/generic/ComputeGenericFormSurveyMixin.vue";
import { cloneDeep, maxBy } from "lodash";
import { v4 as uuidv4 } from "uuid";
import "vue-class-component/hooks";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
  components: {
    BaselineCard,
    EndlineCard,
    SurveyItemTitle,
  },
})
export default class BaselineEndlineWrapper extends Mixins(
  ComputeGenericFormSurveyMixin
) {
  @Prop([Object, Array])
  readonly value!: GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  >;

  @Prop([Array])
  readonly headers!: SurveyTableHeader[];

  @Prop([String])
  readonly name!: string;

  @Prop([String])
  readonly diffDimension!: keyof SurveyInput;

  @Prop({ type: Boolean, default: false })
  readonly activatePie!: boolean;

  @Prop([Function])
  readonly computeItem!: (
    localItemInput: SurveyInput,
    ghgMapRef: ItemReferencesMap
  ) => SurveyResult;

  baselineMode = true;
  ghgMapRef!: ItemReferencesMap;

  public get localValue(): GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  > {
    if (!this.value) {
      return this.generateNewValue();
    }
    if (this.value?.baseline.items === undefined) {
      return this.generateNewValue();
    }
    return this.value;
  }

  private generateNewValue(): GenericFormSurvey<
    SurveyItem,
    SurveyResult,
    SurveyItem,
    SurveyResult
  > {
    return {
      baseline: {
        items: [],
        results: {} as SurveyResult,
      },
      endline: {
        items: [],
        results: {} as SurveyResult,
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
    const newValue = cloneDeep(this.localValue);
    newValue.baseline = baseline;
    newValue.endline.items = this.updateEndlineInstancesWithBaseline(newValue);
    this.updateValue(newValue);
  }
  public updateEndline(
    endline: GenericEndline<SurveyItem, SurveyResult>
  ): void {
    const newValue = cloneDeep(this.localValue);
    newValue.endline = endline;
    this.updateValue(newValue);
  }
  private updateEndlineInstancesWithBaseline(
    value: GenericFormSurvey<SurveyItem, SurveyResult, SurveyItem, SurveyResult>
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
        newEndlineItem.enabled = true;
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

  private updateValue(
    value: GenericFormSurvey<SurveyItem, SurveyResult, SurveyItem, SurveyResult>
  ): void {
    const newForm = this.updateGenericFormSurvey(
      value,
      this.diffDimension,
      this.headers,
      this.computeItem,
      this.ghgMapRef
    );
    this.$emit("input", newForm);
  }
}
</script>
