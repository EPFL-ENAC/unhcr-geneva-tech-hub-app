<template>
  <v-container v-if="shelter" fluid class="shelter-step-5-container">
    <v-row v-if="$route.name === 'ShelterSustainabilityStep5'">
      <v-col class="d-flex align-center">
        <h2 class="text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
    </v-row>
    <v-row class="d-no-print">
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
                  class="first-level elevation-1 hover:primary"
                  :headers="headers"
                  :items="items"
                  hide-default-header
                  hide-default-footer
                  :items-per-page="-1"
                  :single-expand="singleExpand"
                  :expanded.sync="expanded"
                  :item-class="itemMaterialClass"
                  item-key="materialId"
                  show-expand
                >
                  <template #header>
                    <thead>
                      <tr>
                        <th colspan="1">Per Shelter</th>
                        <th style="text-align: center; vertical-align: middle">
                          Material
                          <info-tooltip>
                            {{ infoTooltipText.step5Material.text }}
                          </info-tooltip>
                        </th>
                        <th style="vertical-align: middle; text-align: center">
                          Material weight (kg)
                          <info-tooltip>
                            {{ infoTooltipText.step5MaterialWeight.text }}
                          </info-tooltip>
                        </th>
                        <th
                          colspan="3"
                          class="embodied-carbon-title-cell"
                          style="vertical-align: middle; text-align: center"
                        >
                          Embodied carbon (kgCO2e/kg)
                          <info-tooltip>
                            {{ infoTooltipText.step5EmbodiedCarbon.text }}
                          </info-tooltip>
                        </th>
                        <th style="vertical-align: middle; text-align: center">
                          <span>
                            Embodied water (L)
                            <info-tooltip>
                              {{ infoTooltipText.step5EmbodiedWater.text }}
                            </info-tooltip>
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="vertical-align: middle; text-align: center">
                          Production
                          <info-tooltip>
                            {{ infoTooltipText.step5Production.text }}
                          </info-tooltip>
                        </th>
                        <th style="vertical-align: middle; text-align: center">
                          Transportation
                          <info-tooltip>
                            {{ infoTooltipText.step5Transportation.text }}
                          </info-tooltip>
                        </th>
                        <th style="vertical-align: middle; text-align: center">
                          Total
                        </th>
                        <th colspan="3"></th>
                      </tr>
                    </thead>
                  </template>
                  <template #[`item.weight`]="{ item }">
                    <span>{{ item.weight | formatNumber }}</span>
                  </template>
                  <template #[`item.embodiedCarbonProduction`]="{ item }">
                    <span>
                      {{ item.embodiedCarbonProduction | formatNumber }}
                    </span>
                  </template>
                  <template #[`item.embodiedCarbonTransport`]="{ item }">
                    <span>
                      {{ item.embodiedCarbonTransport | formatNumber }}
                    </span>
                  </template>
                  <template #[`item.embodiedCarbonTotal`]="{ item }">
                    <span>{{ item.embodiedCarbonTotal | formatNumber }}</span>
                  </template>
                  <template #[`item.embodiedWater`]="{ item }">
                    <span>{{ item.embodiedWater | formatNumber }}</span>
                  </template>
                  <template #[`item.totalCost`]="{ item }">
                    <span>{{ item.totalCost | formatNumber }}</span>
                  </template>
                  <template #expanded-item="{ headers, item }">
                    <td :colspan="headers.length" style="padding: 0 0 0 0">
                      <v-data-table
                        hide-default-footer
                        hide-default-header
                        :items-per-page="-1"
                        :headers="headersSubItems"
                        :items="item.children"
                        :item-class="itemFormClass"
                      >
                        <!-- <template v-slot:[`item.formId`]="slotProps">
                          <span v-if="materialMap[slotProps.item.formId]">{{
                            materialMap[slotProps.item.formId].form
                          }}</span>
                          <span v-else> {{ slotProps.item.formId }}</span>
                        </template> -->
                        <template #[`item.name`]="slotProps">
                          <span>{{ slotProps.item.name }}</span>
                        </template>
                        <!-- beware duplicated code from above -->
                        <template #[`item.weight`]="slotProps">
                          <span>
                            {{ slotProps.item.weight | formatNumber }}
                          </span>
                        </template>
                        <template
                          #[`item.embodiedCarbonProduction`]="slotProps"
                        >
                          <span>
                            {{
                              slotProps.item.embodiedCarbonProduction |
                                formatNumber
                            }}
                          </span>
                        </template>
                        <template #[`item.embodiedCarbonTransport`]="slotProps">
                          <span>
                            {{
                              slotProps.item.embodiedCarbonTransport |
                                formatNumber
                            }}
                          </span>
                        </template>
                        <template #[`item.embodiedCarbonTotal`]="slotProps">
                          <span>
                            {{
                              slotProps.item.embodiedCarbonTotal | formatNumber
                            }}
                          </span>
                        </template>
                        <template #[`item.embodiedWater`]="slotProps">
                          <span>
                            {{ slotProps.item.embodiedWater | formatNumber }}
                          </span>
                        </template>
                        <template #[`item.totalCost`]="slotProps">
                          <span>
                            {{ slotProps.item.totalCost | formatNumber }}
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
                md="12"
                lg="1"
                class="shelter-graph-button__container d-print-none"
              >
                <div class="d-flex justify-center">View</div>
                <div class="d-flex justify-center">
                  <v-radio-group v-model="selectedGraph" mandatory>
                    <v-radio value="treemap">
                      <template #label>
                        <v-icon>$mdiViewQuilt</v-icon>
                      </template>
                    </v-radio>
                    <v-radio value="sunburst">
                      <template #label>
                        <v-icon>$mdiChartDonutVariant</v-icon>
                      </template>
                    </v-radio>

                    <v-radio value="sankey">
                      <template #label>
                        <v-icon>$mdiChartSankey</v-icon>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </div>
              </v-col>
              <v-col
                lg="11"
                md="12"
                class="shelter-environmental-graphs-container"
              >
                <v-row>
                  <v-col
                    v-for="(option, $idx) in graphTreeOptions"
                    :key="$idx"
                    class="shelter-environmental-graphs-container__col"
                    :md="12"
                    :lg="4"
                  >
                    <graph-tree
                      :selected-field="option.selectedField"
                      :graph-type="selectedGraph"
                      :unit-name="option.unitName"
                      :title="option.title"
                      :items="items"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="environmental-info-group">
              <v-col :sm="12" :md="6">
                <v-card class="">
                  <v-card-title>
                    <h2 class="project-shelter__h4 font-weight-mediumt text-h5">
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
              <v-col :sm="12" :md="6">
                <v-card>
                  <v-card-title>
                    <h2 class="project-shelter__h4 font-weight-medium text-h5">
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
import { cloneDeep, kebabCase } from "lodash";
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
    InfoTooltip,
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;
  materialMap!: Record<string, ShelterMaterial>;

  singleExpand = true;
  infoTooltipText = infoTooltipText;
  expanded = [];
  selectedGraph = "treemap";

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

  public itemMaterialClass(value: MaterialTree): string {
    return `material-${kebabCase(value.materialId) as string}`;
  }
  public itemFormClass(value: MaterialTree): string {
    return kebabCase(value.formId) as string;
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

  graphTreeOptions = [
    {
      selectedField: "weight",
      title: "Material weight",
      unitName: "Kg",
    },
    {
      title: "Embodied carbon (total)",
      selectedField: "embodiedCarbonTotal",
      unitName: "kgCO2e",
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
.shelter-graph-button__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}
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
  thead tr:first-child {
    th {
      border-top: thin solid rgba(0, 0, 0, 0.12);
    }
  }
  thead tr {
    th:last-child {
      border-right: thin solid rgba(0, 0, 0, 0.12);
    }
    th.embodied-carbon-title-cell {
      border-bottom: thin solid rgba(0, 0, 0, 0.12);
    }
  }
  tbody tr:last-child {
    td {
      button {
        visibility: hidden;
      }
    }
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
@media print {
  ::v-deep .v-sheet.v-card:not(.v-sheet--outlined) {
    box-shadow: none !important;
  }

  .shelter-step-5-container {
    padding: 0 !important;
    // page-break-before: avoid;
    // page-break-inside: avoid;
  }
  .environmental-info-group {
    page-break-before: always;
    page-break-inside: auto;
  }
  .project-shelter__h4 {
    font-size: 0.8rem !important;
    line-height: 1rem;
  }
  .shelter-environmental-graphs-container__col {
    justify-content: start;
    align-content: start;
    min-width: 475px !important;
    max-width: 475px !important;
    max-height: 250px !important;
    min-height: 250px !important;
    .v-responsive {
      max-height: 250px !important;
      min-height: 250px !important;
    }
  }
  @page {
    size: portrait;
  }
}
</style>
<style lang="scss">
@media print {
  .elevation-1 > .v-data-table__wrapper > table > thead > tr > th,
  .elevation-1 > .v-data-table__wrapper > table > tbody > tr > td,
  .elevation-1 > .v-data-table__wrapper > table > tfoot > tr > td {
    height: 20px;
    font-size: 6pt;
    button {
      display: none;
    }
  }
  .boq-custom-title {
    padding-bottom: 0px;
    padding-top: 0px;
  }
  // https://stackoverflow.com/questions/274149/repeat-table-headers-in-print-mode
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
    break-inside: auto;
  }
}
</style>
<style>
.alu-cpa:hover {
  background-color: hsl(206, 33%, 87%);
}
.alu-oth:hover {
  background-color: hsl(206, 33%, 77%);
}
.alu-she:hover {
  background-color: hsl(206, 33%, 67%);
}
.bit-all:hover {
  background-color: hsl(328, 47%, 62%);
}
.bit-oth:hover {
  background-color: hsl(328, 47%, 52%);
}
.bmb-mat:hover {
  background-color: hsl(96, 60%, 63%);
}
.bmb-oth:hover {
  background-color: hsl(96, 60%, 53%);
}
.bmb-pol:hover {
  background-color: hsl(96, 60%, 43%);
}
.car-all:hover {
  background-color: hsl(32, 90%, 65%);
}
.car-oth:hover {
  background-color: hsl(32, 90%, 45%);
}
.cem-mtr:hover {
  background-color: hsl(51, 15%, 66%);
}
.cem-oth:hover {
  background-color: hsl(51, 15%, 56%);
}
.cem-pur:hover {
  background-color: hsl(51, 15%, 46%);
}
.cla-brf:hover {
  background-color: hsl(51, 70%, 71%);
}
.cla-bru:hover {
  background-color: hsl(51, 70%, 66%);
}
.cla-oth:hover {
  background-color: hsl(51, 70%, 51%);
}
.cla-tlf:hover {
  background-color: hsl(51, 70%, 46%);
}
.cla-tlr:hover {
  background-color: hsl(51, 70%, 41%);
}
.con-aeb:hover {
  background-color: hsl(51, 5%, 86%);
}
.con-gen:hover {
  background-color: hsl(51, 5%, 76%);
}
.con-oth:hover {
  background-color: hsl(51, 5%, 66%);
}
.con-pcb:hover {
  background-color: hsl(51, 5%, 60%);
}
.con-pcu:hover {
  background-color: hsl(51, 5%, 52%);
}
.con-rei:hover {
  background-color: hsl(51, 5%, 46%);
}
.ear-oth:hover {
  background-color: hsl(51, 85%, 76%);
}
.ear-pla:hover {
  background-color: hsl(51, 85%, 66%);
}
.ear-rme:hover {
  background-color: hsl(51, 85%, 56%);
}
.ear-rof:hover {
  background-color: hsl(51, 85%, 46%);
}
.gla-oth:hover {
  background-color: hsl(59, 100%, 62%);
}
.gla-win:hover {
  background-color: hsl(59, 100%, 52%);
}
.gla-woo:hover {
  background-color: hsl(59, 100%, 42%);
}
.gra-all:hover {
  background-color: hsl(96, 90%, 33%);
}
.gyp-oth:hover {
  background-color: hsl(51, 60%, 56%);
}
.gyp-pla:hover {
  background-color: hsl(51, 60%, 46%);
}
.hmp-oth:hover {
  background-color: hsl(96, 80%, 33%);
}
.hmp-rop:hover {
  background-color: hsl(96, 80%, 23%);
}
.lme-oth:hover {
  background-color: hsl(51, 40%, 56%);
}
.lme-pla:hover {
  background-color: hsl(51, 40%, 46%);
}
.oth:hover {
  background-color: hsl(0, 0%, 25%);
}
.pla-oth:hover {
  background-color: hsl(328, 87%, 83%);
}
.pla-pcc:hover {
  background-color: hsl(328, 87%, 78%);
}
.pla-pcs:hover {
  background-color: hsl(328, 87%, 73%);
}
.pla-pct:hover {
  background-color: hsl(328, 87%, 68%);
}
.pla-psy:hover {
  background-color: hsl(328, 87%, 63%);
}
.pla-pvc:hover {
  background-color: hsl(328, 87%, 58%);
}
.pla-rop:hover {
  background-color: hsl(328, 87%, 53%);
}
.pla-tar:hover {
  background-color: hsl(328, 87%, 48%);
}
.plc-hvy:hover {
  background-color: hsl(32, 50%, 65%);
}
.plc-lht:hover {
  background-color: hsl(32, 50%, 55%);
}
.plc-oth:hover {
  background-color: hsl(32, 50%, 45%);
}
.rbr-all:hover {
  background-color: hsl(328, 37%, 72%);
}
.snd-all:hover {
  background-color: hsl(41, 95%, 56%);
}
.snd-oth:hover {
  background-color: hsl(41, 95%, 46%);
}
.ste-chs:hover {
  background-color: hsl(206, 83%, 87%);
}
.ste-cse:hover {
  background-color: hsl(206, 83%, 82%);
}
.ste-eas:hover {
  background-color: hsl(206, 83%, 78%);
}
.ste-fxh:hover {
  background-color: hsl(206, 43%, 87%);
}
.ste-fxl:hover {
  background-color: hsl(206, 43%, 77%);
}
.ste-fxn:hover {
  background-color: hsl(206, 43%, 67%);
}
.ste-fxo:hover {
  background-color: hsl(206, 43%, 62%);
}
.ste-gsh:hover {
  background-color: hsl(206, 83%, 75%);
}
.ste-ise:hover {
  background-color: hsl(206, 83%, 73%);
}
.ste-oth:hover {
  background-color: hsl(206, 83%, 69%);
}
.ste-pla:hover {
  background-color: hsl(206, 83%, 65%);
}
.ste-reb:hover {
  background-color: hsl(206, 83%, 61%);
}
.ste-rhs:hover {
  background-color: hsl(206, 83%, 57%);
}
.ste-seo:hover {
  background-color: hsl(206, 83%, 53%);
}
.ste-shs:hover {
  background-color: hsl(206, 83%, 49%);
}
.ste-str:hover {
  background-color: hsl(206, 83%, 45%);
}
.ste-wir:hover {
  background-color: hsl(206, 83%, 41%);
}
.sto-agg:hover {
  background-color: hsl(51, 25%, 76%);
}
.sto-blk:hover {
  background-color: hsl(51, 25%, 71%);
}
.sto-oth:hover {
  background-color: hsl(51, 25%, 66%);
}
.tim-hdc:hover {
  background-color: hsl(96, 20%, 73%);
}
.tim-hdr:hover {
  background-color: hsl(96, 20%, 68%);
}
.tim-oth:hover {
  background-color: hsl(96, 20%, 63%);
}
.tim-ply:hover {
  background-color: hsl(96, 20%, 58%);
}
.tim-sfc:hover {
  background-color: hsl(96, 20%, 53%);
}
.tim-sfr:hover {
  background-color: hsl(96, 20%, 48%);
}

.material-aluminium,
.material-aluminium:hover {
  color: #fefefe;
  background-color: hsl(206, 33%, 57%) !important;
}
.material-bitumen,
.material-bitumen:hover {
  color: #fefefe;
  background-color: hsl(328, 47%, 42%) !important;
}
.material-bamboo,
.material-bamboo:hover {
  color: #fefefe;
  background-color: hsl(96, 60%, 43%) !important;
}
.material-cardboard-paper,
.material-cardboard-paper:hover {
  color: #fefefe;
  background-color: hsl(32, 90%, 35%) !important;
}
.material-cement,
.material-cement:hover {
  color: #fefefe;
  background-color: hsl(51, 15%, 36%) !important;
}
.material-clay,
.material-clay:hover {
  color: #fefefe;
  background-color: hsl(51, 70%, 36%) !important;
}
.material-concrete,
.material-concrete:hover {
  color: #fefefe;
  background-color: hsl(51, 5%, 36%) !important;
}
.material-earth-soil-mud,
.material-earth-soil-mud:hover {
  color: #fefefe;
  background-color: hsl(51, 85%, 36%) !important;
}
.material-glass,
.material-glass:hover {
  color: #fefefe;
  background-color: hsl(59, 100%, 32%) !important;
}
.grass-straw,
.grass-straw:hover {
  color: #fefefe;
  background-color: hsl(96, 90%, 23%) !important;
}
.material-gypsum,
.material-gypsum:hover {
  color: #fefefe;
  background-color: hsl(51, 60%, 36%) !important;
}
.material-hemp,
.material-hemp:hover {
  color: #fefefe;
  background-color: hsl(96, 80%, 13%) !important;
}
.material-lime,
.material-lime:hover {
  color: #fefefe;
  background-color: hsl(51, 40%, 36%) !important;
}
.material-other,
.material-other:hover {
  color: #fefefe;
  background-color: hsl(0, 0%, 25%) !important;
}
.material-plastic-polymer,
.material-plastic-polymer:hover {
  color: #fefefe;
  background-color: hsl(328, 87%, 43%) !important;
}
.material-canvas-polycotton,
.material-canvas-polycotton:hover {
  color: #fefefe;
  background-color: hsl(32, 50%, 35%) !important;
}
.material-rubber,
.material-rubber:hover {
  color: #fefefe;
  background-color: hsl(328, 37%, 62%) !important;
}
.material-sand,
.material-sand:hover {
  color: #fefefe;
  background-color: hsl(41, 95%, 36%) !important;
}
.material-steel,
.material-steel:hover {
  color: #fefefe;
  background-color: hsl(206, 83%, 37%) !important;
}
.material-steel-brass-fixture-fixing,
.material-steel-brass-fixture-fixing:hover {
  color: #fefefe;
  background-color: hsl(206, 43%, 57%) !important;
}
.material-stone,
.material-stone:hover {
  color: #fefefe;
  background-color: hsl(51, 25%, 61%) !important;
}
.material-timber,
.material-timber:hover {
  color: #fefefe;
  background-color: hsl(96, 20%, 43%) !important;
}
</style>
