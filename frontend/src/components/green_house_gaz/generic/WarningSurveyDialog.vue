<template>
  <v-dialog v-model="isOpen" max-width="500px" @keypress.enter="() => submit()">
    <v-form @submit.prevent="() => submit()">
      <v-card>
        <v-card-text>
          <warning-message-alert
            :show="show"
            :text="text"
            :baseline="baseline"
            :endline="endline"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text type="submit">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import WarningMessageAlert from "@/components/green_house_gaz/generic/WarningMessageAlert.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    WarningMessageAlert,
  },
})
export default class WarningSurveyDialog extends Vue {
  @Prop({ required: true, type: Boolean, default: false })
  dialogOpen!: boolean;
  @Prop([String])
  readonly name!: string;
  @Prop({ required: true, type: Boolean, default: false })
  readonly show!: boolean;
  @Prop([String])
  readonly text!: string;
  @Prop([Number])
  readonly baseline!: number;
  @Prop([Number])
  readonly endline!: number;

  get isOpen(): boolean {
    return this.dialogOpen;
  }

  set isOpen(value: boolean) {
    this.$emit("update:dialogOpen", value);
  }

  public submit(): void {
    this.$emit("update:submit");
    this.isOpen = false;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
