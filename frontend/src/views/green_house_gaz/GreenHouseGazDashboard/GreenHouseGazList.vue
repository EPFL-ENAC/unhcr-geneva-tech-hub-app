<template>
  <v-expansion-panels accordion v-model="panel">
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
            <!-- <thead>
              <tr>
                <th class="text-left">Location</th>
                <th class="text-left">Created by</th>
                <th class="text-left">Edit mode</th>
              </tr>
            </thead> -->
            <tbody>
              <tr v-for="location in country.value" :key="location.name">
                <td width="100px">
                  {{ location.name }}
                </td>
                <td>
                  <!-- <router-link
                    :to="{
                      name: 'GreenHouseGazItem',
                      params: {
                        country: encodeURIComponent(country.key),
                        site: encodeURIComponent(location.name),
                      },
                    }"
                  >
                    {{ location.name }}
                  </router-link> -->
                  <v-slider
                    @input="(i) => selectSurvey(i, country.key, location.name)"
                    :tick-labels="['Survey 1', 'Survey 2', 'Survey 3']"
                    :max="3"
                    step="1"
                    ticks="always"
                    tick-size="4"
                  ></v-slider>
                </td>
                <td width="104px">
                  <!-- actions -->
                  <v-btn
                    icon
                    :to="{
                      name: 'GreenHouseGazCompareSurveys',
                      params: {
                        country: encodeURIComponent(country.key),
                        site: encodeURIComponent(location.name),
                      },
                    }"
                  >
                    <v-icon>mdi-chart-areaspline</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    :to="{
                      name: 'GreenHouseGazItem',
                      params: {
                        country: encodeURIComponent(country.key),
                        site: encodeURIComponent(location.name),
                      },
                    }"
                  >
                    <v-icon>mdi-cog-outline</v-icon>
                  </v-btn>
                </td>
                <!-- <td>{{ location.created_by }}</td>
                <td>
                  <span v-if="$can('edit', location)">editable</span>
                  <span v-else>readonly </span>
                </td> -->
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Countries from "@/utils/countriesAsList";
import flagEmoji from "@/utils/flagEmoji";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

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

  private setCountry(country: Country): void {
    let hash = "";
    if (this.$route.hash !== `#${country.key}`) {
      hash = country.key;
    }
    this.$router.push({ hash });
  }

  private unsetCountry(): void {
    let hash = "";
    this.$router.push({ hash });
  }

  public get panel(): number {
    const hash = this.$route.hash;
    const cleanedHash = hash.substring(1);
    const index = Object.values(this.countries)
      .map((x: Country) => x.key)
      .findIndex((x) => x === cleanedHash);
    return index;
  }

  public set panel(value: number) {
    if (value !== undefined) {
      const country = this.countries[value];
      this.setCountry(country);
    } else {
      this.unsetCountry();
    }
  }

  public selectSurvey(index: number, country_code: string, site: string): void {
    // retrieve id of survey
  }
}

type CountriesMap = Record<string, Country>;
type Country = Record<string, string>;
</script>
