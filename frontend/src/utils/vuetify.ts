/**
 * https://v2.uetifyjs.com/en/api/v-select/#props-items
 */
export interface SelectItemObject<
  // eslint-disable-next-line @typescript-eslint/ban-types
  T = string | number | object,
  // eslint-disable-next-line @typescript-eslint/ban-types
  V = string | number | object
> {
  text: T;
  value: V;
  disabled?: boolean;
  divider?: boolean;
  header?: string;
}

/**
 * https://v2.vuetifyjs.com/en/api/v-form/#functions
 */
export interface VForm extends HTMLFormElement {
  validate(): boolean;
}
