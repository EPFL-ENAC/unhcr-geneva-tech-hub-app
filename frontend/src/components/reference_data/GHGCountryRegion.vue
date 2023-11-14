<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>
          Geographic Regions from UN M49 Standard
          (https://unstats.un.org/unsd/methodology/m49/overview/). Regions
          information used to calculate regional emission factors for the Solid
          Waste module.</v-col
        >
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
            :items="items"
            :search="search"
            dense
          >
            <template #[`item.c`]="props">
              <span>{{ props.item.Region }} </span>
            </template>
            <template #[`item._id`]="props">
              <span :title="props.item._id"
                >{{ countriesMap?.[props.item._id]?.name ?? "default" }}
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

  public get headers(): HeaderInterface[] {
    return [
      { text: "Country name", value: "_id" },
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
