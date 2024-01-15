import { VueConstructor } from "vue";

export default {
  install(Vue: VueConstructor): void {
    Vue.filter("formatNumber", formatNumber);
    Vue.filter("formatNumberGhg", formatNumberGhg);
    Vue.filter("formatNumberGhgRef", formatNumberGhgRef);

    const defaultFormatDate: Intl.DateTimeFormatOptions = {
      dateStyle: "short",
    };
    Vue.filter(
      "formatDate",
      (date: string, { ...options } = defaultFormatDate): string => {
        if (date === undefined) {
          return "—";
        }
        const finalOptions = {
          ...defaultFormatDate,
          ...options,
        };
        return Intl.DateTimeFormat("fr", finalOptions).format(new Date(date));
      }
    );
  },
};

const defaultOptions: ExtendedFormatOptions = {
  maximumFractionDigits: 2,
};

const defaultGhgOptions: ExtendedFormatOptions = {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0, // to remove an deplace to ghg default Options
};

const defaultGhgRefOptions: ExtendedFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2, // to remove an deplace to ghg default Options
};
// how to use
// formatNumber(0.43433333345)
// --> 0,43
// formatNumber(0.43433333345, { style: "percent", maximumFractionDigits: 0 })
// --> 43%
export function formatNumber(
  n: number,
  { ...options } = defaultOptions,
  lang = "fr-mathmono"
): string {
  if (n === null || isNaN(n)) {
    return "—";
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
  };
  const formatted = Intl.NumberFormat(lang, finalOptions).format(n);

  return `${formatted}${finalOptions.suffix ? ` ${finalOptions.suffix}` : ""}`;
}

export function formatNumberGhg(
  n: number,
  { ...options } = defaultGhgOptions
): string {
  return formatNumber(n, { ...defaultGhgOptions, ...options }, "en-mathmono");
}

export function formatNumberGhgRef(
  n: number,
  { ...options } = defaultGhgRefOptions
): string {
  return formatNumber(
    n,
    { ...defaultGhgRefOptions, ...options },
    "en-mathmono"
  );
}

export interface ExtendedFormatOptions extends Intl.NumberFormatOptions {
  suffix?: string;
}
