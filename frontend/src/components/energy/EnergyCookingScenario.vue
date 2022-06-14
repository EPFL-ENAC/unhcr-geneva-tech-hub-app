<template>
  <v-radio-group v-model="selectedIndex">
    <v-row>
      <v-col
        v-for="(scenarioItem, index) in module.scenarios"
        :key="scenarioItem.id"
        cols="4"
      >
        <v-card>
          <v-card-title>
            <v-radio hide-details="auto" :value="index">
              <template #label>
                <h3>{{ scenarioItem.name }}</h3>
              </template>
            </v-radio>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <form-item-component
                  v-for="item in formItems"
                  :key="item.key"
                  v-model="scenarioItem[item.key]"
                  v-bind="item"
                ></form-item-component>
              </v-col>
            </v-row>
            <energy-year-tabs
              v-model="yearTabs[index]"
              :year-offset="yearOffset"
              :items.sync="scenarioItem.years"
            ></energy-year-tabs>
            <v-row v-if="scenarioItem.years[yearTabs[index]]">
              <v-col>
                <form-item-component
                  v-for="item in yearFormItems"
                  :key="item.key"
                  v-model="scenarioItem.years[yearTabs[index]][item.key]"
                  v-bind="item"
                ></form-item-component>
                <h3>Fuels</h3>
                <form-item-component
                  v-for="item in fuelFormItems"
                  :key="item.key"
                  v-model="
                    scenarioItem.years[yearTabs[index]].fuelPriceRates[item.key]
                  "
                  v-bind="item"
                ></form-item-component>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-radio-group>
</template>

<script lang="ts">
import { FormItem, SelectOption } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyYearTabs from "@/components/energy/EnergyYearTabs.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import {
  CookingFuel,
  CookingFuelId,
  cookingFuelIds,
  GeneralModule,
  ProjectDocument,
  Scenario,
  ScenarioModule,
  ScenarioTrend,
  ScenarioYear,
} from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyForm,
    EnergyYearTabs,
    FormItemComponent,
  },
  computed: {
    ...mapState("energy", ["sites", "cookingFuels"]),
  },
})
export default class EnergyCookingScenario extends Vue {
  cookingFuels!: CookingFuel[];
  sites!: ExistingDocument<ProjectDocument>[];

  readonly trendOptions: SelectOption<ScenarioTrend>[] = [
    {
      text: "Stable",
      value: "stable",
    },
    {
      text: "Increase",
      value: "increase",
    },
    {
      text: "Decrease",
      value: "decrease",
    },
  ];
  readonly formItems: FormItem<keyof Scenario>[] = [
    {
      type: "select",
      key: "energyPriceTrend",
      label: "Energy Price",
      options: this.trendOptions,
      disabled: true,
    } as FormItem<keyof Scenario, ScenarioTrend>,
    {
      type: "select",
      key: "investmentCostTrend",
      label: "Investment Cost",
      options: this.trendOptions,
      disabled: true,
    } as FormItem<keyof Scenario, ScenarioTrend>,
  ];
  get yearFormItems(): FormItem<keyof ScenarioYear>[] {
    return [
      {
        type: "range",
        key: "householdSize",
        label: "Household Size",
        isTemplate: this.isTemplate,
      },
      {
        type: "range",
        key: "discountRate",
        label: "Discount Rate",
        subtype: "rate",
        isTemplate: this.isTemplate,
      },
      {
        type: "range",
        key: "incomeRate",
        label: "Average Income Rate per household",
        subtype: "rate",
        isTemplate: this.isTemplate,
      },
      {
        type: "range",
        key: "demographicGrowth",
        label: "Growth rate of the population",
        subtype: "rate",
        isTemplate: this.isTemplate,
      },
    ];
  }

  @VModel({ type: Object as () => ScenarioModule })
  module!: ScenarioModule;
  @Prop({ type: Object as () => GeneralModule })
  generalModule!: GeneralModule;

  yearTabs: number[] = [];

  get scenarios(): Scenario[] {
    return this.module.scenarios;
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

  get fuelFormItems(): FormItem<CookingFuelId>[] {
    return cookingFuelIds.map((id) => {
      const fuelName =
        this.cookingFuels.find((item) => item._id === id)?.name ?? id;
      return {
        type: "range",
        key: id,
        label: `${fuelName} Price Increase Rate`,
        subtype: "rate",
        isTemplate: this.isTemplate,
      };
    });
  }

  get selectedIndex(): number | undefined {
    return this.scenarios.findIndex(
      (item) => item.id === this.module.selectedId
    );
  }

  set selectedIndex(value: number | undefined) {
    this.module.selectedId =
      value !== undefined ? this.scenarios[value].id : "";
  }

  get yearOffset(): number {
    return this.generalModule.yearStart;
  }

  created(): void {
    this.onScenarioChanged();
  }

  @Watch("scenarios")
  onScenarioChanged(): void {
    this.yearTabs = new Array(this.scenarios.length).fill(0);
  }
}
</script>
