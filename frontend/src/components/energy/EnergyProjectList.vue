<template>
  <sync-document-list
    ref="list"
    title="Projects"
    databaseName="energy_projects"
    @click:item="clickItem"
    @create="create"
  >
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon @click="deleteItem(item, $event)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
    <template v-slot:create>
      <v-text-field v-model="name" label="Name"></v-text-field>
      <v-select :items="templates" label="Select template"></v-select>
    </template>
  </sync-document-list>
</template>

<script lang="ts">
import SyncDocumentList from "@/components/commons/SyncDocumentList.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import {
  EnergyProjectDocument,
  EnergyTemplateDocument,
} from "@/models/energyModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import { SelectItemObject } from "@/utils/vuetify";
import "vue-class-component/hooks";
import { Component, Ref, Vue } from "vue-property-decorator";

@Component({
  components: { SyncDocumentList },
})
export default class EnergyProjectList extends Vue {
  createDialog = false;
  name = "";
  templateDocuments: EnergyTemplateDocument[] = [];

  @Ref()
  readonly list!: SyncDocumentList<EnergyProjectDocument>;

  created(): void {
    // TODO vuex
    const templateDatabase: SyncDatabase<EnergyTemplateDocument> =
      createSyncDatabase("energy_templates");
    templateDatabase
      .getAllDocuments()
      .then((documents) => {
        this.templateDocuments = documents;
      })
      .finally(() => {
        templateDatabase.cancel();
      });
  }

  get templates(): SelectItemObject<string, EnergyTemplateDocument>[] {
    return this.templateDocuments.map((document) => ({
      text: document.name,
      value: document,
    }));
  }

  clickItem(document: ExistingDocument<EnergyProjectDocument>): void {
    this.$router.push({ path: `projects/${document._id}`, append: true });
  }

  deleteItem(
    document: ExistingDocument<EnergyProjectDocument>,
    event: Event
  ): void {
    event.stopPropagation();
    this.list.database.db.remove(document);
  }

  create(): void {
    this.list.database.db.post({
      name: this.name,
      users: [],
    });
    this.name = "";
  }
}
</script>
