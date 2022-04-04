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
            </v-container>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { EnvPerf, Shelter } from "@/store/ShelterInterface";
import descriptions from "@/views/shelter_sustainability/ShelterSustainabilityItem/environementalPerformanceDescription";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapGetters("GhgReferenceModule", ["materialMap"]),
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  singleExpand = true;
  expanded = [];

  get items(): EnvPerf[] {
    const res = cloneDeep(this.shelter.envPerfItems) as EnvPerf[];
    if (this.shelter?.totalEnvPerf) {
      res.push(this.shelter?.totalEnvPerf);
    }
    return res;
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

  descriptions = descriptions;
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}
</script>
