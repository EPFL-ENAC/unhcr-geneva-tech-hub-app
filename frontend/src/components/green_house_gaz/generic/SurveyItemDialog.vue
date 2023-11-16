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
        <v-card-subtitle v-if="subtitle">
          <span class="text-h7">{{ subtitle }} </span>
        </v-card-subtitle>
        <v-card-text>
          <v-container v-if="localItem">
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
                    matchConditions(localItem?.input, surveyItem)
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
                      v-if="localItem.input.image"
                      max-width="150px"
                      max-height="150px"
                      aspect-ratio="1"
                      :src="localItem.input.image"
                    />
                  </div>
                  <form-item-component
                    v-if="!surveyItem.hideInput"
                    v-bind="surveyItem"
                    :value="_get(localItem, surveyItem.value)"
                    :disabled="
                      matchDisabledConditions(localItem.input, surveyItem)
                    "
                    @input="
                      (v) => customFormInput(v, surveyItem, localItem.input)
                    "
                  />
                </v-col>
              </template>
              <v-col v-if="showOverride" :cols="12">
                <v-checkbox v-model="overrideAll" hide-details inset>
                  <template #label>
                    Do you want to override all endline items ?
                    {{ overrideAll ? "yes" : "no" }}
                  </template>
                </v-checkbox>
              </v-col>
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
  SurveyResult,
} from "@/store/GhgInterface";

import { SelectCustom } from "@/components/green_house_gaz/generic/surveyTableHeader";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { VForm } from "@/utils/vuetify";
import { cloneDeep, get as _get, set as _set } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  components: {
    FormItemComponent,
  },
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
  methods: {
    _get,
    _set,
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

  @Prop([Function])
  readonly computeItem!: (
    localItemInput: SurveyInput,
    ghgMapRef: ItemReferencesMap
  ) => SurveyResult;

  $refs!: {
    form: VForm;
  };
  ghgMapRef!: ItemReferencesMap;

  formValid = false;
  refreshKey = 0;

  localItem: SurveyItem = {} as SurveyItem;
  overrideAll = false;

  @Watch("item", { immediate: true, deep: true })
  onItemChange(value: SurveyItem): void {
    this.localItem = cloneDeep(value);
  }

  mounted(): void {
    this.$refs?.form?.validate();
  }

  @Watch("formValid", { immediate: true, deep: true })
  onFormValid(): void {
    this.$refs?.form?.validate();
  }

  @Watch("localItem.input", { immediate: true, deep: true })
  onLocalInputChange(value: any): void {
    // we watch only for input, because we modify the localitem.computed object
    if (value === undefined) {
      return;
    }
    // if (this.formValid) {
    // fail silently!
    try {
      const computed = this.computeItem(value, this.ghgMapRef);
      this.$set(this.localItem, "computed", computed);
      this.$refs?.form?.validate();
    } catch (e) {
      // it's on purpose we don't want to show the error
      // A better way of doing this, would be to have a partial computed, that does not fail on error
      // but we don't have time for that right now
      // console.log(
      //   "warning in computeItem, due to unfinished/not valid form",
      //   e
      // );
    }
  }

  @Watch("localItem", { immediate: true, deep: true })
  onlocalitemchange(value: any): void {
    if (value === undefined) {
      return;
    }
    // this.$refs?.form?.reset();
    this.$refs?.form?.validate();
  }

  get isOpen(): boolean {
    return this.dialogOpen;
  }

  set isOpen(value: boolean) {
    this.$emit("update:dialogOpen", value);
  }
  public customFormInput(
    newInputValue: SurveyInputValue,
    surveyItem: SurveyTableHeader,
    localInput: SurveyInput = {}
  ): void {
    const newLocalInput = (surveyItem?.customEventInput?.(
      newInputValue,
      localInput,
      this.ghgMapRef
    ) ?? cloneDeep(localInput)) as SurveyInput;
    const newLocalItem = cloneDeep(this.localItem);
    newLocalItem.input = newLocalInput;
    _set(newLocalItem, surveyItem.value, newInputValue);

    this.localItem = newLocalItem;
    this.$refs.form.validate();
    this.refreshKey = this.refreshKey + 1;
  }
  public get isNewMode(): boolean {
    return Object.keys(this.item?.input ?? []).length === 0;
  }

  public get showOverride(): boolean {
    return !this.isNewMode && !this.intervention;
  }

  public get title(): string {
    return this.isNewMode ? `New ${this.name}` : `Edit ${this.name}`;
  }

  public get subtitle(): string | undefined {
    const Cooking = "Primary cooking solution only"; // for cooking
    const Lighting = "Consider fuel amounts for lighting only"; // for lighting
    if (this.name === "cookstove") {
      return Cooking;
    }
    if (this.name === "lighting") {
      return Lighting;
    }
    return undefined;
  }

  public get dynamicHeaders(): SurveyTableHeader[] {
    this.refreshKey; // Some hack it is: https://stackoverflow.com/questions/48700142/vue-js-force-computed-properties-to-recompute
    const localInput = this.localItem?.input ?? {};
    return this.headers.map((header: SurveyTableHeader) => {
      if (typeof header.rulesFn === "function") {
        header.rules = header.rulesFn(localInput, header);
      }
      if (typeof header.items === "string") {
        const [category, key] = header.items.split(".");
        if (category !== "input") {
          throw new Error(
            "items category should be input like so: `input.fuelTypes` for instance"
          );
        }
        const items = _get(this.localItem[category], key) as string[];

        if (typeof items === "object" && items.length) {
          header.options = items.map((x) => {
            let description;
            if (typeof header.tooltipInfo === "string") {
              description = header.tooltipInfo;
            }

            if (typeof header.tooltipInfo === "function") {
              description = header.tooltipInfoFn?.(x);
            }
            return {
              text: header.formatter?.(x as unknown) ?? x,
              description,
              value: x,
            };
          });
        }
      }
      if (typeof header.tooltipInfoFn === "function") {
        const res = header.tooltipInfoFn?.(
          (localInput?.[header.key] as string) ?? ""
        );
        if (res !== undefined) {
          header.tooltipInfo = res;
        } else {
          header.tooltipInfo = undefined;
        }
      }
      if (typeof header.text === "function") {
        // we don't overide text (dynamic text should not be authorized for table)
        // only for header in form
        header.label = header.text(this.localItem?.input ?? {});
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
            if (typeof item === "string") {
              if (typeof header.tooltipInfoFn === "function") {
                description = header.tooltipInfoFn?.(item);
              } else {
                if (typeof header.tooltipInfo === "string") {
                  description = header.tooltipInfo;
                }
              }
              return {
                text: header.formatter?.(item as unknown) ?? item,
                description,
                value: item,
              };
            } else {
              if (typeof header.tooltipInfo === "function") {
                description = header.tooltipInfoFn?.(item.text);
              }
            }
            return {
              text: item.text,
              value: item._id,
              description,
            };
          }) ?? [];
      }

      if (typeof header.items === "function") {
        const items = header.items({
          localInput: this.localItem?.input ?? {},
          surveyItem: header,
          intervention: this.intervention,
        });
        // TODO: abstract wrapper function to make things more readable
        header.options = items;
      }
      return header;
    });
  }

  public get previousItem(): SurveyItem {
    // small bug when using multiple item we show the previous kWh
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
      this.$set(this.localItem, "input", cloneDeep(foundItem.input));
      this.localItem = { ...this.localItem };
    }
  }

  public async submitFn(): Promise<void> {
    if (!this.localItem?.input) {
      return Promise.resolve();
    }
    if (this.intervention) {
      this.localItem.enabled = true;
    }
    if (this.overrideAll) {
      this.localItem.overrideAll = true;
    }
    this.$emit("update:item", this.localItem);
    this.isOpen = false;
  }

  public matchDisabledConditions(
    localInput: SurveyInput,
    surveyItem: SurveyTableHeader
  ) {
    if (typeof surveyItem.conditional_disabled_function === "function") {
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
    // if we have a conditional_function field it superseed the conditional logic
    if (localInput === undefined) {
      return false;
    }
    if (typeof surveyItem.conditional_function === "function") {
      return surveyItem.conditional_function(localInput, surveyItem);
    }
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
