<template>
  <main class="green-house-gaz__references">
    <v-tabs v-model="tab" background-color="primary">
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
</template>

<script lang="ts">
import {
  EnergyInterface,
  GreenHouseGazReference,
  IgesItemInterface,
  ReferenceItemInterface,
} from "@/store/GhgInterface";
import flagEmoji from "@/utils/flagEmoji";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

const REFERENCE_DOC_ID = "reference";

@Component({
  computed: {
    ...mapState("GhgReferenceModule", ["reference"]),
  },

  methods: {
    ...mapActions("GhgReferenceModule", [
      "syncDB",
      "getDoc",
      "updateDoc",
      "closeDB",
    ]),
  },
})
export default class ReferencesList extends Vue {
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
    }
    return [];
  }

  public get items(): ReferenceItemInterface[] | IgesItemInterface[] {
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
