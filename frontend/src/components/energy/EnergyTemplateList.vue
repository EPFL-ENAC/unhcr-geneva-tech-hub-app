<template>
  <sync-document-list
    ref="list"
    title="Templates"
    databaseName="energy_templates"
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
    </template>
  </sync-document-list>
</template>

<script lang="ts">
import SyncDocumentList from "@/components/commons/SyncDocumentList.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { TemplateDocument } from "@/models/energyModel";
import * as rules from "@/utils/rules";
import "vue-class-component/hooks";
import { Component, Ref, Vue } from "vue-property-decorator";

@Component({
  components: { SyncDocumentList },
})
export default class EnergyTemplateList extends Vue {
  readonly rules = rules;

  createDialog = false;
  name = "";

  @Ref()
  readonly list!: SyncDocumentList<TemplateDocument>;

  clickItem(document: ExistingDocument<TemplateDocument>): void {
    this.$router.push({ path: `templates/${document._id}`, append: true });
  }

  deleteItem(document: ExistingDocument<TemplateDocument>, event: Event): void {
    event.stopPropagation();
    this.list.database.db.remove(document);
  }

  create(): void {
    this.list.database.db.post({
      name: this.name,
      users: [],
      modules: {},
    });
    this.name = "";
  }
}
</script>
