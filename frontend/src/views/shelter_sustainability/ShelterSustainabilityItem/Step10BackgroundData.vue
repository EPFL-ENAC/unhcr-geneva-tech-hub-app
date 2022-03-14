<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="project-shelter__header">Background Data</h1>
        <v-data-table :headers="headers" :items="materials">
          <template v-slot:item.density="props">
            {{ props.item.density }} {{ props.item.density_unit }}
          </template>
          <template v-slot:item.production_water_consumption="props">
            {{ props.item.density }} L/kg
          </template>
          <template v-slot:item.production_embodied_carbon="props">
            {{ props.item.density }} kgCO2e/kg
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ShelterMaterial } from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("ShelterMaterialsModule", ["materials"]),
  },

  methods: {
    ...mapActions("ShelterMaterialsModule", [
      "syncDB",
      "getAllDocs",
      "updateDoc",
      "closeDB",
    ]),
  },
})
export default class BackgroundData extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<ShelterMaterial[]>;

  updateDoc!: (obj: ShelterMaterial) => PromiseLike<ShelterMaterial>;

  materials!: ShelterMaterial[];

  snack = false;
  snackColor = "";
  snackText = "";
  max25chars = (v: string): boolean | string =>
    v.length <= 25 || "Input too long!";
  pagination = {};

  mounted(): void {
    this.syncDB();
    this.getAllDocs();
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view reference list, closing DB");
    });
  }

  public get headers(): HeaderInterface[] {
    return [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "variable name",
        align: "start",
        sortable: false,
        value: "variable",
      },
      { text: "density", value: "density" },
      { text: "embodied_carbon", value: "production_embodied_carbon" },
      { text: "water_consumption", value: "production_water_consumption" },
    ];
  }

  save(): void {
    this.snack = true;
    this.snackColor = "success";
    this.snackText = "Data saved";
  }
  cancel(): void {
    this.snack = true;
    this.snackColor = "error";
    this.snackText = "Canceled";
  }
  open(): void {
    this.snack = true;
    this.snackColor = "info";
    this.snackText = "Dialog opened";
  }
  close(): void {
    console.log("Dialog closed");
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}
</script>
