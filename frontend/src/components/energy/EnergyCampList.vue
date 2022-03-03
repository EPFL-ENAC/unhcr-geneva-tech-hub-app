<template>
  <sync-document-list
    ref="list"
    title="Camps"
    databaseName="energy_camps"
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
      <v-text-field
        v-model="name"
        label="Name"
        required
        :rules="[rules.required]"
      ></v-text-field>
      <v-select
        v-model="templateDocument"
        :items="templates"
        label="Select template"
        required
        :rules="[rules.required]"
      ></v-select>
    </template>
  </sync-document-list>
</template>

<script lang="ts">
import SyncDocumentList from "@/components/commons/SyncDocumentList.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { ProjectDocument } from "@/models/energyModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import * as rules from "@/utils/rules";
import { SelectItemObject } from "@/utils/vuetify";
import "vue-class-component/hooks";
import { Component, Ref, Vue } from "vue-property-decorator";

@Component({
  components: { SyncDocumentList },
})
class EnergyCampList extends Vue {
  readonly rules = rules;
  // TODO vuex
  readonly templateDatabase: SyncDatabase<ProjectDocument> =
    createSyncDatabase("energy_templates");

  createDialog = false;
  name = "";
  templateDocuments: ExistingDocument<ProjectDocument>[] = [];
  templateDocument: ProjectDocument | null = null;

  @Ref()
  readonly list!: SyncDocumentList<ProjectDocument>;

  created(): void {
    this.updateTemplates();
    this.templateDatabase.onChange(() => {
      this.updateTemplates();
    });
  }

  destroyed(): void {
    this.templateDatabase.cancel();
  }

  get templates(): SelectItemObject<string, ProjectDocument>[] {
    return this.templateDocuments.map((document) => ({
      text: document.name,
      value: document,
    }));
  }

  updateTemplates(): void {
    this.templateDatabase.getAllDocuments().then((documents) => {
      this.templateDocuments = documents;
    });
  }

  clickItem(document: ExistingDocument<ProjectDocument>): void {
    this.$router.push({ path: `camps/${document._id}`, append: true });
  }

  deleteItem(document: ExistingDocument<ProjectDocument>, event: Event): void {
    event.stopPropagation();
    this.list.database.db.remove(document);
  }

  create(): void {
    this.list.database.db.post({
      name: this.name,
      users: [
        // current user
      ],
      modules: {
        general: this.templateDocument?.modules.general,
      },
    });
    this.name = "";
  }
}

export { EnergyCampList as default };
</script>
