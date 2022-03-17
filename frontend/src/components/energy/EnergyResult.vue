<template>
  <v-row>
    <v-col>
      <v-card v-if="householdCookingResult" flat>
        <v-card-title>Household Cooking</v-card-title>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th></th>
                <th class="text-right">Very Low</th>
                <th class="text-right">Low</th>
                <th class="text-right">Middle</th>
                <th class="text-right">High</th>
                <th class="text-right">Very High</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in lines" :key="item.key">
                <td class="font-weight-black">{{ item.text }}</td>
                <td class="text-right">
                  {{
                    householdCookingResult.categories.veryLow[item.key]
                      | formatNumber
                  }}
                </td>
                <td class="text-right">
                  {{
                    householdCookingResult.categories.low[item.key]
                      | formatNumber
                  }}
                </td>
                <td class="text-right">
                  {{
                    householdCookingResult.categories.middle[item.key]
                      | formatNumber
                  }}
                </td>
                <td class="text-right">
                  {{
                    householdCookingResult.categories.high[item.key]
                      | formatNumber
                  }}
                </td>
                <td class="text-right">
                  {{
                    householdCookingResult.categories.veryHigh[item.key]
                      | formatNumber
                  }}
                </td>
                <td class="font-weight-bold text-right">
                  {{ householdCookingResult.total[item.key] | formatNumber }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
  </v-row>
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
  filters: {
    formatNumber(value: number): string {
      return value.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      });
    },
  },
})
export default class EnergyResult extends Vue {
  readonly lines: { text: string; key: keyof CookingResult }[] = [
    {
      text: "Energy [MJ]",
      key: "energy",
    },
    {
      text: "CO2 Emission [kg]",
      key: "emissionCo2",
    },
    {
      text: "CO Emission [g]",
      key: "emissionCo",
    },
    {
      text: "Particles Emission [g]",
      key: "emissionPm",
    },
  ];

  @Prop({ type: Object as () => Modules })
  modules!: Modules;

  cookingFuels!: CookingFuel[];

  get householdCookingResult(): HouseholdCookingResult | undefined {
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
                  (cooking) => cooking.categories[item].countPerHousehold > 0
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

  private getCategoryPercentage(category: SocioEconomicCategory): number {
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
        (v) => v * item.property.countPerHousehold
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

  computeBySite(site: CookingSite): HouseholdCookingResult {
    const results: [keyof SocioEconomicCategory, CookingResult][] =
      Object.entries(site.categories).map(([key, value]) => {
        const count = site.householdsCount * (value.percentage / 100);
        return [
          key as keyof SocioEconomicCategory,
          this.computeByCategory(count, value.technologies),
        ];
      });
    return {
      categories: Object.fromEntries(results) as Record<
        SocioEconomicCategory,
        CookingResult
      >,
      total: applyReduce(
        results.map((item) => item[1]),
        (a, b) => a + b
      ),
    };
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

interface CookingResult {
  /**
   * CEf
   */
  energy: number;
  emissionCo2: number;
  emissionCo: number;
  emissionPm: number;
}

interface HouseholdCookingResult {
  categories: Record<SocioEconomicCategory, CookingResult>;
  total: CookingResult;
}
</script>
