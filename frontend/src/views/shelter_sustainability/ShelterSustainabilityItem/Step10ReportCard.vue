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
      <v-col class="d-flex align-center justify-end">
        <v-btn
          class="d-print-none"
          @click="
            window.print();
            return false;
          "
          >Export Assessment report as pdf</v-btn
        >
      </v-col>
    </v-row>
    <step-1-project-information :shelter="shelter" />
    <step-2-geometry :shelter="shelter" />
    <step-3-bill-of-quantities :shelter="shelter" />
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { Shelter } from "@/store/ShelterInterface";
import Step1ProjectInformation from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step1ProjectInformation.vue";

import Step2Geometry from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step2Geometry.vue";
import Step3BillOfQuantities from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step3BillOfQuantities.vue";

import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    Step1ProjectInformation,
    Step2Geometry,
    Step3BillOfQuantities,
    InfoTooltip,
  },
})
/** Project */
export default class Step10ReportCard extends Vue {
  infoTooltipText = infoTooltipText;
  @Prop({ type: [Object], required: true })
  shelter!: Shelter;
}
</script>

<style lang="scss" scoped>
@media print {
  @page {
    size: landscape;
  }
}
</style>
