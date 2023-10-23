import { formatNumberGhg } from "@/plugins/filters";
import { EnergyItem } from "@/store/GhgInterface";
import { ElectricFuel, electricFuelWithText } from "../fuelTypes";
import { computeCO2CostEnergy, TimePeriod } from "./computeCO2cost";
import { dieselInputsProducedPer, getDieselPowerText } from "./dieselInputs";
import {
  CountryIrradianceKeys,
  getSolarPowerText,
  solarInputsProducedPer,
} from "./solarInputs";

import {
  DIESEL,
  KM,
  LITERS,
  PETROL,
} from "@/components/green_house_gaz/wash/Trucking";
import {
  ItemReferencesMap,
  ReferenceItemInterface,
} from "@/store/GhgReferenceModule";

export function computeTotalPower(localInput: EnergyItem): number {
  let totalPower =
    (localInput?.gridPower ?? 0) +
    (localInput?.dieselPower ?? 0) +
    (localInput?.renewablePower ?? 0);
  totalPower = parseFloat(totalPower.toFixed(0));
  return totalPower;
}

export function computeCO2costElectric(
  localInput: EnergyItem,
  ghgMapRef: ItemReferencesMap,
  project_REF_GRD: ReferenceItemInterface,
  multiplicationFactor = 1
): number {
  let totalCO2Emission = 0;
  switch (localInput.fuelType) {
    case "ELE_HYB":
    case "ELE_GRID":
    case "ELE_DIES":
      totalCO2Emission =
        computeCO2CostEnergy(
          localInput,
          ghgMapRef?.REF_EFF_DIES,
          project_REF_GRD
        ) * multiplicationFactor;
      break;
    case "ELE_SOLAR":
    case "ELE_NONE":
    default:
      break;
  }
  return totalCO2Emission;
}

export function getGridPowerText() {
  return `Grid`;
}

export function poweredByInputs(
  timePeriod: TimePeriod,
  countryCode: CountryIrradianceKeys,
  projectSolar: number | undefined, // locationIrradianceValue
  inputExtension: any = {
    // extension of every input
    // hideFooterContent: false,
    // conditional_function: (),
    // cookingMode: false, // hack to know if we are in cooking mode
    // pp_per_hh: undefined, // should not be part of the input, but sometimes we should ?
  }
): any[] {
  function resetPoweredByInputs(localInput: EnergyItem): EnergyItem {
    delete localInput.fuelUsage;

    delete localInput.disableDieselLiters; // do I know the total litres of diesels
    localInput.disabledFuelUsage = false; // Number of liters of diesel known?

    localInput.generatorLoad = 0.6; // default factor of 60%
    delete localInput.generatorSize;
    delete localInput.operatingHours;

    delete localInput.solarInstalled;

    delete localInput.dieselPower;
    delete localInput.gridPower;
    delete localInput.renewablePower;
    delete localInput.totalPower;

    delete localInput.dieselPowerEstimated;
    delete localInput.dieselLitersEstimated;
    // delete localInput.renewablePowerEstimated; don't exist ?
    // delete localInput.solarInstalledEstimated;

    return localInput;
  }
  try {
    let suffixTimePeriod = "";
    switch (timePeriod) {
      case "Year":
        suffixTimePeriod = "/yr";
        break;
      case "Month":
        suffixTimePeriod = "/mo";
        break;
      case "Week":
        suffixTimePeriod = "/wk";
        break;
      case "Day":
        suffixTimePeriod = "/day";
        break;
      default:
        break;
    }
    const suffix = `kWh${suffixTimePeriod}`;

    const dieselInputs = dieselInputsProducedPer(
      timePeriod,
      "Week",
      inputExtension
    );

    const solarInputs = solarInputsProducedPer(
      timePeriod,
      countryCode,
      projectSolar,
      inputExtension
    );

    const dieselFormatter =
      dieselInputs.find((item) => item.value === "input.dieselPower")
        ?.formatter ?? (() => "");
    const solarFormatter =
      solarInputs.find((item) => item.value === "input.renewablePower")
        ?.formatter ?? (() => "");
    const gridPowerFormatter = (v: number) => {
      return formatNumberGhg(v);
    };
    return [
      {
        text: "Powered by",
        value: "input.fuelType", // facilityType
        type: "select",
        style: {
          cols: "12",
        },
        items: electricFuelWithText,
        formatter: (_id: string, args: any, item: any) => {
          const electricFuel = electricFuelWithText.find(
            (electricFuel) => electricFuel._id === _id
          );
          const name = electricFuel?.text ?? "Unknown";

          if (name === "Unknown" && item?.input?.TR_TYP === DIESEL) {
            return DIESEL;
          }

          if (name === "Unknown" && item?.input?.TR_TYP === PETROL) {
            return PETROL;
          }
          return `${name}`;
        },
        customEventInput: (fuelType: ElectricFuel, localInput: EnergyItem) => {
          localInput.fuelType = fuelType;
          localInput = resetPoweredByInputs(localInput);
          if (
            localInput.fuelType === "ELE_DIES" ||
            localInput.fuelType === "ELE_HYB"
          ) {
            localInput.disableDieselLiters = false;
          }
          return localInput;
        },
        ...inputExtension,
        hideFooterContent: false,
      },
      ...dieselInputs,
      // begingin og national grid
      {
        value: "input.gridPower", // maybe use like in DieselGeneratorWithoutLitres
        computeResults: true,
        // text: "Total kWh used per yr for instance",
        text: getGridPowerText(),
        suffix,
        style: {
          cols: "12",
        },
        formatter: gridPowerFormatter,
        type: "number",
        ...inputExtension,
        // Merge conditional_value and conditional_function from inputExtension
        conditional_function: (localInput: EnergyItem) => {
          return (
            (localInput.fuelType === "ELE_GRID" ||
              localInput.fuelType === "ELE_HYB") &&
            (inputExtension?.conditional_function?.(localInput) ?? true)
          );
        },
      },
      // end of national grid\
      ...solarInputs,
      // {
      //   text: `Total (kWh${suffixTimePeriod})`,
      //   value: "computed.totalPower",
      //   hideInput: true, // so we can only display diffWarning in endline
      //   isInput: true,
      //   formatter: (v: number, { ...args }) => {
      //     return formatNumberGhg(v, { suffix: args.suffix });
      //   },
      //   computeResults: true,
      //   type: "number",
      //   disabled: true,
      //   ...inputExtension,
      // },
      {
        text: `Annual fuel / Energy consumption`,
        value: "computed.totalPower",
        hideInput: true, // so we can only display diffWarning in endline
        isInput: true,
        formatter: (v: number, { ...args }, localInput: any) => {
          if (
            localInput?.input?.fuelType === "ELE_SOLAR" ||
            localInput?.input?.fuelType === "ELE_HYB" ||
            localInput?.input?.fuelType === "ELE_GRID"
            // localInput?.input?.fuelType === "ELE_DIES"
          ) {
            // use the formater of the correct input!
            return formatNumberGhg(v, { suffix });
          }
          if (localInput?.input?.fuelType === "ELE_DIES") {
            return dieselFormatter(v, args, localInput);
          }
          if (localInput?.input?.fuelType === "NO_ACCESS") {
            return "No access";
          }
          if (localInput?.input?.US_UNI === KM) {
            return `~${formatNumberGhg(
              localInput?.computed?.fuelUsage
            )} L${suffixTimePeriod}`;
          }

          if (localInput?.input?.US_UNI === LITERS) {
            return `${formatNumberGhg(localInput?.input?.fuelUsage, {
              suffix: `L${suffixTimePeriod}`,
              minimumFractionDigits: 2,
            })}`;
          }
        },
        tooltipInfoFn: (value: string, args: any, localItem: any) => {
          // iterate diesel/grid/solar estimated
          if (localItem?.input?.fuelType === "ELE_HYB") {
            return `
          <ul>
              <li>
              ${getDieselPowerText()}:
                  ${dieselFormatter(
                    localItem?.input?.dieselPower,
                    args,
                    localItem
                  )}
              </li>
              <li>
                ${getGridPowerText()}:
                ${gridPowerFormatter(localItem?.input?.gridPower)}
              </li>
              <li>
              ${getSolarPowerText()}:
              ${solarFormatter(localItem?.input?.renewablePower)}
            </li>
            <ul>
          `;
          }
          return false;
        },
        computeResults: true,
        type: "number",
        disabled: true,
        ...inputExtension,
        hideFooterContent: false, // overide the inputExtension
      },
    ];
  } catch (e) {
    console.error(e);
  }
  return [];
}
