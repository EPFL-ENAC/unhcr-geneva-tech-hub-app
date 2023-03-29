import {
  numberOfDaysPerYear,
  numberOfWeekPerYear,
  TimePeriod,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";
import { formatNumber } from "@/plugins/filters";
import { EnergyItem, SurveyItem } from "@/store/GhgInterface.vue";

import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";

export function computeLitresDieselPerYear(localItem: EnergyItem): number {
  return computeLitresPerDayDiesel(localItem) * numberOfDaysPerYear;
}

export function computeLitresDieselPerWeek(localItem: EnergyItem): number {
  return computeLitresPerDayDiesel(localItem) * numberOfWeekPerYear;
}

export function computeLitresPerDayDiesel(localItem: EnergyItem): number {
  const {
    generatorSize = 0,
    operatingHours = 0, // perDay
    generatorLoad = 0.6,
  } = localItem || {};
  const DIE_GEN_L_per_kWh = -0.031 * Math.log(generatorLoad) + 0.2514;
  return generatorSize * operatingHours * DIE_GEN_L_per_kWh * generatorLoad;
}

export function getLitresPerYearForGeneratorHoursPerWeek(
  localItem: EnergyItem
): number {
  if (localItem.disableDieselLiters) {
    return computeLitresDieselPerWeek(localItem);
  } else {
    return localItem?.dieselLiters ?? 0;
  }
}

export function computeDieselPower(
  localItem: EnergyItem,
  REF_EFF_DIES_L: ReferenceItemInterface | undefined
): number {
  if (REF_EFF_DIES_L?.value) {
    return (localItem?.dieselLiters ?? 0) / REF_EFF_DIES_L?.value;
  }
  return 0;
}

export function computedieselLitersFromPower(
  localItem: EnergyItem,
  REF_EFF_DIES_L: ReferenceItemInterface | undefined
): number {
  if (REF_EFF_DIES_L?.value) {
    // power = litres / EFF_DIES_L THEN litres = power * EFF_DIES
    return (localItem?.dieselPower ?? 0) * REF_EFF_DIES_L?.value;
  }
  return 0;
}

function dieselEstimated(
  localInput: EnergyItem,
  PowerEstimated: boolean,
  LitersEstimated?: boolean
): EnergyItem {
  localInput.dieselPowerEstimated = PowerEstimated;
  localInput.dieselLitersEstimated =
    LitersEstimated !== undefined ? LitersEstimated : !PowerEstimated;
  return localInput;
}

function computeDieselPowerAndUpdateKey(
  key: keyof EnergyItem,
  computeLitersDiesel: (v: EnergyItem) => number,
  computeDieselPowerFromLiters: (
    v: EnergyItem,
    ghgMapRefItem: ReferenceItemInterface
  ) => number
): (
  valueOfKey: number,
  localInput: EnergyItem,
  ghgMapRef: ItemReferencesMap
) => EnergyItem {
  return (
    valueOfKey: number,
    localInput: EnergyItem,
    ghgMapRef: ItemReferencesMap
  ): EnergyItem => {
    localInput[key] = valueOfKey as unknown as undefined;
    if (key !== "dieselLiters") {
      localInput.dieselLiters = computeLitersDiesel(localInput); // we're modifying the generator
      localInput = dieselEstimated(localInput, true, true);
    } else {
      localInput = dieselEstimated(localInput, true);
    }
    // TODO divide or not by number of day.
    localInput.dieselPower = computeDieselPowerFromLiters(
      localInput as EnergyItem,
      ghgMapRef?.REF_EFF_DIES_L
    );
    return localInput;
  };
}

function computeDieselLitersFromPowerAndUpdateKey(
  key: keyof EnergyItem,
  computeLitersDieselFromPower: (
    v: EnergyItem,
    ghgMapRefItem: ReferenceItemInterface
  ) => number
): (
  valueOfKey: number,
  localInput: EnergyItem,
  ghgMapRef: ItemReferencesMap
) => EnergyItem {
  return (
    valueOfKey: number,
    localInput: EnergyItem,
    ghgMapRef: ItemReferencesMap
  ): EnergyItem => {
    localInput[key] = valueOfKey as unknown as undefined;
    localInput.dieselLiters = computeLitersDieselFromPower(
      localInput,
      ghgMapRef?.REF_EFF_DIES_L
    );
    localInput = dieselEstimated(localInput, false);
    return localInput;
  };
}

export function dieselInputsProducedPer(
  timePeriod: TimePeriod,
  timePeriodOperatingHours: TimePeriod
): any[] {
  let computePower: any;
  let computeLiters: any;
  let computeLitersFromPower: any;
  let suffix: string;
  let litersSuffix: string;
  let operatingHoursSuffix: string;
  switch (timePeriod) {
    case "Day":
      if (timePeriodOperatingHours !== "Day") {
        throw new Error(
          `${timePeriodOperatingHours} is not supported for Diesel`
        );
      }
      suffix = "Kwh/day";
      operatingHoursSuffix = "hrs/day";
      litersSuffix = "used per day";
      computeLitersFromPower = computedieselLitersFromPower;
      computeLiters = computeLitresPerDayDiesel;
      computePower = computeDieselPower;
      break;
    case "Week":
      throw new Error("Week is not supported for Solar");
      break;
    case "Year":
      if (timePeriodOperatingHours !== "Week") {
        throw new Error(
          `${timePeriodOperatingHours} is not supported for Diesel`
        );
      }
      suffix = "kWh/yr";
      litersSuffix = "used per year";
      operatingHoursSuffix = "hrs/week";
      // todo arange per week
      computeLitersFromPower = computedieselLitersFromPower;
      computeLiters = computeLitresDieselPerWeek;
      computePower = computeDieselPower;
      break;
  }
  return [
    // beginning of diesel generators
    {
      text: `Diesel (${suffix}) estimated`,
      computeResults: true,
      value: "input.dieselPower",
      hideFooterContent: false,
      formatter: (
        dieselPower: number,
        __: SurveyTableHeader,
        item: SurveyItem
      ) => {
        if (typeof dieselPower === "number") {
          return `${item?.input?.dieselPowerEstimated ? "~" : ""}${formatNumber(
            dieselPower
          )} (${item?.input?.dieselLitersEstimated ? "~" : ""}${formatNumber(
            item?.input?.dieselLiters as number
          )}L) `;
        }
        return dieselPower;
      },
      customEventInput: computeDieselLitersFromPowerAndUpdateKey(
        "dieselPower",
        computeLitersFromPower
      ),
      conditional_value: ["ELE_DIES", "ELE_HYB"],
      conditional: "fuelType",
      disabled: false,
      disabledWithConditions: "disableDieselLiters",
      disabledWithConditions_value: true,
      style: {
        cols: "12",
      },
      type: "number",
    },
    {
      value: "input.disableDieselLiters",
      conditional_value: ["ELE_DIES", "ELE_HYB"],
      text: "Number of liters of diesel known",
      conditional: "fuelType",
      style: {
        cols: "12",
      },
      options: {
        false: "yes",
        true: "no",
      },
      type: "boolean",
      customEventInput: computeDieselPowerAndUpdateKey(
        "disableDieselLiters",
        computeLiters,
        computePower
      ),
    },
    {
      value: "input.dieselLiters", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
      conditional_value: false,
      conditional: "disableDieselLiters",
      computeResults: true,
      text: `Liters of diesel used ${litersSuffix}`,
      suffix: "l",
      style: {
        cols: "12",
      },
      type: "number",
      customEventInput: computeDieselPowerAndUpdateKey(
        "dieselLiters",
        computeLiters,
        computePower
      ),
    },
    {
      value: "input.generatorSize", // maybe use dieselLiters like in DieselGeneratorWithoutLitres
      conditional_value: true,
      conditional: "disableDieselLiters",
      text: "generator size (kW)",
      tooltipInfo: "read from nameplate",
      suffix: "kW",
      min: 0,
      style: {
        cols: "12",
      },
      type: "number",
      customEventInput: computeDieselPowerAndUpdateKey(
        "generatorSize",
        computeLiters,
        computePower
      ),
    },
    {
      value: "input.generatorLoad",
      conditional_value: true,
      conditional: "disableDieselLiters",
      text: "generator load (percentage)",
      tooltipInfo:
        "default average load of 60% per year will be used if not overwritten. Load on a diesel generator is the power being consumed from the unit. In a household application the load would be the items in a house, such as lights.",
      style: {
        cols: "12",
      },
      type: "number",
      subtype: "percent",
      customEventInput: computeDieselPowerAndUpdateKey(
        "generatorLoad",
        computeLiters,
        computePower
      ),
    },
    {
      value: "input.operatingHours",
      conditional_value: true,
      conditional: "disableDieselLiters",
      text: `operating hours (${operatingHoursSuffix})`,
      tooltipInfo:
        "from daily log and application will extrapolate this information to be annual",
      suffix: operatingHoursSuffix,
      min: 0,
      style: {
        cols: "12",
      },
      type: "number",
      customEventInput: computeDieselPowerAndUpdateKey(
        "operatingHours",
        computeLiters,
        computePower
      ),
    },
    // end of diesel generatorsp
  ];
}
