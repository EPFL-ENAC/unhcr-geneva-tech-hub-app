<template>
  <v-responsive aspect-ratio="10" min-height="200">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { TreemapChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { Component, Vue } from "vue-property-decorator";

use([
  CanvasRenderer,
  TreemapChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
]);

@Component({
  components: {
    VChart,
  },
})
export default class GraphTree extends Vue {
  option = {
    series: [
      {
        type: "treemap",
        data: [
          {
            name: "nodeA", // First tree
            value: 10,
            children: [
              {
                name: "nodeAa", // First leaf of first tree
                value: 4,
              },
              {
                name: "nodeAb", // Second leaf of first tree
                value: 6,
              },
            ],
          },
          {
            name: "nodeB", // Second tree
            value: 20,
            children: [
              {
                name: "nodeBa", // Son of first tree
                value: 20,
                children: [
                  {
                    name: "nodeBa1", // Granson of first tree
                    value: 20,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
</script>

<style></style>
