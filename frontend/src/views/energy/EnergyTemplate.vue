<template>
  <energy-project
    id-name="Templates"
    database-name="energy_templates"
    router-prefix="energyTemplate"
  ></energy-project>
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
export default class EnergyTemplate extends Vue {}
</script>
