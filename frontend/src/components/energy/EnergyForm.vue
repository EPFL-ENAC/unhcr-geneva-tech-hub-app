<template>
  <v-card>
    <v-card-text>
      <slot name="append"></slot>
      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-row v-for="(rowItem, index) in items" :key="index">
          <template v-for="(item, index) in rowItem">
            <v-col
              v-if="!item.hidden"
              :key="index"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
            >
              <form-item-component
                v-model="module[item.key]"
                v-bind="item"
              ></form-item-component>
            </v-col>
          </template>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :disabled="saveDisabled" @click="save">
        <v-icon left>mdi-check</v-icon>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
} from "@/components/commons/FormItemComponent.vue";
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
  @Prop({ type: Array as () => FormItem<keyof M>[][] })
  readonly items!: FormItem<keyof M>[][];
  @PropSync("module", { type: Object as () => M })
  syncedModule!: M;

  @Ref()
  readonly form!: VForm;

  formValid = true;

  get saveDisabled(): boolean {
    return !this.formValid || isEqual(this.initialModule, this.syncedModule);
  }

  @Watch("initialModule")
  onInitialModuleChanged(): void {
    if (this.initialModule) {
      this.syncedModule = cloneDeep(this.initialModule);
    }
  }

  save(): void {
    if (this.form.validate()) {
      this.$emit("save", this.syncedModule);
    }
  }
}
</script>
