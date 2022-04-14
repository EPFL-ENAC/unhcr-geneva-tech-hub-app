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
      <v-btn color="primary" @click="openCreateDialog">
        <v-icon left>mdi-plus</v-icon>
        Create
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="createDialog" max-width="256">
      <v-card>
        <v-card-title>New</v-card-title>
        <v-card-text>
          <v-form v-model="formValid">
            <slot name="create"></slot>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="!formValid" @click="create">
            <v-icon left>mdi-check</v-icon>
            Create
          </v-btn>
          <v-btn text @click="cancel">
            <v-icon left>mdi-close</v-icon>
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import { ExistingDocument } from "@/models/couchdbModel";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SyncDocumentList<T> extends Vue {
  @Prop(String)
  readonly title!: string;
  @Prop({ type: Array as () => ExistingDocument<T>[] })
  readonly documents!: ExistingDocument<T>[];

  createDialog = false;
  formValid = true;

  clickItem(document: T): void {
    this.$emit("click:item", document);
  }

  openCreateDialog(): void {
    this.createDialog = true;
  }

  create(): void {
    this.$emit("create");
    this.createDialog = false;
  }

  cancel(): void {
    this.createDialog = false;
  }
}
</script>
