<template>
  <v-card v-if="cookingResult">
    <v-card-title>Household Cooking</v-card-title>
    <v-card-text>Energy: {{ cookingResult.energy }} [MJ]</v-card-text>
    <v-card-text>
      CO2 Emission: {{ cookingResult.emissionCo2 }} [kg]
    </v-card-text>
    <v-card-text>CO Emission: {{ cookingResult.emissionCo }} [g]</v-card-text>
    <v-card-text>
      Particles Emission: {{ cookingResult.emissionPm }} [g]
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  CategoryProperty,
  CookingFuel,
  CookingStove,
  GeneralModule,
  Modules,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { applyMap, applyReduce } from "@/utils/energy";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState("energy", ["cookingFuels"]),
  },
})
export default class EnergyResult extends Vue {
  @Prop({ type: Object as () => Modules })
  modules!: Modules;

  cookingFuels!: CookingFuel[];

  get cookingResult(): CookingResult | undefined {
    const householdCooking = this.modules.householdCooking;
    if (this.modules.general && householdCooking) {
      const site: CookingSite = {
        householdsCount:
          this.modules.general.totalPopulation /
          this.modules.general.familiesCount,
        categories: Object.fromEntries(
          socioEconomicCategories.map((item) => {
            const percentage = this.getCategoryPercentage(item);
            const technologies: CookingTechnology[] =
              householdCooking.categoryCookings
                .filter(
                  (cooking) =>
                    cooking.categories[item].perHouseholdPercentage > 0
                )
                .map((cooking) => {
                  const fuel = this.cookingFuels.find(
                    (fuel) => fuel._id === cooking.stove.fuel
                  );
                  if (!fuel) {
                    throw new Error(`Fuel ${cooking.stove.fuel} not found`);
                  }
                  return {
                    stove: cooking.stove,
                    fuel: fuel,
                    property: cooking.categories[item],
                  };
                });
            return [
              item,
              {
                percentage,
                technologies,
              },
            ];
          })
        ) as CookingCategories,
      };
      return this.computeBySite(site);
    } else {
      return undefined;
    }
  }

  getCategoryPercentage(category: SocioEconomicCategory): number {
    if (!this.modules.general) {
      return 0;
    }
    const general: GeneralModule = this.modules.general;
    switch (category) {
      case "veryLow":
        return general.categoryVeryLow;
      case "low":
        return general.categoryLow;
      case "middle":
        return general.categoryMiddle;
      case "high":
        return general.categoryHigh;
      case "veryHigh":
        return general.categoryVeryHigh;
    }
  }

  computeByCategory(
    count: number,
    technologies: CookingTechnology[]
  ): CookingResult {
    const results: CookingResult[] = technologies.map((item) => {
      // CEu
      const usefulEnergy =
        item.stove.capacity *
        (item.property.useFactor / 100) *
        item.property.cookingTime *
        24 *
        365;
      // CEf
      const finalEnergy = usefulEnergy / item.stove.energyEfficiency;
      // CWF
      const fuelWeight = finalEnergy / item.fuel.energy;
      // CEmiss
      const emissionCo2 = fuelWeight * item.fuel.emissionFactorCo2;
      const emissionCo = finalEnergy * item.stove.emissionFactorCo;
      const emissionPm = finalEnergy * item.stove.emissionFactorPm;
      return applyMap(
        {
          energy: finalEnergy,
          emissionCo2,
          emissionCo,
          emissionPm,
        },
        (v) => (v * item.property.perHouseholdPercentage) / 100
      );
    });
    const result = applyReduce(results, (a, b) => a + b, {
      energy: 0,
      emissionCo2: 0,
      emissionCo: 0,
      emissionPm: 0,
    });
    return applyMap(result, (v) => v * count);
  }

  computeBySite(site: CookingSite): CookingResult {
    const results = Object.values(site.categories).map((item) => {
      const count = site.householdsCount * (item.percentage / 100);
      return this.computeByCategory(count, item.technologies);
    });
    return applyReduce(results, (a, b) => a + b);
  }
}

interface CookingSite {
  householdsCount: number;
  categories: CookingCategories;
}

type CookingCategories = Record<
  SocioEconomicCategory,
  {
    percentage: number;
    technologies: CookingTechnology[];
  }
>;

interface CookingTechnology {
  stove: CookingStove;
  fuel: CookingFuel;
  property: CategoryProperty;
}

// interface CookingResult {
//   years: Record<SocioEconomicCategory, SingleResult>[];
// }

interface CookingResult {
  /**
   * CEf
   */
  energy: number;
  emissionCo2: number;
  emissionCo: number;
  emissionPm: number;
}
</script>
