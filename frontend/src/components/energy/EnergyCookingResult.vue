<template>
  <v-row>
    <v-col>
      <v-card v-if="siteResults" flat>
        <v-card-text>
          <v-row>
            <!-- Energy -->
            <v-col cols="4">
              <h1 class="pa-4">Energy</h1>
              <energy-key-indicator
                name="Total Energy"
                unit="MJ/HH"
                :base-value="baselineResult.energy"
                :value="globalResult.energy"
              ></energy-key-indicator>
              <energy-key-indicator
                name="Global Efficiency"
                unit="%"
                :base-value="baselineResult.energyEfficiency"
                :value="globalResult.energyEfficiency"
                greater-better
              ></energy-key-indicator>
              <energy-chart
                title="Energy"
                :years="years"
                :items="energy"
                :y-labels="['Final Energy [MJ]', 'Efficiency [%]']"
              ></energy-chart>
              <h2>Requirement of fuelwood and charcoal</h2>
              <energy-key-indicator
                name="Maximum annual wood equivalent area"
                unit="ha"
                :base-value="baselineResult.woodArea"
                :value="globalResult.woodArea"
              ></energy-key-indicator>
              <energy-chart
                title="Equivalent forested area"
                :years="years"
                :items="wood"
                :y-labels="['[ha]']"
              ></energy-chart>
              <v-row>
                <v-col>
                  <energy-legend></energy-legend>
                </v-col>
                <v-col>
                  <energy-radar-chart
                    :items="radarItems"
                    :properties="radarProperties"
                  ></energy-radar-chart>
                </v-col>
              </v-row>
            </v-col>
            <v-divider vertical></v-divider>
            <!-- Emissions -->
            <v-col cols="4">
              <h1 class="pa-4">Emissions</h1>
              <energy-key-indicator
                name="CO2 Emission"
                unit="kg/HH"
                :base-value="baselineResult.emissionCo2"
                :value="globalResult.emissionCo2"
              ></energy-key-indicator>
              <energy-chart
                title="CO2"
                :years="years"
                :items="emissionCo2"
                :y-labels="['CO2 Emission [kg]']"
              ></energy-chart>
              <energy-chart
                title="CO"
                :years="years"
                :items="emissionCo"
                :y-labels="['CO Emission [g]']"
              ></energy-chart>
              <energy-chart
                title="PM"
                :years="years"
                :items="emissionPm"
                :y-labels="['PM Emission [mg]']"
              ></energy-chart>
            </v-col>
            <v-divider vertical></v-divider>
            <!-- Economy -->
            <v-col cols="4">
              <h1 class="pa-4">Economy</h1>
              <energy-key-indicator
                name="Sum Discounted Cost"
                unit="$"
                :base-value="baselineResult.discountedCost"
                :value="globalResult.discountedCost"
              ></energy-key-indicator>
              <energy-chart
                title="Income"
                :years="years"
                :items="income"
                :y-labels="['Income [$]']"
              ></energy-chart>
              <energy-chart
                title="Cost"
                :years="years"
                :items="cost"
                :y-labels="['Total Cost [$]']"
                y-inverse
              ></energy-chart>
              <energy-key-indicator
                name="Affordability"
                unit="%"
                :base-value="baselineResult.affordability"
                :value="globalResult.affordability"
                greater-better
              ></energy-key-indicator>
              <energy-chart
                title="Affordability"
                :years="years"
                :items="affordability"
                :y-labels="['Affordability [%]']"
              ></energy-chart>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span>Details</span>
                    <v-btn
                      class="flex-grow-0"
                      color="primary"
                      text
                      @click.stop.prevent="downloadExcel"
                    >
                      <v-icon left>$mdiDownload</v-icon>
                      Download
                    </v-btn>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-tabs v-model="tab" center-active show-arrows>
                      <v-tab
                        v-for="item in years"
                        :key="item"
                        :href="`#${item}`"
                      >
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
                          <template #default>
                            <thead>
                              <tr>
                                <th></th>
                                <th
                                  v-for="cat in categories"
                                  :key="cat"
                                  class="text-right"
                                >
                                  {{ $t(`energy.${cat}`) }}
                                </th>
                                <th class="text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="item in lines" :key="item.key">
                                <td class="font-weight-black">
                                  {{ item.text }}
                                  <template v-if="item.unit"
                                    >[{{ item.unit }}]</template
                                  >
                                </td>
                                <td
                                  v-for="cat in categories"
                                  :key="cat"
                                  class="text-right"
                                >
                                  {{
                                    siteResult.categories[cat][item.key] |
                                      formatNumber(0, item.decimal)
                                  }}
                                </td>
                                <td class="font-weight-bold text-right">
                                  {{
                                    siteResult.categoryTotal[item.key] |
                                      formatNumber(0, item.decimal)
                                  }}
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import EnergyChart, {
  ChartItem,
  ChartItemType,
} from "@/components/energy/EnergyChart.vue";
import EnergyKeyIndicator from "@/components/energy/EnergyKeyIndicator.vue";
import EnergyLegend from "@/components/energy/EnergyLegend.vue";
import EnergyRadarChart, {
  RadarItem,
  RadarProperty,
} from "@/components/energy/EnergyRadarChart.vue";
import {
  CategoryCooking,
  CookingCashIntervention,
  CookingFuel,
  CookingFuelId,
  cookingFuelIds,
  CookingStove,
  CookingStoveId,
  CookingTechnologyIntervention,
  GeneralCategory,
  GeneralModule,
  HouseholdCookingInput,
  HouseholdCookingModule,
  Scenario,
  ScenarioModule,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { cccmColors } from "@/plugins/vuetify";
import {
  applyMap,
  applyReduce,
  fnSum,
  getColor,
  toPercentage,
  toRate,
} from "@/utils/energy";
import download from "downloadjs";
import { Workbook } from "exceljs";
import { chain, clamp, cloneDeep, range, sortBy, sumBy, zip } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyChart,
    EnergyKeyIndicator,
    EnergyLegend,
    EnergyRadarChart,
  },
  computed: {
    ...mapState("energy", ["cookingFuels"]),
  },
})
export default class EnergyCookingResult extends Vue {
  readonly categories = socioEconomicCategories;

  @Prop({ type: Object as () => GeneralModule })
  generalModule: GeneralModule | undefined;
  @Prop({ type: Object as () => HouseholdCookingModule })
  householdCookingModule: HouseholdCookingModule | undefined;
  @Prop({ type: Object as () => ScenarioModule })
  scenarioModule: ScenarioModule | undefined;
  @Prop({ type: String })
  documentName!: string;
  @Prop({ type: String })
  documentSiteName!: string;

  readonly radarProperties: RadarProperty<GlobalResult>[] = [
    {
      name: "Energy",
      key: "energy",
    },
    {
      name: "Energy Efficiency",
      key: "energyEfficiency",
      max: 100,
    },
    {
      name: "Emission CO2",
      key: "emissionCo2",
    },
    {
      name: "Wood Area",
      key: "woodArea",
    },
    {
      name: "Discounted Cost",
      key: "discountedCost",
    },
    {
      name: "Affordability",
      key: "affordability",
    },
  ];

  tab: string | null = null;
  cookingFuels!: CookingFuel[];

  get lines(): TableRow[] {
    const results: TableRow[] = [
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
        text: "Useful Energy",
        key: "usefulEnergy",
        unit: "MJ",
      },
      {
        text: "Final Energy",
        key: "finalEnergy",
        unit: "MJ",
      },
      {
        text: "Energy Efficiency",
        key: "energyEfficiency",
        unit: "%",
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
        unit: "mg",
      },
      {
        text: "Income",
        key: "income",
        unit: "$",
      },
      {
        text: "Wood weight",
        key: "woodWeight",
        unit: "kg",
      },
      {
        text: "Charcoal weight",
        key: "charcoalWeight",
        unit: "kg",
      },
      {
        text: "Equivalent wood weight",
        key: "woodNeed",
        unit: "kg",
      },
      {
        text: "Required biomass area for wood collection",
        key: "woodArea",
        unit: "ha",
      },
      {
        text: "Fixed cost",
        key: "fixedCost",
        unit: "$",
      },
      {
        text: "Variable cost",
        key: "variableCost",
        unit: "$",
      },
      {
        text: "Total cost",
        key: "totalCost",
        unit: "$",
      },
      {
        text: "Discounted cost",
        key: "discountedCost",
        unit: "$",
      },
      {
        text: "Cost affordability",
        key: "costAffordability",
        unit: "%",
      },
    ];
    const stoves: TableRow[] = sortBy(
      this.householdCookingModule?.technologyYears[0].technologies,
      (item) => item.stove.index
    ).map((cooking) => ({
      text: `${cooking.stove.name} - ${cooking.fuel.name}`,
      key: cooking.stove._id,
      decimal: 2,
    }));
    return [...results, ...stoves];
  }

  get years(): number[] {
    if (this.generalModule) {
      return range(
        this.generalModule.yearStart,
        this.generalModule.yearEnd + 1
      );
    } else {
      return [new Date().getFullYear()];
    }
  }

  get energy(): ChartItem[] {
    return [
      ...this.getDetailChartItems("bar", "finalEnergy", {
        itemName: "Final Energy",
        unit: "MJ",
        keys: ["usefulEnergy"],
      }),
      this.getTotalChartItem("line", "energyEfficiency", {
        name: "Efficiency",
        yAxisIndex: 1,
        unit: "%",
      }),
    ];
  }

  get wood(): ChartItem[] {
    return [this.getTotalChartItem("bar", "woodArea", { unit: "ha" })];
  }

  get emissionCo2(): ChartItem[] {
    return this.getDetailChartItems("bar", "emissionCo2", { unit: "kg" });
  }

  get emissionCo(): ChartItem[] {
    return this.getDetailChartItems("bar", "emissionCo", { unit: "g" });
  }

  get emissionPm(): ChartItem[] {
    return this.getDetailChartItems("bar", "emissionPm", { unit: "mg" });
  }

  get income(): ChartItem[] {
    return this.getDetailChartItems("bar", "income", {
      unit: "$",
    });
  }

  get cost(): ChartItem[] {
    return this.getDetailChartItems("bar", "totalCost", {
      itemName: "Cost",
      unit: "$",
      keys: ["fixedCost", "variableCost"],
    });
  }

  get affordability(): ChartItem[] {
    return [
      ...this.getDetailChartItems("line", "costAffordability", {
        unit: "%",
      }),
      this.getTotalChartItem("line", "costAffordability", {
        unit: "%",
      }),
    ];
  }

  get sites(): Site[] {
    const actions: Action[] = [
      ...(this.householdCookingModule?.substitutionInterventions ?? []),
      ...(this.householdCookingModule?.efficiencyInterventions ?? []),
      ...(this.householdCookingModule?.cashInterventions ?? []),
    ]
      .filter((intervention) => intervention.selected)
      .map((intervention) => {
        switch (intervention.type) {
          case "cooking-technology":
            return new CookingTechnologyAction(intervention);
          case "cooking-cash":
            return new CookingCashAction(intervention);
        }
      });
    return this.getSites(actions);
  }

  get baselineSites(): Site[] {
    return this.getSites([]);
  }

  get siteResults(): SiteResult[] {
    return this.sites.map((site) => this.computeSite(site));
  }

  get baselineResults(): SiteResult[] {
    return this.baselineSites.map((site) => this.computeSite(site));
  }

  get globalResult(): GlobalResult {
    return this.getGlobalResult(this.siteResults);
  }

  get baselineResult(): GlobalResult {
    return this.getGlobalResult(this.baselineResults);
  }

  get radarItems(): RadarItem<GlobalResult>[] {
    return [
      {
        name: "Interventions",
        value: this.globalResult,
      },
      {
        name: "Baseline",
        value: this.baselineResult,
      },
    ];
  }

  get scenario(): Scenario | undefined {
    return this.scenarioModule?.scenarios.find(
      (scn) => scn.id === this.scenarioModule?.selectedId
    );
  }

  getGlobalResult(results: SiteResult[]): GlobalResult {
    const finalEnergy = chain(results)
      .sumBy((r) => r.categoryTotal.finalEnergy)
      .value();
    const households = chain(results)
      .sumBy((r) => r.categoryTotal.householdCount)
      .value();
    const usefulEnergy = chain(results)
      .sumBy((r) => r.categoryTotal.usefulEnergy)
      .value();
    const emissionCo2 = chain(results)
      .sumBy((r) => r.categoryTotal.emissionCo2)
      .value();
    const maxWoodArea = chain(results)
      .map((r) => r.categoryTotal.woodArea)
      .max()
      .value();
    const discountedCost = chain(results)
      .sumBy((r) => r.categoryTotal.discountedCost)
      .value();
    const totalCost = chain(results)
      .sumBy((r) => r.categoryTotal.totalCost)
      .value();
    const income = chain(results)
      .sumBy((r) => r.categoryTotal.income)
      .value();
    return {
      energy: finalEnergy / households,
      energyEfficiency: (usefulEnergy / finalEnergy) * 100,
      emissionCo2: emissionCo2 / households,
      woodArea: maxWoodArea,
      discountedCost,
      affordability: (totalCost / income) * 100,
    };
  }

  private getDetailChartItems(
    type: ChartItemType,
    key: keyof HouseholdResult,
    option?: {
      itemName?: string;
      ratio?: number;
      yAxisIndex?: number;
      unit?: string;
      keys?: (keyof HouseholdResult)[];
    }
  ): ChartItem[] {
    return socioEconomicCategories.map((cat) => {
      const name = this.$t(`energy.${cat}`).toString();
      const ratio = option?.ratio ?? 1;
      const mapValue = (value?: number) => ratio * (value ?? 0);
      const keys = option?.keys;
      const itemName = option?.itemName ?? "";
      return {
        type: type,
        name: option?.itemName && !keys ? `${name} ${option?.itemName}` : name,
        data: this.siteResults.map((result) => ({
          value: mapValue(result.categories[cat][key]),
          average: mapValue(result.households[cat][key]),
          ...(keys
            ? Object.fromEntries(
                keys.flatMap((key) => [
                  [`${key}-total`, mapValue(result.categories[cat][key])],
                  [`${key}-average`, mapValue(result.households[cat][key])],
                ])
              )
            : {}),
        })),
        color: getColor(cat),
        yAxisIndex: option?.yAxisIndex,
        unit: option?.unit,
        tooltips: [
          {
            name: `Total ${itemName}`,
            key: "value",
          },
          ...(keys
            ? keys.map((key) => {
                const name = this.$t(`energy.${key}`).toString();
                return {
                  name: `Total ${name}`,
                  key: `${key}-total`,
                };
              })
            : []),
          {
            name: `Average ${itemName}`,
            key: "average",
          },
          ...(keys
            ? keys.map((key) => {
                const name = this.$t(`energy.${key}`).toString();
                return {
                  name: `Average ${name}`,
                  key: `${key}-average`,
                };
              })
            : []),
        ],
      };
    });
  }

  private getTotalChartItem(
    type: ChartItemType,
    key: keyof CategoryResult,
    option?: {
      name?: string;
      ratio?: number;
      yAxisIndex?: number;
      unit?: string;
    }
  ): ChartItem {
    return {
      type: type,
      name: option?.name ?? "Total",
      data: this.siteResults.map(
        (result) => (option?.ratio ?? 1) * (result.categoryTotal[key] ?? 0)
      ),
      color: cccmColors.primary,
      yAxisIndex: option?.yAxisIndex,
      unit: option?.unit,
    };
  }

  getSites(actions: Action[]): Site[] {
    const general = this.generalModule;
    const householdCooking = this.householdCookingModule;
    const scenario = this.scenario;
    if (general && householdCooking && scenario) {
      const firstScenario = scenario.years[0];
      const firstTechnologies = householdCooking.technologyYears[0];
      const firstSite: Site = {
        yearCount: 0,
        householdsCount: general.familiesCount,
        populationCount: general.totalPopulation,
        woodCarbonation: general.woodCarbonation,
        woodDensity: general.woodDensity,

        householdSize: firstScenario.householdSize.val,
        incomeRate: firstScenario.incomeRate.val,
        discountRate: firstScenario.discountRate.val,
        demographicGrowth: firstScenario.demographicGrowth.val,
        fuelPriceRates: Object.fromEntries(
          cookingFuelIds.map((id) => [id, firstScenario.fuelPriceRates[id].val])
        ) as Record<CookingFuelId, number>,

        proportions: Object.fromEntries<number>(
          socioEconomicCategories.map((cat) => [
            cat,
            general.categories[cat].proportion,
          ])
        ) as Record<SocioEconomicCategory, number>,
        categories: this.getCategories(general, firstTechnologies.technologies),
      };
      const sites: Site[] = [firstSite];
      for (let index = 1; index < this.years.length; index++) {
        const year = this.years[index];
        const previousSite = sites[index - 1];
        let currentSite = cloneDeep(previousSite);
        const currentScenario = scenario.years.find(
          (item) => item.yearIndex === index
        );
        if (currentScenario) {
          currentSite.householdSize = currentScenario.householdSize.val;
          currentSite.incomeRate = currentScenario.incomeRate.val;
          currentSite.discountRate = currentScenario.discountRate.val;
          currentSite.demographicGrowth = currentScenario.demographicGrowth.val;
          currentSite.fuelPriceRates = Object.fromEntries(
            cookingFuelIds.map((id) => [
              id,
              currentScenario.fuelPriceRates[id].val,
            ])
          ) as Record<CookingFuelId, number>;
        }
        const technologies = householdCooking.technologyYears.find(
          (item) => item.yearIndex === index
        )?.technologies;
        if (technologies) {
          currentSite.categories = this.getCategories(general, technologies);
        }
        currentSite.yearCount = index;
        currentSite.populationCount =
          previousSite.populationCount * currentSite.demographicGrowth;
        currentSite.householdsCount =
          currentSite.populationCount / currentSite.householdSize;
        currentSite.proportions = this.getNewProportions(previousSite);
        currentSite = actions
          .filter((action) => action.isActive(year))
          .reduce((site, action) => action.apply(site), currentSite);
        sites[index] = currentSite;
      }
      return sites;
    } else {
      return [];
    }
  }

  /**
   * Compute new proportions for the next year.
   * Upgrade the categories by moving from a category to a better next one (from lowest to highest) until the target income is reached or everyone is in the best category.
   */
  getNewProportions(site: Site): Record<SocioEconomicCategory, number> {
    const proportions = cloneDeep(site.proportions);
    const incomes = Object.fromEntries(
      socioEconomicCategories.map((cat) => [
        cat,
        site.categories[cat].general.annualIncome,
      ])
    ) as Record<SocioEconomicCategory, number>;
    const goalTotalIncome =
      sumBy(socioEconomicCategories, (cat) => proportions[cat] * incomes[cat]) *
      site.incomeRate;
    for (let index = 0; index < socioEconomicCategories.length - 1; index++) {
      const totalIncome = sumBy(
        socioEconomicCategories,
        (cat) => proportions[cat] * incomes[cat]
      );
      const rate = goalTotalIncome / totalIncome;
      const currentCat = socioEconomicCategories[index];
      const nextCat = socioEconomicCategories[index + 1];
      const currentProduct = proportions[currentCat] * incomes[currentCat];
      const nextProduct = proportions[nextCat] * incomes[nextCat];
      const idealDelta =
        (currentProduct * (1 - rate) -
          nextProduct * (rate - 1) +
          (totalIncome - (currentProduct + nextProduct)) * (1 - rate)) /
        (incomes[currentCat] - incomes[nextCat]);
      const effectiveDelta: number = clamp(
        idealDelta,
        0,
        proportions[currentCat]
      );
      proportions[currentCat] -= effectiveDelta;
      proportions[nextCat] += effectiveDelta;
      if (proportions[currentCat] > 0) {
        break;
      }
    }
    return proportions;
  }

  getCategories(
    general: GeneralModule,
    technologies: CategoryCooking[]
  ): Record<SocioEconomicCategory, CategoryInput> {
    return Object.fromEntries<CategoryInput>(
      socioEconomicCategories.map((cat) => [
        cat,
        {
          general: general.categories[cat],
          cookingTechnologies: technologies.map((cooking) => {
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
    ) as Record<SocioEconomicCategory, CategoryInput>;
  }

  computeSite(site: Site): SiteResult {
    const results: [
      SocioEconomicCategory,
      HouseholdResult,
      HouseholdResult,
      CategoryResult
    ][] = socioEconomicCategories.map((cat) => {
      const proportion = site.proportions[cat];
      const householdResult = this.computeHousehold(site, site.categories[cat]);
      const proportionalHousehold = applyMap(
        householdResult,
        (value) => (value ?? 1) * proportion
      );
      return [
        cat,
        householdResult,
        proportionalHousehold,
        this.computeCategory(site, proportion, householdResult),
      ];
    });
    const categoryTotal = applyReduce(
      results.map((item) => item[3]),
      fnSum
    );
    return {
      households: Object.fromEntries<HouseholdResult>(
        results.map(([cat, item]) => [cat, item])
      ) as Record<SocioEconomicCategory, HouseholdResult>,
      householdAverage: applyReduce(
        results.map((item) => item[2]),
        fnSum
      ),
      categories: Object.fromEntries<CategoryResult>(
        results.map(([cat, , , item]) => [cat, item])
      ) as Record<SocioEconomicCategory, CategoryResult>,
      categoryTotal: {
        ...categoryTotal,
        energyEfficiency:
          (categoryTotal.usefulEnergy / categoryTotal.finalEnergy) * 100,
        costAffordability:
          (categoryTotal.totalCost / categoryTotal.income) * 100,
      },
    };
  }

  computeHousehold(site: Site, input: CategoryInput): HouseholdResult {
    const technologyResults = input.cookingTechnologies.map((technology) => {
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
      const woodWeight = technology.fuel._id === "wood" ? fuelWeight : 0;
      const charcoalWeight =
        technology.fuel._id === "charcoal" ? fuelWeight : 0;
      // Rwood
      const woodNeed = woodWeight + charcoalWeight / site.woodCarbonation;
      // Awood
      const woodArea = woodNeed / site.woodDensity;
      // CEmiss
      const emissionCo2 = fuelWeight * technology.fuel.emissionFactorCo2;
      const emissionCo = usefulEnergy * technology.stove.emissionFactorCo;
      const emissionPm = usefulEnergy * technology.stove.emissionFactorPm;
      const fixedCost =
        ((site.discountRate - 1) /
          (1 - Math.pow(site.discountRate, -technology.stove.lifetime))) *
        technology.stove.investmentCost;
      const variableCost =
        fuelWeight *
        technology.fuel.price *
        Math.pow(site.fuelPriceRates[technology.fuel._id], site.yearCount);
      // CCI
      const totalCost = fixedCost + variableCost;
      const result = applyMap(
        {
          usefulEnergy,
          finalEnergy,
          woodWeight,
          charcoalWeight,
          woodNeed,
          woodArea,
          emissionCo2,
          emissionCo,
          emissionPm,
          fixedCost,
          variableCost,
          totalCost,
        },
        (v) => (v ?? 0) * technology.value.countPerHousehold
      );
      return result;
    });
    const householdResult = {
      ...(Object.fromEntries<number>(
        input.cookingTechnologies.map((technology) => [
          technology.stove._id,
          technology.value.countPerHousehold,
        ])
      ) as Record<CookingStoveId, number | undefined>),
      ...applyReduce(technologyResults, fnSum, {
        usefulEnergy: 0,
        finalEnergy: 0,
        woodWeight: 0,
        charcoalWeight: 0,
        woodNeed: 0,
        woodArea: 0,
        emissionCo2: 0,
        emissionCo: 0,
        emissionPm: 0,
        fixedCost: 0,
        variableCost: 0,
        totalCost: 0,
      }),
      income: input.general.annualIncome,
    };
    // Cafford
    const costAffordability =
      householdResult.totalCost / householdResult.income;
    return {
      ...householdResult,
      costAffordability,
    };
  }

  computeCategory(
    site: Site,
    proportion: number,
    householdResult: HouseholdResult
  ): CategoryResult {
    const householdCount = site.householdsCount * proportion;
    const categoryResult = applyMap(
      householdResult,
      (v) => (v ?? 0) * householdCount
    );
    const energyEfficiency =
      categoryResult.finalEnergy !== 0
        ? categoryResult.usefulEnergy / categoryResult.finalEnergy
        : 0;
    const discountedCost =
      categoryResult.totalCost / Math.pow(site.discountRate, site.yearCount);
    return {
      ...categoryResult,
      proportion: proportion * 100,
      householdCount,
      populationCount: site.populationCount * proportion,
      energyEfficiency: energyEfficiency * 100,
      discountedCost,
      costAffordability: householdResult.costAffordability * 100,
    };
  }

  async downloadExcel(): Promise<void> {
    const buffer = await this.createWorkbook().xlsx.writeBuffer();
    download(new Uint8Array(buffer), "unhcr-tss-energy-household-cooking.xlsx");
  }

  createWorkbook(): Workbook {
    const workbook = new Workbook();
    workbook.creator = "unhcr-tss.epfl.ch";
    workbook.created = new Date();

    const categoryNames = socioEconomicCategories.map((cat) =>
      this.$t(`energy.${cat}`).toString()
    );

    const informationWorksheet = workbook.addWorksheet("Information");
    informationWorksheet.addRow(["Site Name", this.documentSiteName]);
    informationWorksheet.addRow(["Project Name", this.documentName]);
    informationWorksheet.addRow([
      "Starting Year",
      this.generalModule?.yearStart,
    ]);
    informationWorksheet.addRow(["Ending Year", this.generalModule?.yearEnd]);
    informationWorksheet.addRow([
      "National currency",
      this.generalModule?.currency,
    ]);
    informationWorksheet.addRow([
      "Exchange rate with the US dollar",
      this.generalModule?.exchangeRateUsd,
    ]);
    informationWorksheet.addRow([]);
    informationWorksheet.addRow([
      "Population of the site",
      this.generalModule?.totalPopulation,
    ]);
    informationWorksheet.addRow([
      "Number of families/households",
      this.generalModule?.familiesCount,
    ]);
    informationWorksheet.addRow([
      "Carbonation yield [%]",
      toPercentage(this.generalModule?.woodCarbonation),
    ]);
    informationWorksheet.addRow([]);
    informationWorksheet.addRow([undefined, ...categoryNames]);
    informationWorksheet.addRow([
      "Distribution of the households among the Quality of Life Levels (QLL) [%]",
      ...socioEconomicCategories.map((cat) =>
        toPercentage(this.generalModule?.categories[cat].proportion)
      ),
    ]);
    informationWorksheet.addRow([
      "Cooking time per day by household and QLL [h]",
      ...socioEconomicCategories.map(
        (cat) => this.generalModule?.categories[cat].cookingHours
      ),
    ]);
    informationWorksheet.addRow([
      "Annual income per household per QLL [currency]",
      ...socioEconomicCategories.map(
        (cat) => this.generalModule?.categories[cat].annualIncome
      ),
    ]);

    const scenarioWorksheet = workbook.addWorksheet("Scenario");
    const scenarioFirstYear = this.scenario?.years[0];
    scenarioWorksheet.addRow(["Name of the scenario", this.scenario?.name]);
    scenarioWorksheet.addRow([undefined, "Minimum", "Maximum", "Maximum"]);
    scenarioWorksheet.addRow([
      "Household size",
      scenarioFirstYear?.householdSize.min,
      scenarioFirstYear?.householdSize.max,
      scenarioFirstYear?.householdSize.val,
    ]);
    scenarioWorksheet.addRow([
      "Growth rate of the population [%]",
      toRate(scenarioFirstYear?.demographicGrowth.min),
      toRate(scenarioFirstYear?.demographicGrowth.max),
      toRate(scenarioFirstYear?.demographicGrowth.val),
    ]);
    scenarioWorksheet.addRow([
      "Annual discount rate [%]",
      toRate(scenarioFirstYear?.discountRate.min),
      toRate(scenarioFirstYear?.discountRate.max),
      toRate(scenarioFirstYear?.discountRate.val),
    ]);
    scenarioWorksheet.addRow([
      "Annual increase rate of the annual income per household [%]",
      toRate(scenarioFirstYear?.incomeRate.min),
      toRate(scenarioFirstYear?.incomeRate.max),
      toRate(scenarioFirstYear?.incomeRate.val),
    ]);
    scenarioWorksheet.addRow(["Annual change rate of the fuel price [%]"]);
    Object.entries(scenarioFirstYear?.fuelPriceRates ?? {}).forEach(
      ([id, range]) => {
        scenarioWorksheet.addRow([
          id,
          toRate(range.min),
          toRate(range.max),
          toRate(range.val),
        ]);
      }
    );

    const householdCookingWorksheet =
      workbook.addWorksheet("Household Cooking");
    householdCookingWorksheet.addRow([
      "Number of cookers per 10-household per type of cooker and QLL",
    ]);
    householdCookingWorksheet.addRow(["Stove", "Fuel", ...categoryNames]);
    this.householdCookingModule?.technologyYears[0].technologies.forEach(
      (technology) => {
        householdCookingWorksheet.addRow([
          technology.stove.name,
          technology.fuel.name,
          ...socioEconomicCategories.map(
            (cat) => technology.categories[cat].countPerHousehold * 10
          ),
        ]);
      }
    );

    const kpiWorksheet = workbook.addWorksheet("KPI");
    kpiWorksheet.addRow(["Total Energy [MJ/HH]", this.globalResult.energy]);
    kpiWorksheet.addRow([
      "Global Efficiency [%]",
      this.globalResult.energyEfficiency,
    ]);
    kpiWorksheet.addRow([
      "Maximum annual wood equivalent area [ha]",
      this.globalResult.woodArea,
    ]);
    kpiWorksheet.addRow([
      "CO2 Emission [kg/HH]",
      this.globalResult.emissionCo2,
    ]);
    kpiWorksheet.addRow([
      "Sum Discounted Cost [$]",
      this.globalResult.discountedCost,
    ]);
    kpiWorksheet.addRow(["Affordability [%]", this.globalResult.affordability]);

    zip(this.years, this.siteResults)
      .filter(
        (item): item is [number, SiteResult] =>
          item[0] !== undefined && item[1] !== undefined
      )
      .forEach(([year, siteResult]) => {
        const worksheet = workbook.addWorksheet(`${year}`);
        worksheet.addRow([undefined, ...categoryNames, "Total"]);
        this.lines.forEach((line) => {
          worksheet.addRow([
            line.unit ? `${line.text} [${line.unit}]` : line.text,
            ...socioEconomicCategories.map(
              (cat) => siteResult.categories[cat][line.key]
            ),
            siteResult.categoryTotal[line.key],
          ]);
        });
      });

    return workbook;
  }
}

interface TableRow {
  text: string;
  key: keyof CategoryResult;
  unit?: string;
  decimal?: number;
}

/**
 * Site's input for SiteResult computation (for a given year)
 */
interface Site {
  yearCount: number;
  householdsCount: number;
  populationCount: number;
  woodCarbonation: number;
  woodDensity: number;

  householdSize: number;
  incomeRate: number;
  discountRate: number;
  demographicGrowth: number;
  fuelPriceRates: Record<CookingFuelId, number>;

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

abstract class Action {
  constructor(private yearStart: number, private yearEnd: number) {}

  isActive(year: number): boolean {
    return this.yearStart <= year && year <= this.yearEnd;
  }

  abstract apply(site: Site): Site;
}

class CookingTechnologyAction extends Action {
  constructor(private intervention: CookingTechnologyIntervention) {
    super(intervention.yearStart, intervention.yearEnd);
  }

  apply(site: Site): Site {
    for (const category of this.intervention.categories) {
      const input = site.categories[category];
      const newStove = this.getStove(input, this.intervention.newStoveId);
      let remainingCount = this.intervention.count;
      remainingLoop: for (const item of this.intervention.oldStoveIds
        .map((id) => this.getStove(input, id))
        .filter((item) => item.countPerHousehold > 0)) {
        const replaceCount = clamp(item.countPerHousehold, remainingCount);
        remainingCount -= replaceCount;
        const replacePerHousehold = replaceCount;
        item.countPerHousehold = item.countPerHousehold - replacePerHousehold;
        newStove.countPerHousehold =
          newStove.countPerHousehold + replacePerHousehold;
        if (remainingCount === 0) {
          break remainingLoop;
        }
      }
    }
    return site;
  }

  private getStove(
    input: CategoryInput,
    id: CookingStoveId
  ): HouseholdCookingInput {
    const value = input.cookingTechnologies.find(
      (tech) => tech.stove._id === id
    )?.value;
    if (value) {
      return value;
    } else {
      throw new Error(`Stove id ${id} should be defined in Household Cooking`);
    }
  }
}

class CookingCashAction extends Action {
  constructor(intervention: CookingCashIntervention) {
    super(intervention.yearStart, intervention.yearEnd);
  }

  apply(site: Site): Site {
    // TODO
    return site;
  }
}

type HouseholdResult = Record<CookingStoveId, number | undefined> & {
  income: number;
  usefulEnergy: number;
  finalEnergy: number;
  emissionCo2: number;
  emissionCo: number;
  emissionPm: number;
  woodWeight: number;
  charcoalWeight: number;
  woodNeed: number;
  woodArea: number;
  fixedCost: number;
  variableCost: number;
  totalCost: number;
  costAffordability: number;
};

interface CategoryResult extends HouseholdResult {
  proportion: number;
  householdCount: number;
  populationCount: number;
  energyEfficiency: number;
  discountedCost: number;
}

interface SiteResult {
  households: Record<SocioEconomicCategory, HouseholdResult>;
  householdAverage: HouseholdResult;
  categories: Record<SocioEconomicCategory, CategoryResult>;
  categoryTotal: CategoryResult;
}

interface GlobalResult {
  energy: number;
  energyEfficiency: number;
  emissionCo2: number;
  woodArea: number;
  discountedCost: number;
  affordability: number;
}
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
