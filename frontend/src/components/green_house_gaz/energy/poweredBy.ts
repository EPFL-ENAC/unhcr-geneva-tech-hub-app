import { formatNumber } from "@/plugins/filters";
import { EnergyItem } from "@/store/GhgInterface";
import { ElectricFuel, electricFuelWithText } from "../fuelTypes";
import { TimePeriod } from "./computeCO2cost";
import { dieselInputsProducedPer } from "./dieselInputs";
import { CountryIrradianceKeys, solarInputsProducedPer } from "./solarInputs";

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
    return [
      {
        text: "Powered by",
        value: "input.fuelType", // facilityType
        type: "select",
        style: {
          cols: "12",
        },
        items: electricFuelWithText,
        formatter: (_id: string) => {
          const electricFuel = electricFuelWithText.find(
            (electricFuel) => electricFuel._id === _id
          );
          const name = electricFuel?.text ?? "Unknown";
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
      },
      ...dieselInputsProducedPer(timePeriod, "Week", inputExtension),
      // begingin og national grid
      {
        value: "input.gridPower", // maybe use like in DieselGeneratorWithoutLitres
        conditional_value: ["ELE_GRID", "ELE_HYB"],
        conditional: "fuelType",
        computeResults: true,
        // text: "Total kWh used per yr for instance",
        text: `Grid (kWh${suffixTimePeriod})`,
        suffix: `kWh${suffixTimePeriod}`,
        style: {
          cols: "12",
        },
        formatter: (v: number) => {
          return formatNumber(v);
        },
        type: "number",
        conditional_function: (localInput: EnergyItem) => {
          return (
            (localInput.fuelType === "ELE_GRID" ||
              localInput.fuelType === "ELE_HYB") &&
            (inputExtension?.conditional_function(localInput) ?? true)
          );
        },
        // ...inputExtension,
        // WHAT. I should merge conditional_value and conditional ? how's that supposed to work ?
      },
      // end of national grid\
      ...solarInputsProducedPer(
        timePeriod,
        countryCode,
        projectSolar,
        inputExtension
      ),
      {
        text: `Total (kWh${suffixTimePeriod})`,
        value: "computed.totalPower",
        hideInput: true, // so we can only display diffWarning in endline
        isInput: true,
        formatter: (v: number, { ...args }) => {
          return formatNumber(v, { suffix: args.suffix });
        },
        computeResults: true,
        type: "number",
        disabled: true,
        ...inputExtension,
      },
    ];
  } catch (e) {
    console.error(e);
  }
  return [];
}
