<template>
  <v-container>
    <h1>Energy</h1>
    {{ info }}
  </v-container>
</template>

<script lang="ts">
import { createSyncDatabase } from "@/utils/couchdb";
import PouchDB from "pouchdb";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EnergyHome extends Vue {
  info: PouchDB.Core.DatabaseInfo | null = null;

  created(): void {
    const database: PouchDB.Database = createSyncDatabase("energy_test");
    database.info().then((info) => {
      this.info = info;
    });
  }
}
</script>
