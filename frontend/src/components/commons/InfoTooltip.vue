<template>
  <v-tooltip bottom max-width="512">
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
    </template>
    <slot></slot>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class InfoTooltip extends Vue {}
</script>
