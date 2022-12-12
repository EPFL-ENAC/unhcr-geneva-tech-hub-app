<template>
  <v-tooltip bottom :disabled="percentage === 0">
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" class="text-subtitle-1" v-on="on">
        {{ name }}:
        <span class="font-weight-bold">{{
          value |
            formatNumber({
              maximumFractionDigits: 0,
            })
        }}</span>
        <template v-if="unit"> [{{ unit }}]</template>
        <span v-if="percentage !== 0" :style="{ color: color }"
          >&nbsp;<v-icon :class="iconClass" :color="color" small
            >$mdiTriangle</v-icon
          >
          <span>{{
            percentage |
              formatNumber({
                style: "percent",
                signDisplay: "exceptZero",
                maximumFractionDigits: 0,
              })
          }}</span>
        </span>
      </div>
    </template>
    <div class="text-subtitle-1">
      Baseline:
      {{
        baseValue |
          formatNumber({
            maximumFractionDigits: 0,
          })
      }}
      <template v-if="unit">[{{ unit }}]</template>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
import { indicatorColors } from "@/plugins/vuetify";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class EnergyKeyIndicator extends Vue {
  @Prop(String)
  readonly name!: string;
  @Prop(Number)
  readonly baseValue!: number;
  @Prop(Number)
  readonly value!: number;
  @Prop(String)
  readonly unit: number | undefined;
  @Prop({ type: Boolean, default: false })
  readonly greaterBetter!: boolean;

  get color(): string {
    if (this.value < this.baseValue) {
      return this.greaterBetter ? indicatorColors.bad : indicatorColors.good;
    } else if (this.value > this.baseValue) {
      return this.greaterBetter ? indicatorColors.good : indicatorColors.bad;
    } else {
      return indicatorColors.neutral;
    }
  }

  get iconClass(): string {
    if (this.value < this.baseValue) {
      return "rotate-180";
    } else if (this.value > this.baseValue) {
      return "";
    } else {
      return "rotate-90";
    }
  }

  get percentage(): number {
    return ((this.value - this.baseValue) / this.baseValue) * 100;
  }
}
</script>
