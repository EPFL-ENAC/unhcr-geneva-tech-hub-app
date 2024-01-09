<template>
  <v-card flat>
    <v-card-text v-if="computedItems">
      <v-row>
        <v-col>
          Daily solar peak hours approximated using the Longterm daily average
          of global horizontal irradiation (GHI). (GHI data obtained from the
          Global Solar Atlas 2.0, a free, web-based application developed and
          operated by the company Solargis s.r.o. on behalf of the World Bank
          Group, utilizing Solargis data, with funding provided by the Energy
          Sector Management Assistance Program (ESMAP). For additional
          information: <a target="_blank" href="https://globalsolaratlas.info">globalsolaratlas.info</a>)
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="computedItems"
            :search="search"
            dense
          >
            <template #[`item.population`]="props">
              <span :title="props.item.population">{{
                props.item.population | formatNumberGhgRef
              }}</span>
            </template>
            <template #[`item.solar_peak_hours`]="props">
              <span :title="props.item.solar_peak_hours">{{
                props.item.solar_peak_hours | formatNumberGhgRef
              }}</span>
            </template>
            <template #[`item.country_name`]="props">
              <span :title="props.item.country_code_2"
                >{{ countriesMap[props.item.country_code_2].name }}
                <country-flag
                  :country="props.item.country_code_2"
                  size="small"
                />
              </span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <GHGSolarModule />
    <GHGCountryRegion />
  </v-card>
</template>

<script lang="ts">
import GHGCountryRegion from "@/components/reference_data/GHGCountryRegion.vue";
import GHGSolarModule from "@/components/reference_data/GHGSolarModule.vue";

import { UNHCRLocation } from "@/store/UNHCRLocationModule";
import { countriesMap } from "@/utils/countriesAsList";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UNHCRLocationModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  components: {
    GHGSolarModule,
    GHGCountryRegion,
  },
})
export default class Energy extends Vue {
  items!: UNHCRLocation[];
  countriesMap = countriesMap;
  search = "";

  public get computedItems(): UNHCRLocation[] {
    let newItems: UNHCRLocation[] = [];
    newItems = newItems.concat(this.items);
    newItems = newItems.map((item) => {
      item.country_name = countriesMap[item.country_code_2].name;
      return item;
    });
    newItems.sort((a, b) => {
      return a._id.localeCompare(b._id);
    });
    return newItems;
  }


  public get headers(): HeaderInterface[] {
    return [
      {
        text: "Site name",
        align: "start",
        sortable: true,
        value: "_id",
      },
      { text: "Year", value: "year" },
      {
        text: "location p code",
        align: "start",
        sortable: false,
        value: "location_pcode",
      },
      {
        text: "location id",
        align: "start",
        sortable: false,
        value: "location_id",
      },
      { text: "Country", value: "country_name" },
      { text: "Population", value: "population" },
      { text: "latitude", value: "latitude" },
      { text: "longitude", value: "longitude" },
      {
        text: "Daily solar peak hours",
        value: "solar_peak_hours",
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
