<template>
  <v-tooltip bottom max-width="512">
    <template #activator="{ on, attrs }">
      <v-icon v-bind="attrs" class="ma-1" v-on="on"
        >$mdiInformationOutline</v-icon
      >
    </template>
    <slot></slot>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class InfoTooltip extends Vue {}
</script>
