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

export function formatNumber(
  n: number,
  decimal = 2,
  sign = false,
  style?: "decimal"
): string {
  if (n === null || isNaN(n)) {
    return "—";
  }
  return Intl.NumberFormat("fr-mathmono", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimal,
    maximumSignificantDigits: 3,
    signDisplay: sign ? "exceptZero" : undefined,
    style,
  }).format(n);
}
