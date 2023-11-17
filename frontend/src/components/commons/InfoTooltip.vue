<template>
  <v-tooltip
    v-bind="$attrs"
    class="d-print-none info-tooltip"
    :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
    :max-width="'max-width' in $attrs ? $attrs['max-width'] : 512"
  >
    <template #activator="{ on, attrs }">
      <v-icon
        :dense="$attrs.dense"
        :x-small="$attrs['x-small']"
        v-bind="attrs"
        :class="`${$attrs?.['icon-class'] ?? 'ml-1'} d-print-none`"
        v-on="on"
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

<style lang="scss">
.info-tooltip {
  color: white;
  pointer-events: all;

  a {
    font-weight: bold;
  }
  a:link {
    text-decoration: none;
    color: white;
  }

  a:visited {
    text-decoration: none;
    color: white;
  }

  a:hover {
    text-decoration: underline;
    color: white;
  }

  a:active {
    text-decoration: underline;
    color: white;
  }
}</style>