<template>
  <v-card>
    <v-card-title v-if="$slots.title">
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="formValid" lazy-validation>
        <slot></slot>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :disabled="saveDisabled" @click="save">
        <v-icon left>mdi-content-save</v-icon>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import { VForm } from "@/utils/vuetify";
import { cloneDeep, isEqual } from "lodash";
import "vue-class-component/hooks";
import {
  Component,
  Prop,
  PropSync,
  Ref,
  Vue,
  Watch,
} from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyForm<M> extends Vue {
  @Prop({ type: Object as () => M })
  readonly initialModule!: M;
  @PropSync("module", { type: Object as () => M })
  syncedModule!: M;

  @Ref()
  readonly form: VForm | undefined;

  formValid = true;

  get saveDisabled(): boolean {
    return !this.formValid || isEqual(this.initialModule, this.syncedModule);
  }

  created(): void {
    this.onInitialModuleChanged();
  }

  @Watch("initialModule")
  onInitialModuleChanged(): void {
    if (this.initialModule) {
      this.syncedModule = cloneDeep(this.initialModule);
      this.$emit("after-sync");
      console.debug("module synced from database");
    }
  }

  @Watch("syncedModule", { deep: true })
  onSyncedModuleChanged(): void {
    this.$nextTick().then(() => this.form?.validate());
  }

  save(): void {
    if (this.form?.validate()) {
      this.$emit("save", this.syncedModule);
    }
  }
}
</script>
