<template>
  <p>
    This tool estimates greenhouse gas emissions for energy, material, and
    transport in displacement contexts, focusing on Scope
    <v-tooltip
      class="d-print-none"
      :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
      :max-width="'max-width' in $attrs ? $attrs['max-width'] : 512"
    >
      <template #activator="{ on, attrs }">
        <span v-bind="attrs" class="scope-decoration" v-on="on">1</span>
      </template>
      <span>{{ scope1 }}</span>
    </v-tooltip>
    and
    <v-tooltip
      class="d-print-none"
      :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
      :max-width="'max-width' in $attrs ? $attrs['max-width'] : 512"
    >
      <template #activator="{ on, attrs }">
        <span v-bind="attrs" class="scope-decoration" v-on="on">2</span>
      </template>
      <span>{{ scope2 }}</span>
    </v-tooltip>
    emissions
    <info-tooltip icon-class="ml-0" x-small dense>
      <span
        class="info-tooltip"
        @click.stop
        v-html="scope1and2Exception"
      ></span> </info-tooltip
    >. Exceptionally some Scope
    <v-tooltip
      class="d-print-none"
      :bottom="'bottom' in $attrs ? $attrs['bottom'] : true"
      :max-width="'max-width' in $attrs ? $attrs['max-width'] : 512"
    >
      <template #activator="{ on, attrs }">
        <span v-bind="attrs" class="scope-decoration" v-on="on">3</span>
      </template>
      <span>{{ scope3 }}</span>
    </v-tooltip>
    emissions are included due to their high impact
    <info-tooltip icon-class="ml-0" x-small dense>
      <span
        class="info-tooltip"
        @click.stop
        v-html="scope3Exception"
      ></span> </info-tooltip
    >. (Scopes definitions from
    <a
      target="_blank"
      onclick="event.stopPropagation();"
      href="https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-i.pdf"
      >IPCC</a
    >)
  </p>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import {
  scope1,
  scope1and2Exception,
  scope2,
  scope3,
  scope3Exception,
} from "@/utils/apps";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    InfoTooltip,
  },
})
export default class GhgDescription extends Vue {
  scope1 = scope1;
  scope2 = scope2;
  scope3 = scope3;
  scope1and2Exception = scope1and2Exception;
  scope3Exception = scope3Exception;
}
</script>

<style lang="scss">
.scope-decoration {
  color: inherit;
  font-weight: normal;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
    color: grey;
  }
}
</style>
