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
import { computeChangeInEmission } from "@/components/green_house_gaz/generic/changeInEmission";
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
} from "@/store/GhgInterface.vue";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import { cloneDeep, get, isError, maxBy, sumBy } from "lodash";
import { v4 as uuidv4 } from "uuid";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
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
export default class BaselineEndlineWrapper<
  A extends SurveyItem,
  B extends SurveyResult,
  C extends SurveyItem,
  D extends SurveyResult
> extends Vue {
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
    // TODO: MIGRATION remove when data migration complete
    if (this.value?.baseline.items === undefined) {
      return this.generateNewValue();
    }
    // END OF TODO: MIGRATION
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
    const newForm = cloneDeep(value);
    newForm.baseline.items = this.computeItems(newForm.baseline.items);
    newForm.endline.items = this.computeItems(newForm.endline.items);
    newForm.endline.items = this.computeChangeInItemsWithRatio(
      newForm.baseline.items,
      newForm.endline.items
    );

    newForm.baseline.results = this.computeResults(newForm.baseline.items);
    newForm.endline.results = this.computeResults(newForm.endline.items);
    newForm.endline.results.changeInEmission = computeChangeInEmission(
      newForm.baseline.results.totalCO2Emission as number,
      newForm.endline.results.totalCO2Emission as number
    );
    this.$emit("input", newForm);
  }

  private computeItems(items: SurveyItem[]): SurveyItem[] {
    return items.map((item: SurveyItem) => {
      try {
        item.computed = this.computeItem(item.input, this.ghgMapRef);
      } catch (e: Error | unknown) {
        let stack;
        let message = e;
        if (isError(e)) {
          stack = e.stack;
          message = e.message;
        }
        this.$store.dispatch("notifyUser", {
          title: `compute CO2 line failed`,
          message,
          stack,
          type: "error",
        });
      }
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
    const itemsByIncrement = items.reduce(
      (acc: Record<number, SurveyItem>, el: SurveyItem) => {
        acc[el.increment] = el;
        return acc;
      },
      {}
    );
    interventions.forEach((intervention: SurveyItem) => {
      const baselineItem = itemsByIncrement[intervention.originIncrement ?? -1];
      const interventionsDiffDimensionTotal = interventions
        .filter((x) => x.originIncrement === intervention.originIncrement)
        .reduce((acc, el) => {
          const interventionDiffValue =
            (el.input?.[this.diffDimension] as number) ??
            (el.computed?.[this.diffDimension] as number);
          return acc + interventionDiffValue;
        }, 0);
      const baselineCO2 = baselineItem.computed.totalCO2Emission as number;
      const endlineCO2 = intervention.computed.totalCO2Emission as number;

      const interventionDiffDimension =
        (intervention.input?.[this.diffDimension] as number) ??
        (intervention.computed?.[this.diffDimension] as number);
      const ratioEndline: number =
        interventionDiffDimension / interventionsDiffDimensionTotal;
      // if baseline == 0 and endline === 0 then 0%
      // if baseline == 0 and endline = x then 100%
      // if baseline == NOT POWERED and endline = x then 100%
      let changeInEmission = 0;
      if (baselineCO2 * ratioEndline === 0) {
        if (endlineCO2 !== 0) {
          changeInEmission = 1 * ratioEndline;
        }
      } else {
        changeInEmission = computeChangeInEmission(
          baselineCO2,
          endlineCO2,
          ratioEndline
        );
      }
      intervention.computed.changeInEmission = changeInEmission;
    });
    return interventions;
  }
}
</script>
