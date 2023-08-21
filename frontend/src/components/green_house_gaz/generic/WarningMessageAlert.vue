<template>
  <v-alert
    v-if="!show"
    dense
    outlined
    border="left"
    close-text="Close Alert"
    color="error"
    dark
  >
    Please note that the baseline and endline
    {{ text }} do not match.
    <br />
    Baseline:
    {{ baseline | formatNumber(formatNumberOptions) }}
    {{ textFormatted }}
    <br />
    Endline:
    {{ endline | formatNumber(formatNumberOptions) }}
    {{ textFormatted }}
  </v-alert>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class WarningMessageAlert extends Vue {
  @Prop({ required: true, type: Boolean, default: false })
  readonly show!: boolean;
  @Prop([String])
  readonly text!: string;
  @Prop([Number])
  readonly baseline!: number;
  @Prop([Number])
  readonly endline!: number;
  @Prop([String])
  readonly subtype!: string;

  public get formatNumberOptions() {
    if (this.subtype === "percent") {
      return {
        style: "percent",
        maximumFractionDigits: 0,
      };
    }
    return {};
  }

  public get textFormatted() {
    if (this.subtype === "percent") {
      return this.text.replace("%", "");
    }
    return this.text;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
