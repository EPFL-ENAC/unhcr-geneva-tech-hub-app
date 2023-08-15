<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
    @keypress.enter="() => submitFn()"
  >
    <v-form ref="form" v-model="formValid" @submit.prevent="() => submitFn()">
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
                  :required="true"
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
                    matchConditions(localInput, surveyItem)
                  "
                  :key="$index"
                  :cols="surveyItem?.style?.cols ?? 6"
                  xs="12"
                >
                  <span v-if="diffDimension === surveyItem.key">
                    Previous {{ surveyItem.label }} was:
                    {{
                      surveyItem.formatter
                        ? surveyItem.formatter(
                            previousItem.input?.[surveyItem.key] ??
                              previousItem.computed?.[surveyItem.key],
                            surveyItem,
                            localItem
                          )
                        : previousItem.input?.[surveyItem.key] ??
                          previousItem.computed?.[surveyItem.key]
                    }}
                  </span>
                  <div
                    v-if="surveyItem.image"
                    class="d-flex flex-row justify-center align-center"
                  >
                    <v-img
                      v-if="localInput.image"
                      max-width="150px"
                      max-height="150px"
                      aspect-ratio="1"
                      :src="localInput.image"
                    />
                  </div>
                  <form-item-component
                    v-if="!surveyItem.hideInput"
                    :value="localInput[surveyItem.key]"
                    v-bind="surveyItem"
                    :disabled="matchDisabledConditions(localInput, surveyItem)"
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
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";
import {
  SurveyInput,
  SurveyInputValue,
  SurveyItem,
} from "@/store/GhgInterface";

import { SelectCustom } from "@/components/green_house_gaz/generic/surveyTableHeader";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { VForm } from "@/utils/vuetify";
import { cloneDeep, get as _get } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  components: {
    FormItemComponent,
  },
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
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

  @Prop([String])
  readonly diffDimension!: keyof SurveyInput;

  $refs!: {
    form: VForm;
  };
  ghgMapRef!: ItemReferencesMap;

  formValid = false;
  refreshKey = 0;

  localInput: SurveyInput = {} as SurveyInput;
  localItem: SurveyItem = {} as SurveyItem;
  // previousItem: SurveyItem = {} as SurveyItem;

  @Watch("item", { immediate: true, deep: true })
  onItemChange(value: SurveyItem): void {
    this.localItem = cloneDeep(value);
    this.localInput = cloneDeep(value.input) ?? {};
  }
  @Watch("formValid", { immediate: true, deep: true })
  onFormValid(): void {
    this.$refs?.form?.validate();
  }

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
    const newLocalInput = (surveyItem?.customEventInput?.(
      v,
      localInput,
      this.ghgMapRef
    ) ?? cloneDeep(localInput)) as SurveyInput;
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
    const localInput = this.localInput;
    return this.headers.map((header: SurveyTableHeader) => {
      if (typeof header.items === "string") {
        const [category, key] = header.items.split(".");
        if (category !== "input") {
          throw new Error(
            "items category should be input like so: `input.fuelTypes` for instance"
          );
        }
        const items = _get(localInput, key) as string[];

        if (typeof items === "object" && items.length) {
          header.options = items.map((x) => {
            let description;
            if (typeof header.tooltipInfo === "string") {
              description = header.tooltipInfo;
            }

            if (typeof header.tooltipInfo === "function") {
              description = header.tooltipInfo?.(x);
            }
            return {
              text: header.formatter?.(x as unknown) ?? x,
              description,
              value: x,
            };
          });
        }
      }
      if (typeof header.tooltipInfo === "function") {
        // TODO: fix dynamic tooltipinfo
        header.tooltipInfo = undefined;
        // header.tooltipInfo = header.tooltipInfo?.(localInput?.[header.key] ?? "");
      }
      // TODO implement a dynamic way for header.items when it's a function ? cf below
      if (typeof header.text === "function") {
        // we don't overide text (dynamic text should not be authorized for table)
        // only for header in form
        header.label = header.text(this.localInput);
      }
      if (
        typeof header.items === "object" &&
        header.items.length &&
        header.formatter
      ) {
        // array we should just check that it's just string.
        header.options =
          header.items?.map((item: string | SelectCustom<string>) => {
            let description;
            if (typeof header.tooltipInfo === "string") {
              description = header.tooltipInfo;
            }

            if (typeof item === "string") {
              if (typeof header.tooltipInfo === "function") {
                description = header.tooltipInfo?.(item);
              }
              return {
                text: header.formatter?.(item as unknown) ?? item,
                description,
                value: item,
              };
            }
            return {
              text: item.text,
              value: item._id,
              description,
            };
          }) ?? [];
      }

      if (typeof header.items === "function") {
        header.options = header.items({
          intervention: this.intervention,
          localInput,
        });
      }
      return header;
    });
  }

  public get previousItem(): SurveyItem {
    // small bug when using multiple item we show the previous kwh
    return (
      this.referenceItems?.find(
        (x) => x.increment === this.localItem.originIncrement
      ) ?? ({} as SurveyItem)
    );
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
    if (this.intervention) {
      this.localItem.enabled = true;
    }
    this.$emit("update:item", this.localItem);
    this.isOpen = false;
  }

  public matchDisabledConditions(
    localInput: SurveyInput,
    surveyItem: SurveyTableHeader
  ) {
    if (typeof surveyItem.conditional_disabled_function === "function") {
      console.log(
        "result of conditional_disabled_function:",
        surveyItem.conditional_disabled_function(localInput, surveyItem)
      );
      console.groupEnd();
      return surveyItem.conditional_disabled_function(localInput, surveyItem);
    }
    return (
      surveyItem.disabled || localInput?.[surveyItem.disabledWithConditions]
    );
  }

  public matchConditions(
    localInput: SurveyInput,
    surveyItem: SurveyTableHeader
  ) {
    // console.group(`matchConditions: ${surveyItem.label}`);
    // console.log(
    //   `\x1B[1;4m${surveyItem.key}: ${localInput[surveyItem.key] ?? ""}`
    // );
    // console.log(localInput, surveyItem);
    // if we have a conditional_function field it superseed the conditional logic
    if (typeof surveyItem.conditional_function === "function") {
      // console.log(
      //   "result of conditional_function:",
      //   surveyItem.conditional_function(localInput, surveyItem)
      // );
      // console.groupEnd();
      return surveyItem.conditional_function(localInput, surveyItem);
    }
    // console.groupEnd();
    if (typeof surveyItem.conditional === "undefined") {
      return true;
    }
    if (
      typeof surveyItem.conditional === "object" &&
      Array.isArray(surveyItem.conditional)
    ) {
      let result!: boolean;
      const breaker = surveyItem.conditional_type !== "AND";
      surveyItem.conditional.every((conditional: string, index: number) => {
        let conditional_value = surveyItem.conditional_value;
        if (
          typeof surveyItem.conditional_value === "object" &&
          Array.isArray(surveyItem.conditional_value) &&
          Array.isArray(surveyItem.conditional_value[0])
        ) {
          conditional_value = surveyItem.conditional_value[index];
        }
        const temp = this.matchCondition(localInput, {
          ...surveyItem,
          conditional_value,
          conditional, // override surveyItem.conditional
        });
        switch (surveyItem.conditional_type) {
          case "AND":
            result = (result ?? true) && (temp as boolean);
            break;
          case "OR":
            result = (result ?? false) || (temp as boolean);
            break;
          default:
            result = temp as boolean;
            break;
        }

        if (temp) {
          if (breaker) {
            return false;
          }
        }
        return true;
      });
      return result;
    }
    if (typeof surveyItem.conditional === "string") {
      return this.matchCondition(localInput, surveyItem);
    }
    throw new Error(
      `Could not match condition in current form: ${JSON.stringify(surveyItem)}`
    );
  }

  public matchCondition(
    localInput: SurveyInput,
    surveyItem: SurveyTableHeader
  ) {
    // if objective is emptystring it means we matched all value, we just need the
    // target to be defined
    if (typeof surveyItem.conditional === "undefined") {
      return true;
    }
    if (typeof surveyItem.conditional_value === "undefined") {
      return true;
    }
    if (typeof surveyItem.conditional === "string") {
      const target: SurveyInputValue = localInput?.[surveyItem.conditional];
      const objective: SurveyInputValue[] | SurveyInputValue =
        surveyItem.conditional_value;
      if (target === undefined) {
        return false;
      }
      if (Array.isArray(objective) && !Array.isArray(target)) {
        return objective.includes(target as string);
      }
      return target === objective || (target && objective === "");
    }
    throw new Error(
      `conditional ""${surveyItem.conditional}"" should be of type string\n with conditional value: ${surveyItem.conditional_value}\n in surveyTableHeader item: ${surveyItem.value}`
    );
  }
}

export type Rule = (value: string) => boolean | string;
</script>

<style lang="scss" scoped>
::v-deep .v-card__title {
  word-break: break-word;
}
</style>
