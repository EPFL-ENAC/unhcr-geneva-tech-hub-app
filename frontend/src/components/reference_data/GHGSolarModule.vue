<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>
          Longterm daily average of solar hours per country (Source: <a target="_blank" href="https://globalsolaratlas.info">globalsolaratlas.info</a>)
          <p class="mb-0">
            (Note: This value is calculated as the average of solar hours for the camps in the country and is used when the site global horizontal irradiation for the site is unknown.)
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>
            <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="computedItems"
            :search="search"
            dense
          >
            <template #[`item.c`]="props">
              <span :title="props.item.c"
                >{{ props.item.c | formatNumberGhgRef }}
                hrs/day
              </span>
            </template>
            <template #[`item.Country`]="props">
              <span :title="props.item.Country"
                >
                {{  props.item.Country ?? "default" }}
                <country-flag
                  v-if="props.item._id !== 'default'"
                  :country="props.item._id"
                  size="small"
                />
              </span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { GHGSolar, GHGSolarExtended } from "@/store/GHGReferenceSolarModule";
import { countriesMap } from "@/utils/countriesAsList";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceSolarModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
})
export default class Energy extends Vue {
  items!: GHGSolar[];
  countriesMap = countriesMap;
  search = "";

  public get computedItems(): GHGSolarExtended[] {
    let newItems: GHGSolarExtended[] = [];
    newItems = newItems.concat(this.items as GHGSolarExtended[]);
    newItems = newItems.map((item) => {
      item.Country = countriesMap[item._id]?.name ?? "default";
      return item;
    });
    newItems.sort((a, b) => {
      return a.Country.localeCompare(b.Country);
    });
    return newItems;
  }

  public get headers(): HeaderInterface[] {
    return [
      { text: "Country name", value: "Country" },
      {
        text: "Solar average",
        align: "start",
        sortable: false,
        value: "c",
      },
    ];
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}
</script>

<style></style>
