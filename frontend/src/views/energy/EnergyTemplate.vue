<template>
  <energy-project
    id-name="Templates"
    :database="templatesDatabase"
    router-prefix="energyTemplate"
  ></energy-project>
</template>

<script lang="ts">
import EnergyProject from "@/components/energy/EnergyProject.vue";
import { ProjectDocument } from "@/models/energyModel";
import { SyncDatabase } from "@/utils/couchdb";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyProject,
  },
  computed: {
    ...mapState("energy", ["templatesDatabase"]),
  },
})
export default class EnergyTemplate extends Vue {
  templatesDatabase!: SyncDatabase<ProjectDocument>;
}
</script>
