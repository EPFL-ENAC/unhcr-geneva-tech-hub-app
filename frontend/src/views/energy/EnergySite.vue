<template>
  <energy-project id-name="Site" database-name="energy_sites"></energy-project>
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
export default class EnergySite extends Vue {}
</script>
