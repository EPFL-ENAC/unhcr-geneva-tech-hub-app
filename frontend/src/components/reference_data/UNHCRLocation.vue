<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-data-table
        :headers="headers"
        :items="items"
        hide-default-footer
        :items-per-page="-1"
      >
        <template #[`item.Country`]="props">
          <span :title="props.item.Country"
            >{{ countriesMap[props.item.Country].name }}
            <country-flag :country="props.item.Country" size="small" />
          </span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";
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
  getAllDocs!: () => Promise<ReferenceItemInterface>;
  items!: ReferenceItemInterface[];
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
