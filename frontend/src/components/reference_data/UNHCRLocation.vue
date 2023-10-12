<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>
          Daily solar peak hours approximated using the Longterm daily average
          of global horizontal irradiation (GHI). (GHI data obtained from the
          Global Solar Atlas 2.0, a free, web-based application developed and
          operated by the company Solargis s.r.o. on behalf of the World Bank
          Group, utilizing Solargis data, with funding provided by the Energy
          Sector Management Assistance Program (ESMAP). For additional
          information: https://globalsolaratlas.info)
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>
            IGES GRID
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search" dense>
            <template #[`item.population`]="props">
              <span :title="props.item.population">{{
                props.item.population |
                formatNumberGhg
              }}</span>
            </template>
            <template #[`item.solar_peak_hours`]="props">
              <span :title="props.item.solar_peak_hours">{{
                props.item.solar_peak_hours |
                formatNumberGhg
              }}</span>
            </template>
            <template #[`item.Country`]="props">
              <span :title="props.item.country_code_2"
                >{{ countriesMap[props.item.country_code_2].name }}
                <country-flag :country="props.item.country_code_2" size="small" />
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
import GHGSolarModule from "@/components/reference_data/GHGSolarModule.vue";
import GHGCountryRegion from "@/components/reference_data/GHGCountryRegion.vue";

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

  public get headers(): HeaderInterface[] {
    return [
      {
        text: "Site name",
        align: "start",
        sortable: false,
        value: "_id",
      },
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
      { text: "Country", value: "country_code_2" },
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
