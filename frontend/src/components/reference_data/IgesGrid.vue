<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-data-table dense :headers="headers" :items="items">
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
import { IgesItem } from "@/store/GhgReferenceIgesGridModule";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceIgesGridModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
})
export default class IgesGrid extends Vue {
  items!: IgesItem[];
  snack = false;
  snackColor = "";
  snackText = "";
  max25chars = (v: string): boolean | string =>
    v.length <= 25 || "Input too long!";
  pagination = {};

  public get headers(): HeaderInterface[] {
    return [
      {
        text: "name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "value", value: "value", width: "100px" },
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
  width?: string;
}
</script>

<style></style>
