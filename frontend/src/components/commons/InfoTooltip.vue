<template>
  <v-tooltip
    v-bind="$attrs"
    class="d-print-none"
    :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
    :max-width="'max-width' in $attrs ? $attrs['max-width'] : 512"
  >
    <template #activator="{ on, attrs }">
      <v-icon v-bind="attrs" class="ma-1 d-print-none" v-on="on"
        >$mdiInformationOutline</v-icon
      >
    </template>
    <slot></slot>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({ inheritAttrs: true })
export default class InfoTooltip extends Vue {}
</script>