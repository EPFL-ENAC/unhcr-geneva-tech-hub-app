<template>
  <v-card flat>
    <v-card-text v-if="computedItems">
      <v-row>
        <v-col>
          List of Grid Emission Factor from List of Grid Emission Factors from
          EMBER (2021). Source:
          <a
            target="_blank"
            href="https://ember-climate.org/data-catalogue/yearly-electricity-data/"
            >https://ember-climate.org/data-catalogue/yearly-electricity-data/</a
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>
            Grid emission factors
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
            dense
            :headers="headers"
            :items="computedItems"
            :search="search"
          >
            <template #[`item.value`]="props">
              <span :title="props.item.value">{{
                props.item.value | formatNumberGhgRef
              }}</span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}

        <template #action="{ attrs }">
          <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { GridItem } from "@/store/GhgReferenceGridModule";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceGridModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
})
export default class GhgGrid extends Vue {
  items!: GridItem[];
  snack = false;
  snackColor = "";
  snackText = "";
  max25chars = (v: string): boolean | string =>
    v.length <= 25 || "Input too long!";
  pagination = {};

  search = "";
  public get headers(): HeaderInterface[] {
    return [
      {
        text: "Country",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Combined Margin Grid Emission Factor (tCO2/MWh)",
        value: "value",
        width: "400px",
        align: "center",
      },
    ];
  }

  public get computedItems(): GridItem[] {
    let newItems: GridItem[] = [];
    newItems = newItems.concat(this.items);
    newItems.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    return newItems;
  }

  save(): void {
    this.snack = true;
    this.snackColor = "success";
    this.snackText = "Data saved";
  }
  cancel(): void {
    this.snack = true;
    this.snackColor = "error";
    this.snackText = "Canceled";
  }
  open(): void {
    this.snack = true;
    this.snackColor = "info";
    this.snackText = "Dialog opened";
  }
  close(): void {
    console.log("Dialog closed");
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
  width?: string;
}
</script>

<style></style>
