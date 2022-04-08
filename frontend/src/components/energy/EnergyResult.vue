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
          <v-row>
            <v-col cols="4">
              <energy-chart
                title="Income"
                :x-data="years"
                :y-data="income"
              ></energy-chart>
            </v-col>
            <v-col cols="4">
              <energy-chart
                title="Energy"
                :x-data="years"
                :y-data="energy"
              ></energy-chart>
            </v-col>
            <v-col cols="4">
              <energy-chart
                title="CO2 Emission"
                :x-data="years"
                :y-data="emissionCo2"
              ></energy-chart>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import EnergyChart from "@/components/energy/EnergyChart.vue";
import {
  CookingFuel,
  CookingStove,
  GeneralCategory,
  HouseholdCookingInput,
  Modules,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { applyMap, applyReduce } from "@/utils/energy";
import { chain, clamp, cloneDeep, range, round } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyChart,
  },
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
  @Prop({ type: Object as () => Modules })
  modules!: Modules;

  tab: string | null = null;
  cookingFuels!: CookingFuel[];

  get lines(): { text: string; key: keyof CookingResult; unit?: string }[] {
    return [
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
      {
        text: "Income",
        key: "income",
        unit: this.modules.general?.currency,
      },
    ];
  }

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

  get income(): Record<SocioEconomicCategory, number[]> {
    return this.getChartData("income");
  }

  get energy(): Record<SocioEconomicCategory, number[]> {
    return this.getChartData("energy");
  }

  get emissionCo2(): Record<SocioEconomicCategory, number[]> {
    return this.getChartData("emissionCo2");
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
        categories: Object.fromEntries<CategoryInput>(
          socioEconomicCategories.map((cat) => [
            cat,
            {
              general: general.categories[cat],
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
            } as CategoryInput,
          ])
        ) as Record<SocioEconomicCategory, CategoryInput>,
      };
      const sites: Site[] = [firstSite];
      for (let index = 1; index < this.years.length; index++) {
        const oldSite = sites[index - 1];
        const newSite = cloneDeep(oldSite);
        newSite.populationCount =
          oldSite.populationCount * scenario.demographicGrowth;
        newSite.proportions = this.updateProportions(oldSite);
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

  private getChartData(
    key: keyof CookingResult
  ): Record<SocioEconomicCategory, number[]> {
    return Object.fromEntries<number[]>(
      socioEconomicCategories.map((cat) => [
        cat,
        this.siteResults.map((result) => round(result.categories[cat][key])),
      ])
    ) as Record<SocioEconomicCategory, number[]>;
  }

  updateProportions(site: Site): Record<SocioEconomicCategory, number> {
    const precision = 2;
    const proportions = cloneDeep(site.proportions);
    for (let index = 0; index < socioEconomicCategories.length - 1; index++) {
      const currentCat = socioEconomicCategories[index];
      const nextCat = socioEconomicCategories[index + 1];
      const idealDelta = round(
        (proportions[currentCat] *
          site.categories[currentCat].general.annualIncome *
          (1 - site.incomeRate) -
          proportions[nextCat] *
            site.categories[nextCat].general.annualIncome *
            (site.incomeRate - 1) +
          chain(socioEconomicCategories)
            .filter((cat) => cat !== currentCat && cat !== nextCat)
            .map(
              (cat) =>
                proportions[cat] * site.categories[cat].general.annualIncome
            )
            .sum()
            .value() *
            (1 - site.incomeRate)) /
          (site.categories[currentCat].general.annualIncome -
            site.categories[nextCat].general.annualIncome),
        precision
      );
      const effectiveDelta: number = clamp(
        idealDelta,
        0,
        proportions[currentCat]
      );
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
    input: CategoryInput
  ): CookingResult {
    const results = input.cookingTechnologies.map((technology) => {
      // Ch
      const cookingTime =
        input.general.cookingHours /
        chain(input.cookingTechnologies)
          .map((t) => t.value.countPerHousehold)
          .sum()
          .value();
      // CEu
      const usefulEnergy =
        technology.stove.capacity *
        technology.value.useFactor *
        cookingTime *
        365 *
        3.6;
      // CEf
      const finalEnergy = usefulEnergy / technology.stove.energyEfficiency;
      // CWF
      const fuelWeight = finalEnergy / technology.fuel.energy;
      // CEmiss
      const emissionCo2 = fuelWeight * technology.fuel.emissionFactorCo2;
      const emissionCo = finalEnergy * technology.stove.emissionFactorCo;
      const emissionPm = finalEnergy * technology.stove.emissionFactorPm;
      return applyMap(
        {
          energy: finalEnergy,
          emissionCo2,
          emissionCo,
          emissionPm,
        },
        (v) => v * technology.value.countPerHousehold
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
      ...applyMap(result, (v) => v * householdCount),
      proportion: proportion * 100,
      householdCount: householdCount,
      populationCount: site.populationCount * proportion,
      income: input.general.annualIncome * householdCount,
    };
  }
}

interface Site {
  householdsCount: number;
  populationCount: number;
  incomeRate: number;
  proportions: Record<SocioEconomicCategory, number>;
  categories: Record<SocioEconomicCategory, CategoryInput>;
}

interface CategoryInput {
  general: GeneralCategory;
  cookingTechnologies: CookingTechnology[];
}

interface CookingTechnology {
  stove: CookingStove;
  fuel: CookingFuel;
  value: HouseholdCookingInput;
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
  income: number;
}

interface SiteResult {
  categories: Record<SocioEconomicCategory, CookingResult>;
  total: CookingResult;
}
</script>
