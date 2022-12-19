<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="name"
    class="elevation-1"
    :hide-default-footer="true"
    :items-per-page="-1"
  >
    <template #top>
      <v-toolbar v-if="!disabled" flat>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          :disabled="disabled"
          @click="() => openItemDialog(newDefaultItem(), -1)"
        >
          New facility
        </v-btn>
        <facility-dialog
          :dialog-open.sync="dialogs['facility-dialog']"
          :item-index="itemIndex"
          :item="localItem"
          :facilities-name="facilitiesName"
          @update:item="updateWithItem"
        />
        <duplicate-facility-dialog
          :dialog-open.sync="dialogs['duplicate-facility-dialog']"
          @duplicate:facility="duplicateItem"
        />
        <delete-facility-dialog
          :dialog-open.sync="dialogs['delete-facility-dialog']"
          @delete:facility="deleteItem"
        />
      </v-toolbar>
    </template>

    <template #[`item.facilityType`]="{ item }">
      {{ facilityTypesMap[item.facilityType] }}
    </template>
    <template #[`item.dieselLiters`]="{ item }">
      <template v-if="item.operatingHours && item.generatorSize">
        ~ {{ getLitres(item) }}
      </template>
      <template v-else>{{ item.dieselLiters | formatNumber }}</template>
    </template>
    <template #[`item.gridPower`]="{ item }">
      {{ item.gridPower | formatNumber }}
    </template>
    <template #[`item.renewablePower`]="{ item }">
      {{ item.renewablePower | formatNumber }}
    </template>
    <template #[`item.totalCO2Emission`]="{ item }">
      <span class="bold-table-cell-content">
        {{ item.totalCO2Emission | formatNumber }}
      </span>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            small
            class="mr-2"
            :disabled="disabled"
            v-on="on"
            @click.stop="() => openItemDialog(item, item.name)"
          >
            <v-icon small class="better-click"> $mdiPencil </v-icon>
          </v-btn>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            small
            class="mr-2"
            :disabled="disabled"
            v-on="on"
            @click.stop="() => openDuplicateItemDialog(item, item.name)"
          >
            <v-icon small class="better-click"> $mdiContentCopy </v-icon>
          </v-btn>
        </template>
        <span>Duplicate</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            small
            class="mr-2"
            :disabled="disabled"
            v-on="on"
            @click.stop="() => openDeleteDialog(item, item.name)"
          >
            <v-icon small class="better-click"> $mdiDelete </v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </template>

    <template #foot="{}">
      <tr>
        <td
          v-for="(header, $index) in headers"
          :key="$index"
          class="facilities-footer-like-vuetify"
        >
          <span v-if="!header.hideFooterContent">
            <span v-if="header.value === 'totalCO2Emission'">
              {{
                results[header.value] |
                  formatNumber({
                    maximumFractionDigits: 0,
                  })
              }}
            </span>
            <span v-else-if="header.value === 'dieselLiters'">
              {{
                results[header.value] |
                  formatNumber({
                    maximumFractionDigits: 0,
                  })
              }}
              ({{ results.dieselPower }} in Kwh)
            </span>
            <span v-else>
              {{
                results[header.value] |
                  formatNumber({
                    maximumFractionDigits: 0,
                  })
              }}
            </span>
          </span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { getLitres } from "@/components/green_house_gaz/energy/computeCO2cost";
import DeleteFacilityDialog from "@/components/green_house_gaz/energy/DeleteFacilityDialog.vue";
import DuplicateFacilityDialog from "@/components/green_house_gaz/energy/DuplicateFacilityDialog.vue";
import { facilityTypes } from "@/components/green_house_gaz/energy/Facility";
import FacilityDialog from "@/components/green_house_gaz/energy/FacilityDialog.vue";
import { EnergyFacilityItem } from "@/store/GhgInterface.vue";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  components: {
    DeleteFacilityDialog,
    FacilityDialog,
    DuplicateFacilityDialog,
  },
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
})
export default class BaselineFacilitiesTable extends Vue {
  @Prop({ type: [Array], default: () => [] })
  readonly items!: EnergyFacilityItem[];

  @Prop({ type: [Object], default: () => ({}) })
  readonly results!: EnergyFacilityItem;

  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean;

  ghgMapRef!: ItemReferencesMap;
  localItems: EnergyFacilityItem[] = [];
  dialogs = {} as Record<string, boolean>;
  defaultItem = {};
  localItem: EnergyFacilityItem = {} as EnergyFacilityItem;
  itemIndex: number | string = -1;
  readonly getLitres = getLitres;

  headers = [
    {
      text: "Name",
      align: "start",
      sortable: false,
      hideFooterContent: true,
      value: "name",
    },
    { text: "Powered by", value: "facilityType", hideFooterContent: true },
    { text: "Total diesel used (litres/yr)", value: "dieselLiters" },
    { text: "Grid power (kWh/yr)", value: "gridPower" },
    { text: "Solar (kW installed per yr)", value: "renewablePower" },
    { text: "CO2 Emissions", value: "totalCO2Emission" },
    { text: "", value: "actions", sortable: false, hideFooterContent: true },
  ];

  @Watch("items", { immediate: true, deep: true })
  onItemChange(value: EnergyFacilityItem[]): void {
    this.localItems = cloneDeep(value);
  }

  public get facilityTypesMap(): Record<string, string> {
    const acc: Record<string, string> = {};
    return facilityTypes.reduce(
      (acc: Record<string, string>, item: Record<string, string>) => {
        acc[item.componentName] = item.name;
        return acc;
      },
      acc
    );
  }

  public get facilitiesName(): string[] {
    return this.localItems.map((item: EnergyFacilityItem) => item.name ?? "");
  }

  public newDefaultItem(): EnergyFacilityItem {
    return {
      name: "",
      facilityType: "DieselGenerators",
      gridPower: 0,
      dieselLiters: 0,
      dieselPower: 0,
      renewablePower: 0,
      totalCO2Emission: 0,
    };
  }
  public openItemDialog(
    item: EnergyFacilityItem,
    itemIndex: string | number
  ): void {
    this.itemIndex = itemIndex;
    this.localItem = item;
    Vue.set(this.dialogs, "facility-dialog", true);
  }
  public openDuplicateItemDialog(
    item: EnergyFacilityItem,
    itemIndex: string
  ): void {
    this.itemIndex = itemIndex;
    this.localItem = item;
    Vue.set(this.dialogs, "duplicate-facility-dialog", true);
  }
  public openDeleteDialog(item: EnergyFacilityItem, itemIndex: string): void {
    this.itemIndex = itemIndex;
    this.localItem = item;
    Vue.set(this.dialogs, "delete-facility-dialog", true);
  }

  public updateWithItem(value: EnergyFacilityItem): void {
    // use current itemIndex for good measure
    if (this.itemIndex === -1) {
      this.localItems.push(value);
    } else {
      // find real index because array may have been shuffled by something
      const realIndex = this.localItems.findIndex(
        (item: EnergyFacilityItem) => item.name === this.itemIndex
      );
      if (realIndex !== -1) {
        this.localItems.splice(realIndex, 1, value);
      }
    }
    this.$emit("update:items", this.localItems);
  }
  public duplicateItem(): void {
    const realIndex = this.localItems.findIndex(
      (item: EnergyFacilityItem) => item.name === this.itemIndex
    );
    if (realIndex !== -1) {
      this.localItems.splice(realIndex, 0, cloneDeep(this.localItem));
      this.localItems.splice(this.localItems.length); // vue trick
      this.$emit("update:items", this.localItems);
    }
  }

  public deleteItem(): void {
    const realIndex = this.localItems.findIndex(
      (item: EnergyFacilityItem) => item.name === this.itemIndex
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
</style>
