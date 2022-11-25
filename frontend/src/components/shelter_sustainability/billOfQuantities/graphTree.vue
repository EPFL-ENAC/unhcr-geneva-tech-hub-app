<template>
  <v-responsive aspect-ratio="8" min-height="250">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { MaterialTree, MaterialTreeKey } from "@/store/ShelterInterface";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import { materialColors } from "@/utils/materialColors";
import {
  SankeyChart,
  SankeySeriesOption,
  SunburstChart,
  TreemapChart,
} from "echarts/charts";
import { TitleComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  EChartsOption,
  TitleOption,
  TooltipOption,
} from "echarts/types/dist/shared";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

use([
  CanvasRenderer,
  TreemapChart,
  SunburstChart,
  SankeyChart,
  TooltipComponent,
  TitleComponent,
]);

@Component({
  components: {
    VChart,
  },
  computed: {
    ...mapGetters("SheltersMaterialModule", ["materialMap", "materials"]),
  },
})
export default class GraphTree extends Vue {
  @Prop({ type: [Object, Array], default: () => [] })
  readonly items!: MaterialTree[];
  @Prop([String])
  readonly selectedField: MaterialTreeKey | undefined;
  @Prop([String])
  readonly unitName: string | undefined;
  @Prop([String])
  readonly title: string | undefined;
  @Prop({ type: [String], default: "sunburst" })
  readonly graphType!: string;

  materialMap!: Record<string, ShelterMaterial>;
  materials!: string[];
  materialColors = materialColors;
  private get itemsWithoutTotal(): MaterialTree[] {
    return this.items.length === 0 ? this.items : this.items.slice(0, -1);
  }

  public get generateTreeData(): datatree[] {
    const key = this.selectedField as MaterialTreeKey;
    const unitName = this.unitName as string;
    const localMaterialMap = this.materialMap;
    if (!localMaterialMap || Object.keys(localMaterialMap).length == 0) {
      return [];
    }

    return this.itemsWithoutTotal.map((item: MaterialTree) => {
      const currentColors = [
        ...(this.materialColors[item.materialId ?? ""] ?? []),
      ];

      return {
        name: item.materialId,
        value: [item[key], unitName],
        itemStyle: {
          color: currentColors[0],
        },

        children: item?.children?.map((child: MaterialTree) => {
          const matched = localMaterialMap[child.formId as string] ?? {};
          // const name = `${matched?.material} — ${matched?.form}`;
          const name = `${matched?.form}`;
          return {
            name,
            value: [child[key], unitName],
            itemStyle: {
              color: matched.color,
            },
          } as datatree;
        }),
      } as datatree;
    });
  }
  public get sankeyData(): sankeyData[] {
    const result: Record<string, sankeyData> = {};
    const localMaterialMap = this.materialMap;
    const key = this.selectedField as MaterialTreeKey;
    const unitName = this.unitName as string;

    this.itemsWithoutTotal.forEach((item: MaterialTree) => {
      const currentMaterialId = item.materialId ?? "";
      const currentColors = this.materialColors[currentMaterialId] ?? [];

      result[currentMaterialId] = {
        name: currentMaterialId,
        value: [item[key], unitName] as number[],
        itemStyle: {
          color: currentColors[0],
        },
      };
      item?.children?.forEach((child: MaterialTree) => {
        const matched = localMaterialMap[child.formId as string] ?? {};
        // const name = `${matched?.material} — ${matched?.form}`;
        const name = `${matched?.form}`;
        const currentValue = child[key] as number;
        const previousValue = result[name]?.value?.[0];
        result[name] = {
          name,
          value: [
            previousValue ? currentValue + previousValue : currentValue,
            unitName,
          ] as number[],
          itemStyle: {
            color: matched.color ?? "grey",
          },
        };
      });
    });
    return Object.values(result);
  }

  public get sankeyLinks(): sankeyLinks[] {
    const result: sankeyLinks[] = [];
    const localMaterialMap = this.materialMap;
    const key = this.selectedField as MaterialTreeKey;
    const unitName = this.unitName as string;

    let source: string;
    this.itemsWithoutTotal.forEach((item: MaterialTree) => {
      source = item.materialId ?? "";
      item?.children?.forEach((child: MaterialTree) => {
        const matched = localMaterialMap[child.formId as string] ?? {};
        // const name = `${matched?.material} — ${matched?.form}`;
        const name = `${matched?.form}`;
        result.push({
          source,
          target: name,
          value: [child[key], unitName] as number[],
        });
      });
    });
    return result;
  }

  public get option(): EChartsOption {
    if (!this.selectedField || !this.unitName) {
      return {};
    }
    if (this.graphType === "sunburst") {
      return this.optionSunburst;
    }
    if (this.graphType === "treemap") {
      return this.optionTreeMap;
    }
    if (this.graphType === "sankey") {
      return this.optionSankey;
    }
    throw new Error("graphType does not exist");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public tooltipFormatter(params: any): string {
    const formatNumber = this.$options.filters?.formatNumber;
    if (!formatNumber) {
      return "error: format number undefined";
    }
    const v = params.data.value[0];
    const unit = params.data.value[1];
    const name = params.treePathInfo
      .map((x: TreePathInfo) => x.name)
      .join(" — ")
      .substr(3);
    return `</div>${name}: ${formatNumber(v)} ${unit}</div>`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public tooltipSankeyFormatter(params: any): string {
    const formatNumber = this.$options.filters?.formatNumber;
    if (!formatNumber) {
      return "error: format number undefined";
    }
    const [value, unit] = params.data.value;
    return `</div>${params.name}: ${formatNumber(value)} ${unit}</div>`;
  }

  public get tooltipOption(): TooltipOption {
    return {
      trigger: "item",
      confine: false,
      formatter: this.tooltipFormatter,
    };
  }
  public get titleOption(): TitleOption[] {
    return [
      {
        text: this.title ?? "",
        left: "center",
        padding: [0, 0, 40, 0],
        textStyle: {
          height: 80,
        },
      },
    ];
  }

  public get optionSunburst(): EChartsOption {
    return {
      tooltip: this.tooltipOption,
      title: this.titleOption,
      series: [
        {
          emphasis: {
            focus: "ancestor",
          },
          type: "sunburst",
          id: "graphTreeIdEchart",
          radius: ["20%", "80%"],
          nodeClick: undefined,
          data: this.generateTreeData,
          animationDurationUpdate: 1000,
          universalTransition: true,
          itemStyle: {
            borderWidth: 1,
            borderColor: "rgba(150,160,255,.5)",
            borderRadius: 7,
          },
          label: {
            show: false,
          },
        },
      ],
    };
  }

  public get optionTreeMap(): EChartsOption {
    return {
      tooltip: this.tooltipOption,
      title: this.titleOption,
      series: [
        {
          breadcrumb: {
            show: false,
          },
          id: "graphTreeIdEchart",
          animationDurationUpdate: 1000,
          universalTransition: true,
          roam: false,
          type: "treemap",
          data: this.generateTreeData,
        },
      ],
    };
  }
  public get optionSankey(): EChartsOption {
    const series: SankeySeriesOption = {
      type: "sankey",
      emphasis: {
        focus: "adjacency",
      },
      nodeAlign: "left",
      id: "graphTreeIdEchart",
      top: 30,
      data: this.sankeyData,
      links: this.sankeyLinks,
      lineStyle: {
        color: "source",
        curveness: 0.5,
      },
    };
    return {
      tooltip: {
        formatter: this.tooltipSankeyFormatter,
        triggerOn: "mousemove",
      },
      title: this.titleOption,
      series,
    };
  }
}
interface datatree {
  name: string;
  value: number[];
  itemStyle: Record<string, string>;
  children?: datatree[];
}

interface sankeyLinks {
  source: string;
  target: string;
  value: number[];
}

interface sankeyData {
  name: string;
  value: number[];
  itemStyle: Record<string, string>;
}

interface TreePathInfo {
  name: string;
  dataIndex: number;
  value: OptionDataItem;
}

declare type OptionDataItem =
  | OptionDataValue
  | Dictionary<OptionDataValue>
  | OptionDataValue[];
declare type OptionDataValue = string | number;
declare type Dictionary<T> = {
  [key: string]: T;
};
</script>

<style></style>
