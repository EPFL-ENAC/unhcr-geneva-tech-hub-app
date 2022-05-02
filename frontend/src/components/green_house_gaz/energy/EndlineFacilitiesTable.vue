<template>
  <v-sheet elevation="2" rounded v-if="items">
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="name"
      class="elevation-1"
      :hide-default-footer="true"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Endline</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="() => openItemDialog(newDefaultItem(), -1)"
          >
            New intervention
          </v-btn>
          <!-- weird sync because new intervention is not a new item, but a modification of an existing -->
          <intervention-dialog
            :dialog-open.sync="dialogs['intervention-dialog']"
            :facilities="facilities"
            :item-index.sync="itemIndex"
            :item="localItem"
            @update:item="updateWithItem"
          />
          <duplicate-intervention-dialog
            :dialog-open.sync="dialogs['duplicate-intervention-dialog']"
            @duplicate:intervention="duplicateItem"
          />
          <delete-intervention-dialog
            :dialog-open.sync="dialogs['delete-intervention-dialog']"
            @delete:intervention="deleteItem"
          />
        </v-toolbar>
      </template>

      <template v-slot:item.dieselLiters="{ item }">
        {{ item.dieselLiters | formatNumber }}
      </template>
      <template v-slot:item.gridPower="{ item }">
        {{ item.gridPower | formatNumber }}
      </template>
      <template v-slot:item.renewablePower="{ item }">
        {{ item.renewablePower | formatNumber }}
      </template>
      <template v-slot:item.totalCO2Emission="{ item }">
        <span class="bold-table-cell-content">
          {{ item.totalCO2Emission | formatNumber }}
        </span>
      </template>

      <template v-slot:item.changeInEmission="{ item }">
        <span
          :class="{
            'facilities-positive': item.changeInEmission > 0,
            'facilities-negative': item.changeInEmission < 0,
            'bold-table-cell-content': item.changeInEmission === 0,
          }"
        >
          {{ item.changeInEmission | formatNumber }}%
        </span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          small
          class="mr-2"
          :disabled="disabled"
          @click="openItemDialog(item, item.name)"
        >
          <v-icon> mdi-pencil</v-icon>
        </v-btn>

        <!-- <v-btn
          icon
          small
          class="mr-2"
          @click="openDuplicateItemDialog(item, item.name)"
          :disabled="disabled"
        >
          <v-icon> mdi-content-duplicate</v-icon>
        </v-btn>

        <v-btn
          icon
          small
          class="mr-2"
          @click="openDeleteDialog(item, item.name)"
          :disabled="disabled"
        >
          <v-icon> mdi-delete</v-icon>
        </v-btn> -->
      </template>
      <template v-slot:foot="{}">
        <tr>
          <td
            v-for="(header, $index) in headers"
            :key="$index"
            class="facilities-footer-like-vuetify"
          >
            <span v-if="!header.hideFooterContent">
              {{ results[header.value] | formatNumber }}
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script lang="ts">
import DeleteInterventionDialog from "@/components/green_house_gaz/energy/DeleteInterventionDialog.vue";
import DuplicateInterventionDialog from "@/components/green_house_gaz/energy/DuplicateInterventionDialog.vue";
import InterventionDialog from "@/components/green_house_gaz/energy/InterventionDialog.vue";
import {
  EnergyFacilityInterventionItem,
  EnergyFacilityItem,
} from "@/store/GhgInterface";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    DeleteInterventionDialog,
    InterventionDialog,
    DuplicateInterventionDialog,
  },
})
export default class EndlineFacilitiesTable extends Vue {
  @Prop({ type: [Array], default: () => [] })
  readonly items!: EnergyFacilityInterventionItem[];

  @Prop({ type: [Object], default: () => ({}) })
  readonly results!: EnergyFacilityInterventionItem;

  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean;

  @Prop({ type: Array, default: () => [] })
  readonly facilities!: EnergyFacilityItem[];

  localItems: EnergyFacilityInterventionItem[] = [];
  dialogs = {} as Record<string, boolean>;
  defaultItem = {};
  localItem: EnergyFacilityInterventionItem =
    {} as EnergyFacilityInterventionItem;
  itemIndex: number | string = -1;

  headers = [
    {
      text: "Name", // facility name === dropdown of existant facilities
      align: "start",
      sortable: false,
      value: "name",
      hideFooterContent: true,
    },
    {
      text: "Intervention",
      value: "description",
      hideFooterContent: true,
    },
    { text: "Diesel (in litres)", value: "dieselLiters" },
    { text: "Grid power (kWh)", value: "gridPower" },
    { text: "Renewable (kWh)", value: "renewablePower" },
    { text: "CO2 Emissions", value: "totalCO2Emission" },
    { text: "Change in Emissions", value: "changeInEmission" },
    { text: "", value: "actions", sortable: false, hideFooterContent: true },
  ];

  @Watch("items", { immediate: true, deep: true })
  onItemChange(value: EnergyFacilityInterventionItem[]): void {
    this.localItems = cloneDeep(value);
  }

  public newDefaultItem(): EnergyFacilityInterventionItem {
    return {
      name: "", // existing facility id
      description: "",
      gridPower: 0,
      dieselLiters: 0,
      renewablePower: 0,
      totalCO2Emission: 0,
      changeInEmission: 0,
    };
  }
  public openItemDialog(
    item: EnergyFacilityInterventionItem,
    itemIndex: number
  ): void {
    this.itemIndex = itemIndex;
    this.localItem = item;
    Vue.set(this.dialogs, "intervention-dialog", true);
  }
  public openDuplicateItemDialog(
    item: EnergyFacilityInterventionItem,
    itemIndex: string
  ): void {
    this.itemIndex = itemIndex;
    this.localItem = item;
    Vue.set(this.dialogs, "duplicate-intervention-dialog", true);
  }
  public openDeleteDialog(
    item: EnergyFacilityInterventionItem,
    itemIndex: string
  ): void {
    this.itemIndex = itemIndex;
    this.localItem = item;
    Vue.set(this.dialogs, "delete-intervention-dialog", true);
  }

  public updateWithItem(value: EnergyFacilityInterventionItem): void {
    // use current itemIndex for good measure
    if (this.itemIndex === -1) {
      this.localItems.push(value);
    } else {
      // find real index because array may have been shuffled by something
      const realIndex = this.localItems.findIndex(
        (item: EnergyFacilityInterventionItem) => item.name === this.itemIndex
      );
      if (realIndex !== -1) {
        this.localItems.splice(realIndex, 1, value);
      }
    }
    this.$emit("update:items", this.localItems);
  }
  public duplicateItem(): void {
    const realIndex = this.localItems.findIndex(
      (item: EnergyFacilityInterventionItem) => item.name === this.itemIndex
    );
    if (realIndex !== -1) {
      this.localItems.splice(realIndex, 0, cloneDeep(this.localItem));
      this.localItems.splice(this.localItems.length); // vue trick
      this.$emit("update:items", this.localItems);
    }
  }

  public deleteItem(): void {
    const realIndex = this.localItems.findIndex(
      (item: EnergyFacilityInterventionItem) => item.name === this.itemIndex
    );
    if (realIndex !== -1) {
      this.localItems.splice(realIndex, 1);
      this.$emit("update:items", this.localItems);
    }
  }
}
</script>

<style scoped>
.facilities-footer-like-vuetify {
  font-size: 0.875rem;
  font-weight: bold;
  height: 48px;
  padding: 0 16px;
}
.bold-table-cell-content {
  font-size: 0.875rem;
  font-weight: bold;
}

::v-deep .facilities-negative {
  font-weight: bold;
  font-size: 0.875rem;
  color: red;
}
::v-deep .facilities-positive {
  font-weight: bold;
  font-size: 0.875rem;
  color: green;
}
</style>
