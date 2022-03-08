<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    :items="items"
    @save="save"
  >
    <template v-slot:append>
      <v-data-table :headers="tableHeaders" :items="tableItems"></v-data-table>
    </template>
  </energy-form>
</template>

<script lang="ts">
import { FormItem } from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import {
  CookingFuel,
  CookingStove,
  HouseholdCookingModule,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyForm,
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

  module: HouseholdCookingModule = this.emptyModule;
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];

  get emptyModule(): HouseholdCookingModule {
    return {
      categoryCookings: [],
    };
  }

  get items(): FormItem<keyof HouseholdCookingModule>[][] {
    return [];
  }

  get tableItems(): TableItem[] {
    return (
      this.module?.categoryCookings.map((item) => ({
        name: item.cooking.name,
        fuel: item.cooking.fuel,
        ...item.categoryCounts,
      })) ?? []
    );
  }

  created(): void {
    if (!this.initialModule) {
      this.module.categoryCookings = this.cookingStoves.map((item) => ({
        cooking: item,
        categoryCounts: {
          veryLow: 0,
          low: 0,
          middle: 0,
          high: 0,
          veryHigh: 0,
        },
      }));
    }
  }
}

interface TableItem extends Record<SocioEconomicCategory, number> {
  name: string;
  fuel: string;
}
</script>
