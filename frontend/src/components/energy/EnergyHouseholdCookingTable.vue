<template>
  <v-card>
    <v-card-title>
      <span>Cooking Technologies</span>
      <div class="flex-grow-1 d-flex justify-end">
        <v-dialog v-model="detailDialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon v-on="on">
              <v-icon>mdi-account-hard-hat</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span>Cooking Technologies</span>
              <v-dialog v-model="addDialog" max-width="512px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    color="primary"
                    :disabled="addSelectItems.length === 0"
                    icon
                    v-on="on"
                  >
                    <v-icon large>mdi-plus-box</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>Add Cooking Technology</v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="addSelectedItem"
                      hide-details="auto"
                      :items="addSelectItems"
                      label="Available technologies"
                      append-outer-icon="mdi-plus-box"
                      @click:append-outer="addItem(addSelectedItem)"
                    ></v-select>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-card-text>
              <energy-year-tabs
                v-model="yearTab"
                :year-offset="yearOffset"
                :items.sync="module.technologyYears"
              ></energy-year-tabs>
              <v-row>
                <v-col>
                  <v-data-table
                    :headers="tableHeaders"
                    item-key="id"
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
                                <td class="font-weight-bold">
                                  {{ property.text }}
                                </td>
                                <td>
                                  <template v-if="property.getDisplayValue">
                                    {{
                                      property.getDisplayValue(
                                        item[property.key]
                                      )
                                    }}
                                  </template>
                                  <template v-else>
                                    {{ item[property.key] }}
                                  </template>
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
                      v-for="cat in socioEconomicCategories"
                      v-slot:[`item.${cat}`]="{ item }"
                    >
                      <form-item-component
                        v-for="cellItem in tableCellItems"
                        :key="`${cat}-${cellItem.key}`"
                        v-model="
                          categoryCooking(item).categories[cat][cellItem.key]
                        "
                        v-bind="cellItem"
                      ></form-item-component>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                      <v-btn icon @click="deleteItem(item)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="yearTab">
        <v-tab v-for="year in years" :key="year">
          {{ year }}
        </v-tab>
      </v-tabs>
      <v-data-table
        :headers="simpleTableHeaders"
        item-key="id"
        :items="tableItems"
        :items-per-page="5"
        sort-by="index"
      >
        <template v-slot:[`item.image`]="{ item }">
          <v-img
            :src="`${publicPath}images/energy/cookstoves/${item.id}.png`"
            contain
            width="32px"
            aspect-ratio="1"
          ></v-img>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
} from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyYearTabs from "@/components/energy/EnergyYearTabs.vue";
import {
  CategoryCooking,
  CookingFuel,
  CookingStove,
  CookingStoveId,
  GeneralModule,
  HouseholdCookingInput,
  HouseholdCookingModule,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { getCookingFuel } from "@/utils/energy";
import { SelectItemObject } from "@/utils/vuetify";
import { chain, cloneDeep, round, sumBy } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyForm,
    FormItemComponent,
    EnergyYearTabs,
  },
  computed: {
    ...mapState("energy", ["cookingFuels", "cookingStoves"]),
  },
})
export default class EnergyHouseholdCookingTable extends Vue {
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];

  readonly socioEconomicCategories = socioEconomicCategories;
  readonly simpleTableHeaders: DataTableHeader[] = [
    "image",
    "cookstoveName",
    "fuelName",
    "countPer10Households",
  ].map((item) => ({
    text: this.$t(`energy.${item}`).toString(),
    value: item,
    sortable: true,
  }));
  readonly tableHeaders: DataTableHeader[] = [
    "cookstoveName",
    "fuelName",
    ...socioEconomicCategories,
    "action",
  ].map((item) => ({
    text: this.$t(`energy.${item}`).toString(),
    value: item,
    sortable: ["cookstoveName", "fuelName"].includes(item),
  }));
  readonly tableCellItems: FormItem<keyof HouseholdCookingInput>[] = [
    {
      type: "number",
      key: "countPerHousehold",
      label: "Count per 10 households",
      ratio: 10,
    },
    {
      type: "number",
      key: "useFactor",
      label: "Use Factor",
      subtype: "percent",
    },
  ];
  readonly tableExpandProperties: {
    text: string;
    key: keyof TableItem;
    unit?: string;
    getDisplayValue?: (value: number) => number | string;
  }[] = [
    {
      text: "Technology type",
      key: "technologyType",
    },
    {
      text: "Energy efficiency",
      key: "energyEfficiency",
      unit: "%",
      getDisplayValue: (value: number): number => value * 100,
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
      getDisplayValue: (value: number | [number, number]): string | number => {
        return typeof value === "number" ? value : `${value[0]}-${value[1]}`;
      },
    },
    {
      text: "IWA indoor emission TIER",
      key: "iwaIndoorEmissionTier",
      getDisplayValue: (value: number | [number, number]): string | number => {
        return typeof value === "number" ? value : `${value[0]}-${value[1]}`;
      },
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

  @VModel({ type: Object as () => HouseholdCookingModule })
  module!: HouseholdCookingModule;
  @Prop({ type: Object as () => GeneralModule })
  generalModule!: GeneralModule;

  addDialog = false;
  addSelectedItem: CookingStove | null = null;
  yearTab = 0;
  detailDialog = false;

  get publicPath(): string {
    return process.env.BASE_URL;
  }

  get yearOffset(): number {
    return this.generalModule.yearStart;
  }

  get years(): number[] {
    return this.module.technologyYears.map(
      (item) => this.yearOffset + item.yearIndex
    );
  }

  get technologies(): CategoryCooking[] {
    return this.module.technologyYears[this.yearTab].technologies;
  }

  set technologies(value: CategoryCooking[]) {
    this.module.technologyYears[this.yearTab].technologies = value;
  }

  get addSelectItems(): SelectItemObject<string, CookingStove>[] {
    const existingIds = new Set(this.tableItems.map((item) => item.id));
    return chain(this.cookingStoves)
      .filter((stove) => !existingIds.has(stove._id))
      .map((stove) => ({
        text: `${stove.name} - ${this.getFuel(stove).name}`,
        value: stove,
      }))
      .value();
  }

  get tableItems(): TableItem[] {
    return this.technologies.map((item) => ({
      ...item.categories,
      ...item.stove,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(item.fuel as any),
      cookstoveName: item.stove.name,
      fuelName: item.fuel.name,
      countPer10Households: round(
        sumBy(
          Object.values(item.categories),
          (input) => input.countPerHousehold
        ) * 10
      ),
      id: item.stove._id,
      index: item.stove.index,
    }));
  }

  private getFuel(stove: CookingStove): CookingFuel {
    return getCookingFuel(this.cookingFuels, stove);
  }

  addItem(item: CookingStove): void {
    if (item) {
      this.technologies.push(mapCategoryCooking(item, this.cookingFuels));
      this.addDialog = false;
    }
  }

  deleteItem(tableItem: TableItem): void {
    this.technologies = this.technologies.filter(
      (item) => item.stove._id !== tableItem.id
    );
  }

  categoryCooking(item: TableItem): CategoryCooking {
    const categoryCooking = this.technologies.find(
      (cooking) => cooking.stove._id === item.id
    );
    if (!categoryCooking) {
      throw new Error(`id ${item.id} not found`);
    }
    return categoryCooking;
  }
}

type TableItem = Record<SocioEconomicCategory, HouseholdCookingInput> &
  CookingStove &
  CookingFuel & {
    id: CookingStoveId;
    cookstoveName: string;
    fuelName: string;
    countPerHousehold: number;
  };

export const mapCategoryCooking = function (
  stove: CookingStove,
  cookingFuels: CookingFuel[]
): CategoryCooking {
  return {
    categories: Object.fromEntries<HouseholdCookingInput>(
      socioEconomicCategories.map((cat) => [
        cat,
        {
          countPerHousehold: 0,
          useFactor: 0.8,
        },
      ])
    ) as Record<SocioEconomicCategory, HouseholdCookingInput>,
    stove: cloneDeep(stove),
    fuel: getCookingFuel(cookingFuels, stove),
  };
};
</script>
