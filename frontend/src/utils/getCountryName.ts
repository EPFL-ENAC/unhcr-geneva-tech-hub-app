import Countries from "@/utils/countriesAsList";

export default function getCountryName(countryCode: string): string {
  return Countries.find((x) => x.code === countryCode)?.name ?? "";
}
