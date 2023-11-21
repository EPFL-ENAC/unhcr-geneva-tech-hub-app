<template>
  <p>
    The GHG Emission Calculator only considers Scope
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
    emissions at this stage. The calculations are estimations. For solar in
    particular, it is assumed that the addition of solar panels will add zero
    emissions.<br />
    Exceptionally, Scope
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
    emissions associated with feedstock production and/or processing of
    charcoal, ethanol and vegetable oil are considered due to their high impact
    relative to the total emissions.
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
export default class ResultsTooltip extends Vue {
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
