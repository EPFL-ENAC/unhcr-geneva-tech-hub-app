import { VueConstructor } from "vue";

export default {
  install(Vue: VueConstructor): void {
    Vue.filter("formatNumber", formatNumber);

    Vue.filter("formatDate", (date: string): string => {
      if (date === undefined) {
        return "—";
      }
      return Intl.DateTimeFormat("fr").format(new Date(date));
    });
  },
};

const defaultOptions: ExtendedFormatOptions = {
  maximumFractionDigits: 2,
};
// how to use
// formatNumber(0.43433333345)
// --> 0,43
// formatNumber(0.43433333345, { style: "percent", maximumFractionDigits: 0 })
// --> 43%
export function formatNumber(
  n: number,
  { ...options } = defaultOptions
): string {
  if (n === null || isNaN(n)) {
    return "—";
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
  };
  const formatted = Intl.NumberFormat("fr-mathmono", finalOptions).format(n);

  return `${formatted}${finalOptions.suffix ? ` ${finalOptions.suffix}` : ""}`;
}

export interface ExtendedFormatOptions extends Intl.NumberFormatOptions {
  suffix?: string;
}
