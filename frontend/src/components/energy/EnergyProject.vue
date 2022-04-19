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
        <v-tabs v-model="tab" center-active hide-slider show-arrows>
          <template v-for="(item, index) in tabItems">
            <v-divider
              v-if="!item.text"
              :key="index"
              class="mx-2"
              vertical
            ></v-divider>
            <v-menu
              v-else-if="item.children"
              :key="index"
              offset-y
              open-on-hover
            >
              <template v-slot:activator="{ on, attrs }">
                <v-tab
                  v-bind="attrs"
                  v-on="on"
                  :disabled="!item.toName"
                  :to="{ name: routerPrefix + item.toName }"
                >
                  <v-icon left>{{ item.icon }}</v-icon>
                  {{ item.text }}
                </v-tab>
              </template>
              <v-list>
                <v-list-item
                  v-for="(subItem, subIndex) in item.children"
                  :key="subIndex"
                >
                  <v-tab
                    :disabled="!subItem.toName"
                    :to="{
                      name: subItem.toName
                        ? routerPrefix + item.toName + subItem.toName
                        : undefined,
                    }"
                  >
                    <v-icon left>{{ subItem.icon }}</v-icon>
                    {{ subItem.text }}
                  </v-tab>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-tab
              v-else
              :key="index"
              :disabled="!item.toName"
              :to="{ name: routerPrefix + item.toName }"
            >
              <v-icon left>{{ item.icon }}</v-icon>
              {{ item.text }}
            </v-tab>
          </template>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row v-if="modules">
      <v-col>
        <router-view v-model="modules"></router-view>
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
import { Modules, ProjectDocument } from "@/models/energyModel";
import { SyncDatabase } from "@/utils/couchdb";
import { checkRequired } from "@/utils/rules";
import { cloneDeep, isEqual } from "lodash";
import PouchDB from "pouchdb";
import "vue-class-component/hooks";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

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
  @Prop({ type: Object as () => SyncDatabase<ProjectDocument> })
  readonly database!: SyncDatabase<ProjectDocument>;
  @Prop(String)
  readonly routerPrefix!: string;

  readonly tabItems: TabItem[] = [
    {
      text: "General",
      icon: "mdi-information",
      toName: "General",
    },
    {
      text: "Household",
      icon: "mdi-home",
      toName: "Household",
      children: [
        {
          text: "Cooking",
          icon: "mdi-stove",
          toName: "Cooking",
        },
        {
          text: "Lighting",
          icon: "mdi-lightbulb",
        },
        {
          text: "Heating & Cooling",
          icon: "mdi-sun-snowflake",
        },
      ],
    },
    {
      text: "Community",
      icon: "mdi-home-city",
      toName: "Community",
      children: [
        {
          text: "Lighting",
          icon: "mdi-lightbulb",
        },
        {
          text: "Heating & Cooling",
          icon: "mdi-sun-snowflake",
        },
        {
          text: "Goods & Services",
          icon: "mdi-room-service",
        },
      ],
    },
    {},
    {
      text: "Scenario",
      icon: "mdi-skip-next",
      toName: "Scenario",
    },
    {
      text: "Intervention",
      icon: "mdi-gesture-tap",
      toName: "Intervention",
    },
    {
      text: "Results",
      icon: "mdi-chart-box",
      toName: "Result",
    },
  ];

  document: ExistingDocument<ProjectDocument> | null = null;
  lastDocument?: ExistingDocument<ProjectDocument>;
  tab: string | null = null;
  changes?: PouchDB.Core.Changes<ProjectDocument>;

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

  get modules(): Modules | undefined {
    return this.document?.modules;
  }

  created(): void {
    this.getDocument();
    this.changes = this.database.localDB.changes({
      doc_ids: [this.documentId],
    });
    this.changes.on("change", this.getDocument);
    // TODO use changed document
  }

  destroyed(): void {
    this.changes?.cancel();
  }

  @Watch("modules", { deep: true })
  onModulesUpdated(): void {
    if (this.document && !isEqual(this.lastDocument, this.document)) {
      this.database.remoteDB
        .put(this.document)
        .then(() => {
          console.debug(`document ${this.document?._id} updated`);
        })
        .catch((reason) => {
          console.error(reason);
          this.document = this.lastDocument
            ? cloneDeep(this.lastDocument)
            : null;
        });
    }
  }

  getDocument(): void {
    this.database.localDB
      .get(this.documentId)
      .then((document) => {
        this.document = cloneDeep(document);
        this.lastDocument = cloneDeep(document);
      })
      .catch(() => {
        this.$router.push({ name: "energy" });
      });
  }

  changeName(): void {
    if (this.document) {
      this.database.localDB.put(this.document).then(() => this.getDocument());
    }
  }
}

interface TabItem {
  text?: string;
  toName?: string;
  icon?: string;
  children?: TabItem[];
}
</script>
