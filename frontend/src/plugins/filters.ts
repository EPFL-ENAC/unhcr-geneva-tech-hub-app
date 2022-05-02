import { VueConstructor } from "vue";

export default {
  install(Vue: VueConstructor): void {
    Vue.filter("formatNumber", formatNumber);

    Vue.filter("formatDate", (date: string): string => {
      return Intl.DateTimeFormat("fr").format(new Date(date));
    });
  },
};

export function formatNumber(n: number, decimal = 2, sign = false): string {
  return Intl.NumberFormat("fr-mathmono", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimal,
    signDisplay: sign ? "exceptZero" : undefined,
  }).format(n);
}
