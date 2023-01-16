<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex">
        <h2 class="d-flex align-center text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
    </v-row>
    <step-2-geometry />
  </v-container>
</template>

<script lang="ts">
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import Step2Geometry from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step2Geometry.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    Step2Geometry,
  },
})
/** Project */
export default class Step10ReportCard extends Vue {
  infoTooltipText = infoTooltipText;
}
</script>

<style lang="scss" scoped>
@media print {
  @page {
    size: landscape;
  }
}
</style>
