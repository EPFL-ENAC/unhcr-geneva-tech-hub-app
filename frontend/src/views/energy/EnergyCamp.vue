<template>
  <energy-project id-name="Camp" database-name="energy_camps"></energy-project>
</template>

<script lang="ts">
import EnergyProject from "@/components/energy/EnergyProject.vue";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    EnergyProject,
  },
})
export default class EnergyCamp extends Vue {}
</script>
