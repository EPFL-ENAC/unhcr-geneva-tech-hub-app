<template>
  <router-view
    v-model="modules"
    :document-name="documentName"
    :document-site-name="documentSiteName"
  ></router-view>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";
import EnergyModuleMixin from "./EnergyModuleMixin.vue";

@Component
export default class EnergyHouseholdView extends EnergyModuleMixin {}
</script>
