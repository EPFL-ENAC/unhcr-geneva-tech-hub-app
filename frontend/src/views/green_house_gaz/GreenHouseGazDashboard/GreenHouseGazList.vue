<template>
  <v-expansion-panels accordion>
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
                <th class="text-left">hard_coded</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="location in country.value" :key="location">
                <td>
                  <router-link
                    :to="{
                      name: 'GreenHouseGazEdit',
                      params: { id: encodeURIComponent(location) },
                    }"
                  >
                    {{ location }}
                  </router-link>
                </td>
                <td>hard_coded_value</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";
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
  }, {} as Record<string, Record<string, string>>);
}
</script>