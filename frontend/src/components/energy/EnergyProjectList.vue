<template>
  <sync-document-list
    ref="list"
    title="Projects"
    databaseName="energy_projects"
    @click:item="clickItem"
    @create="openDialog"
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
    <template v-slot>
      <v-dialog v-model="createDialog" max-width="256">
        <v-card>
          <v-card-title>New Project</v-card-title>
          <v-card-text>
            <v-text-field v-model="name" label="Name"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="create">Create</v-btn>
            <v-btn text @click="cancel">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </sync-document-list>
</template>

<script lang="ts">
import SyncDocumentList from "@/components/commons/SyncDocumentList.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { EnergyProjectDocument } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, Ref, Vue } from "vue-property-decorator";

@Component({
  components: { SyncDocumentList },
})
export default class EnergyProjectList extends Vue {
  createDialog = false;
  name = "";

  @Ref()
  readonly list!: SyncDocumentList<EnergyProjectDocument>;

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

  openDialog(): void {
    this.createDialog = true;
  }

  create(): void {
    this.list.database.db.post({
      name: this.name,
      users: [],
    });
    this.createDialog = false;
  }

  cancel(): void {
    this.createDialog = false;
  }
}
</script>
