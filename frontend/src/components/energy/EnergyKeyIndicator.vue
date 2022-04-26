<template>
  <div class="text-overline">
    {{ name }}:
    <span :style="{ color: color }">
      {{ value | formatNumber }}
      <template v-if="unit">[{{ unit }}]</template>
      <v-icon :color="color">{{ icon }}</v-icon>
    </span>
  </div>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { colors } from "vuetify/lib";

@Component({
  filters: {
    formatNumber(value: number, decimal = 0): string {
      return value.toLocaleString(undefined, {
        maximumFractionDigits: decimal,
      });
    },
  },
})
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
      return this.greaterBetter ? colors.red.base : colors.green.base;
    } else if (this.value > this.baseValue) {
      return this.greaterBetter ? colors.green.base : colors.red.base;
    } else {
      return colors.blue.base;
    }
  }

  get icon(): string {
    if (this.value < this.baseValue) {
      return "mdi-trending-down";
    } else if (this.value > this.baseValue) {
      return "mdi-trending-up";
    } else {
      return "mdi-trending-neutral";
    }
  }
}
</script>
