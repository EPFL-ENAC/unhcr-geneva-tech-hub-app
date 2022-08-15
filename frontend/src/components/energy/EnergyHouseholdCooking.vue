<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @after-sync="migrate"
    @save="save"
  >
    <template #default>
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
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="6">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h2>Interventions</h2>
                {{ interventionsCount }} selected
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <energy-cooking-intervention
                  v-model="module"
                  :general-module="generalModule"
                ></energy-cooking-intervention>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <energy-cooking-result
            :general-module="generalModule"
            :scenario-module="scenarioModule"
            :household-cooking-module="module"
            :document-name="documentName"
            :document-site-name="documentSiteName"
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
    EnergyHouseholdCookingTable,
    FormItemComponent,
  },
  computed: {
    ...mapState("energy", ["sites", "cookingFuels", "cookingStoves"]),
  },
})
export default class EnergyHouseholdCooking extends EnergyFormMixin<HouseholdCookingModule> {
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];

  @Prop({ type: Object as () => GeneralModule })
  generalModule!: GeneralModule;
  @Prop({ type: Object as () => ScenarioModule })
  scenarioModule: ScenarioModule | undefined;
  @Prop({ type: String })
  documentName!: string;
  @Prop({ type: String })
  documentSiteName!: string;

  module: HouseholdCookingModule = {
    technologyYears: [],
    categoryCookings: [],
    substitutionInterventions: [],
    efficiencyInterventions: [],
    cashInterventions: [],
  };

  get scenarioName(): string | undefined {
    return this.scenarioModule?.scenarios.find(
      (scenario) => scenario.id === this.scenarioModule?.selectedId
    )?.name;
  }

  get interventionsCount(): number {
    return [
      ...this.module.substitutionInterventions,
      ...this.module.efficiencyInterventions,
      ...this.module.cashInterventions,
    ].filter((intervention) => intervention.selected).length;
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
    if (!this.module.substitutionInterventions) {
      this.module.substitutionInterventions = this.module.interventions ?? [];
      delete this.module.interventions;
    }
    if (!this.module.efficiencyInterventions) {
      this.module.efficiencyInterventions = [];
    }
    if (!this.module.cashInterventions) {
      this.module.cashInterventions = [];
    }
  }
}
</script>
