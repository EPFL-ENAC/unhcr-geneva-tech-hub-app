<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @save="save"
  >
    <template v-slot:append>
      <v-data-table
        :headers="tableHeaders"
        item-key="_id"
        :items="tableItems"
        :items-per-page="5"
        show-expand
        sort-by="index"
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td class="pa-2" :colspan="headers.length">
            <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <tr
                    v-for="property in tableExpandProperties"
                    :key="property.key"
                  >
                    <td class="font-weight-bold">{{ property.text }}</td>
                    <td>
                      {{ item[property.key] }}
                      <template v-if="property.unit">
                        [{{ property.unit }}]
                      </template>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </td>
        </template>
        <template
          v-for="name in inputNumberColumnNames"
          v-slot:[`item.${name}`]="{ item }"
        >
          <form-item-component
            :key="name + '-count'"
            v-model="item[name].countPerHousehold"
            type="number"
            label="Count per household"
          ></form-item-component>
          <form-item-component
            :key="name + '-use'"
            v-model="item[name].useFactor"
            type="number"
            label="Use Factor"
            subtype="percent"
          ></form-item-component>
          <form-item-component
            :key="name + '-time'"
            v-model="item[name].cookingTime"
            type="number"
            label="Daily Cooking Time"
            unit="h"
          ></form-item-component>
        </template>
      </v-data-table>
    </template>
  </energy-form>
</template>

<script lang="ts">
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import {
  CookingCategoryValue,
  CookingFuel,
  CookingStove,
  HouseholdCookingModule,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { assign, cloneDeep, keys, pick, zip } from "lodash";
import "vue-class-component/hooks";
import { Component, Watch } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyForm,
    FormItemComponent,
  },
  computed: {
    ...mapState("energy", ["cookingFuels", "cookingStoves"]),
  },
})
export default class EnergyHouseholdCooking extends EnergyFormMixin<HouseholdCookingModule> {
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];

  readonly tableHeaders: DataTableHeader[] = [
    "name",
    "fuel",
    ...socioEconomicCategories,
  ].map((item) => ({
    text: this.$t(`energy.${item}`).toString(),
    value: item,
  }));
  readonly inputNumberColumnNames: string[] = socioEconomicCategories;
  readonly tableExpandProperties: {
    text: string;
    key: keyof TableItem;
    unit?: string;
  }[] = [
    {
      text: "Technology type",
      key: "technologyType",
    },
    {
      text: "Energy efficiency",
      key: "energyEfficiency",
      unit: "%",
    },
    {
      text: "Capacity",
      key: "capacity",
      unit: "kW",
    },
    {
      text: "Investment Cost",
      key: "investmentCost",
      unit: "USD",
    },
    {
      text: "Lifetime",
      key: "lifetime",
      unit: "years",
    },
    {
      text: "Emission factor for CO",
      key: "emissionFactorCo",
      unit: "g/MJ delivered",
    },
    {
      text: "Emission factor for PM2.5",
      key: "emissionFactorPm",
      unit: "g/MJ delivered",
    },
    {
      text: "IWA efficiency TIER",
      key: "iwaEfficiencyTier",
    },
    {
      text: "IWA indoor emission TIER",
      key: "iwaIndoorEmissionTier",
    },
    {
      text: "Fuel energy",
      key: "energy",
      unit: "MJ/kg",
    },
    {
      text: "Fuel emission factor for CO2",
      key: "emissionFactorCo2",
      unit: "ton/ton of fuel",
    },
    {
      text: "Fuel price",
      key: "price",
      unit: "$/kg",
    },
  ];

  module: HouseholdCookingModule = {
    categoryCookings: [],
  };
  tableItems: TableItem[] = [];

  @Watch("tableItems", { deep: true })
  onTableItemsChanged(tableItems: TableItem[]): void {
    zip(this.module.categoryCookings, tableItems).forEach(([cooking, item]) => {
      assign(cooking?.stove, pick(item, keys(cooking?.stove)));
      assign(cooking?.categories, pick(item, keys(cooking?.categories)));
    });
  }

  created(): void {
    if (this.initialModule) {
      this.module = cloneDeep(this.initialModule);
    } else {
      this.module.categoryCookings = this.cookingStoves.map((item) => {
        const fuel: CookingFuel = this.cookingFuels.find(
          (fuel) => fuel._id === item.fuel
        ) ?? {
          _id: item.fuel,
          name: item.fuel,
          index: -1,
          energy: 0,
          emissionFactorCo2: 0,
          price: 0,
        };
        return {
          categories: Object.fromEntries<CookingCategoryValue>(
            socioEconomicCategories.map((item) => [
              item,
              {
                countPerHousehold: 0,
                useFactor: 0,
                cookingTime: 0,
              },
            ])
          ) as Record<SocioEconomicCategory, CookingCategoryValue>,
          stove: item,
          fuel: fuel,
        };
      });
    }
    this.tableItems = this.module.categoryCookings.map((item) => ({
      ...item.categories,
      ...item.fuel,
      ...item.stove,
    }));
  }
}

type TableItem = Record<SocioEconomicCategory, CookingCategoryValue> &
  CookingStove &
  CookingFuel;
</script>
