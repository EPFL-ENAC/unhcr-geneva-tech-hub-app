<template>
  <energy-result :modules="modules"></energy-result>
</template>

<script lang="ts">
import EnergyResult from "@/components/energy/EnergyResult.vue";
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyResult,
  },
})
export default class EnergyResultView extends EnergyModuleMixin {}
</script>
