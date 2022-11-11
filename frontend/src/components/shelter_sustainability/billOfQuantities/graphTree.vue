<template>
  <v-responsive aspect-ratio="8" min-height="250">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { MaterialTree, MaterialTreeKey } from "@/store/ShelterInterface";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
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
    ...mapGetters("SheltersMaterialModule", ["materialMap"]),
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

  private generateColorSpaceForList(v: string[]): Record<string, string[]> {
    /* the idea is to return something like:
    {
      'Steel': [primary color, children color....]
    }
    We use the HWB color space for generating the colors
    https://en.wikipedia.org/wiki/HWB_color_model
    we want 10 sub colors, because we don't have more than 10 nuances of sub color
    black 60 white 0
    black 60 white 20
    black 40 white 0
    black 40 white 20
    black 20 white 0
    black 20 white 20
    black 0 white 0
    black 0 white 20
    black 0 white 40
    black 0 white 60
    black 0 white 80
    */
    // below functions are from: https://w3c.github.io/csswg-drafts/css-color/#the-hwb-notation
    /**
     * @param {number} hue -  Hue as degrees 0..360
     * @param {number} white -  Whiteness as percentage 0..100
     * @param {number} black -  Blackness as percentage 0..100
     * @return {number[]} Array of RGB components 0..1
     */
    function hwbToRgb(hue: number, white: number, black: number): number[] {
      white /= 100;
      black /= 100;
      if (white + black >= 1) {
        const gray = white / (white + black);
        return [gray, gray, gray];
      }
      const rgb = hslToRgb(hue, 100, 50);
      for (let i = 0; i < 3; i++) {
        rgb[i] *= 1 - white - black;
        rgb[i] += white;
      }
      return rgb;
    }
    /**
     * @param {number} hue - Hue as degrees 0..360
     * @param {number} sat - Saturation as percentage 0..100
     * @param {number} light - Lightness as percentage 0..100
     * @return {number[]} Array of RGB components 0..1
     */
    function hslToRgb(hue: number, sat: number, light: number) {
      hue = hue % 360;

      if (hue < 0) {
        hue += 360;
      }

      sat /= 100;
      light /= 100;

      function f(n: number) {
        const k = (n + hue / 30) % 12;
        const a = sat * Math.min(light, 1 - light);
        return light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      }

      return [f(0), f(8), f(4)];
    }
    const huesStep = Math.floor(360 / v.length);
    const white = [0, 0, 0, 20, 0, 20, 40, 60, 80];
    const black = [30, 20, 10, 10, 0, 0, 0, 0, 0];
    const wb = white.map((b, i) => [b, black[i]]);
    const result = v.reduce(
      (acc: Record<string, string[]>, el, currentIndex) => {
        acc[el] = wb.map((wbValue) => {
          const newColor = hwbToRgb(
            currentIndex * huesStep,
            wbValue[0],
            wbValue[1]
          ).map((x: number) => x * 255);
          return `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`;
        });
        return acc;
      },
      {}
    );
    return result;
  }

  private get materialIds(): string[] {
    // we want to have only the unique set of currrent table
    return Array.from(
      new Set(
        this.itemsWithoutTotal.map((item) => {
          return item.materialId;
        }) as string[]
      )
    );
    /* if we wanted to have all keys we should do the following */
    // return Array.from(
    //   new Set(Object.values(this.materialMap).map((x) => x.material))
    // );
  }
  private get materialColorsId(): Record<string, string[]> {
    return this.generateColorSpaceForList(this.materialIds);
  }

  private get itemsWithoutTotal(): MaterialTree[] {
    return this.items.length === 0 ? this.items : this.items.slice(0, -1);
  }

  public get generateTreeData(): datatree[] {
    const key = this.selectedField as MaterialTreeKey;
    const unitName = this.unitName as string;
    const localMaterialMap = this.materialMap;
    if (!localMaterialMap) {
      return [];
    }
    return this.itemsWithoutTotal.map((item: MaterialTree) => {
      const currentColors = this.materialColorsId[item.materialId ?? ""] ?? [];
      return {
        name: item.materialId,
        value: [item[key], unitName],
        itemStyle: {
          color: currentColors[0],
        },

        children: item?.children?.map((child: MaterialTree, childIndex) => {
          const matched = localMaterialMap[child.formId as string] ?? {};
          // const name = `${matched?.material} — ${matched?.form}`;
          const name = `${matched?.form}`;
          return {
            name,
            value: [child[key], unitName],
            itemStyle: {
              color: currentColors[childIndex + 1],
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
      const currentColors = this.materialColorsId[currentMaterialId] ?? [];

      result[currentMaterialId] = {
        name: currentMaterialId,
        value: [item[key], unitName] as number[],
        itemStyle: {
          color: currentColors[0],
        },
      };
      item?.children?.forEach((child: MaterialTree, childIndex) => {
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
            color: currentColors[childIndex + 1],
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((x: any) => x.name)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemStyle: any;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemStyle: any;
}
</script>

<style></style>
