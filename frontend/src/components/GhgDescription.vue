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
    >.
  </p>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    InfoTooltip,
  },
})
export default class GhgDescription extends Vue {
  scope1 = `'Scope 1' indicates direct greenhouse gas (GHG) emissions that are from sources owned or controlled by the reporting entity.`;

  scope2 = `'Scope 2' indicates indirect GHG emissions associated with the production of electricity, heat, or steam purchased by the reporting entity.`;

  scope3 = `'Scope 3' indicates all other indirect emissions, i.e., emissions associated with the extraction and production of purchased materials, fuels, and services, including transport in vehicles not owned or controlled by the reporting entity, outsourced activities, waste disposal, etc`;
  scope3Exception = `Emissions associated with feedstock production and/or processing
of some fuels are considered due to their high impact relative to the total emissions`;
  scope1and2Exception = `For solar in particular, it is assumed that the addition of solar panels will add zero emissions.`;
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
