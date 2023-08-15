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
    <!-- TODO: display percentage accordingly -->
    Please note that the baseline and endline
    {{ text }} do not match.
    <br />
    Baseline:
    {{ baseline | formatNumber }}
    {{ text }}
    <br />
    Endline:
    {{ endline | formatNumber }}
    {{ text }}
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
}
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
