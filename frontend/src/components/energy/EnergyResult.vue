<template>
  <v-row>
    <v-col>
      <v-card v-if="siteResults" flat>
        <v-card-title>Household Cooking</v-card-title>
        <v-card-text>
          <v-tabs v-model="tab" center-active show-arrows>
            <v-tab v-for="item in years" :key="item" :href="`#${item}`">
              {{ item }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="(siteResult, index) in siteResults"
              :key="index"
              :value="`${years[index]}`"
            >
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
                          siteResult.categories.veryLow[item.key] | formatNumber
                        }}
                      </td>
                      <td class="text-right">
                        {{ siteResult.categories.low[item.key] | formatNumber }}
                      </td>
                      <td class="text-right">
                        {{
                          siteResult.categories.middle[item.key] | formatNumber
                        }}
                      </td>
                      <td class="text-right">
                        {{
                          siteResult.categories.high[item.key] | formatNumber
                        }}
                      </td>
                      <td class="text-right">
                        {{
                          siteResult.categories.veryHigh[item.key]
                            | formatNumber
                        }}
                      </td>
                      <td class="font-weight-bold text-right">
                        {{ siteResult.total[item.key] | formatNumber }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  CookingCategoryValue,
  CookingFuel,
  CookingStove,
  Modules,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { applyMap, applyReduce } from "@/utils/energy";
import { cloneDeep, range } from "lodash";
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

  tab: string | null = null;
  cookingFuels!: CookingFuel[];

  get years(): number[] {
    if (this.modules.general) {
      return range(
        this.modules.general.yearStart,
        this.modules.general.yearEnd + 1
      );
    } else {
      return [new Date().getFullYear()];
    }
  }

  get sites(): Site[] {
    const general = this.modules.general;
    const householdCooking = this.modules.householdCooking;
    if (general && householdCooking) {
      const firstSite: Site = {
        householdsCount: general.totalPopulation / general.familiesCount,
        proportions: Object.fromEntries<number>(
          socioEconomicCategories.map((cat) => [
            cat,
            general.categories[cat].proportion,
          ])
        ) as Record<SocioEconomicCategory, number>,
        categories: Object.fromEntries<CategoryValue>(
          socioEconomicCategories.map((item) => [
            item,
            {
              cookingTechnologies: householdCooking.categoryCookings
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
                    value: cooking.categories[item],
                  };
                }),
            },
          ])
        ) as Record<SocioEconomicCategory, CategoryValue>,
      };
      const sites: Site[] = [firstSite];
      for (let index = 1; index < this.years.length; index++) {
        const previousSite = sites[index - 1];
        const site = cloneDeep(previousSite);
        site.proportions = this.updateProportions(site.proportions);
        sites[index] = site;
      }
      return sites;
    } else {
      return [];
    }
  }

  get siteResults(): SiteResult[] {
    return this.sites.map((site) => this.computeSite(site));
  }

  updateProportions(
    proportions: Record<SocioEconomicCategory, number>
  ): Record<SocioEconomicCategory, number> {
    return proportions;
  }

  computeSite(site: Site): SiteResult {
    const results: [SocioEconomicCategory, CookingResult][] =
      socioEconomicCategories.map((cat) => {
        const count = site.householdsCount * site.proportions[cat];
        return [
          cat,
          this.computeCategory(count, site.categories[cat].cookingTechnologies),
        ];
      });
    return {
      categories: Object.fromEntries<CookingResult>(results) as Record<
        SocioEconomicCategory,
        CookingResult
      >,
      total: applyReduce(
        results.map((item) => item[1]),
        (a, b) => a + b
      ),
    };
  }

  computeCategory(
    count: number,
    technologies: CookingTechnology[]
  ): CookingResult {
    const results: CookingResult[] = technologies.map((item) => {
      // CEu
      const usefulEnergy =
        item.stove.capacity *
        item.value.useFactor *
        item.value.cookingTime *
        365 *
        3.6;
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
        (v) => v * item.value.countPerHousehold
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
}

interface Site {
  householdsCount: number;
  proportions: Record<SocioEconomicCategory, number>;
  categories: Record<SocioEconomicCategory, CategoryValue>;
}

interface CategoryValue {
  cookingTechnologies: CookingTechnology[];
}

interface CookingTechnology {
  stove: CookingStove;
  fuel: CookingFuel;
  value: CookingCategoryValue;
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

interface SiteResult {
  categories: Record<SocioEconomicCategory, CookingResult>;
  total: CookingResult;
}
</script>
