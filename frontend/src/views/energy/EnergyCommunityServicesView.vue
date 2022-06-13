<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert type="warning">
          <i><v-icon>$mdiWrench</v-icon> This module is under development</i>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>
          This sector includes units such as: shops, small restaurants, and
          water pumping and distribution. For each sub-units, the productive
          energy use is assessed for the base year, and assumed for the future
          in the scenario section.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyCommunityServicesView extends EnergyModuleMixin {}
</script>
