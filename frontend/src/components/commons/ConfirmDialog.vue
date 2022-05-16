<template>
  <v-dialog v-model="dialog" max-width="256">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="confirm">
          <v-icon left>mdi-check</v-icon>
          Confirm
        </v-btn>
        <v-btn text @click="cancel">
          <v-icon left>mdi-close</v-icon>
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class ConfirmDialog extends Vue {
  dialog = false;
  title = "";
  message = "";
  resolve: (value: boolean | PromiseLike<boolean>) => void = () => null;
  open(message: string, title = "Confirmation"): Promise<boolean> {
    this.title = title;
    this.message = message;
    this.dialog = true;
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  confirm(): void {
    this.resolve(true);
    this.dialog = false;
  }
  cancel(): void {
    this.resolve(false);
    this.dialog = false;
  }
}
</script>
