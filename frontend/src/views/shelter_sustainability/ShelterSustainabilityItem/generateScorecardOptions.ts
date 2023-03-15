import { formatNumber } from "@/plugins/filters";
import { ScoreCardWithShelterInfo } from "@/store/ShelterInterface";
import { ShelterColors } from "@/views/shelter_sustainability/shelterTypeColors";
import { EChartsOption } from "echarts/types/dist/shared";
import { cloneDeep } from "lodash";

export interface ScorecardConfig {
  id: string;
  min?: number;
  max?: number | (() => undefined);
  title: string;
  unit: string;
  selectedField?: string;
  selectedFieldUnit?: string;
  subpart?: boolean;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
  gridLeft?: number;
  seltectedFieldUnit?: string | undefined;
}

export function generateScorecardOptions(
  configs: ScorecardConfig[],
  scorecards: ScoreCardWithShelterInfo[],
  shelterColors: ShelterColors
): EChartsOption[] {
  const title: Record<string, string | number>[] = [];
  const singleAxis: Record<
    string,
    | string
    | number
    | boolean
    | Record<string, number>
    | ((v: MinMax) => undefined)
  >[] = [];
  const series: Record<
    string,
    string | number | boolean | Serie[] | SymbSizeFn
  >[] = [];
  configs.forEach((config: ScorecardConfig): void => {
    singleAxis.push({
      left: 10,
      type: "value",
      boundaryGap: false,
      height: "10%",
      axisLabel: {
        interval: 2,
        lineHeight: 4,
        fontSize: 8,
        margin: 4,
        inside: 0,
      },
      min: config.min ?? "dataMin",
      max: config.max ?? "dataMax",
    });
    series.push({
      singleAxisIndex: 0,
      coordinateSystem: "singleAxis",
      type: "scatter",
      data:
        cloneDeep(scorecards)?.map((item: ScoreCardWithShelterInfo) => {
          const scor = item as ScoreCardScatter;
          const key = config.id as ScoreCardsKey;
          const shelter_type = scor.shelter_type as colorType;
          const colors = shelterColors[shelter_type];
          let firstValue = parseFloat(scor[key].toFixed(3));
          if (key === "habitability" || key === "techPerf") {
            firstValue = firstValue * 100;
          }
          scor[key] = firstValue;
          return {
            value: [firstValue, scor.selected ? 4 : 2, key, scor, config],
            itemStyle: {
              color: scor.selected ? colors.primary : colors.secondary, //config.colors.secondary,
            },
            symbol: scor.selected ? "diamond" : "circle",
            symbolSize: scor.selected ? 16 : 8,
          };
        }) ?? [],
      symbolSize: (dataItem: number[]) => dataItem[1] * 4,
    });
  });
  return configs.map((config, idx) => ({
    title: title[idx],
    singleAxis: singleAxis[idx],
    series: series[idx],
    config,
    legend: {
      type: "scroll",
      top: 20,
    },
    grid: {
      bottom: 12,
    },
    tooltip: {
      trigger: "axis",
      confine: false,
      appendToBody: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any): string => {
        if (!formatNumber) {
          return "error: format number undefined";
        }
        return params.reduce((acc: string, param: Serie) => {
          acc = acc ? `${acc}<br/>` : "";
          const key = param.value[2] as ScoreCardsKey;
          const scorecard = param.value[3] as ScoreCardScatter;
          const name = scorecard.name;
          return `${acc}</div>${name}: ${formatNumber(scorecard[key])} ${
            config.unit
          }</div>`;
        }, "");
      },
    },
  }));
}

interface ScoreCardScatter extends ScoreCardWithShelterInfo {
  selected: boolean;
  id: string;
}
interface Serie {
  value: (number | string | ScoreCardScatter | ScorecardConfig)[];
}

type colorType = "Emergency" | "Transitional" | "Durable" | "";

type SymbSizeFn = (a: number[]) => number;
type ScoreCardsKey =
  | "weight"
  | "co2"
  | "h2o"
  | "techPerf"
  | "affordability"
  | "habitability";

interface MinMax {
  min: number;
  max: number;
}
