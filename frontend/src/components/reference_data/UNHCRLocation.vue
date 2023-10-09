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
          <v-data-table :headers="headers" :items="items" dense>
            <template #[`item.Population`]="props">
              <span :title="props.item.Population">{{
                props.item.Population |
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
              <span :title="props.item.Country"
                >{{ countriesMap[props.item.Country].name }}
                <country-flag :country="props.item.Country" size="small" />
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

  public get headers(): HeaderInterface[] {
    // _id: string; // "Abazar : Point",
    // Country: string; // "IR",
    // Population: number;
    // siteId: number;
    // latitude: number; //: 28.978026
    // longitude: number; // : 50.8379918,
    // "solar_peak_hours": number; // 5.607999802,
    return [
      {
        text: "Site name",
        align: "start",
        sortable: false,
        value: "_id",
      },
      { text: "Country", value: "Country" },
      { text: "Population", value: "Population" },
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
