<template>
  <v-container v-if="shelter" fluid>
    <v-row>
      <v-col class="d-flex">
        <h2 class="text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-sheet v-if="shelter" elevation="2" rounded>
          <v-container fluid>
            <v-row>
              <v-col class="about-first-column d-flex justify-center" lg="12">
                <v-data-table
                  class="first-level"
                  :headers="headers"
                  :items="items"
                  hide-default-header
                  hide-default-footer
                  :items-per-page="-1"
                  :single-expand="singleExpand"
                  :expanded.sync="expanded"
                  item-key="materialId"
                  show-expand
                >
                  <template v-slot:header>
                    <thead>
                      <tr>
                        <th colspan="1"></th>
                        <th rowspan="3">Material</th>
                        <th style="vertical-align: middle; text-align: center">
                          Material weight (kg)
                        </th>
                        <th
                          colspan="3"
                          style="vertical-align: middle; text-align: center"
                        >
                          Embodied carbon (kgCO2e/kg)
                        </th>
                        <th style="vertical-align: middle; text-align: center">
                          <span>
                            Embodied water (L)
                            <info-tooltip>
                              Embodied potable/tap water, excludes water from
                              natural irrigation
                            </info-tooltip>
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th style="vertical-align: middle; text-align: center">
                          Production
                        </th>
                        <th style="vertical-align: middle; text-align: center">
                          Transportation
                        </th>
                        <th style="vertical-align: middle; text-align: center">
                          Total
                        </th>
                        <th colspan="3"></th>
                      </tr>
                    </thead>
                  </template>
                  <template v-slot:[`item.weight`]="{ item }">
                    <span>{{ item.weight | formatNumber }} </span>
                  </template>
                  <template v-slot:[`item.embodiedCarbonProduction`]="{ item }">
                    <span
                      >{{ item.embodiedCarbonProduction | formatNumber }}
                    </span>
                  </template>
                  <template v-slot:[`item.embodiedCarbonTransport`]="{ item }">
                    <span
                      >{{ item.embodiedCarbonTransport | formatNumber }}
                    </span>
                  </template>
                  <template v-slot:[`item.embodiedCarbonTotal`]="{ item }">
                    <span>{{ item.embodiedCarbonTotal | formatNumber }} </span>
                  </template>
                  <template v-slot:[`item.embodiedWater`]="{ item }">
                    <span>{{ item.embodiedWater | formatNumber }} </span>
                  </template>
                  <template v-slot:[`item.totalCost`]="{ item }">
                    <span>{{ item.totalCost | formatNumber }} </span>
                  </template>
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length" style="padding: 0 0 0 0">
                      <v-data-table
                        hide-default-footer
                        hide-default-header
                        :items-per-page="-1"
                        :headers="headersSubItems"
                        :items="item.children"
                      >
                        <!-- <template v-slot:[`item.formId`]="slotProps">
                          <span v-if="materialMap[slotProps.item.formId]">{{
                            materialMap[slotProps.item.formId].form
                          }}</span>
                          <span v-else> {{ slotProps.item.formId }}</span>
                        </template> -->
                        <template v-slot:[`item.name`]="slotProps">
                          <span> {{ slotProps.item.name }}</span>
                        </template>
                        <!-- beware duplicated code from above -->
                        <template v-slot:[`item.weight`]="slotProps">
                          <span
                            >{{ slotProps.item.weight | formatNumber }}
                          </span>
                        </template>
                        <template
                          v-slot:[`item.embodiedCarbonProduction`]="slotProps"
                        >
                          <span
                            >{{
                              slotProps.item.embodiedCarbonProduction
                                | formatNumber
                            }}
                          </span>
                        </template>
                        <template
                          v-slot:[`item.embodiedCarbonTransport`]="slotProps"
                        >
                          <span
                            >{{
                              slotProps.item.embodiedCarbonTransport
                                | formatNumber
                            }}
                          </span>
                        </template>
                        <template
                          v-slot:[`item.embodiedCarbonTotal`]="slotProps"
                        >
                          <span
                            >{{
                              slotProps.item.embodiedCarbonTotal | formatNumber
                            }}
                          </span>
                        </template>
                        <template v-slot:[`item.embodiedWater`]="slotProps">
                          <span
                            >{{ slotProps.item.embodiedWater | formatNumber }}
                          </span>
                        </template>
                        <template v-slot:[`item.totalCost`]="slotProps">
                          <span
                            >{{ slotProps.item.totalCost | formatNumber }}
                          </span>
                        </template>
                      </v-data-table>
                    </td>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(option, $idx) in graphTreeOptions"
                :key="$idx"
                :md="12"
                :lg="4"
              >
                <graph-tree
                  :selected-field="option.selectedField"
                  :unit-name="option.unitName"
                  :title="option.title"
                  :items="items"
                />
              </v-col>
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
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import GraphTree from "@/components/shelter_sustainability/billOfQuantities/graphTree.vue";
import InfoGroup from "@/components/shelter_sustainability/InfoGroup.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { MaterialTree, Shelter } from "@/store/ShelterInterface";
import { getFormIdItems } from "@/store/ShelterModuleUtils";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import habitatRisks from "@/views/shelter_sustainability/ShelterSustainabilityItem/habitatRisks";
import reuseRecycling from "@/views/shelter_sustainability/ShelterSustainabilityItem/reuseRecycling";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapGetters("SheltersMaterialModule", ["materialMap", "materials"]),
  },
  methods: {
    ...mapActions("SheltersMaterialModule", [
      "syncDB",
      "getAllDocs",
      "closeDB",
    ]),
  },
  components: {
    InfoGroup,
    GraphTree,
    InfoTooltip,
  },
})
/** Project */
export default class Step3Materials extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<null>;

  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;
  materialMap!: Record<string, ShelterMaterial>;

  singleExpand = true;
  infoTooltipText = infoTooltipText;
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
        align: "left" as DataTableHeader["align"],
        text: "Material",
        value: "materialId",
        sortable: false,
        width: "100px",
      },
      {
        align: "center" as DataTableHeader["align"],
        text: "Weight in kg",
        value: "weight",
        sortable: false,
      },
      {
        align: "center" as DataTableHeader["align"],
        text: "Production",
        value: "embodiedCarbonProduction",
        sortable: false,
      },
      {
        align: "center" as DataTableHeader["align"],
        text: "Transport",
        value: "embodiedCarbonTransport",
        sortable: false,
      },
      {
        align: "center" as DataTableHeader["align"],
        text: "Total",
        value: "embodiedCarbonTotal",
        sortable: false,
      },
      {
        align: "center" as DataTableHeader["align"],
        text: "Embodied water in L/kg",
        value: "embodiedWater",
        sortable: false,
      },
    ].map((x) => ({ ...x, class: "test", cellClass: "class-test" }));
  }

  public get headersSubItems(): DataTableHeader[] {
    return [
      { text: "", value: "data-null" },
      // { text: "Form", value: "formId", sortable: false, width: "100px" },
      { text: "Name", value: "name", sortable: false, width: "100px" },
      { align: "center", text: "Weight", value: "weight", sortable: false },
      {
        align: "center",
        text: "Embodied carbon production",
        value: "embodiedCarbonProduction",
        sortable: false,
      },
      {
        align: "center",
        text: "Embodied carbon transport",
        value: "embodiedCarbonTransport",
        sortable: false,
      },
      {
        align: "center",
        text: "Embodied carbon total",
        value: "embodiedCarbonTotal",
        sortable: false,
      },
      {
        align: "center",
        text: "Embodied water",
        value: "embodiedWater",
        sortable: false,
      },
      // { text: "Unit cost", value: "unitCost", sortable: false },
      // { text: "Total cost", value: "totalCost", sortable: false },
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
      .map((x) => {
        const localMap = this.materialMap[x.id] || {};
        return {
          ...x,
          id: `${localMap.material ?? x.id}—${localMap.form ?? x.id}`,
        };
      });
  }

  mounted(): void {
    this.syncDB();
    this.getAllDocs();
  }
  destroyed(): void {
    this.closeDB();
  }

  graphTreeOptions = [
    {
      selectedField: "weight",
      title: "Weight",
      unitName: "Kg",
    },
    {
      title: "Embodied carbon total",
      selectedField: "embodiedCarbonTotal",
      unitName: "kgCO2e/kg",
    },
    {
      title: "Embodied water",
      selectedField: "embodiedWater",
      unitName: "L",
    },
  ];
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
      width: 200px;
    }
  }

  tbody {
    tr > td {
      width: 200px;
    }
  }
}
.v-data-table.first-level ::v-deep {
  tbody tr:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
}
.v-data-table.first-level
  ::v-deep
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:last-child {
  background-color: #ccc;
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
