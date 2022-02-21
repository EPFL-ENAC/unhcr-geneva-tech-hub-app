<template>
  <v-container>
    {{ document }}
  </v-container>
</template>

<script lang="ts">
import { ExistingDocument } from "@/models/couchdbModel";
import { EnergyTemplateDocument } from "@/models/energyModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EnergyProject extends Vue {
  readonly database: SyncDatabase<EnergyTemplateDocument> =
    createSyncDatabase("energy_templates");

  document: ExistingDocument<EnergyTemplateDocument> | null = null;

  created(): void {
    this.database.db
      .get(this.$route.params.id)
      .then((document) => {
        this.document = document;
      })
      .catch(() => {
        this.$router.push("/energy");
      });
  }

  destroyed(): void {
    this.database.cancel();
  }
}
</script>
