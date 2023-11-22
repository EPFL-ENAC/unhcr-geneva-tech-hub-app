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
    <p v-if="subtype === 'percent' && baseline > 1">
      Baseline total is above 100%, please check your data.
    </p>
    Please note that the baseline and endline
    {{ textWarning }} do not match.
    <br />
    Baseline:
    {{ baseline | formatNumberGhg(formatNumberGhgOptions) }}
    {{ textFormatted }}
    <br />
    Endline:
    {{ endline | formatNumberGhg(formatNumberGhgOptions) }}
    {{ textFormatted }}
    <span v-if="description">
      <br />
      {{ description }}
    </span>
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
  @Prop([String])
  readonly description!: string;
  @Prop([String])
  readonly textWarning!: string;
  @Prop([Number])
  readonly baseline!: number;
  @Prop([Number])
  readonly endline!: number;
  @Prop([String])
  readonly subtype!: string;

  public get formatNumberGhgOptions() {
    if (this.subtype === "percent") {
      return {
        style: "percent",
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
