<template>
  <energy-project
    id-name="Site"
    :database="sitesDatabase"
    router-prefix="energySite"
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
    ...mapState("energy", ["sitesDatabase"]),
  },
})
export default class EnergySite extends Vue {
  sitesDatabase!: SyncDatabase<ProjectDocument>;
}
</script>
