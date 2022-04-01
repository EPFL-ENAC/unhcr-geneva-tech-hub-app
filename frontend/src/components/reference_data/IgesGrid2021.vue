<template>
  <v-card flat>
    <v-card-text>
      <v-data-table :headers="headers" :items="reference.iges_grid_2021">
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

        <template v-slot:item.name="props">
          <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.name }} {{ flagEmoji(props.item.country_code) }}
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
      </v-data-table>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}

        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { GreenHouseGazReference } from "@/store/GhgInterface";
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
  },
})
export default class IgesGrid2021 extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getDoc!: (id: string) => Promise<null>;

  updateDoc!: (
    obj: GreenHouseGazReference
  ) => PromiseLike<GreenHouseGazReference>;

  reference!: GreenHouseGazReference;
  flagEmoji = flagEmoji;
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

<style></style>
