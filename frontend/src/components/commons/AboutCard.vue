<template>
  <v-card class="about ma-2" elevation="2">
    <v-card-text>
      <h2 class="mx-8" data-cy="aboutDisclaimer">Disclaimer</h2>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <p class="mx-8">
        The GHG Emission Calculator and Sustainable Shelter Calculator have been
        developed at EPFL through a collaboration with the UNHCR Geneva
        Technical Hub and SDC. At EPFL the project was coordinated by the
        EssentialTech Centre. Scientific contributions were provided by the FAR
        and Smart Living laboratories, IT4Research and EssentialTech.
      </p>

      <p class="mx-8">
        The goal of the tools is to enable UNHCR to 'green' its operations by
        informing its strategies and activity planning with concrete and
        evidence-based recommendations. These elements are made available
        directly and in a user-friendly way to humanitarian practitioners
        working in the field. It will support UNHCR to align with the Pillar 2
        of its
        <a
          onclick="event.stopPropagation();"
          target="_blank"
          href="https://www.unhcr.org/sites/default/files/legacy-pdf/604a26d84.pdf"
        >
          Strategic Framework for Climate Action </a
        >. The tools also support actions toward achieving UNHCR's
        <a
          onclick="event.stopPropagation();"
          target="_blank"
          href="https://www.unhcr.org/media/summary-operational-strategy-climate-resilience-and-environmental-sustainability-2022-2025"
        >
          Operational Strategy for Climate Resilience
        </a>
        and Environmental Sustainability 2021-2025.
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AboutCard extends Vue {}
</script>
