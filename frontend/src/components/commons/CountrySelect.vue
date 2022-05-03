<template>
  <v-select
    tabindex="0"
    :input="currentValue"
    :items="countriesRef"
    item-value="code"
    item-text="name"
    label="Select country"
    v-bind="{ ...$attrs, ...$props }"
    @change="(value) => $emit('input', value)"
  >
    <template v-slot:item="slotProps">
      <div class="d-flex justify-space-between" style="width: 300px">
        <span> {{ slotProps.item.emoji }} </span>
        {{ slotProps.item.name }}
      </div>
    </template>
  </v-select>
</template>

<script lang="ts">
import { CountryInfo } from "@/store/GhgInterface";
import Countries from "@/utils/countriesAsList";
import flagEmoji from "@/utils/flagEmoji";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    countries: {
      default: () => [],
      type: Array,
      required: false,
    },
    value: {
      required: true,
      type: String,
      default: "",
    },
  },
})
export default class CountrySelect extends Vue {
  value!: string;
  countries!: string[];

  public get currentValue(): string {
    return this.value;
  }
  public get countriesRef(): CountryInfo[] {
    const countriesCloned = cloneDeep(this.countries);
    if (countriesCloned && countriesCloned.length) {
      const result = countriesCloned.map(
        (v: string): CountryInfo => ({
          emoji: flagEmoji(v),
          name: v,
          code: v,
        })
      ) as CountryInfo[];
      return this.countriesSorted(result);
    } else {
      const result = Countries.map((country) => ({
        ...country,
        emoji: flagEmoji(country.code),
      })) as CountryInfo[];
      return this.countriesSorted(result);
    }
  }

  public countriesSorted(value: CountryInfo[]): CountryInfo[] {
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
}
</script>

<style></style>
