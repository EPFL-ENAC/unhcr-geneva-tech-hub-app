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
      <v-text-field v-model="name" label="Name"></v-text-field>
    </template>
  </sync-document-list>
</template>

<script lang="ts">
import SyncDocumentList from "@/components/commons/SyncDocumentList.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { EnergyTemplateDocument } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, Ref, Vue } from "vue-property-decorator";

@Component({
  components: { SyncDocumentList },
})
export default class EnergyTemplateList extends Vue {
  createDialog = false;
  name = "";

  @Ref()
  readonly list!: SyncDocumentList<EnergyTemplateDocument>;

  clickItem(document: ExistingDocument<EnergyTemplateDocument>): void {
    this.$router.push({ path: `templates/${document._id}`, append: true });
  }

  deleteItem(
    document: ExistingDocument<EnergyTemplateDocument>,
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
