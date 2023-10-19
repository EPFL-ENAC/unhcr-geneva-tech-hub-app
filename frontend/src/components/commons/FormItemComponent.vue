<template>
  <div>
    <v-text-field
      v-if="type === 'text'"
      v-model="model"
      hide-details="auto"
      required
      :rules="actualRules"
      :readonly="readonly"
      :disabled="disabled"
      @change="$emit('change', $event)"
    >
      <template #label>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ label }}</span>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
    </v-text-field>
    <v-text-field
      v-if="type === 'number'"
      v-model.number="numberModel"
      hide-details="auto"
      hide-spin-buttons
      required
      :placeholder="placeholder"
      :messages="messages"
      :suffix="suffix"
      :rules="actualRules"
      :readonly="readonly"
      :disabled="disabled"
      type="string"
      @change="$emit('change', $event)"
    >
      <template #label>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ label }}</span>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
      <template v-if="actualUnit" #append>{{ actualUnit }}</template>
      <template #append-outer>
        <slot name="append-outer"></slot>
      </template>
      <template v-if="tooltipInfo" #prepend>
        <info-tooltip>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="tooltipInfo ?? label"></span>
        </info-tooltip>
      </template>
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
      :readonly="readonly"
      :disabled="disabled"
    >
      <template v-if="tooltipInfo" #prepend>
        <info-tooltip>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="tooltipInfo ?? label"></span>
        </info-tooltip>
      </template>
      <template #label>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ label }}</span>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
      <template v-if="actualUnit" #append>{{ actualUnit }}</template>
    </v-select>
    <v-combobox
      v-if="type === 'combobox'"
      v-model="model"
      :items="options"
      hide-details="auto"
    >
      <template #label>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ label }}</span>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
      <template v-if="actualUnit" #append>{{ actualUnit }}</template>
    </v-combobox>
    <form-item-component
      v-if="type === 'range'"
      v-model="model.val"
      type="number"
      :subtype="subtype"
      :label="label"
      :unit="unit"
      :rules="rules"
      :ratio="ratio"
      :precision="precision"
      :min="model.min"
      :max="model.max"
      :readonly="readonly"
      :disabled="disabled"
    >
      <template v-if="!readonly && !disabled" #append-outer>
        <v-dialog max-width="256">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon v-on="on">
              <v-icon>$mdiAccountHardHat</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>{{ label }}</v-card-title>
            <v-card-text>
              <v-form :disabled="!isTemplate">
                <form-item-component
                  v-model="model.min"
                  type="number"
                  :subtype="subtype"
                  label="Minimum"
                  :unit="unit"
                  :rules="rules"
                  :ratio="ratio"
                  :precision="precision"
                  optional
                  @change="onRangeChanged"
                ></form-item-component>
                <form-item-component
                  v-model="model.max"
                  type="number"
                  :subtype="subtype"
                  label="Maximum"
                  :unit="unit"
                  :rules="rules"
                  :ratio="ratio"
                  :precision="precision"
                  optional
                  @change="onRangeChanged"
                ></form-item-component>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
    </form-item-component>
    <country-select
      v-if="type === 'country'"
      v-model="model"
      hide-details="auto"
      :label="label"
      :readonly="readonly"
      required
      :rules="rules"
    ></country-select>
  </div>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
import InfoTooltip from "@/components/commons/InfoTooltip.vue";

import {
  BooleanOptions,
  SelectOption,
  SelectValue,
  TypeType,
} from "@/components/commons/FormItem";
import { RangeModel } from "@/models/energyModel";
import { checkMax, checkMin, checkRequired, Rule } from "@/utils/rules";
import { SelectItemObject } from "@/utils/vuetify";
import { round } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component({
  name: "FormItemComponent",
  components: {
    CountrySelect,
    InfoTooltip,
  },
})
export default class FormItemComponent extends Vue {
  @VModel({ type: [String, Number, Boolean, Array, Object] })
  model!: string | number | boolean | string[] | RangeModel | undefined;
  @Prop({ type: String as () => TypeType })
  readonly type!: TypeType;
  @Prop({ type: String as () => "percent" })
  readonly subtype: "percent" | undefined;
  @Prop(String)
  readonly label: string | undefined;
  @Prop(String)
  readonly tooltipInfo: string | undefined;
  @Prop([Object, Array])
  readonly options:
    | BooleanOptions
    | SelectOption<SelectValue>[]
    | string[]
    | undefined;
  @Prop(String)
  readonly unit: string | undefined;
  @Prop(String)
  readonly suffix: string | undefined;
  @Prop({ type: Array as () => string[] })
  readonly messages: string[] | undefined;
  @Prop(Number)
  readonly min: number | undefined;
  @Prop(Number)
  readonly max: number | undefined;
  @Prop({ type: Array as () => Rule[] })
  readonly rules: Rule[] | undefined;
  @Prop({ type: Boolean, default: false })
  readonly optional!: boolean;
  @Prop({ type: String, default: "", required: false })
  readonly placeholder!: string;
  @Prop(Number)
  readonly ratio: number | undefined;
  @Prop(Boolean)
  readonly multiple: boolean | undefined;
  @Prop(Number)
  readonly precision: number | undefined;
  @Prop({ type: Boolean, default: false })
  readonly readonly!: boolean;
  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean;
  @Prop({ type: Boolean, default: false })
  readonly isTemplate!: boolean;

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
    const mappedMin = this.mapValue(this.actualMin);
    if (mappedMin != undefined) {
      rules.push(checkMin(mappedMin));
    }
    const mappedMax = this.mapValue(this.actualMax);
    if (mappedMax != undefined) {
      rules.push(checkMax(mappedMax));
    }
    if (this.rules) {
      rules.push(...this.rules);
    }
    return rules;
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
      return 1;
    }
    return this.max;
  }

  get actualRatio(): number {
    if (this.subtype === "percent") {
      return 100;
    }
    return this.ratio ?? 1;
  }

  get actualPrecision(): number {
    return this.precision ?? 8;
  }

  get numberModel(): number | string {
    return this.mapValue(this.model as number) ?? "";
  }

  set numberModel(value: number | string) {
    if (typeof value === "string") {
      this.model = undefined;
    } else {
      this.model = (value as number) / this.actualRatio;
    }
  }

  mapValue(value: number | undefined): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    return round((value as number) * this.actualRatio, this.actualPrecision);
  }

  onRangeChanged(): void {
    if (typeof this.model === "object") {
      const rangeModel = this.model as RangeModel;
      if (rangeModel.min !== undefined && rangeModel.max !== undefined) {
        rangeModel.val = (rangeModel.min + rangeModel.max) / 2;
      }
    }
  }
}
</script>
