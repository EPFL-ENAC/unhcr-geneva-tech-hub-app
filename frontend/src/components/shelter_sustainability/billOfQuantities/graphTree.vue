<template>
  <v-responsive aspect-ratio="10" min-height="200">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { MaterialTree, MaterialTreeKey } from "@/store/ShelterInterface";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import { TreemapChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts/types/dist/shared";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

use([CanvasRenderer, TreemapChart, TooltipComponent]);

@Component({
  components: {
    VChart,
  },
  ...mapGetters("SheltersMaterialModule", ["materialMap"]),
})
export default class GraphTree extends Vue {
  @Prop({ type: [Object, Array], default: () => [] })
  readonly items!: MaterialTree[];
  @Prop([String])
  readonly selectedField: MaterialTreeKey | undefined;

  materialMap!: Record<string, ShelterMaterial>;

  public generateDataTree(key: MaterialTreeKey): datatree[] {
    return this.items.map(
      (item: MaterialTree) =>
        ({
          name: item.materialId,
          value: item[key],
          children: item?.children?.map(
            (value: MaterialTree) =>
              ({
                name: this.materialMap[value.formId as string].form,
                value: value[key],
              } as datatree)
          ),
        } as datatree)
    );
  }

  public get option(): EChartsOption {
    if (!this.selectedField) {
      return {};
    }
    return {
      tooltip: {
        trigger: "item",
        confine: true,
      },
      series: [
        {
          breadcrumb: {
            show: false,
          },
          roam: false,
          type: "treemap",
          data: this.generateDataTree(this.selectedField),
        },
      ],
    };
  }
}
interface datatree {
  name: string;
  value: number;
  children?: datatree[];
}
</script>

<style></style>
