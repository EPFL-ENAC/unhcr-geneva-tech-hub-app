<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>
          Longterm daily average of solar hours per site (Source: Solar Global
          Atlas)
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="headers" :items="items" dense>
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
  </v-card>
</template>

<script lang="ts">
import { UNHCRLocation } from "@/store/UNHCRLocation";
import { countriesMap } from "@/utils/countriesAsList";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UNHCRLocation", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  methods: {
    ...mapActions("UNHCRLocation", ["syncDB", "getAllDocs", "closeDB"]),
  },
})
export default class Energy extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<UNHCRLocation>;
  items!: UNHCRLocation[];
  countriesMap = countriesMap;
  mounted(): void {
    this.syncDB();
    this.getAllDocs();
  }

  destroyed(): void {
    this.closeDB();
  }

  public get headers(): HeaderInterface[] {
    //     _id: string; // "Abazar : Point",
    // Country: string; // "IR",
    // Population: number;
    // "Location id": number;
    // latitude: number; //: 28.978026
    // longitude: number; // : 50.8379918,
    // "GHI/Daily_solar_peak_hours": number; // 5.607999802,
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
        text: "GHI/Daily_solar_peak_hours",
        value: "GHI/Daily_solar_peak_hours",
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
