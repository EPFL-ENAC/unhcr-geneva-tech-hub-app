<template>
  <v-container fluid v-if="shelter">
    <v-row>
      <v-col>
        <h2 class="text-h4 project-shelter__h3 font-weight-medium">
          Environmental Performance
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-sheet elevation="2" rounded v-if="shelter">
          <v-container fluid>
            <v-row>
              <v-col class="about-first-column d-flex justify-center" lg="12">
                <v-data-table
                  :headers="headers"
                  :items="items"
                  :single-expand="singleExpand"
                  :expanded.sync="expanded"
                  item-key="material"
                  hide-default-header
                  hide-default-footer
                  :show-expand="true"
                  @click:row="
                    (item, slot) => item.items && slot.expand(!slot.isExpanded)
                  "
                >
                  <template v-slot:header>
                    <thead>
                      <tr>
                        <th colspan="1"></th>
                        <th rowspan="3">Material</th>
                        <th style="vertical-align: middle; text-align: center">
                          Material efficiency (weight)
                        </th>
                        <th
                          colspan="3"
                          style="vertical-align: middle; text-align: center"
                        >
                          Embodied carbon
                        </th>
                        <th>Embodied water</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th style="vertical-align: middle; text-align: center">
                          kg
                        </th>
                        <th
                          colspan="3"
                          style="vertical-align: middle; text-align: center"
                        >
                          kgCO2e/kg
                        </th>
                        <th style="text-align: center">L</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>Production</th>
                        <th>Transportation</th>
                        <th>Total</th>
                        <th colspan="3"></th>
                      </tr>
                    </thead>
                  </template>
                  <template v-slot:item.weight="{ item }">
                    <span>{{ item.weight | formatNumber }} </span>
                  </template>
                  <template v-slot:item.embodiedCarbonProduction="{ item }">
                    <span
                      >{{ item.embodiedCarbonProduction | formatNumber }}
                    </span>
                  </template>
                  <template v-slot:item.embodiedCarbonTransport="{ item }">
                    <span
                      >{{ item.embodiedCarbonTransport | formatNumber }}
                    </span>
                  </template>
                  <template v-slot:item.embodiedCarbonTotal="{ item }">
                    <span>{{ item.embodiedCarbonTotal | formatNumber }} </span>
                  </template>
                  <template v-slot:item.embodiedWater="{ item }">
                    <span>{{ item.embodiedWater | formatNumber }} </span>
                  </template>
                  <template v-slot:item.totalCost="{ item }">
                    <span>{{ item.totalCost | formatNumber }} </span>
                  </template>
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                      <v-data-table
                        hide-default-footer
                        hide-default-header
                        :headers="headersSubItems"
                        :items="item.items"
                      >
                        <template v-slot:item.formId="{ item }">
                          <span>{{ materialMap[item.formId].form }}</span>
                        </template>
                      </v-data-table>
                    </td>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col> <graph-tree :items="items" /></v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card>
                  <v-card-title>
                    <h2 class="text-h5 project-shelter__h4 font-weight-medium">
                      Habitat risks
                    </h2>
                  </v-card-title>
                  <v-card-text>
                    <info-group
                      v-for="risk in habitatRiskFiltered"
                      :key="risk.id"
                      :info="risk"
                      :depth="2"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card>
                  <v-card-title>
                    <h2 class="text-h5 project-shelter__h4 font-weight-medium">
                      Reuse and recyle considerations
                    </h2>
                  </v-card-title>
                  <v-card-text>
                    <info-group
                      v-for="info in reuseRecyclingFiltered"
                      :key="info.id"
                      :info="info"
                      :depth="2"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import GraphTree from "@/components/shelter_sustainability/billOfQuantities/graphTree.vue";
import InfoGroup from "@/components/shelter_sustainability/InfoGroup.vue";
import { MaterialTree, Shelter } from "@/store/ShelterInterface";
import { getFormIdItems } from "@/store/ShelterModuleUtils";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import habitatRisks from "@/views/shelter_sustainability/ShelterSustainabilityItem/habitatRisks";
import reuseRecycling from "@/views/shelter_sustainability/ShelterSustainabilityItem/reuseRecycling";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapGetters("SheltersMaterialModule", ["materialMap", "materials"]),
  },
  components: {
    InfoGroup,
    GraphTree,
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;
  materialMap!: Record<string, ShelterMaterial>;

  singleExpand = true;
  expanded = [];

  showSubPanel = {} as Record<string, boolean>;
  public toggle(key: string): void {
    this.showSubPanel[key] = !this.showSubPanel[key];
  }

  get items(): MaterialTree[] {
    const res = cloneDeep(this.shelter.envPerfItems) as MaterialTree[];
    if (this.shelter?.totalEnvPerf) {
      res.push(this.shelter?.totalEnvPerf);
    }
    return res;
  }
  get currentForms(): string[] {
    return getFormIdItems(this.shelter.items);
  }

  public get headers(): DataTableHeader[] {
    return [
      {
        text: "Material",
        value: "materialId",
        sortable: false,
        width: "100px",
      },
      { text: "Weight in kg", value: "weight", sortable: false },
      {
        text: "Production",
        value: "embodiedCarbonProduction",
        sortable: false,
      },
      {
        text: "Transport",
        value: "embodiedCarbonTransport",
        sortable: false,
      },
      {
        text: "Total",
        value: "embodiedCarbonTotal",
        sortable: false,
      },
      {
        text: "Embodied water in L/kg",
        value: "embodiedWater",
        sortable: false,
      },
      // { text: "Unit cost in $", value: "unit_cost", sortable: false },
      // { text: "Total cost in $", value: "totalCost", sortable: false },
    ].map((x) => ({ ...x, class: "test", cellClass: "class-test" }));
  }

  public get headersSubItems(): DataTableHeader[] {
    return [
      { text: "", value: "data-null" },
      { text: "Form", value: "formId", sortable: false, width: "100px" },
      { text: "Weight", value: "weight", sortable: false },
      {
        text: "Embodied carbon production",
        value: "embodiedCarbonProduction",
        sortable: false,
      },
      {
        text: "Embodied carbon transport",
        value: "embodiedCarbonTransport",
        sortable: false,
      },
      {
        text: "Embodied carbon total",
        value: "embodiedCarbonTotal",
        sortable: false,
      },
      { text: "Embodied water", value: "embodiedWater", sortable: false },
      { text: "Unit cost", value: "unitCost", sortable: false },
      { text: "Total cost", value: "totalCost", sortable: false },
    ];
  }

  get currentMaterials(): string[] {
    return (
      this.shelter?.envPerfItems?.map(
        (envPerf: MaterialTree): string => envPerf.materialId as string
      ) ?? []
    );
  }
  get habitatRiskFiltered(): Info[] {
    return habitatRisks.filter(
      (habitatRisk: Info) =>
        this.currentMaterials.indexOf(habitatRisk.id) !== -1
    );
  }

  get reuseRecyclingFiltered(): Info[] {
    return reuseRecycling
      .filter((info: Info) => this.currentForms.indexOf(info.id) !== -1)
      .map((x) => ({ ...x, id: this.materialMap[x.id]?.form }));
  }
}

interface Info {
  id: string;
  description: string;
}
</script>

<style scoped lang="scss">
.v-data-table ::v-deep {
  thead {
    tr > th {
      border-left: 1px solid rgba(0, 0, 0, 0.12);
      // border-right: 1px solid rgba(0, 0, 0, 0.12);
    }
  }
  tbody > tr:last-child { background:#ddd; }
}
.v-data-table tbody tr:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.v-data-table
  ::v-deep
  .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content {
  box-shadow: none;
}
.center-table {
  vertical-align: middle;
  text-align: center;
}
</style>
