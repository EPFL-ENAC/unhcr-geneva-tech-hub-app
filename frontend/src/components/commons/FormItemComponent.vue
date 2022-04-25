<template>
  <div>
    <v-text-field
      v-if="type === 'text'"
      v-model="model"
      clearable
      hide-details="auto"
      required
      :rules="actualRules"
    >
      <template v-slot:label>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ label }}</span>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
    </v-text-field>
    <v-text-field
      v-if="type === 'number'"
      v-model.number="numberModel"
      :clearable="!actualUnit"
      hide-details="auto"
      hide-spin-buttons
      required
      :rules="actualRules"
      type="number"
    >
      <template v-slot:label>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ label }}</span>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
      <template v-if="actualUnit" v-slot:append>{{ actualUnit }}</template>
    </v-text-field>
    <v-select
      v-if="type === 'boolean' || type === 'select'"
      v-model="model"
      :small-chips="multiple"
      :clearable="multiple"
      deletable-chips
      hide-details="auto"
      :items="items"
      :multiple="multiple"
      required
      :rules="actualRules"
    >
      <template v-slot:label>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ label }}</span>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
      <template v-if="actualUnit" v-slot:append>{{ actualUnit }}</template>
    </v-select>
  </div>
</template>

<script lang="ts">
import { checkMax, checkMin, checkRequired, Rule } from "@/utils/rules";
import { SelectItemObject } from "@/utils/vuetify";
import { round } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class FormItemComponent extends Vue {
  @VModel({ type: [String, Number, Boolean, Array] })
  model!: string | number | boolean | string[];
  @Prop({ type: String as () => "text" | "number" | "boolean" | "select" })
  readonly type!: "text" | "number" | "boolean" | "select";
  @Prop({ type: String as () => "percent" })
  readonly subtype: "percent" | "rate" | undefined;
  @Prop(String)
  readonly label: string | undefined;
  @Prop([Object, Array])
  readonly options: BooleanOptions | SelectOption<SelectValue>[] | undefined;
  @Prop(String)
  readonly unit: string | undefined;
  @Prop(Number)
  readonly min: number | undefined;
  @Prop(Number)
  readonly max: number | undefined;
  @Prop({ type: Array as () => Rule[] })
  readonly rules: Rule[] | undefined;
  @Prop({ type: Boolean, default: false })
  readonly optional!: boolean;
  @Prop(Number)
  readonly ratio: number | undefined;
  @Prop(Boolean)
  readonly multiple: boolean | undefined;
  @Prop(Number)
  readonly precision: number | undefined;

  get items(): SelectItemObject<string, SelectValue>[] {
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
        return (this.options as SelectOption<SelectValue>[]).map((option) => ({
          text: option.text,
          value: option.value,
        }));
      default:
        return [];
    }
  }

  get actualRules(): Rule[] {
    const rules: Rule[] = [];
    if (!this.optional) {
      rules.push(checkRequired);
    }
    if (this.actualMin !== undefined) {
      rules.push(checkMin(this.actualMin));
    }
    if (this.actualMax !== undefined) {
      rules.push(checkMax(this.actualMax));
    }
    if (this.rules) {
      rules.push(...this.rules);
    }
    return rules;
  }

  get actualUnit(): string | undefined {
    if (this.subtype === "percent" || this.subtype === "rate") {
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

  get actualRatio(): number {
    if (this.subtype === "percent" || this.subtype === "rate") {
      return 100;
    }
    return this.ratio ?? 1;
  }

  get actualOffset(): number {
    if (this.subtype === "rate") {
      return 1;
    }
    return 0;
  }

  get actualPrecision(): number {
    return this.precision ?? 4;
  }

  get numberModel(): number {
    return round(
      ((this.model as number) - this.actualOffset) * this.actualRatio,
      this.actualPrecision
    );
  }

  set numberModel(value: number) {
    this.model = (value as number) / this.actualRatio + this.actualOffset;
  }
}

export type FormItem<K = string, V = string> =
  | TextFormItem<K>
  | NumberFormItem<K>
  | BooleanFormItem<K>
  | SelectFormItem<K, V>;

interface AbstractFormItem<K> {
  key: K;
  label?: string;
  hidden?: boolean;
  rules?: Rule[];
  optional?: boolean;
}

interface TextFormItem<K> extends AbstractFormItem<K> {
  type: "text";
}

interface NumberFormItem<K> extends AbstractFormItem<K> {
  type: "number";
  subtype?: "percent" | "rate";
  unit?: string;
  min?: number;
  max?: number;
  ratio?: number;
  precision?: number;
}

interface BooleanFormItem<K> extends AbstractFormItem<K> {
  type: "boolean";
  options?: BooleanOptions;
}

interface SelectFormItem<K, V> extends AbstractFormItem<K> {
  type: "select";
  options: SelectOption<V>[];
  unit?: string;
  multiple?: boolean;
}

interface BooleanOptions {
  true: string;
  false: string;
}

export interface SelectOption<V> {
  text: string;
  value: V;
}

type SelectValue = boolean | string;
</script>
