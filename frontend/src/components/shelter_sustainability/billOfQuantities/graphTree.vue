<template>
  <v-responsive aspect-ratio="10" min-height="230">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { MaterialTree, MaterialTreeKey } from "@/store/ShelterInterface";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import { TreemapChart } from "echarts/charts";
import { TitleComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts/types/dist/shared";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

use([CanvasRenderer, TreemapChart, TooltipComponent, TitleComponent]);

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

  materialMap!: Record<string, ShelterMaterial>;

  private get itemsWithoutTotal(): MaterialTree[] {
    return this.items.length === 0 ? this.items : this.items.slice(0, -1);
  }

  public get generateDataTree(): datatree[] {
    const key = this.selectedField as MaterialTreeKey;
    const unitName = this.unitName as string;
    const localMaterialMap = this.materialMap;
    if (!localMaterialMap) {
      return [];
    }
    return this.itemsWithoutTotal.map(
      (item: MaterialTree) =>
        ({
          name: item.materialId,
          value: [item[key], unitName],
          children: item?.children?.map((value: MaterialTree) => {
            const matched = localMaterialMap[value.formId as string] ?? {};
            const name = `${matched?.material}—${matched?.form}`;
            return {
              name,
              value: [value[key], unitName],
            } as datatree;
          }),
        } as datatree)
    );
  }

  public get option(): EChartsOption {
    if (!this.selectedField || !this.unitName) {
      return {};
    }
    return {
      tooltip: {
        trigger: "item",
        confine: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any): string => {
          const formatNumber = this.$options.filters?.formatNumber;
          if (!formatNumber) {
            return "error: format number undefined";
          }
          const name = params.treeAncestors.reduce(
            (acc: string, node: nodeInterface) => {
              return `${acc}${acc === "" ? "" : "—"}${node.name}`;
            },
            ""
          );
          const v = params.data.value[0];
          const unit = params.data.value[1];
          return `</div>${name}: ${formatNumber(v)} ${unit}</div>`;
        },
      },
      title: [
        {
          text: this.title ?? "",
          left: "center",
          padding: [0, 0, 24, 0],
        },
      ],
      series: [
        {
          breadcrumb: {
            show: false,
          },
          roam: false,
          type: "treemap",
          data: this.generateDataTree,
        },
      ],
    };
  }
}
interface datatree {
  name: string;
  value: number[];
  children?: datatree[];
}
interface nodeInterface {
  name: string;
}
</script>

<style></style>
