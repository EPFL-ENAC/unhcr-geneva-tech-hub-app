<template>
  <v-navigation-drawer v-model="drawer" absolute width="80%" right temporary>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between">
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Reference Data
          </h2>
          <v-btn icon @click="toggleReferenceData">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <main class="green-house-gaz__references">
      <v-tabs
        v-model="tab"
        class="fixed-tabs-bar"
        centered
        grow
        :show-arrows="true"
        elevation="2"
      >
        <v-tab v-for="item in menuItems" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in menuItems" :key="item.tab">
          <v-card flat>
            <v-card-text>
              <v-data-table :headers="headers" :items="items">
                <template v-slot:item.name="props">
                  <v-edit-dialog
                    :return-value.sync="props.item.name"
                    @save="save"
                    @cancel="cancel"
                    @open="open"
                    @close="close"
                  >
                    {{ props.item.name }} {{ props.item.emoji }}
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.name"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.value="props">
                  <v-edit-dialog
                    :return-value.sync="props.item.name"
                    @save="save"
                    @cancel="cancel"
                    @open="open"
                    @close="close"
                  >
                    {{ props.item.value }}
                    <template v-slot:input>
                      <v-text-field
                        v-if="props.item.type === 'percentage'"
                        v-model.number="props.item.value"
                        min="1"
                        max="100"
                        label="Percentage"
                        type="number"
                        suffix="%"
                        single-line
                      ></v-text-field>
                      <v-text-field
                        v-else
                        v-model.number="props.item.value"
                        label="Edit"
                        type="number"
                        single-line
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.source="props">
                  <v-edit-dialog
                    :return-value.sync="props.item.source"
                    @save="save"
                    @cancel="cancel"
                    @open="open"
                    @close="close"
                  >
                    {{ props.item.source }}
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.source"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

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
                  {{ props.item.density }} L/kg
                </template>
                <template v-slot:item.embodied_carbon="props">
                  {{ props.item.density }} kgCO2e/kg
                </template>
              </v-data-table>
              <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                {{ snackText }}

                <template v-slot:action="{ attrs }">
                  <v-btn v-bind="attrs" text @click="snack = false">
                    Close
                  </v-btn>
                </template>
              </v-snackbar>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </main>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  EnergyInterface,
  GreenHouseGazReference,
  IgesItemInterface,
  ReferenceItemInterface,
} from "@/store/GhgInterface";
import { ShelterMaterial } from "@/store/ShelterInterface";
import flagEmoji from "@/utils/flagEmoji";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

const REFERENCE_DOC_ID = "reference";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["reference"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  methods: {
    ...mapActions("GhgReferenceModule", [
      "syncDB",
      "getDoc",
      "updateDoc",
      "closeDB",
    ]),
    ...mapActions(["toggleReferenceData", "setReferenceDataDrawer"]),
  },
})
/** ProjectList */
export default class App extends Vue {
  referenceDataDrawer!: boolean;
  toggleReferenceData!: () => Promise<void>;
  setReferenceDataDrawer!: (value: boolean) => void;

  set drawer(value: boolean) {
    this.setReferenceDataDrawer(value);
  }
  get drawer(): boolean {
    return this.referenceDataDrawer;
  }

  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getDoc!: (id: string) => Promise<null>;

  updateDoc!: (
    obj: GreenHouseGazReference
  ) => PromiseLike<GreenHouseGazReference>;

  reference!: GreenHouseGazReference;

  readonly menuItems: MenuSurveyItem[] = [
    { tab: "iges_grid_2021", content: "iges_grid_2021" },
    { tab: "Energy", content: "energy" },
    { tab: "Materials", content: "materials" },
  ];
  tab = 1;

  snack = false;
  snackColor = "";
  snackText = "";
  max25chars = (v: string): boolean | string =>
    v.length <= 25 || "Input too long!";
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
    if (this.reference) {
      const key = this.menuItems[this.tab].content as string;
      if (key === "energy") {
        return [
          {
            text: "description",
            align: "start",
            sortable: false,
            value: "description",
          },
          { text: "value", value: "value" },
          { text: "source", value: "source" },
        ];
      }

      if (key === "iges_grid_2021") {
        return [
          {
            text: "name",
            align: "start",
            sortable: false,
            value: "name",
          },
          { text: "value", value: "value" },
        ];
      }
      if (key === "materials") {
        return [
          { text: "Material", value: "material" },
          { text: "Form", value: "form" },
          { text: "density", value: "density" },
          { text: "embodied_carbon", value: "embodied_carbon" },
          { text: "embodied_water", value: "embodied_water" },
        ];
      }
    }
    return [];
  }

  public get items():
    | ReferenceItemInterface[]
    | IgesItemInterface[]
    | ShelterMaterial[] {
    if (this.reference) {
      const key = this.menuItems[this.tab].content as string;
      if (key === "energy") {
        const obj: EnergyInterface = this.reference.energy;
        return Object.values(obj);
      }

      if (key === "iges_grid_2021") {
        const obj: IgesItemInterface[] = this.reference.iges_grid_2021;
        return obj.map((x) => ({ ...x, emoji: flagEmoji(x.country_code) }));
      }

      if (key === "materials") {
        return this.reference.materials as ShelterMaterial[];
      }
    }
    return [];
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

interface MenuSurveyItem {
  tab: string;
  content: string;
}
</script>

<style></style>
