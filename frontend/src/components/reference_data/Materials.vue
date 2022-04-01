<template>
  <v-card flat>
    <v-card-text>
      <v-data-table :headers="headers" :items="reference.materials">
        <template v-slot:item.density="props">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              {{ props.item.density }} {{ props.item.density_unit }}
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-information'"></v-icon>
              </v-btn>
            </template>
            <span>{{ props.item.density_ref }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.embodied_water="props">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              {{ props.item.embodied_water }} L/kg
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-information'"></v-icon>
              </v-btn>
            </template>
            <span>{{ props.item.embodied_water_ref }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.embodied_carbon="props">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              {{ props.item.embodied_carbon }}kgCO2e/kg
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-information'"></v-icon>
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
import { GreenHouseGazReference } from "@/store/GhgInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

const REFERENCE_DOC_ID = "reference";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },
  methods: {
    ...mapActions("GhgReferenceModule", ["syncDB", "getDoc", "closeDB"]),
  },
})
export default class Materials extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getDoc!: (id: string) => Promise<null>;

  reference!: GreenHouseGazReference;
  pagination = {};

  mounted(): void {
    this.syncDB();
    this.getDoc(REFERENCE_DOC_ID);
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view reference list, closing DB");
    });
  }

  public get headers(): HeaderInterface[] {
    return [
      { text: "Material", value: "material" },
      { text: "Form", value: "form" },
      { text: "density", value: "density" },
      { text: "embodied_carbon", value: "embodied_carbon" },
      { text: "embodied_water", value: "embodied_water" },
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
