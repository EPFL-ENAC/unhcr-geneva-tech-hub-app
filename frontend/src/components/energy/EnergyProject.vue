<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field
          v-model="name"
          hide-details="auto"
          :label="idName + ' Name'"
          outlined
          required
          :rules="rules"
          @change="changeName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs v-model="tab" center-active show-arrows>
          <template v-for="item in tabItems">
            <v-divider
              v-if="!item.text"
              :key="item.id"
              class="mx-2"
              vertical
            ></v-divider>
            <v-menu
              v-else-if="item.children"
              :key="item.id"
              offset-y
              open-on-hover
            >
              <template v-slot:activator="{ on, attrs }">
                <v-tab
                  v-bind="attrs"
                  v-on="on"
                  :href="`#${item.id}-${item.children[0].id}`"
                >
                  <v-icon left>{{ item.icon }}</v-icon>
                  {{ item.text }}
                </v-tab>
              </template>
              <v-list>
                <v-list-item v-for="subItem in item.children" :key="subItem.id">
                  <v-tab :href="`#${item.id}-${subItem.id}`">
                    <v-icon left>{{ subItem.icon }}</v-icon>
                    {{ subItem.text }}
                  </v-tab>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-tab v-else :key="item.id" :href="`#${item.id}`">
              <v-icon left>{{ item.icon }}</v-icon>
              {{ item.text }}
            </v-tab>
          </template>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-items v-model="tab">
          <v-tab-item value="general">
            <energy-general
              :initial-module="generalModule"
              @save="saveGeneral"
            ></energy-general>
          </v-tab-item>
          <v-tab-item value="household-cooking">
            <energy-household-cooking
              :initial-module="householdCookingModule"
              @save="saveHouseholdCooking"
            ></energy-household-cooking>
          </v-tab-item>
          <v-tab-item value="household-lighting">TODO</v-tab-item>
          <v-tab-item value="household-heating">TODO</v-tab-item>
          <v-tab-item value="community-lighting">TODO</v-tab-item>
          <v-tab-item value="community-heating">TODO</v-tab-item>
          <v-tab-item value="community-service">TODO</v-tab-item>
          <v-tab-item value="scenario">
            <energy-scenario
              :initial-module="scenarioModule"
              @save="saveScenario"
            ></energy-scenario>
          </v-tab-item>
          <v-tab-item value="intervention">
            <energy-intervention></energy-intervention>
          </v-tab-item>
          <v-tab-item value="result">
            <energy-result :modules="modules"></energy-result>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import EnergyGeneral from "@/components/energy/EnergyGeneral.vue";
import EnergyHouseholdCooking from "@/components/energy/EnergyHouseholdCooking.vue";
import EnergyIntervention from "@/components/energy/EnergyIntervention.vue";
import EnergyResult from "@/components/energy/EnergyResult.vue";
import EnergyScenario from "@/components/energy/EnergyScenario.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import {
  GeneralModule,
  HouseholdCookingModule,
  Modules,
  ProjectDocument,
  ScenarioModule,
} from "@/models/energyModel";
import { SyncDatabase } from "@/utils/couchdb";
import { checkRequired } from "@/utils/rules";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    EnergyGeneral,
    EnergyHouseholdCooking,
    EnergyScenario,
    EnergyIntervention,
    EnergyResult,
  },
})
export default class EnergyProject extends Vue {
  readonly rules = [checkRequired];

  @Prop(String)
  readonly idName!: string;
  @Prop(String)
  readonly databaseName!: string;

  readonly database: SyncDatabase<ProjectDocument> = new SyncDatabase(
    this.databaseName
  );
  readonly tabItems: TabItem[] = [
    {
      text: "General",
      id: "general",
      icon: "mdi-information",
    },
    {
      text: "Household",
      id: "household",
      icon: "mdi-home",
      children: [
        {
          text: "Cooking",
          id: "cooking",
          icon: "mdi-stove",
        },
        {
          text: "Lighting",
          id: "lighting",
          icon: "mdi-lightbulb",
        },
        {
          text: "Heating & Cooling",
          id: "heating",
          icon: "mdi-sun-snowflake",
        },
      ],
    },
    {
      text: "Community",
      id: "community",
      icon: "mdi-home-city",
      children: [
        {
          text: "Lighting",
          id: "lighting",
          icon: "mdi-lightbulb",
        },
        {
          text: "Heating & Cooling",
          id: "heating",
          icon: "mdi-sun-snowflake",
        },
        {
          text: "Good & Service",
          id: "service",
          icon: "mdi-room-service",
        },
      ],
    },
    {
      text: "",
      id: "divider",
    },
    {
      text: "Scenario",
      id: "scenario",
      icon: "mdi-skip-next",
    },
    {
      text: "Intervention",
      id: "intervention",
      icon: "mdi-gesture-tap",
    },
    {
      text: "Results",
      id: "result",
      icon: "mdi-chart-box",
    },
  ];

  document: ExistingDocument<ProjectDocument> | null = null;
  tab: string | null = null;

  get name(): string {
    return this.document?.name ?? "";
  }

  set name(value: string) {
    if (this.document) {
      this.document.name = value;
    }
  }

  get documentId(): string {
    return this.$route.params.id;
  }

  get generalModule(): GeneralModule | undefined {
    return this.document?.modules?.general;
  }

  get householdCookingModule(): HouseholdCookingModule | undefined {
    return this.document?.modules?.householdCooking;
  }

  get scenarioModule(): ScenarioModule | undefined {
    return this.document?.modules.scenario;
  }

  get modules(): Modules | undefined {
    return this.document?.modules;
  }

  created(): void {
    this.getDocument();
  }

  destroyed(): void {
    this.database.cancel();
  }

  updateDocument(update: (document: ProjectDocument) => void): void {
    if (this.document) {
      update(this.document);
      this.database.db.put(this.document);
      this.getDocument();
    }
  }

  getDocument(): void {
    this.database.db
      .get(this.documentId)
      .then((document) => {
        this.document = document;
      })
      .catch(() => {
        this.$router.push("/energy");
      });
  }

  changeName(): void {
    if (this.document) {
      this.database.db.put(this.document);
      this.getDocument();
    }
  }

  saveGeneral(module: GeneralModule): void {
    this.updateDocument((document) => (document.modules.general = module));
  }

  saveHouseholdCooking(module: HouseholdCookingModule): void {
    this.updateDocument(
      (document) => (document.modules.householdCooking = module)
    );
  }

  saveScenario(module: ScenarioModule): void {
    this.updateDocument((document) => (document.modules.scenario = module));
  }
}

interface TabItem {
  text: string;
  id: string;
  icon?: string;
  children?: TabItem[];
}
</script>
