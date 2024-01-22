import {
  numberOfDaysPerYear,
  numberOfWeekPerYear,
  TimePeriod,
} from "@/components/green_house_gaz/energy/computeCO2cost";
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";
import { formatNumberGhg } from "@/plugins/filters";
import { ghg } from "@/utils/apps";

import { EnergyItem, SurveyInput, SurveyItem } from "@/store/GhgInterface";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";
import { EnergyCookingItemInput, getDefaultFuel } from "./Cooking";

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
    return localItem?.fuelUsage ?? 0;
  }
}

export function computeDieselPower(
  localItem: EnergyItem,
  REF_EFF_DIES_L: ReferenceItemInterface | undefined
): number {
  if (REF_EFF_DIES_L?.value) {
    return (localItem?.fuelUsage ?? 0) / REF_EFF_DIES_L?.value;
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

export function dieselEstimated(
  PowerEstimated: boolean,
  LitersEstimated?: boolean
): { dieselPowerEstimated: boolean; dieselLitersEstimated: boolean } {
  const dieselPowerEstimated = PowerEstimated;
  const dieselLitersEstimated =
    LitersEstimated !== undefined ? LitersEstimated : !PowerEstimated;
  return { dieselPowerEstimated, dieselLitersEstimated };
}

export function computeDieselPowerAndUpdateKey(
  key: keyof EnergyItem,
  computeLitersDiesel: (v: EnergyItem) => number,
  computeDieselPowerFromLiters: (
    v: EnergyItem,
    ghgMapRefItem: ReferenceItemInterface
  ) => number,
  cookingMode?: boolean,
  pp_per_hh?: number
): (
  valueOfKey: number | boolean,
  localInput: EnergyItem,
  ghgMapRef: ItemReferencesMap
) => EnergyItem {
  return (
    valueOfKey: number | boolean,
    localInput: EnergyItem,
    ghgMapRef: ItemReferencesMap
  ): EnergyItem => {
    localInput[key] = valueOfKey as unknown as undefined;

    const powerFactor = ghgMapRef?.REF_POW_FAC?.value ?? 0.8;
    if (key === "generatorSizekVA") {
      let generatorSize = (valueOfKey as number) * powerFactor;
      // truncate the above value to two decimals points after zero
      generatorSize = parseFloat(generatorSize.toFixed(2));
      localInput.generatorSize = generatorSize;
    }
    if (key === "generatorSize") {
      let generatorSizekVA = (valueOfKey as number) / powerFactor;
      generatorSizekVA = parseFloat(generatorSizekVA.toFixed(2));
      localInput.generatorSizekVA = generatorSizekVA;
    }

    if (key === "disableDieselLiters" && cookingMode) {
      // set default VALUE for fuelUsage here...
      // for cookstove
      // false means generator config known
      // true means liters field enabled and we should have default value
      // else it's the oposite
      if (valueOfKey) {
        localInput.fuelUsage = getDefaultFuel(
          localInput as EnergyCookingItemInput,
          pp_per_hh
        );
      }
    } else {
      if (key !== "fuelUsage") {
        localInput.fuelUsage = computeLitersDiesel(localInput); // we're modifying the generator
        const dieselEstimatedRes = dieselEstimated(true, true);
        localInput.dieselPowerEstimated =
          dieselEstimatedRes.dieselLitersEstimated;
        localInput.dieselLitersEstimated =
          dieselEstimatedRes.dieselLitersEstimated;
      } else {
        const dieselEstimatedRes = dieselEstimated(true);
        localInput.dieselPowerEstimated =
          dieselEstimatedRes.dieselLitersEstimated;
        localInput.dieselLitersEstimated =
          dieselEstimatedRes.dieselLitersEstimated;
      }
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
    localInput.fuelUsage = computeLitersDieselFromPower(
      localInput,
      ghgMapRef?.REF_EFF_DIES_L
    );
    const dieselEstimatedRes = dieselEstimated(false);
    localInput.dieselPowerEstimated = dieselEstimatedRes.dieselLitersEstimated;
    localInput.dieselLitersEstimated = dieselEstimatedRes.dieselLitersEstimated;

    return localInput;
  };
}
export function getDieselPowerText(): string {
  return `Diesel estimated (kWh/yr)`;
}

export function dieselInputsProducedPer(
  timePeriod: TimePeriod,
  timePeriodOperatingHours: TimePeriod,
  { hideFooterContent, cookingMode, pp_per_hh } = {
    hideFooterContent: false,
    cookingMode: false,
    pp_per_hh: undefined,
  } as {
    hideFooterContent?: boolean;
    cookingMode?: boolean;
    pp_per_hh?: number;
  }
): any[] {
  let computePower: any;
  let computeLiters: any;
  let computeLitersFromPower: any;
  let powerSuffix!: string;
  let litersSuffix!: string;
  let operatingHoursSuffix!: string;

  switch (timePeriod) {
    case "Day": {
      powerSuffix = "kWh/day";
      operatingHoursSuffix = "hrs/day";
      litersSuffix = "used per day";
      computeLitersFromPower = computedieselLitersFromPower;
      computeLiters = computeLitresPerDayDiesel;
      computePower = computeDieselPower;
      if (timePeriodOperatingHours !== "Day") {
        throw new Error(
          `${timePeriodOperatingHours} is not supported for Diesel`
        );
      }
      break;
    }
    case "Week": {
      throw new Error("Week is not supported for Solar");
    }
    case "Month": {
      powerSuffix = "kWh/month";
      litersSuffix = "used per month";
      operatingHoursSuffix = "hrs/week";
      break;
    }
    case "Year": {
      if (timePeriodOperatingHours !== "Week") {
        throw new Error(
          `${timePeriodOperatingHours} is not supported for Diesel`
        );
      }
      powerSuffix = "kWh/yr";
      litersSuffix = "used per year";
      operatingHoursSuffix = "hrs/week";
      // todo arange per week
      computeLitersFromPower = computedieselLitersFromPower;
      computeLiters = computeLitresDieselPerWeek;
      computePower = computeDieselPower;
      break;
    }
    default:
      break;
  }

  // cookingInputs replace default Inputs
  const defaultInputs = [
    {
      value: "input.disableDieselLiters",
      text: "Number of liters of diesel known?",
      conditional_value: ["ELE_DIES", "ELE_HYB"],
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
        computePower,
        cookingMode,
        pp_per_hh
      ),
    },
  ];
  const cookingInputs = [
    {
      value: "input.disableDieselLiters",
      text: "Generator size and working hours known?", // Number of liters of diesel known
      // conditional_value: [["ELE_DIES", "ELE_HYB"], [true]],
      // conditional: ["fuelType"],
      // conditional_type: "AND",
      conditional_function: (
        itemInput: SurveyInput,
        tableHeader: SurveyTableHeader
      ) => {
        if (
          itemInput.fuelType &&
          !["ELE_DIES", "ELE_HYB"].includes(itemInput.fuelType as string)
        ) {
          return false;
        }
        return itemInput.disabledFuelUsage;
        // return false;
        // rules regarding appliance :
        //   - only some cookstove tech have access (      conditional_value: allFuelsButElectric,
        // conditional: "fuelType",)
        //   - show if Fuel quantity not known (disabledFuelUsage is true)
        //   - show only if
        //     - cooking is electric diesel generator AND
        //     -  disabledFuelUsage is True AND
        //     -  disableDieselLiters is False (no diesel generator charact )
        // when disabledFuelUsage == TRUE AND disableDieselLiters is False --> automatic number of diesel liters with default value
      },
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
        computePower,
        cookingMode,
        pp_per_hh
      ),
    },
  ];
  const dynamicDieselInputs = cookingMode ? cookingInputs : defaultInputs;
  const showGeneratorOptionFunction = (itemInput: SurveyInput) => {
    if (cookingMode) {
      return (
        itemInput.disabledFuelUsage === true &&
        itemInput.disableDieselLiters === false
      );
    } else {
      return itemInput.disableDieselLiters === true;
    }
  };

  const dieselEstimatedInput = (suffix: string) => ({
    text: getDieselPowerText(),
    computeResults: true,
    value: "input.dieselPower",
    hideFooterContent,
    conditional_function: (itemInput: SurveyInput) => {
      // if (
      //   itemInput.cookstove &&
      //   !["ELE_DIES", "ELE_HYB"].includes(itemInput.cookstove as string)
      // ) {
      //   return false;
      // }
      // return true;
      if (
        itemInput.fuelType &&
        !["ELE_DIES", "ELE_HYB"].includes(itemInput.fuelType as string)
      ) {
        return false;
      }
      if (cookingMode) {
        return (
          itemInput.disabledFuelUsage === false ||
          itemInput.disableDieselLiters != undefined
        );
      } else {
        return itemInput.fuelType; // meaning it's defined
      }
      // if (cookingMode) {
      //   return (
      //     itemInput.disabledFuelUsage === true ||
      //     itemInput.disableDieselLiters
      //   );
      // } else {
      //   return itemInput.disableDieselLiters != undefined;
      // }
      // rules regarding appliance :
      //   - only some cookstove tech have access (      conditional_value: allFuelsButElectric,
      // conditional: "fuelType",)
      //   - show if Fuel quantity not known (disabledFuelUsage is true)
      //   - show only if
      //     - cooking is electric diesel generator AND
      //     -  disabledFuelUsage is True AND
      //     -  disableDieselLiters is False (no diesel generator charact )
      // when disabledFuelUsage == TRUE AND disableDieselLiters is False --> automatic number of diesel liters with default value
    },
    formatter: (
      dieselPower: number,
      __: SurveyTableHeader,
      item: SurveyItem
    ) => {
      if (typeof dieselPower === "number") {
        return `${
          item?.input?.dieselPowerEstimated ? "~" : ""
        }${formatNumberGhg(dieselPower, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })} ${suffix} (${
          item?.input?.dieselLitersEstimated ? "~" : ""
        }${formatNumberGhg(item?.input?.fuelUsage as number, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}L) `;
      }
      return dieselPower;
    },
    customEventInput: computeDieselLitersFromPowerAndUpdateKey(
      "dieselPower",
      computeLitersFromPower
    ),
    conditional_value: ["ELE_DIES", "ELE_HYB"],
    conditional: "fuelType",
    conditional_disabled_function: (itemInput: SurveyInput) => {
      return itemInput.disableDieselLiters == !cookingMode;
    },
    style: {
      cols: "12",
    },
    type: "number",
  });

  return [
    // beginning of diesel generators

    ...dynamicDieselInputs,
    {
      value: "input.fuelUsage",
      conditional_function: (itemInput: SurveyInput) => {
        if (
          itemInput.fuelType &&
          !["ELE_DIES", "ELE_HYB"].includes(itemInput.fuelType as string)
        ) {
          return false;
        }
        if (cookingMode) {
          return (
            itemInput.disabledFuelUsage === false ||
            itemInput.disableDieselLiters === true
          );
        } else {
          return itemInput.disableDieselLiters === false;
        }
        // rules regarding appliance :
        //   - only some cookstove tech have access (      conditional_value: allFuelsButElectric,
        // conditional: "fuelType",)
        //   - show if Fuel quantity not known (disabledFuelUsage is true)
        //   - show only if
        //     - cooking is electric diesel generator AND
        //     -  disabledFuelUsage is True AND
        //     -  disableDieselLiters is False (no diesel generator charact )
        // when disabledFuelUsage == TRUE AND disableDieselLiters is False --> automatic number of diesel liters with default value
      },
      computeResults: true,
      // TODO: beware for lighting it should be per hh per day like cookstove
      // but for facility it's not per hh
      text: `Liters of diesel ${litersSuffix}${cookingMode ? "/HH" : ""}`,
      suffix: "l",
      style: {
        cols: "12",
      },
      type: "number",
      customEventInput: computeDieselPowerAndUpdateKey(
        "fuelUsage",
        computeLiters,
        computePower,
        cookingMode,
        pp_per_hh
      ),
    },

    {
      value: "input.generatorSize", // maybe like in DieselGeneratorWithoutLitres
      conditional_function: showGeneratorOptionFunction,
      text: "generator size (kW)",
      tooltipInfo: "read from nameplate",
      suffix: "kW",
      min: 0,
      style: {
        cols: "6",
      },
      type: "number",
      customEventInput: computeDieselPowerAndUpdateKey(
        "generatorSize",
        computeLiters,
        computePower,
        cookingMode,
        pp_per_hh
      ),
    },
    {
      value: "input.generatorSizekVA", // maybe like in DieselGeneratorWithoutLitres
      conditional_function: showGeneratorOptionFunction,
      text: "generator size (kVA)",
      tooltipAttrs: {
        "open-on-click": true,
        "open-on-focus": false,
        "open-on-hover": false,
        "close-delay": 1000,
      },
      tooltipInfo:
        "kVA * Default Power Factor = kW \n Default Power Factor found in <a href='#reference-data'>databases for diesel generators</a>",
      hint: `kVA * Default Power Factor = kW \n Default Power Factor found in databases for diesel generators`,
      persistentHint: true,
      suffix: "kVA",
      min: 0,
      style: {
        cols: "6",
      },
      type: "number",
      customEventInput: computeDieselPowerAndUpdateKey(
        "generatorSizekVA",
        computeLiters,
        computePower,
        cookingMode,
        pp_per_hh
      ),
    },
    {
      value: "input.generatorLoad",
      conditional_function: showGeneratorOptionFunction,
      text: "generator load (percentage)",
      tooltipAttrs: {
        "open-on-click": true,
        "open-on-focus": false,
        "open-on-hover": false,
        "close-delay": 1000,
      },
      tooltipInfo: `Load refers to the electrical demand or consumption placed on the generator by connected devices, equipment, or systems.
        <br/> The average load is calculated by determining the total electrical energy consumed over a given time period and dividing it by the duration of that period. Based on an <a target="_blank" href="/s3/2023-11-23/DG.fuel.efficiency.pdf">engineering study</a> on diesel generators where a logarithmic relationship was found to best represent fuel consumption and load, the average load placed on diesel generators ranging from 5 to 2500 kW was found to be 60%.
        (see Appendix C in <a href="${ghg.link}" target="_blank">${ghg.linkName}</a>).`,
      style: {
        cols: "12",
      },
      hint: "default: 60%",
      type: "number",
      subtype: "percent",
      customEventInput: computeDieselPowerAndUpdateKey(
        "generatorLoad",
        computeLiters,
        computePower,
        cookingMode,
        pp_per_hh
      ),
    },
    {
      value: "input.operatingHours",
      conditional_function: showGeneratorOptionFunction,
      text: `operating hours (${operatingHoursSuffix})`,
      tooltipInfo:
        "from daily log and application will extrapolate this information to be annual",
      suffix: operatingHoursSuffix,
      min: 0,
      // max: 24 * 7, // not logical to have more than 24*7 hours per week
      maxFn: (): number | undefined => {
        // warning since it's a percentage we return 1; because it means 100%
        if (operatingHoursSuffix === "hrs/week") {
          // since the default is 100% for percentage, if we want to change it
          // we need to max it out to something like 100000% which is not really possible
          return 24 * 7;
        }
        if (operatingHoursSuffix === "hrs/day") {
          return 24;
        }
        return 1;
      },
      style: {
        cols: "12",
      },
      type: "number",
      customEventInput: computeDieselPowerAndUpdateKey(
        "operatingHours",
        computeLiters,
        computePower,
        cookingMode,
        pp_per_hh
      ),
    },
    // end of diesel generatorsp
    dieselEstimatedInput(powerSuffix),
  ];
}
