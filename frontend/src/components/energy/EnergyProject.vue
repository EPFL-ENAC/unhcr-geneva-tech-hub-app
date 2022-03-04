<template>
  <v-container fluid>
    <v-text-field
      v-model="name"
      hide-details="auto"
      :label="idName + ' Name'"
      outlined
      required
      :rules="[rules.required]"
      @change="changeName"
    ></v-text-field>
    <v-tabs v-model="tab" center-active show-arrows>
      <v-tab href="#general">General Information</v-tab>
      <v-tab href="#household-cooking">Household Cooking</v-tab>
      <v-tab href="#household-lighting">Household Lighting</v-tab>
      <v-tab>Community lighting</v-tab>
      <v-tab>Community heating & cooling</v-tab>
      <v-tab>Productive use of energy</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="general">
        <energy-general
          :initial-module="generalModule"
          @save="saveGeneral"
        ></energy-general>
      </v-tab-item>
      <v-tab-item value="household-cooking">
        <energy-household-cooking
          :initial-module="householdCookingModule"
          @save="saveHouseholdCooking"
        ></energy-household-cooking>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import EnergyGeneral from "@/components/energy/EnergyGeneral.vue";
import EnergyHouseholdCooking from "@/components/energy/EnergyHouseholdCooking.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import {
  GeneralModule,
  HouseholdCookingModule,
  ProjectDocument,
} from "@/models/energyModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import * as rules from "@/utils/rules";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    EnergyGeneral,
    EnergyHouseholdCooking,
  },
})
export default class EnergyProject extends Vue {
  readonly rules = rules;

  @Prop(String)
  readonly idName!: string;
  @Prop(String)
  readonly databaseName!: string;

  readonly database: SyncDatabase<ProjectDocument> = createSyncDatabase(
    this.databaseName
  );

  document: ExistingDocument<ProjectDocument> | null = null;
  tab: string | null = null;

  get name(): string {
    return this.document?.name ?? "";
  }

  set name(value: string) {
    if (this.document) {
      this.document.name = value;
    }
  }

  get documentId(): string {
    return this.$route.params.id;
  }

  get generalModule(): GeneralModule | undefined {
    return this.document?.modules?.general;
  }

  get householdCookingModule(): HouseholdCookingModule | undefined {
    return this.document?.modules?.householdCooking;
  }

  created(): void {
    this.getDocument();
  }

  destroyed(): void {
    this.database.cancel();
  }

  updateDocument(update: (document: ProjectDocument) => void): void {
    if (this.document) {
      update(this.document);
      this.database.db.put(this.document);
      this.getDocument();
    }
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

  saveGeneral(module: GeneralModule): void {
    this.updateDocument((document) => (document.modules.general = module));
  }

  saveHouseholdCooking(module: HouseholdCookingModule): void {
    this.updateDocument(
      (document) => (document.modules.householdCooking = module)
    );
  }
}
</script>
