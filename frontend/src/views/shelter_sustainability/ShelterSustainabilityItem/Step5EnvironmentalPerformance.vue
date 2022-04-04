<template>
  <v-form
    :readonly="!$can('edit', shelter)"
    v-if="shelter"
    @submit.prevent="() => submitForm(shelter)"
  >
    <v-container fluid>
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
                    hide-default-footer
                    :show-expand="true"
                    @click:row="
                      (item, slot) =>
                        item.items && slot.expand(!slot.isExpanded)
                    "
                  >
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
                <v-col> GRAPH HERE </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-title>
                      <h2
                        class="text-h5 project-shelter__h4 font-weight-medium"
                      >
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
                      <h2
                        class="text-h5 project-shelter__h4 font-weight-medium"
                      >
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
  </v-form>
</template>

<script lang="ts">
import InfoGroup from "@/components/shelter_sustainability/InfoGroup.vue";
import {
  EnvPerf,
  MaterialReferenceData,
  Shelter,
} from "@/store/ShelterInterface";
import { getFormIdItems } from "@/store/ShelterModuleUtils";
import habitatRisks from "@/views/shelter_sustainability/ShelterSustainabilityItem/habitatRisks";
import reuseRecycling from "@/views/shelter_sustainability/ShelterSustainabilityItem/reuseRecycling";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapGetters("GhgReferenceModule", ["materialMap", "materials"]),
  },
  components: {
    InfoGroup,
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;
  materialMap!: Record<string, MaterialReferenceData>;

  singleExpand = true;
  expanded = [];

  showSubPanel = {} as Record<string, boolean>;
  public toggle(key: string): void {
    this.showSubPanel[key] = !this.showSubPanel[key];
  }

  get items(): EnvPerf[] {
    const res = cloneDeep(this.shelter.envPerfItems) as EnvPerf[];
    if (this.shelter?.totalEnvPerf) {
      res.push(this.shelter?.totalEnvPerf);
    }
    return res;
  }
  get currentForms(): string[] {
    return getFormIdItems(this.shelter.items);
  }

  public get headers(): HeaderInterface[] {
    return [
      { text: "Material", value: "material", sortable: false },
      { text: "Weight", value: "weight", sortable: false },
      {
        text: "embodied_carbon_production in Kg/CO2",
        value: "embodied_carbon_production",
        sortable: false,
      },
      {
        text: "embodied_carbon_transport",
        value: "embodied_carbon_transport",
        sortable: false,
      },
      {
        text: "embodied_carbon_total",
        value: "embodied_carbon_total",
        sortable: false,
      },
      { text: "embodied_water", value: "embodied_water", sortable: false },
      { text: "unit_cost", value: "unit_cost", sortable: false },
      { text: "total_cost", value: "total_cost", sortable: false },
    ];
  }

  public get headersSubItems(): HeaderInterface[] {
    return [
      { text: "Form", value: "formId", sortable: false },
      { text: "Weight", value: "weight", sortable: false },
      {
        text: "embodied_carbon_production",
        value: "embodiedCarbon",
        sortable: false,
      },
      {
        text: "embodied_carbon_transport",
        value: "embodiedCarbonTransport",
        sortable: false,
      },
      {
        text: "embodied_carbon_total",
        value: "embodied_carbon_total",
        sortable: false,
      },
      { text: "embodied_water", value: "embodiedWater", sortable: false },
      { text: "unit_cost", value: "unitCost", sortable: false },
      { text: "total_cost", value: "totalCost", sortable: false },
    ];
  }

  get currentMaterials(): string[] {
    return (
      this.shelter.envPerfItems?.map(
        (envPerf: EnvPerf): string => envPerf.material
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
      .map((x) => ({ ...x, id: this.materialMap[x.id].form }));
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}
interface Info {
  id: string;
  description: string;
}
</script>
