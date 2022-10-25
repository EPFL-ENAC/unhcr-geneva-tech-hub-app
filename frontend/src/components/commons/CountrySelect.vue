<template>
  <v-select
    tabindex="0"
    :input="currentValue"
    :items="countriesRef"
    item-value="code"
    item-text="name"
    :label="label"
    :return-object="true"
    v-bind="{ ...$attrs, ...$props }"
    :readonly="readonly"
    :disabled="disabled"
    @change="(e) => updateCountry(e)"
  >
    <template #item="slotProps">
      <div class="d-flex justify-space-between" style="width: 300px">
        <country-flag :country="slotProps.item.code" size="small" />
        {{ slotProps.item.name }}
      </div>
    </template>
  </v-select>
</template>

<script lang="ts">
import { CountryInfo } from "@/store/GhgInterface";
import { countries as Countries } from "@/utils/countriesAsList";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CountrySelect extends Vue {
  @Prop({ type: String, default: "Select country" })
  readonly label!: string;

  @Prop({ type: Array, default: () => [] })
  readonly countries!: string[];

  @Prop({ type: String, default: "" })
  readonly value!: string;
  @Prop({ type: Boolean, default: false })
  readonly readonly!: boolean;
  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean;

  public get currentValue(): string {
    return this.value;
  }

  public get countriesRef(): CountryInfo[] {
    const countriesCloned = cloneDeep(this.countries);
    if (countriesCloned && countriesCloned.length) {
      const result = countriesCloned.map(
        (v: string): CountryInfo => ({
          name: v,
          code: v,
          lat: 0, // not used
          lon: 0, // not used
        })
      ) as CountryInfo[];
      return this.sortCountries(result);
    } else {
      const result = Countries.map((country) => ({
        ...country,
      })) as CountryInfo[];
      result.push({
        name: "Unknown",
        code: "ZZ",
        lat: 0, // not used
        lon: 0, // not used
      });
      return this.sortCountries(result);
    }
  }

  public sortCountries(value: CountryInfo[]): CountryInfo[] {
    const result = cloneDeep(value);
    result.sort((a: CountryInfo, b: CountryInfo): number => {
      if (a.name === b.name) {
        return 0;
      }

      if (a.name > b.name) {
        return 1;
      }

      return -1;
    });
    return result;
  }

  public updateCountry(country: CountryInfo): void {
    this.$emit("input", country.code);
    this.$emit("update", country.code);
    this.$emit("change", country.code);
    // if country change.. force latitude
    this.$emit("update:latitude", country.lat);
    this.$emit("update:longitude", country.lon);
  }
}
</script>

<style></style>
