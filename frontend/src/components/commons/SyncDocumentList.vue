<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-list nav>
      <v-list-item-group>
        <v-list-item
          v-for="item in documents"
          :key="item._id"
          @click="clickItem(item)"
        >
          <slot name="item" :item="item">
            <v-list-item-content>
              <v-list-item-title>{{ item._id }}</v-list-item-title>
            </v-list-item-content>
          </slot>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-card-actions class="justify-end">
      <v-btn color="primary" @click="create">
        <v-icon left>mdi-plus</v-icon>
        Create
      </v-btn>
    </v-card-actions>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import { ExistingDocument } from "@/models/couchdbModel";
import { createSyncDatabase, SyncDatabase } from "@/utils/couchdb";
import PouchDB from "pouchdb";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SyncDocumentList<T> extends Vue {
  @Prop(String)
  readonly title!: string;
  @Prop(String)
  readonly databaseName!: string;

  readonly database: SyncDatabase<T> = createSyncDatabase(this.databaseName);

  documents: ExistingDocument<T>[] = [];
  changes?: PouchDB.Core.Changes<T>;

  created(): void {
    this.updateProjects();

    this.changes = this.database.onChange(() => {
      this.updateProjects();
    });
  }

  destroyed(): void {
    this.database.cancel();
    this.changes?.cancel();
  }

  create(): void {
    this.$emit("create");
  }

  updateProjects(): void {
    this.database.getAllDocuments().then((documents) => {
      this.documents = documents;
    });
  }

  clickItem(document: T): void {
    this.$emit("click:item", document);
  }
}
</script>
