<template>
  <sync-document-list
    title="Sites"
    :documents="sites"
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
        :rules="rules"
      ></v-text-field>
      <v-select
        v-model="templateDocument"
        :items="templateOptions"
        label="Select template"
        required
        :rules="rules"
      ></v-select>
    </template>
  </sync-document-list>
</template>

<script lang="ts">
import SyncDocumentList from "@/components/commons/SyncDocumentList.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { ProjectDocument } from "@/models/energyModel";
import { SyncDatabase } from "@/utils/couchdb";
import { checkRequired } from "@/utils/rules";
import { SelectItemObject } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: { SyncDocumentList },
  computed: {
    ...mapState("energy", ["sites", "sitesDatabase", "templates"]),
  },
})
class EnergySiteList extends Vue {
  sites!: ExistingDocument<ProjectDocument>[];
  templates!: ExistingDocument<ProjectDocument>[];
  sitesDatabase!: SyncDatabase<ProjectDocument>;

  readonly rules = [checkRequired];

  createDialog = false;
  name = "";
  templateDocument: ProjectDocument | null = null;

  get templateOptions(): SelectItemObject<string, ProjectDocument>[] {
    return this.templates.map((document) => ({
      text: document.name,
      value: document,
    }));
  }

  clickItem(document: ExistingDocument<ProjectDocument>): void {
    this.$router.push({ path: `sites/${document._id}`, append: true });
  }

  deleteItem(document: ExistingDocument<ProjectDocument>, event: Event): void {
    event.stopPropagation();
    this.sitesDatabase.remoteDB.remove(document);
  }

  create(): void {
    if (this.templateDocument) {
      const username = this.$userName();
      this.sitesDatabase.remoteDB
        .post({
          name: this.name,
          siteName: this.name,
          users: [username],
          modules: cloneDeep(this.templateDocument.modules),
        })
        .then(() => (this.name = ""))
        .catch((reason) => console.error(reason));
    }
  }
}

export { EnergySiteList as default };
</script>
