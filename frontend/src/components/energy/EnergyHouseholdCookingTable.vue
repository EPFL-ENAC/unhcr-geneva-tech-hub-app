<template>
  <v-card>
    <v-card-title>
      <span>Cooking Technologies</span>
      <div class="flex-grow-1 d-flex justify-end">
        <v-dialog v-model="detailDialog">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon v-on="on">
              <v-icon>$mdiAccountHardHat</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span>Cooking Technologies (full view)</span>
              <v-dialog v-model="addDialog" max-width="512px">
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    color="primary"
                    :disabled="addSelectItems.length === 0"
                    icon
                    v-on="on"
                  >
                    <v-icon large>$mdiPlusBox</v-icon>
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
                      append-outer-icon="$mdiPlusBox"
                      @click:append-outer="addItem(addSelectedItem)"
                    ></v-select>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-card-text>
              <v-form :disabled="!isTemplate">
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
                      <template #expanded-item="{ headers, item }">
                        <td class="pa-2" :colspan="headers.length">
                          <v-row justify="center">
                            <v-col cols="3">
                              <h3>Stove</h3>
                              <form-item-component
                                v-for="formItem in tableExpandStoveItems"
                                :key="formItem.key"
                                v-model="item.stove[formItem.key]"
                                v-bind="formItem"
                              ></form-item-component>
                            </v-col>
                            <v-col cols="3">
                              <h3>Fuel</h3>
                              <form-item-component
                                v-for="formItem in tableExpandFuelItems"
                                :key="formItem.key"
                                v-model="item.fuel[formItem.key]"
                                v-bind="formItem"
                              ></form-item-component>
                            </v-col>
                          </v-row>
                        </td>
                      </template>
                      <template
                        v-for="cat in socioEconomicCategories"
                        #[`item.${cat}`]="{ item }"
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
                      <template v-if="isTemplate" #[`item.action`]="{ item }">
                        <v-btn icon @click="deleteItem(item)">
                          <v-icon>$mdiDelete</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-form>
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
        <template #[`item.image`]="{ item }">
          <v-img
            :src="`${publicPath}images/energy/cookstoves/${item.id}.png`"
            contain
            width="32px"
            aspect-ratio="1"
          ></v-img>
        </template>
        <template #[`item.countPer10Households`]="{ item }">
          <v-tooltip
            bottom
            color="white"
            :disabled="item.countPer10Households === 0"
          >
            <template #activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ item.countPer10Households }}
              </span>
            </template>
            <v-responsive height="256px" width="256px">
              <v-chart autoresize :option="getChartOption(item)"></v-chart>
            </v-responsive>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyYearTabs from "@/components/energy/EnergyYearTabs.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import {
  CategoryCooking,
  CookingFuel,
  CookingStove,
  CookingStoveId,
  GeneralModule,
  HouseholdCookingInput,
  HouseholdCookingModule,
  ProjectDocument,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { getColor, getCookingFuel } from "@/utils/energy";
import { SelectItemObject } from "@/utils/vuetify";
import { PieChart } from "echarts/charts";
import { TitleComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts/types/dist/shared";
import { chain, cloneDeep, round, sumBy } from "lodash";
import "vue-class-component/hooks";
import VChart from "vue-echarts";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { mapState } from "vuex";

use([CanvasRenderer, PieChart, TitleComponent]);

@Component({
  components: {
    EnergyForm,
    FormItemComponent,
    EnergyYearTabs,
    VChart,
  },
  computed: {
    ...mapState("energy", ["sites", "cookingFuels", "cookingStoves"]),
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
  readonly tableExpandStoveItems: FormItem<keyof CookingStove>[] = [
    {
      type: "number",
      key: "energyEfficiency",
      label: "Energy Efficiency",
      subtype: "percent",
    },
    {
      type: "number",
      key: "capacity",
      label: "Capacity",
      unit: "kW",
    },
    {
      type: "number",
      key: "investmentCost",
      label: "Investment Cost",
      unit: "USD",
    },
    {
      type: "number",
      key: "lifetime",
      label: "Lifetime",
      unit: "years",
    },
    {
      type: "number",
      key: "emissionFactorCo",
      label: "Emission factor for CO",
      unit: "g/MJ delivered",
    },
    {
      type: "number",
      key: "emissionFactorPm",
      label: "Emission factor for PM2.5",
      unit: "g/MJ delivered",
    },
  ];
  readonly tableExpandFuelItems: FormItem<keyof CookingFuel>[] = [
    {
      type: "number",
      key: "energy",
      label: "Fuel energy",
      unit: "MJ/kg",
    },
    {
      type: "number",
      key: "emissionFactorCo2",
      label: "Fuel emission factor for CO2",
      unit: "ton/ton of fuel",
    },
    {
      type: "number",
      key: "price",
      label: "Fuel price",
      unit: "$/kg",
    },
  ];

  @VModel({ type: Object as () => HouseholdCookingModule })
  module!: HouseholdCookingModule;
  @Prop({ type: Object as () => GeneralModule })
  generalModule!: GeneralModule;

  sites!: ExistingDocument<ProjectDocument>[];
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
  get isTemplate(): boolean {
    return this.site?.isTemplate ?? false;
  }

  get documentId(): string {
    return this.$route.params.id;
  }

  get site(): ProjectDocument | null {
    if (this.sites) {
      return (
        this.sites.find(
          (doc: ExistingDocument<ProjectDocument>) =>
            doc._id === this.documentId
        ) ?? null
      );
    }
    return null;
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
    return this.technologies.map((item) => {
      const tableItem: TableItem = {
        ...item.categories,
        cookstoveName: item.stove.name,
        fuelName: item.fuel.name,
        countPer10Households: round(
          sumBy(
            Object.entries(item.categories),
            ([cat, input]) =>
              input.countPerHousehold *
              this.getProportion(cat as SocioEconomicCategory)
          ) * 10
        ),
        id: item.stove._id,
        index: item.stove.index,
        stove: item.stove,
        fuel: item.fuel,
      };
      return tableItem;
    });
  }

  private getFuel(stove: CookingStove): CookingFuel {
    return getCookingFuel(this.cookingFuels, stove);
  }

  getProportion(cat: SocioEconomicCategory): number {
    return this.generalModule.categories[cat].proportion;
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

  getChartOption(item: TableItem): EChartsOption {
    const data = socioEconomicCategories
      .map((cat) => ({
        id: cat,
        name: this.$t(`energy.${cat}`).toString(),
        value:
          item[cat].countPerHousehold *
          this.getProportion(cat as SocioEconomicCategory),
      }))
      .filter((item) => item.value > 0);
    return {
      title: {
        text: "Distribution of cookstoves per households",
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          type: "pie",
          radius: "25%",
          label: {
            overflow: "break",
          },
          data: data,
        },
      ],
      color: data.map((item) => getColor(item.id)),
    };
  }
}

type TableItem = Record<SocioEconomicCategory, HouseholdCookingInput> & {
  id: CookingStoveId;
  index: number;
  cookstoveName: string;
  fuelName: string;
  countPer10Households: number;
  stove: CookingStove;
  fuel: CookingFuel;
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
