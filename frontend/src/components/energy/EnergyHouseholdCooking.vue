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
  Cooking,
  HouseholdCookingModule,
  socioEconomicCategories,
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
    ...mapState("energy", ["cookings"]),
  },
})
export default class EnergyHouseholdCooking extends EnergyFormMixin<HouseholdCookingModule> {
  module: HouseholdCookingModule = this.emptyModule;
  cookings!: Cooking[];

  get emptyModule(): HouseholdCookingModule {
    return {
      categoryCookings: [],
    };
  }

  get items(): FormItem<keyof HouseholdCookingModule>[][] {
    return [];
  }

  get tableHeaders(): DataTableHeader[] {
    return ["name", ...socioEconomicCategories].map((item) => ({
      text: item,
      value: item,
    }));
  }

  get tableItems(): tableItem[] {
    return (
      this.module?.categoryCookings.map((item) => ({
        name: item.cooking.name,
        ...item.categoryCounts,
      })) ?? []
    );
  }

  created(): void {
    if (!this.initialModule) {
      this.module.categoryCookings = this.cookings.map((cooking) => ({
        cooking: cooking,
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

interface tableItem {
  name: string;
  veryLow: number;
}
</script>
