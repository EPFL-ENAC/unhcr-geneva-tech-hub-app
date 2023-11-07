<template>
  <v-card flat>
    <v-card-text v-if="computedItems">
      <v-row>
        <v-col>
          List of Grid Emission Factor from IGES (Institute for Global
          Environmental Strategies) (2023). Source:
          <a href="https://www.iges.or.jp/en/pub/list-grid-emission-factor/en"
            >https://www.iges.or.jp/en/pub/list-grid-emission-factor/en</a
          >
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
          <v-data-table
            dense
            :headers="headers"
            :items="computedItems"
            :search="search"
          >
            <template #[`item.value`]="props">
              <span :title="props.item.value">{{
                props.item.value | formatNumberGhg
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
import { IgesItem } from "@/store/GhgReferenceIgesGridModule";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceIgesGridModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
})
export default class IgesGrid extends Vue {
  items!: IgesItem[];
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

  public get computedItems(): IgesItem[] {
    let newItems: IgesItem[] = [];
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
