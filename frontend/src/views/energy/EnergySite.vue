<template>
  <energy-project
    id-name="Site"
    :database="sitesDatabase"
    :documents="sites"
    router-prefix="energySite"
  ></energy-project>
</template>

<script lang="ts">
import EnergyProject from "@/components/energy/EnergyProject.vue";
import { ExistingDocument } from "@/models/couchdbModel";
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
    ...mapState("energy", ["sitesDatabase", "sites"]),
  },
})
export default class EnergySite extends Vue {
  sitesDatabase!: SyncDatabase<ProjectDocument>;
  sites!: ExistingDocument<ProjectDocument>[];
}
</script>
