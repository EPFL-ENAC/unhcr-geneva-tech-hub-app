<template>
  <v-card flat>
    <v-card-text>
      <v-card-text>
        <v-row>
          <v-col class="d-flex">
            <h2 class="text-h4 project__h3 font-weight-medium">
              {{ infoTooltipText.Materials.title }}
            </h2>
            <info-tooltip>
              {{ infoTooltipText.Materials.text }}
            </info-tooltip>
          </v-col>
        </v-row>
      </v-card-text>
      <v-data-table :headers="headers" :items="items" dense>
        <template #[`item.density`]="props">
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              {{
                props.item.density |
                  formatNumber({
                    maximumFractionDigits: 3,
                  })
              }}
              {{ props.item.density_unit }}
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>$mdiInformation</v-icon>
              </v-btn>
            </template>
            <span>{{ props.item.density_ref }}</span>
          </v-tooltip>
        </template>
        <template #[`item.embodied_water`]="props">
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              {{ props.item.embodied_water | formatNumber }} L/kg
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>$mdiInformation</v-icon>
              </v-btn>
            </template>
            <span>{{ props.item.embodied_water_ref }}</span>
          </v-tooltip>
        </template>
        <template #[`item.embodied_carbon`]="props">
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              {{ props.item.embodied_carbon | formatNumber }} kgCO2e/kg
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>$mdiInformation</v-icon>
              </v-btn>
            </template>
            <span>{{ props.item.embodied_carbon_ref }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("SheltersMaterialModule", ["items"]),
  },
  components: {
    InfoTooltip,
  },
})
export default class Materials extends Vue {
  items!: ShelterMaterial[];
  pagination = {};
  infoTooltipText = infoTooltipText;

  public get headers(): HeaderInterface[] {
    return [
      { text: "Material", value: "material" },
      { text: "Form", value: "form" },
      { text: "density", value: "density" },
      { text: "Embodied carbon", value: "embodied_carbon" },
      { text: "Embodied water", value: "embodied_water" },
    ];
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}
</script>

<style></style>
