<script lang="ts">
import { computeChangeInEmission } from "@/components/green_house_gaz/generic/changeInEmission";
import { Component, Vue } from "vue-property-decorator";

import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { cloneDeep, get, isError, sumBy } from "lodash";

// You can declare mixins as the same style as components.
@Component
export default class ComputeGenericFormSurveyMixin extends Vue {
  public updateGenericFormSurvey(
    value: GenericFormSurvey<
      SurveyItem,
      SurveyResult,
      SurveyItem,
      SurveyResult
    >,
    diffDimension: string,
    headers: SurveyTableHeader[],
    computeItem: (
      localItemInput: SurveyInput,
      ghgMapRef: ItemReferencesMap
    ) => SurveyResult,
    ghgMapRef: ItemReferencesMap
  ): GenericFormSurvey<SurveyItem, SurveyResult, SurveyItem, SurveyResult> {
    const newForm = cloneDeep(value);
    newForm.baseline.items = this.computeItems(
      newForm.baseline.items,
      computeItem,
      ghgMapRef
    );
    newForm.endline.items = this.computeItems(
      newForm.endline.items,
      computeItem,
      ghgMapRef
    );
    newForm.endline.items = this.computeChangeInItemsWithRatio(
      newForm.baseline.items,
      newForm.endline.items,
      diffDimension
    );

    newForm.baseline.results = this.computeResults(
      newForm.baseline.items,
      headers
    );
    newForm.endline.results = this.computeResults(
      newForm.endline.items,
      headers,
      { filterEnabled: true }
    );
    newForm.endline.results.changeInEmission = computeChangeInEmission(
      newForm.baseline.results.totalCO2Emission as number,
      newForm.endline.results.totalCO2Emission as number
    );
    return newForm;
  }

  private computeItems(
    items: SurveyItem[],
    computeItem: (
      localItemInput: SurveyInput,
      ghgMapRef: ItemReferencesMap
    ) => SurveyResult,
    ghgMapRef: ItemReferencesMap
  ): SurveyItem[] {
    return items.map((item: SurveyItem) => {
      try {
        item.computed = computeItem(item.input, ghgMapRef);
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

  private computeResults(
    items: SurveyItem[],
    headers: SurveyTableHeader[],
    options: ComputeResultsOptions = { filterEnabled: false }
  ): SurveyResult {
    // should look like {key: path}
    const keysToSumBy = headers
      .filter((header) => header.computeResults)
      .reduce((acc: Record<string, string>, el) => {
        acc[el.key] = el.value;
        return acc;
      }, {});
    const itemsToSum = options.filterEnabled
      ? items.filter((intervention: SurveyItem) => intervention.enabled)
      : items;
    return Object.entries(keysToSumBy).reduce(
      (acc: SurveyResult, [key, value]) => {
        acc[key] = sumBy(
          // filter only for endline
          itemsToSum,
          (item: SurveyItem) => get(item, value) as number
        );
        return acc;
      },
      {}
    );
  }

  private computeChangeInItemsWithRatio(
    items: SurveyItem[],
    interventions: SurveyItem[],
    diffDimension: string
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
      const interventionsWithSameOrigins = interventions.filter(
        (x) => x.originIncrement === intervention.originIncrement
      );
      const interventionsWithSameOriginsSelectedLength =
        interventionsWithSameOrigins.filter((x) => x.enabled).length;
      const interventionsDiffDimensionTotal =
        interventionsWithSameOrigins.reduce((acc, el) => {
          const interventionDiffValue =
            (el.input?.[diffDimension] as number) ??
            (el.computed?.[diffDimension] as number);
          return acc + interventionDiffValue;
        }, 0);
      const baselineCO2 = baselineItem.computed.totalCO2Emission as number;
      const endlineCO2 = intervention.computed.totalCO2Emission as number;

      const interventionDiffDimension =
        (intervention.input?.[diffDimension] as number) ??
        (intervention.computed?.[diffDimension] as number);
      // https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/351
      // we don't use the ratio when selected endline is 0 or 1
      let ratioEndline = 1;
      if (interventionsWithSameOriginsSelectedLength > 1) {
        ratioEndline =
          interventionDiffDimension / interventionsDiffDimensionTotal;
      }
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

interface ComputeResultsOptions {
  filterEnabled: boolean;
}
</script>
