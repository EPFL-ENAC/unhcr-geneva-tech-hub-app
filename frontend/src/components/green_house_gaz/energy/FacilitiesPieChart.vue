<template>
  <v-responsive height="256px" width="256px">
    <v-chart autoresize :option="option"></v-chart>
  </v-responsive>
</template>

<script lang="ts">
import { PieChart } from "echarts/charts";
import { TitleComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts/types/dist/shared";
import VChart from "vue-echarts";
import { Component, Prop, Vue } from "vue-property-decorator";

use([CanvasRenderer, PieChart, TitleComponent, TitleComponent]);

@Component({
  components: {
    VChart,
  },
})
export default class GraphTree extends Vue {
  @Prop({ type: [Object], default: () => ({}) })
  readonly option!: EChartsOption;
}
</script>

<style></style>
