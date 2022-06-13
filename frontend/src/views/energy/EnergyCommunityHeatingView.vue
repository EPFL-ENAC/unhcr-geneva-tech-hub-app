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
          The community is divided in different units such as: camp management,
          schools, medical centers, and administrative facilities. For each
          unit, the demand and supply of thermal energy (heating & cooling) are
          assessed from energy, environmental, and economic point of view. For
          each unit, the demand and supply of thermal energy are evaluated for
          the base year and assumed in the scenario section for the future.
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
export default class EnergyCommunityHeatingView extends EnergyModuleMixin {}
</script>
