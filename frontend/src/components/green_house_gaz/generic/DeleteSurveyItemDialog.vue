<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
    @keypress.enter="() => deleteItem()"
  >
    <v-form @submit.prevent="() => deleteItem()">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this {{ name }}?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              () => {
                isOpen = false;
              }
            "
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text type="submit">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class deleteSurveyItemDialog extends Vue {
  @Prop({ required: true, type: Boolean, default: false })
  dialogOpen!: boolean;
  @Prop([String])
  readonly name!: string;

  get isOpen(): boolean {
    return this.dialogOpen;
  }

  set isOpen(value: boolean) {
    this.$emit("update:dialogOpen", value);
  }

  public deleteItem(): void {
    this.$emit("delete:item");
    this.isOpen = false;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
