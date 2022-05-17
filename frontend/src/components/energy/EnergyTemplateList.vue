<template>
  <sync-document-list
    title="Templates"
    :documents="templates"
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
    </template>
  </sync-document-list>
</template>

<script lang="ts">
import SyncDocumentList from "@/components/commons/SyncDocumentList.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { ProjectDocument } from "@/models/energyModel";
import { SyncDatabase } from "@/utils/couchdb";
import { checkRequired } from "@/utils/rules";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: { SyncDocumentList },
  computed: {
    ...mapState("energy", ["templates", "templatesDatabase"]),
  },
})
export default class EnergyTemplateList extends Vue {
  templates!: ExistingDocument<ProjectDocument>[];
  templatesDatabase!: SyncDatabase<ProjectDocument>;

  readonly rules = [checkRequired];

  createDialog = false;
  name = "";

  clickItem(document: ExistingDocument<ProjectDocument>): void {
    this.$router.push({ path: `templates/${document._id}`, append: true });
  }

  deleteItem(document: ExistingDocument<ProjectDocument>, event: Event): void {
    event.stopPropagation();
    this.templatesDatabase.remoteDB.remove(document);
  }

  create(): void {
    const username = this.$userName();
    this.templatesDatabase.remoteDB
      .post({
        name: this.name,
        siteName: this.name,
        users: [username],
        modules: {},
      })
      .then(() => (this.name = ""))
      .catch((reason) => console.error(reason));
  }
}
</script>
