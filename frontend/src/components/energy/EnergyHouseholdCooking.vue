<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @after-sync="migrate"
    @save="save"
  >
    <template v-slot>
      <v-row>
        <v-col cols="6">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h2>Scenario</h2>
                {{ scenarioName }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <energy-household-cooking-table
                  v-model="module"
                  :general-module="generalModule"
                ></energy-household-cooking-table>
                <br />
                <energy-cooking-scenario
                  v-model="module"
                ></energy-cooking-scenario>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="6">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h2>Interventions</h2>
                {{ interventions.length }} selected
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <energy-cooking-intervention
                  v-model="module"
                ></energy-cooking-intervention>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <energy-cooking-result
            :general="generalModule"
            :household-cooking="module"
          ></energy-cooking-result>
        </v-col>
      </v-row>
    </template>
  </energy-form>
</template>

<script lang="ts">
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import EnergyCookingIntervention from "@/components/energy/EnergyCookingIntervention.vue";
import EnergyCookingResult from "@/components/energy/EnergyCookingResult.vue";
import EnergyCookingScenario from "@/components/energy/EnergyCookingScenario.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import EnergyHouseholdCookingTable, {
  mapCategoryCooking,
} from "@/components/energy/EnergyHouseholdCookingTable.vue";
import {
  CookingFuel,
  CookingStove,
  GeneralModule,
  HouseholdCookingModule,
  Intervention,
  InterventionModule,
  Scenario,
  ScenarioModule,
} from "@/models/energyModel";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyForm,
    EnergyCookingIntervention,
    EnergyCookingResult,
    EnergyCookingScenario,
    EnergyHouseholdCookingTable,
    FormItemComponent,
  },
  computed: {
    ...mapState("energy", ["cookingFuels", "cookingStoves"]),
  },
})
export default class EnergyHouseholdCooking extends EnergyFormMixin<HouseholdCookingModule> {
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];

  readonly defaultScenarios: Scenario[] = [
    {
      id: "usual",
      name: "Business as Usual",
      energyPriceTrend: "stable",
      investmentCostTrend: "stable",
      discountRate: 1,
      incomeRate: 1,
      demographicGrowth: 1,
      fuelPriceRate: 1,
    },
    {
      id: "optimistic",
      name: "Optimistic Scenario",
      energyPriceTrend: "stable",
      investmentCostTrend: "decrease",
      discountRate: 1,
      incomeRate: 1,
      demographicGrowth: 1,
      fuelPriceRate: 1,
    },
    {
      id: "pessimistic",
      name: "Pessimistic Scenario",
      energyPriceTrend: "increase",
      investmentCostTrend: "increase",
      discountRate: 1,
      incomeRate: 1,
      demographicGrowth: 1,
      fuelPriceRate: 1,
    },
  ];

  @Prop({ type: Object as () => GeneralModule })
  generalModule!: GeneralModule;
  @Prop({ type: Object as () => ScenarioModule })
  scenarioModule: ScenarioModule | undefined;
  @Prop({ type: Object as () => InterventionModule })
  interventionModule: InterventionModule | undefined;

  module: HouseholdCookingModule = {
    technologyYears: [],
    categoryCookings: [],
    scenarios: cloneDeep(this.defaultScenarios),
    scenarioId: "",
    interventions: [],
  };

  get scenarioName(): string | undefined {
    return this.module.scenarios.find(
      (scenario) => scenario.id === this.module.scenarioId
    )?.name;
  }

  get interventions(): Intervention[] {
    return this.module.interventions.filter(
      (intervention) => intervention.selected
    );
  }

  created(): void {
    if (!this.initialModule) {
      this.module.technologyYears = [
        {
          yearIndex: 0,
          technologies: this.cookingStoves.map((stove) =>
            mapCategoryCooking(stove, this.cookingFuels)
          ),
        },
      ];
    }
  }

  migrate(): void {
    if (!this.module.technologyYears) {
      this.module.technologyYears = [
        {
          yearIndex: 0,
          technologies: cloneDeep(this.module.categoryCookings),
        },
      ];
    }
    if (!this.module.scenarios) {
      this.module.scenarios = this.scenarioModule
        ? this.scenarioModule.scenarios
        : cloneDeep(this.defaultScenarios);
    }
    if (!this.module.scenarioId) {
      this.module.scenarioId = this.scenarioModule
        ? this.scenarioModule.selectedId
        : "";
    }
    if (!this.module.interventions) {
      this.module.interventions = this.interventionModule
        ? this.interventionModule.interventions
        : [];
    }
  }
}
</script>
