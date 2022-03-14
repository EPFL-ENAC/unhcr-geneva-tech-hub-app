<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    :items="items"
    @save="save"
  >
    <template v-slot:append>
      <v-data-table
        :headers="tableHeaders"
        item-key="_id"
        :items="tableItems"
        show-expand
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
import FormItemComponent, {
  FormItem,
} from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import {
  Category,
  CategoryProperty,
  CookingFuel,
  CookingStove,
  HouseholdCookingModule,
  socioEconomicCategories,
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
  readonly tableHeaders: DataTableHeader[] = [
    "name",
    "fuel",
    ...socioEconomicCategories,
  ].map((item) => ({
    text: item,
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
      text: "Emission factor for CO2",
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
  ];

  module: HouseholdCookingModule = this.emptyModule;
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];
  tableItems: TableItem[] = [];

  get emptyModule(): HouseholdCookingModule {
    return {
      categoryCookings: [],
    };
  }

  get items(): FormItem<keyof HouseholdCookingModule>[][] {
    return [];
  }

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
      this.module.categoryCookings = this.cookingStoves.map((item) => ({
        stove: item,
        categories: Object.fromEntries<CategoryProperty>(
          socioEconomicCategories.map((item) => [
            item,
            {
              countPerHousehold: 0,
              useFactor: 0,
              cookingTime: 0,
            },
          ])
        ) as Category,
      }));
    }
    this.tableItems = this.module.categoryCookings.map((item) => ({
      ...item.stove,
      ...item.categories,
    }));
  }
}

type TableItem = CookingStove & Category;
</script>
