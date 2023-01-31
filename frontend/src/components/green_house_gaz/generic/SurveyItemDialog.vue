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
              <template v-for="(surveyItem, $index) in dynamicHeaders">
                <v-col
                  v-if="
                    surveyItem.type &&
                    surveyItem.isInput &&
                    matchCondition(localInput, surveyItem)
                  "
                  :key="$index"
                  :cols="surveyItem?.style?.cols ?? 6"
                  xs="12"
                >
                  <form-item-component
                    :value="localInput[surveyItem.key]"
                    v-bind="surveyItem"
                    @input="(v) => customFormInput(v, surveyItem, localInput)"
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
import {
  SurveyInput,
  SurveyInputValue,
  SurveyItem,
} from "@/store/GhgInterface.vue";

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
  readonly headers!: SurveyTableHeader[];

  $refs!: {
    form: VForm;
  };

  formValid = false;
  refreshKey = 0;
  localInput: SurveyInput = {} as SurveyInput;
  localItem: SurveyItem = {} as SurveyItem;

  @Watch("item", { immediate: true, deep: true })
  onItemChange(value: SurveyItem): void {
    this.localItem = cloneDeep(value);
    this.localInput = cloneDeep(value.input);
  }

  // @Watch("localInput", { deep: true })
  // onLocalInputChange(value: SurveyInput): void {

  // }
  get isOpen(): boolean {
    return this.dialogOpen;
  }

  set isOpen(value: boolean) {
    this.$emit("update:dialogOpen", value);
  }
  public customFormInput(
    v: SurveyInputValue,
    surveyItem: SurveyTableHeader,
    localInput: SurveyInput
  ): void {
    const newLocalInput = (surveyItem?.customEventInput?.(v, localInput) ??
      cloneDeep(localInput)) as SurveyInput;
    newLocalInput[surveyItem.key] = v;
    this.localInput = newLocalInput;
    this.refreshKey = this.refreshKey + 1;
  }
  public get isNewMode(): boolean {
    return Object.keys(this.item?.input ?? []).length === 0;
  }
  public get title(): string {
    return this.isNewMode ? `New ${this.name}` : `Edit ${this.name}`;
  }

  public get dynamicHeaders(): SurveyTableHeader[] {
    this.refreshKey; // Some hack it is: https://stackoverflow.com/questions/48700142/vue-js-force-computed-properties-to-recompute
    return this.headers.map((header: SurveyTableHeader) => {
      if (typeof header.items === "string") {
        // console.log(header.items);
        // should be lodash get with items as the PATH // TODO: fixme before release
        const fueltypes = this.localInput.fuelTypes as string[];
        if (typeof fueltypes === "object" && fueltypes.length) {
          header.options = fueltypes.map((x) => ({
            text: header.formatter?.(x as unknown) ?? x,
            value: x,
          }));
        }
      }
      return header;
    });
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
    // this.localItem.input = this.localInput;
    this.$set(this.localItem, "input", this.localInput);
    this.$emit("update:item", this.localItem);
    this.isOpen = false;
  }
  public matchCondition(
    localInput: SurveyInput,
    surveyItem: SurveyTableHeader
  ) {
    const target = localInput?.[surveyItem.conditional];
    const objective = surveyItem.conditional_value;
    // if objective is emptystring it means we matched all value, we just need the
    // target to be defined
    return target === objective || (target && objective == "");
  }
}

export type Rule = (value: string) => boolean | string;
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
