<template>
  <v-tooltip top :disabled="label.length < 32">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-if="type === 'text'"
        v-model="model"
        v-bind="attrs"
        v-on="on"
        :label="label"
        hide-details="auto"
        required
        :rules="[rules.required]"
      ></v-text-field>
      <v-text-field
        v-if="type === 'number'"
        v-model.number="model"
        v-bind="attrs"
        v-on="on"
        :label="label"
        hide-details="auto"
        hide-spin-buttons
        required
        :rules="[rules.required]"
        type="number"
      >
        <template v-if="unit" v-slot:append>{{ unit }}</template>
      </v-text-field>
      <v-select
        v-if="type === 'boolean' || type === 'select'"
        v-model="model"
        v-bind="attrs"
        v-on="on"
        :label="label"
        hide-details="auto"
        :items="items"
        required
        :rules="[rules.required]"
      ></v-select>
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { rules } from "@/utils/rules";
import { SelectItemObject } from "@/utils/vuetify";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class FormItemComponent extends Vue {
  readonly rules = rules;

  @VModel({ type: [String, Number, Boolean] })
  readonly model!: string | number | boolean;
  @Prop({ type: String as () => "text" | "number" | "boolean" | "select" })
  readonly type!: "text" | "number" | "boolean" | "select";
  @Prop(String)
  readonly label!: string;
  @Prop([Object, Array])
  readonly options: BooleanOptions | SelectOption[] | undefined;
  @Prop(String)
  readonly unit: string | undefined;

  get items(): SelectItemObject<string, boolean | string>[] {
    switch (this.type) {
      case "boolean":
        return [
          {
            text: (this.options as BooleanOptions | undefined)?.true ?? "Yes",
            value: true,
          },
          {
            text: (this.options as BooleanOptions | undefined)?.false ?? "No",
            value: false,
          },
        ];
      case "select":
        return (this.options as SelectOption[]).map((option) => ({
          text: option.text,
          value: option.value,
        }));
      default:
        return [];
    }
  }
}

export type FormItem =
  | TextFormItem
  | NumberFormItem
  | BooleanFormItem
  | SelectFormItem;

interface AbstractFormItem {
  key: string;
  label: string;
  hidden?: boolean;
}

interface TextFormItem extends AbstractFormItem {
  type: "text";
}

interface NumberFormItem extends AbstractFormItem {
  type: "number";
  unit?: string;
}

interface BooleanFormItem extends AbstractFormItem {
  type: "boolean";
  options?: BooleanOptions;
}

interface SelectFormItem extends AbstractFormItem {
  type: "select";
  options: SelectOption[];
}

interface BooleanOptions {
  true: string;
  false: string;
}

interface SelectOption {
  text: string;
  value: string;
}
</script>
