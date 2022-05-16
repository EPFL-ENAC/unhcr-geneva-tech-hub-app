import { Rule } from "@/utils/rules";

export type TypeType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "range"
  | "country";

export type FormItem<K = string, V = string> =
  | TextFormItem<K>
  | NumberFormItem<K>
  | BooleanFormItem<K>
  | SelectFormItem<K, V>
  | RangeFormItem<K>
  | CountryFormItem<K>;

interface AbstractFormItem<K> {
  key: K;
  label?: string;
  hidden?: boolean;
  rules?: Rule[];
  suffix?: string;
  optional?: boolean;
  readonly?: boolean;
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

interface RangeFormItem<K> extends AbstractFormItem<K> {
  type: "range";
  subtype?: "rate";
}

export interface BooleanOptions {
  true: string;
  false: string;
}

export interface SelectOption<V> {
  text: string;
  value: V;
}

export type SelectValue = boolean | string | number;

interface CountryFormItem<K> extends AbstractFormItem<K> {
  type: "country";
}
