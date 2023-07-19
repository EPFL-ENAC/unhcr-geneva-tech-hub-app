import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import { formatNumber } from "@/plugins/filters";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

import {
  ensureSurveyTableHeaders,
  surveyTableHeaderCO2,
  surveyTableHeaderIncrements,
} from "@/components/green_house_gaz/generic/surveyTableHeader";

export interface MaterialSolidWasteItemInput extends SurveyInput {
  percentageOfTotalCategories?: number; // computed based on % of HH and stuffs
  image?: string; // image of lighting
}

export interface MaterialSolidWasteItemResults extends SurveyResult {
  totalCO2Emission: number;
}
export interface MaterialSolidWasteItem extends SurveyItem {
  input: MaterialSolidWasteItemInput;
  computed: MaterialSolidWasteItemResults;
}

export interface MaterialSolidWasteItemResultsBalance extends SurveyResult {
  totalCO2Emission: number;
  changeInEmission: number;
}
export interface MaterialSolidWasteItemResultsWithBalance
  extends MaterialSolidWasteItemResults,
    MaterialSolidWasteItemResultsBalance {}

export interface MaterialSolidWasteSurvey
  extends GenericFormSurvey<
    MaterialSolidWasteItem,
    MaterialSolidWasteItemResults,
    MaterialSolidWasteItem,
    MaterialSolidWasteItemResultsWithBalance
  > {
  generationKg: number;
}

export const diffDimension: keyof MaterialSolidWasteItemInput =
  "percentageOfTotalCategories";

export function resetSurveyInput(
  localInput: MaterialSolidWasteItemInput
): MaterialSolidWasteItemInput {
  localInput.fuelType = "NO_ACCESS";
  delete localInput.percentageOfTotalCategories; // percentage of percentage
  return resetSurveyFuelOption(localInput);
}

export function resetSurveyFuelOption(
  localInput: MaterialSolidWasteItemInput
): MaterialSolidWasteItemInput {
  delete localInput.fuelUsage;
  return localInput;
}

export function headers(pp_per_hh: number | undefined) {
  return [
    ...surveyTableHeaderIncrements,
    {
      value: "input.biowaste",
      text: "Type of waste",
      items: ["Biowaste", "Non-biowaste"],
      tooltipInfo:
        "Definition of biowaste: comprises only biodegradable garden and park waste, food and kitchen waste from households and markets  Source: EAWAG: https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/SOWATT/sowatt.pdf",
      style: {
        cols: "12",
      },
      default: true,
      type: "select",
    },
    {
      conditional_value: ["Non-biowaste"],
      conditional: "biowaste",
      value: "input.biowasteSubCategories",
      text: "Biowaste subcategories",
      items: [
        "Plastics",
        "Textiles",
        "Paper / cardboard",
        "Rubber / leather",
        "Nappies",
        "Mixed / unkown composition ",
      ],
      style: {
        cols: "12",
      },
      default: true,
      isInput: true,
      type: "select",
      hideFooterContent: false,
    },
    {
      text: "Solid Waste Management (SWM) Practices",
      value: "input.practiceType",
      items: ["Open pits, unmanaged", "Managed disposal site", "Open burning"],
      formatter: (x: string) => x,
      tooltipInfo: function (value: string) {
        if (value === "Open pits, unmanaged") {
          return "Assumed to be shallow < 5 m depth";
        }
        if (value === "Managed disposal site") {
          return "At least one of these conditions: regular cover material (e.g, soil), mechanical compacting, or leveling of the waste. Example: landfill";
        }
      },
      style: {
        cols: "12",
      },
      default: true,
      isInput: true,
      type: "select",
      hideFooterContent: false,
    },
    {
      text: "Percentage of waste category",
      computeResults: true,
      value: "input.percentageOfTotalCategories",
      // conditional_value: "",
      // conditional: ["fuelType"],
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
    ...surveyTableHeaderCO2,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ].map(ensureSurveyTableHeaders);
}

export function generateComputeItem(
  projectTotalHH: number
): (
  localItemInput: MaterialSolidWasteItemInput,
  ghgMapRef: ItemReferencesMap
) => MaterialSolidWasteItemResults {
  return function computeItem(
    localItemInput: MaterialSolidWasteItemInput,
    ghgMapRef: ItemReferencesMap
  ): MaterialSolidWasteItemResults {
    const { percentageOfTotalCategories } = localItemInput;
    if (percentageOfTotalCategories === undefined) {
      console.log(ghgMapRef);
      throw new Error("number of cooktsove not defined");
    }
    if (projectTotalHH === undefined) {
      throw new Error(
        "Total House holds is undefined, please fill assessment information page and click on save"
      );
    }
    // const hhUsingTheFuel = percentageOfTotalCategories * projectTotalHH; // number of cookstoves
    let totalCO2Emission = 0;
    totalCO2Emission += 1;

    // switch (true) {
    //   default:
    //     throw new Error(`unknown management type ${fuelType}`);
    // }
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is NaN`);
    }
    return {
      totalCO2Emission,
    };
  };
}
