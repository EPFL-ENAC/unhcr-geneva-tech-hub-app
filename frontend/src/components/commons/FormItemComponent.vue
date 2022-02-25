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
        :rules="rules"
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
        :rules="rules"
        type="number"
      >
        <template v-if="actualUnit" v-slot:append>{{ actualUnit }}</template>
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
        :rules="rules"
      >
        <template v-if="actualUnit" v-slot:append>{{ actualUnit }}</template>
      </v-select>
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import * as rules from "@/utils/rules";
import { SelectItemObject } from "@/utils/vuetify";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class FormItemComponent extends Vue {
  @VModel({ type: [String, Number, Boolean] })
  readonly model!: string | number | boolean;
  @Prop({ type: String as () => "text" | "number" | "boolean" | "select" })
  readonly type!: "text" | "number" | "boolean" | "select";
  @Prop({ type: String as () => "percent" })
  readonly subtype: "percent" | undefined;
  @Prop(String)
  readonly label!: string;
  @Prop([Object, Array])
  readonly options: BooleanOptions | SelectOption<any>[] | undefined;
  @Prop(String)
  readonly unit: string | undefined;
  @Prop(Number)
  readonly min: number | undefined;
  @Prop(Number)
  readonly max: number | undefined;

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
        return (this.options as SelectOption<any>[]).map((option) => ({
          text: option.text,
          value: option.value,
        }));
      default:
        return [];
    }
  }

  get rules(): rules.Rule[] {
    const defaultRules = [rules.required];
    if (this.actualMin !== undefined) {
      defaultRules.push(rules.min(this.actualMin));
    }
    if (this.actualMax !== undefined) {
      defaultRules.push(rules.max(this.actualMax));
    }
    return defaultRules;
  }

  get actualUnit(): string | undefined {
    if (this.subtype === "percent") {
      return "%";
    }
    return this.unit;
  }

  get actualMin(): number | undefined {
    if (this.subtype === "percent") {
      return 0;
    }
    return this.min;
  }

  get actualMax(): number | undefined {
    if (this.subtype === "percent") {
      return 100;
    }
    return this.max;
  }
}

export type FormItem<K = string, V = string> =
  | TextFormItem<K>
  | NumberFormItem<K>
  | BooleanFormItem<K>
  | SelectFormItem<K, V>;

interface AbstractFormItem<K> {
  key: K;
  label: string;
  hidden?: boolean;
}

interface TextFormItem<K> extends AbstractFormItem<K> {
  type: "text";
}

interface NumberFormItem<K> extends AbstractFormItem<K> {
  type: "number";
  subtype?: "percent";
  unit?: string;
  min?: number;
  max?: number;
}

interface BooleanFormItem<K> extends AbstractFormItem<K> {
  type: "boolean";
  options?: BooleanOptions;
}

interface SelectFormItem<K, V> extends AbstractFormItem<K> {
  type: "select";
  options: SelectOption<V>[];
  unit?: string;
}

interface BooleanOptions {
  true: string;
  false: string;
}

interface SelectOption<V> {
  text: string;
  value: V;
}
</script>
