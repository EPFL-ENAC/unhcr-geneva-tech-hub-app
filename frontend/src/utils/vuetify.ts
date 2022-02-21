// https://vuetifyjs.com/en/api/v-select/#props-items
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
