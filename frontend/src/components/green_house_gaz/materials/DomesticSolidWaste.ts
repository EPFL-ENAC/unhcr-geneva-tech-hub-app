import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import { formatNumberGhg } from "@/plugins/filters";
import {
  GenericFormSurvey,
  SurveyInput,
  SurveyItem,
  SurveyResult,
} from "@/store/GhgInterface";

import GhgCountryRegionMap from "@/assets/references/ghg_country_region_map.json";
import mixedBiowaste from "@/assets/references/ghg_ef_mixed_biowaste.json";
import mixedNonBiowaste from "@/assets/references/ghg_ef_mixed_non_biowaste.json";
import RefKeyName from "@/assets/references/ghg_ref_key_name.json";

import { SelectOption, SelectValue } from "@/components/commons/FormItem";
import { numberOfDaysPerYear } from "@/components/green_house_gaz/energy/computeCO2cost";

import {
  SurveyTableHeader,
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
  generationGram: number;
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

export type practiceCategoriess = "Biowaste" | "Non-biowaste";

const baselinePractices = [openPits, managedDisposalSite, openBurning]; // region dependent practices

const plastics = "Plastics";
const textiles = "Textiles";
const paper = "Paper / cardboard";
const rubber = "Rubber / leather";
const nappies = "Nappies";
const mixed = "Mixed / unkown composition";
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

export function headers() {
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
      hideFooterContent: false,
    },
    {
      conditional_value: ["Non-biowaste"],
      conditional: "biowaste",
      value: "input.nonBiowasteSubCategories",
      text: "Waste subcategories",
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
        localInput: SurveyInput;
        surveyItemHeader: SurveyTableHeader;
        intervention: boolean;
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
              endLinePractices[
                options.localInput.biowaste as practiceCategoriess
              ];
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
      tooltipInfoFn: function (value: string) {
        if (value === "Open pits, unmanaged") {
          return "Assumed to be shallow < 5 m depth";
        }
        if (value === "Managed disposal site") {
          return "At least one of these conditions: regular cover material (e.g, soil), mechanical compacting, or leveling of the waste. Example: landfill";
        }
        return "";
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
      text: "% of total waste generated",
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
        return formatNumberGhg(v, {
          style: "percent",
        });
      },
    },
    ...surveyTableHeaderCO2,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ].map(ensureSurveyTableHeaders);
}

export function generateComputeItem(
  population: number,
  generationGram: number,
  countryCode: string
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
    if (population === undefined) {
      throw new Error(
        "population is undefined, please fill assessment information page and click on save"
      );
    }
    const populationPercentage = percentageOfTotalCategories * population; // number of cookstoves
    let totalCO2Emission = 0;

    // REF depends on Region for some
    // Retrieve the region for the country
    const projectRegion = (GhgCountryRegionMap as Record<string, string>)[
      countryCode
    ];
    let REF_EFF = 0;
    const practiceType = (localItemInput?.practiceType as string) ?? "";
    const practiceKey =
      (RefKeyName as Record<string, string>)[
        localItemInput.practiceType as string
      ] ?? "";
    if (localItemInput.biowaste === bioWaste) {
      if (baselinePractices.includes(practiceType)) {
        // retrieve region dependant
        REF_EFF =
          (mixedBiowaste as Record<string, Record<string, number>>)?.[
            practiceKey
          ]?.[projectRegion] ?? 0;
      } else {
        REF_EFF = ghgMapRef?.[`REF_EFF_BIO_${practiceKey}`]?.value ?? 0;
      }
    }
    if (localItemInput.biowaste === nonBiowaste) {
      if (localItemInput.nonBiowasteSubCategories === mixed) {
        // region dependant
        if (baselinePractices.includes(practiceType)) {
          // retrieve region dependant
          REF_EFF =
            (mixedNonBiowaste as Record<string, Record<string, number>>)?.[
              practiceKey
            ]?.[projectRegion] ?? 0;
        } else {
          // should be only Recycling
          REF_EFF = 0;
        }
      } else {
        const subcatKey = (RefKeyName as Record<string, string>)[
          localItemInput.nonBiowasteSubCategories as string
        ];
        REF_EFF = ghgMapRef[`REF_EFF_${subcatKey}_${practiceKey}`]?.value ?? 0;
      }
    }
    const totalwasteAmount = //  (ton/yr)
      populationPercentage * // Population
      generationGram * // in Gram
      numberOfDaysPerYear * // days/yr
      0.000001; // (like / 1000000  (g/ton))

    totalCO2Emission = REF_EFF * totalwasteAmount;
    if (isNaN(totalCO2Emission)) {
      throw new Error(`totalCO2Emission is NaN`);
    }
    return {
      totalCO2Emission,
    };
  };
}
