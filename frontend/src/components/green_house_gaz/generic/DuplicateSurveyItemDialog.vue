<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
    @keypress.enter="() => duplicateItem()"
  >
    <v-form @submit.prevent="() => duplicateItem()">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to duplicate this {{ name }}?</v-card-title
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
export default class DuplicateSurveyItemDialog extends Vue {
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

  public duplicateItem(): void {
    this.$emit("duplicate:item");
    this.isOpen = false;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
