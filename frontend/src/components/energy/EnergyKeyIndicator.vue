<template>
  <v-tooltip bottom :disabled="percentage === 0">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" class="text-overline" v-on="on">
        {{ name }}:
        {{ value | formatNumber }}
        <template v-if="unit">[{{ unit }}]</template>
        <span v-if="percentage !== 0" :style="{ color: color }">
          <v-icon :color="color" small>{{ icon }}</v-icon>
          {{ percentage | formatNumber(2, true) }} %
        </span>
      </div>
    </template>
    <div class="text-overline">
      Baseline: {{ baseValue | formatNumber }}
      <template v-if="unit">[{{ unit }}]</template>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { colors } from "vuetify/lib";

@Component
export default class EnergyKeyIndicator extends Vue {
  readonly betterColor = colors.green.base;
  readonly worseColor = colors.red.base;
  readonly sameColor = colors.blue.base;

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
      return this.greaterBetter ? this.worseColor : this.betterColor;
    } else if (this.value > this.baseValue) {
      return this.greaterBetter ? this.betterColor : this.worseColor;
    } else {
      return this.sameColor;
    }
  }

  get icon(): string {
    if (this.value < this.baseValue) {
      return "mdi-triangle mdi-rotate-180";
    } else if (this.value > this.baseValue) {
      return "mdi-triangle";
    } else {
      return "mdi-triangle mdi-rotate-90";
    }
  }

  get percentage(): number {
    return ((this.value - this.baseValue) / this.baseValue) * 100;
  }
}
</script>
