<template>
  <div class="ma-3">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Stoves</v-card-title>
          <v-card-text>
            <v-data-table :headers="stoveHeaders" :items="stoves">
              <template v-slot:[`item.energyEfficiency`]="{ item }">
                {{ item.energyEfficiency * 100 }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Fuels</v-card-title>
          <v-card-text>
            <v-data-table :headers="fuelHeaders" :items="fuels"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { CookingFuel, CookingStove } from "@/models/energyModel";
import { DatabaseName, SyncDatabase } from "@/utils/couchdb";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";

@Component
export default class EnergyCooking extends Vue {
  readonly stoveHeaders: TableHeader<keyof CookingStove>[] = (
    [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Fuel",
        value: "fuel",
      },
      {
        text: "Technology Type",
        value: "technologyType",
      },
      {
        text: "Energy efficiency",
        value: "energyEfficiency",
        unit: "%",
      },
      {
        text: "Capacity",
        value: "capacity",
        unit: "kW",
      },
      {
        text: "Investment Cost",
        value: "investmentCost",
        unit: "$",
      },
      {
        text: "Lifetime",
        value: "lifetime",
        unit: "year",
      },
      {
        text: "Emission factor for CO",
        value: "emissionFactorCo",
        unit: "g/MJ",
      },
      {
        text: "Emission factor for PM2.5",
        value: "emissionFactorPm",
        unit: "mg/MJ",
      },
      {
        text: "IWA efficiency TIER",
        value: "iwaEfficiencyTier",
      },
      {
        text: "IWA indoor emission TIER",
        value: "iwaIndoorEmissionTier",
      },
    ] as TableHeader<keyof CookingStove>[]
  ).map(this.mapHeader);
  readonly fuelHeaders: TableHeader<keyof CookingFuel>[] = (
    [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Name",
        value: "energy",
        unit: "MJ/kg",
      },
      {
        text: "Emission factor for CO2",
        value: "emissionFactorCo2",
        unit: "kg/kg of fuel",
      },
      {
        text: "Price",
        value: "price",
        unit: "$/kg",
      },
    ] as TableHeader<keyof CookingFuel>[]
  ).map(this.mapHeader);

  stoves: CookingStove[] = [];
  fuels: CookingFuel[] = [];

  created(): void {
    const stovesDatabase = new SyncDatabase<CookingStove>(
      DatabaseName.EnergyCookingStoves
    );
    stovesDatabase
      .getAllDocuments()
      .then((documents) => (this.stoves = documents))
      .finally(() => stovesDatabase.cancel());

    const fuelsDatabase = new SyncDatabase<CookingFuel>(
      DatabaseName.EnergyCookingFuels
    );
    fuelsDatabase
      .getAllDocuments()
      .then((documents) => (this.fuels = documents))
      .finally(() => fuelsDatabase.cancel());
  }

  mapHeader<V extends string>(header: TableHeader<V>): TableHeader<V> {
    if (header.unit) {
      header.text = `${header.text} [${header.unit}]`;
    }
    return header;
  }
}

interface TableHeader<V extends string> extends DataTableHeader {
  value: V;
  unit?: string;
}
</script>
