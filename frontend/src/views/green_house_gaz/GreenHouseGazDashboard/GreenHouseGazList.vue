<template>
  <v-expansion-panels accordion
  v-model="panel">
    <v-expansion-panel
      v-for="(country, keyIndex) in countries"
      :key="`${country.key}${keyIndex}`"
    >
      <v-expansion-panel-header>
        <div class="panel-header">
          <span>
            {{ countriesMap[country.key].name }}
          </span>
          <span>
            {{ countriesMap[country.key].emoji }}
          </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Created by</th>
                <th class="text-left">Edit mode</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="location in country.value" :key="location.name">
                <td>
                  <router-link
                    :to="{
                      name: 'GreenHouseGazItem',
                      params: {
                        country: encodeURIComponent(country.key),
                        site: encodeURIComponent(location.name) },
                    }"
                  >
                    {{ location.name }}
                  </router-link>
                </td>
                <td> {{ location.created_by }}</td>
                <td>
                  <span v-if="$can('edit', location)">editable</span>
                  <span v-else>readonly  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import Countries from "../countriesAsList.min.js";
import flagEmoji from "../flagEmoji";

@Component({
  computed: {
    ...mapState("GhgListModule", ["countries"]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  countries!: [];

  countriesMap = Countries.reduce((acc, country) => {
    acc[country.code] = { ...country, emoji: flagEmoji(country.code) };
    return acc;
  }, {} as CountriesMap);

  public setCountry(country: Country): void {
    let hash = "";
    if (this.$route.hash !== `#${country.key}`) {
      hash = country.key;
    }
    this.$router.push({ hash });
  }

  public get panel(): number {
    const hash = this.$route.hash;
    const cleanedHash = hash.substring(1);
    const index = Object.values(this.countries)
      .map((x : Country) => x.key)
      .findIndex(x => x === cleanedHash);
    return index;
  };

  public set panel(value: number) {
    const country = this.countries[value];
    this.setCountry(country);
  }
}

type CountriesMap = Record<string, Country>;
type Country = Record<string, string>;
</script>
