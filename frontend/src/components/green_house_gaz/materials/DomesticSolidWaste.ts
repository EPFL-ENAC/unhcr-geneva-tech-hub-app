import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import { formatNumber } from "@/plugins/filters";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

import { SelectOption, SelectValue } from "@/components/commons/FormItem";

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

const openPits = "Open pits, unmanaged";
const managedDisposalSite = "Managed disposal site";
const openBurning = "Open burning";
const compositing = "Composting";
const anaerobicallyDigested = "Anaerobically digested";
const recyclingReuse = "Recycling / Reuse";

const bioWaste = "Biowaste";
const nonBiowaste = "Non-biowaste";

export type practiceTypes = "Biowaste" | "Non-biowaste";

const baselinePractices = [openPits, managedDisposalSite, openBurning];

const plastics = "Plastics";
const textiles = "Textiles";
const paper = "Paper / cardboard";
const rubber = "Rubber / leather";
const nappies = "Nappies";
const mixed = "Mixed / unkown composition ";
const biowasteSubcategories = [
  plastics,
  textiles,
  paper,
  rubber,
  nappies,
  mixed,
];

const endLinePractices: Record<string, Record<string, string[]>> = {
  [bioWaste]: {
    default: [
      openPits,
      managedDisposalSite,
      openBurning,
      compositing,
      anaerobicallyDigested,
      recyclingReuse,
    ],
  },
  [nonBiowaste]: {
    [plastics]: [openPits, managedDisposalSite, openBurning, recyclingReuse],
    [textiles]: [openPits, managedDisposalSite, openBurning, recyclingReuse],
    [paper]: [openPits, managedDisposalSite, openBurning, recyclingReuse],
    [rubber]: [openPits, managedDisposalSite, openBurning, recyclingReuse],
    [nappies]: [openPits, managedDisposalSite, openBurning],
    [mixed]: [openPits, managedDisposalSite, openBurning, recyclingReuse],
    default: [openPits, managedDisposalSite, openBurning, recyclingReuse],
  },
};

export function headers(pp_per_hh: number | undefined) {
  return [
    ...surveyTableHeaderIncrements,
    {
      value: "input.biowaste",
      text: "Type of waste",
      items: [bioWaste, nonBiowaste],
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
      value: "input.nonBiowasteSubCategories",
      text: "Non-biowaste subcategories",
      items: biowasteSubcategories,
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
      conditional_value: ["Non-biowaste", "Biowaste"],
      conditional: "biowaste",
      conditional_function: (itemInput: SurveyInput) => {
        if ([bioWaste, nonBiowaste].includes(itemInput.biowaste as string)) {
          if (
            itemInput.biowaste === nonBiowaste &&
            !itemInput.nonBiowasteSubCategories
          )
            return false;
          return true;
        }
      },
      value: "input.practiceType",
      items: (options: {
        intervention: boolean;
        localInput: SurveyInput;
      }): SelectOption<SelectValue>[] => {
        let result = baselinePractices;
        if (options.intervention) {
          result = [];
          if (
            [bioWaste, nonBiowaste].includes(
              options.localInput.biowaste as string
            )
          ) {
            const practices =
              endLinePractices[options.localInput.biowaste as practiceTypes];
            result = practices?.default ?? [];
            if (
              options.localInput.nonBiowasteSubCategories &&
              options.localInput.biowaste === nonBiowaste
            ) {
              result =
                practices[
                  options.localInput.nonBiowasteSubCategories as string
                ];
            }
          }
        }
        return result.map((item: string) => ({
          text: item,
          value: item,
        }));
      },
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
