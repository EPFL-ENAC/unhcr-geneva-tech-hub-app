<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
    @keypress.enter="() => submitFn()"
  >
    <v-form
      ref="form"
      v-model="formValid"
      :lazy-validation="false"
      @submit.prevent="() => submitFn()"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} </span>
        </v-card-title>
        <v-card-text>
          <v-container v-if="localInput">
            <v-row v-if="intervention">
              <v-col>
                <v-select
                  v-model="localItem.originIncrement"
                  :items="
                    referenceItems.map((x) => ({
                      text: headers[0].formatterOrigin(x.increment),
                      value: x.increment,
                    }))
                  "
                  label="Baseline id"
                  required
                  @change="selectOrigin"
                />
              </v-col>
            </v-row>
            <v-row>
              <template v-for="(surveyItem, $index) in headers">
                <v-col
                  v-if="
                    surveyItem.type &&
                    surveyItem.isInput &&
                    localInput[surveyItem.conditional] ===
                      surveyItem.conditional_value
                  "
                  :key="$index"
                  :cols="surveyItem?.style?.cols ?? 6"
                  xs="12"
                >
                  <form-item-component
                    v-model="localInput[surveyItem.key]"
                    v-bind="surveyItem"
                  />
                </v-col>
              </template>
            </v-row>
          </v-container>
        </v-card-text>

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
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            type="submit"
            :disabled="!formValid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import { SurveyInput, SurveyItem } from "@/store/GhgInterface.vue";

import { VForm } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class SurveyItemDialog extends Vue {
  @Prop({ required: true, type: Boolean, default: false })
  dialogOpen!: boolean;

  @Prop({ required: false, type: Boolean, default: false })
  intervention!: boolean;
  @Prop({ required: false, type: Object, default: () => ({} as SurveyItem) })
  item!: SurveyItem;

  @Prop({ type: [Array], default: () => [] })
  readonly referenceItems!: SurveyItem[];

  @Prop([String])
  readonly name!: string;

  @Prop([Array])
  readonly headers!: SurveyTableHeader;

  $refs!: {
    form: VForm;
  };

  formValid = false;
  localInput: SurveyInput = {} as SurveyInput;
  localItem: SurveyItem = {} as SurveyItem;

  @Watch("item", { immediate: true, deep: true })
  onItemChange(value: SurveyItem): void {
    this.localItem = cloneDeep(value);
    this.localInput = cloneDeep(value.input);
  }

  get isOpen(): boolean {
    return this.dialogOpen;
  }

  set isOpen(value: boolean) {
    this.$emit("update:dialogOpen", value);
  }

  public get isNewMode(): boolean {
    return Object.keys(this.item?.input ?? []).length === 0;
  }
  public get title(): string {
    return this.isNewMode ? `New ${this.name}` : `Edit ${this.name}`;
  }

  public selectOrigin(value: number): void {
    const foundItem = this.referenceItems.find((x) => x.increment === value);
    if (foundItem) {
      this.$set(this.localItem, "origin", foundItem._id);
      this.$set(this.localItem, "originIncrement", foundItem.increment);
      this.localInput = cloneDeep(foundItem.input);
    }
  }

  public async submitFn(): Promise<void> {
    if (!this.localInput) {
      return Promise.resolve();
    }
    this.localItem.input = this.localInput;
    this.$emit("update:item", this.localItem);
    this.isOpen = false;
  }
}

export type Rule = (value: string) => boolean | string;
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>