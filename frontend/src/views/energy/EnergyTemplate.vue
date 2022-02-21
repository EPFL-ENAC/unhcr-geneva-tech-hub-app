<template>
  <v-container fluid>
    <v-text-field
      v-model="name"
      hide-details="auto"
      label="Template Name"
      outlined
      @change="changeName"
    ></v-text-field>
    <v-tabs v-model="tab" center-active show-arrows>
      <v-tab key="general">General Information</v-tab>
      <v-tab key="households">Households</v-tab>
      <v-tab>Community lighting</v-tab>
      <v-tab>Community heating & cooling</v-tab>
      <v-tab>Productive use of energy</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="general">
        <energy-general :initial-module="general" @save="save"></energy-general>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import EnergyGeneral from "@/components/energy/EnergyGeneral.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { GeneralModule, TemplateDocument } from "@/models/energyModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    EnergyGeneral,
  },
})
export default class EnergyProject extends Vue {
  readonly database: SyncDatabase<TemplateDocument> =
    createSyncDatabase("energy_templates");

  document: ExistingDocument<TemplateDocument> | null = null;
  tab: string | null = null;

  get name(): string {
    return this.document?.name ?? "";
  }

  set name(value: string) {
    if (this.document) {
      this.document.name = value;
    }
  }

  get general(): GeneralModule | undefined {
    return this.document?.modules?.general;
  }

  get documentId(): string {
    return this.$route.params.id;
  }

  created(): void {
    this.getDocument();
  }

  destroyed(): void {
    this.database.cancel();
  }

  getDocument(): void {
    this.database.db
      .get(this.documentId)
      .then((document) => {
        this.document = document;
      })
      .catch(() => {
        this.$router.push("/energy");
      });
  }

  changeName(): void {
    if (this.document) {
      this.database.db.put(this.document);
      this.getDocument();
    }
  }

  save(module: GeneralModule): void {
    if (this.document) {
      this.document.modules.general = module;
      this.database.db.put(this.document);
      this.getDocument();
    }
  }
}
</script>
