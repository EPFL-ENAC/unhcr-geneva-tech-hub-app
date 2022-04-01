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
                      <td class="font-weight-black">
                        {{ item.text }}
                        <template v-if="item.unit">[{{ item.unit }}]</template>
                      </td>
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
import { cloneDeep, min, range, round, sum } from "lodash";
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
  readonly lines: { text: string; key: keyof CookingResult; unit?: string }[] =
    [
      {
        text: "Proportion",
        key: "proportion",
        unit: "%",
      },
      {
        text: "Households",
        key: "householdCount",
      },
      {
        text: "Population",
        key: "populationCount",
      },
      {
        text: "Energy",
        key: "energy",
        unit: "MJ",
      },
      {
        text: "CO2 Emission",
        key: "emissionCo2",
        unit: "kg",
      },
      {
        text: "CO Emission",
        key: "emissionCo",
        unit: "g",
      },
      {
        text: "Particles Emission",
        key: "emissionPm",
        unit: "g",
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
    const scenario = this.modules.scenario?.scenarios.find(
      (scn) => scn.id === this.modules.scenario?.selectedId
    );
    if (general && householdCooking && scenario) {
      const firstSite: Site = {
        householdsCount: general.totalPopulation / general.familiesCount,
        populationCount: general.totalPopulation,
        incomeRate: scenario.incomeRate,
        proportions: Object.fromEntries<number>(
          socioEconomicCategories.map((cat) => [
            cat,
            general.categories[cat].proportion,
          ])
        ) as Record<SocioEconomicCategory, number>,
        categories: Object.fromEntries<CategoryValue>(
          socioEconomicCategories.map((cat) => [
            cat,
            {
              income: general.categories[cat].annualIncome,
              cookingTechnologies: householdCooking.categoryCookings
                .filter(
                  (cooking) => cooking.categories[cat].countPerHousehold > 0
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
                    value: cooking.categories[cat],
                  };
                }),
            } as CategoryValue,
          ])
        ) as Record<SocioEconomicCategory, CategoryValue>,
      };
      const sites: Site[] = [firstSite];
      for (let index = 1; index < this.years.length; index++) {
        const oldSite = sites[index - 1];
        const newSite = cloneDeep(oldSite);
        newSite.populationCount =
          oldSite.populationCount * scenario.demographicGrowth;
        newSite.proportions = this.getNewProportions(oldSite);
        sites[index] = newSite;
      }
      return sites;
    } else {
      return [];
    }
  }

  get siteResults(): SiteResult[] {
    return this.sites.map((site) => this.computeSite(site));
  }

  getNewProportions(site: Site): Record<SocioEconomicCategory, number> {
    const precision = 2;
    const proportions = cloneDeep(site.proportions);
    for (let index = 0; index < socioEconomicCategories.length - 1; index++) {
      const currentCat = socioEconomicCategories[index];
      const nextCat = socioEconomicCategories[index + 1];
      const idealDelta = round(
        (proportions[currentCat] *
          site.categories[currentCat].income *
          (1 - site.incomeRate) -
          proportions[nextCat] *
            site.categories[nextCat].income *
            (site.incomeRate - 1) +
          sum(
            socioEconomicCategories
              .filter((cat) => cat !== currentCat && cat !== nextCat)
              .map((cat) => proportions[cat] * site.categories[cat].income)
          ) *
            (1 - site.incomeRate)) /
          (site.categories[currentCat].income -
            site.categories[nextCat].income),
        precision
      );
      const effectiveDelta: number =
        min([idealDelta, proportions[currentCat]]) ?? 0;
      proportions[currentCat] = round(
        proportions[currentCat] - effectiveDelta,
        precision
      );
      proportions[nextCat] = round(
        proportions[nextCat] + effectiveDelta,
        precision
      );
      if (proportions[currentCat] > 0) {
        break;
      }
    }
    return proportions;
  }

  computeSite(site: Site): SiteResult {
    const results: [SocioEconomicCategory, CookingResult][] =
      socioEconomicCategories.map((cat) => {
        return [
          cat,
          this.computeCategory(
            site,
            site.proportions[cat],
            site.categories[cat]
          ),
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
    site: Site,
    proportion: number,
    value: CategoryValue
  ): CookingResult {
    const results = value.cookingTechnologies.map((item) => {
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
    const householdCount = site.householdsCount * proportion;
    return {
      proportion: proportion * 100,
      householdCount: householdCount,
      populationCount: site.populationCount * proportion,
      ...applyMap(result, (v) => v * householdCount),
    };
  }
}

interface Site {
  householdsCount: number;
  populationCount: number;
  incomeRate: number;
  proportions: Record<SocioEconomicCategory, number>;
  categories: Record<SocioEconomicCategory, CategoryValue>;
}

interface CategoryValue {
  income: number;
  cookingTechnologies: CookingTechnology[];
}

interface CookingTechnology {
  stove: CookingStove;
  fuel: CookingFuel;
  value: CookingCategoryValue;
}

interface CookingResult {
  proportion: number;
  householdCount: number;
  populationCount: number;
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
