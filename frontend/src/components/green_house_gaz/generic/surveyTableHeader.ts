import { SelectOption, SelectValue } from "@/components/commons/FormItem";
import { formatNumber } from "@/plugins/filters";
import {
  SurveyInput,
  SurveyInputValue,
  SurveyItem,
} from "@/store/GhgInterface.vue";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { get as _get } from "lodash";

function n2sFormatter(n: number): string {
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

export const ensureSurveyTableHeaders = (item: any): SurveyTableHeader => {
  // todo: implement typescript for item
  const [category, key] = item.value.split(".");
  const isInput = item?.isInput ?? category === "input";
  return {
    align: "start",
    sortable: false,
    hideFooterContent: item.hideFooterContent ?? true,
    hideInput: item.hideInput ?? false,
    label: item.text, // for form-item-component
    key, // for form-item-component
    isInput,
    category, // input or computed,
    formatter: (value: unknown) => value,
    classFormatter: () => "",
    options: (() => {
      if (item.options) {
        return item.options;
      }
      const items = item?.items;
      if (typeof items === "string") {
        // items should not be string.
        return [];
      }
      return (
        items?.map((item: string | SelectCustom<string>) => {
          if (typeof item === "string") {
            return { text: item, value: item };
          }
          return {
            text: item?.text,
            value: item?._id,
          };
        }) ?? undefined
      );
    })(),
    ...item,
  } as SurveyTableHeader;
};

export const surveyTableHeaderCO2 = [
  {
    text: "Total CO2 Emissions (tCO2e/yr)",
    value: "computed.totalCO2Emission",
    hideFooterContent: false,
    formatter: (v: number, { ...args }) => {
      return formatNumber(v, { suffix: args.suffix });
    },
    computeResults: true,
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
      return formatNumber(v, {
        style: "percent",
        signDisplay: "exceptZero",
      });
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
];
export const surveyTableHeaderIncrements = [
  {
    text: "#", // unique name === dropdown of existant facilities
    value: "increment",
    type: "number",
    hideFooterContent: false,
    baselineOnly: true,
    formatter: n2sFormatter,
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
      const increments = items
        .filter((item: SurveyItem) => item.originIncrement === v)
        .map((item: SurveyItem) => item.increment);
      const indexOf = increments.indexOf(increment);
      return `${n2sFormatter(v)}${"'".repeat(indexOf + 1)}`;
    },
    formatterOrigin: (v: number) => {
      return `${n2sFormatter(v)}`;
    },
  },
];

export interface SelectCustom<V> {
  text: string;
  _id: V;
}

export interface SurveyTableHeader extends EasySurveyTableHeader {
  key: string; // key of input or computed inside input field
  suffix: string; // "l", //if we need to have a suffix displayed in table or input
  align: string; // "start"; // only for table
  sortable: boolean; // false,
}
export interface EasySurveyTableHeader {
  text: string | ((v: SurveyInput) => string); //.e.g "Intervention" description or text to display for input or table header
  value: string; // name of the field to use for table
  type: string; // number etc for text-field type of value in formatter by the way
  items: string[] | string;
  options: SelectOption<SelectValue>[];
  isInput: boolean;
  label?: string;
  tooltipInfo?: string;
  category?: string; // example increment
  classFormatter?: (v: unknown) => string;
  customEventInput?: (
    v: SurveyInputValue,
    localInput: SurveyInput,
    ghgMapRef?: ItemReferencesMap
  ) => SurveyInput;
  formatter?: (v: unknown) => string;
  conditional_value: SurveyInputValue; // e.g "LITRES",
  conditional: string | string[]; // based on other SurveyTableHeader field "US_UNI", needs to have conditional_value set
  endlineOnly?: boolean; // show only for enldine table true,
  baselineOnly?: boolean;
  hideFooterContent: boolean; // default to true only for table
  computeResults: boolean; // false,
}
