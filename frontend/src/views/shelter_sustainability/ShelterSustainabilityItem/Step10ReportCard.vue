<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex">
        <h2 class="d-flex align-center project__h3 font-weight-medium">
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
          >Export Assessment report</v-btn
        >
      </v-col>
    </v-row>
    <!-- <step-1-project-information :value="shelter" /> -->
    <v-row>
      <v-col :cols="6">
        <v-row>
          <v-col>{{ shelter.shelter_type }} shelter</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.shelter_occupants }} intented occupants</v-col>
        </v-row>
        <v-row>
          <v-col
            >{{ shelter.shelter_lifespan }} year intentended lifespan</v-col
          >
        </v-row>
        <v-row>
          <v-col>{{ shelter.setup_people }} people for setup</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.setup_time }} days for setup</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.risk_flood }} local flood risk</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.risk_seismic }} local seismic risk</v-col>
        </v-row>
      </v-col>
      <v-col :cols="6">
        <v-row> country-map </v-row>
        <v-row>
          <v-col> shelter image if any </v-col>
        </v-row>
      </v-col>
    </v-row>
    <step-9-score-card :shelter="shelter" />
    <step-5-environmental-impact :shelter="shelter" />
    <step-6-technical-performance :shelter="shelter" />
    <step-7-habitability :shelter="shelter" />
    <!-- <v-row>
      <v-col :cols="6">
      </v-col>
      <v-col :cols="6">
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { Shelter } from "@/store/ShelterInterface";
import Step1ProjectInformation from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step1ProjectInformation.vue";

import Step2Geometry from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step2Geometry.vue";
import Step5EnvironmentalImpact from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step5EnvironmentalImpact.vue";
import Step6TechnicalPerformance from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step6TechnicalPerformance.vue";
import Step7Habitability from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step7Habitability.vue";
import Step9ScoreCard from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step9ScoreCard.vue";

import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    Step1ProjectInformation,
    Step2Geometry,
    Step6TechnicalPerformance,
    Step7Habitability,
    Step5EnvironmentalImpact,
    Step9ScoreCard,
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
    size: portrait;
  }
}
</style>
