<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>
          Geographic Regions from UN M49 Standard (<a
            target="_blank"
            href="https://unstats.un.org/unsd/methodology/m49/overview/"
            >https://unstats.un.org/unsd/methodology/m49/overview/</a
          >). <br />Regions information used to calculate regional emission
          factors for the Solid Waste module.</v-col
        >
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
            <template #[`item.Region`]="props">
              <span>{{ props.item.Region }} </span>
            </template>
            <template #[`item.Country`]="props">
              <span :title="props.item._id">
                {{ props.item.Country ?? "default" }}
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
import { GHGRegion } from "@/store/GHGReferenceRegionModule";
import { countriesMap } from "@/utils/countriesAsList";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceRegionModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
})
export default class Energy extends Vue {
  items!: GHGRegion[];
  countriesMap = countriesMap;
  search = "";

  public get computedItems(): GHGRegion[] {
    let newItems: GHGRegion[] = [];
    newItems = newItems.concat(this.items);
    newItems = newItems.map((item) => {
      item.Country = countriesMap[item._id].name;
      return item;
    });
    newItems.sort((a, b) => {
      return a._id.localeCompare(b._id);
    });
    return newItems;
  }

  public get headers(): HeaderInterface[] {
    return [
      // { text: "Country name", value: "_id" },
      { text: "Country", value: "Country" },
      {
        text: "Region",
        align: "start",
        sortable: true,
        value: "Region",
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
