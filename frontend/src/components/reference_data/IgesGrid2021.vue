<template>
  <v-card flat>
    <v-card-text v-if="iges_grid_2021">
      <v-data-table :headers="headers" :items="iges_grid_2021">
        <template #[`item.value`]="props">
          <span>{{ props.item.value | formatNumber }}</span>
        </template>
      </v-data-table>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}

        <template #action="{ attrs }">
          <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { IgesItemInterface } from "@/store/GhgReferenceIgesGridModule";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceIgesGridModule", ["iges_grid_2021"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  methods: {
    ...mapActions("GhgReferenceIgesGridModule", [
      "syncDB",
      "getAllDocs",
      "updateDoc",
      "closeDB",
    ]),
  },
})
export default class IgesGrid2021 extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<null>;

  updateDoc!: (obj: IgesItemInterface) => PromiseLike<IgesItemInterface>;

  iges_grid_2021!: IgesItemInterface[];
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
