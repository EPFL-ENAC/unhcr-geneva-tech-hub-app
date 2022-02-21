<template>
  <v-container fluid>
    <v-tabs v-model="tab" center-active show-arrows>
      <v-tab key="general">General Information</v-tab>
      <v-tab key="households">Households</v-tab>
      <v-tab>Community lighting</v-tab>
      <v-tab>Community heating & cooling</v-tab>
      <v-tab>Productive use of energy</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="general">General</v-tab-item>
    </v-tabs-items>
    {{ document }}
  </v-container>
</template>

<script lang="ts">
import { ExistingDocument } from "@/models/couchdbModel";
import { ProjectDocument } from "@/models/energyModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EnergyProject extends Vue {
  readonly database: SyncDatabase<ProjectDocument> =
    createSyncDatabase("energy_projects");

  document: ExistingDocument<ProjectDocument> | null = null;
  tab: string | null = null;

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
