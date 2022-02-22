<template>
  <div>
    <v-text-field
      v-if="type === 'text'"
      v-model="model"
      :label="label"
      hide-details="auto"
      required
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      v-if="type === 'number'"
      v-model="model"
      :label="label"
      hide-details="auto"
      hide-spin-buttons
      required
      :rules="[rules.required]"
      type="number"
    ></v-text-field>
    <v-select
      v-if="type === 'boolean'"
      v-model="model"
      :label="label"
      hide-details="auto"
      :items="items"
      required
      :rules="[rules.required]"
    ></v-select>
  </div>
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
  @Prop({ type: String as () => "text" | "number" | "boolean" })
  readonly type!: "text" | "number" | "boolean";
  @Prop(String)
  readonly label!: string;
  @Prop(Object)
  readonly options: BooleanOptions | undefined;

  get items(): SelectItemObject<string, boolean>[] {
    if (this.type === "boolean") {
      const options = this.options as BooleanOptions;
      return [
        {
          text: options.true,
          value: true,
        },
        {
          text: options.false,
          value: false,
        },
      ];
    } else {
      return [];
    }
  }
}

export type FormItem = TextFormItem | NumberFormItem | BooleanFormItem;

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
}

interface BooleanFormItem extends AbstractFormItem {
  type: "boolean";
  options: BooleanOptions;
}

interface BooleanOptions {
  true: string;
  false: string;
}
</script>
