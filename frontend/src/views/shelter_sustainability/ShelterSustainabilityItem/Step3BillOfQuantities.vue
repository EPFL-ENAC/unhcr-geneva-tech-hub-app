<template>
  <v-container fluid class="shelter__boq">
    <v-row v-if="$router.currentRoute.name === 'ShelterSustainabilityStep3'">
      <v-col class="d-flex justify-space-between boq-custom-title">
        <div class="d-flex flex-row">
          <h2 class="project__h3 font-weight-medium">
            {{ infoTooltipText[$route.name].title }}
            <span class="d-none d-print-inline-block"
              >( Number of shelters: {{ items_individual_shelter }} )</span
            >
          </h2>
          <info-tooltip>
            {{ infoTooltipText[$route.name].text }}
          </info-tooltip>
        </div>
        <v-btn class="d-print-none" @click="printFunction()"
          >Export Bill of Quantities pdf</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="d-print-none">
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="d-print-none">
      <v-col>
        <v-banner>
          <h2 class="py-3">Scope</h2>
          <p>
            Number of individual shelters covered by the Bill of Quantities.
          </p>
          <template #actions>
            <v-text-field
              :value="items_individual_shelter"
              label="Number of individual shelters"
              type="number"
              :min="1"
              @change="individualShelterChange"
            ></v-text-field>
          </template>
        </v-banner>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet v-if="items" elevation="2" rounded>
          <v-data-table
            :headers="headers"
            :items="items"
            sort-by="name"
            class="elevation-1"
            hide-default-footer
            :items-per-page="-1"
          >
            <template #top>
              <v-toolbar flat class="d-print-none">
                <v-toolbar-title>Items</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  dark
                  class="d-print-none mb-2"
                  @click="openNewItemDialog"
                >
                  New item
                </v-btn>
                <item-dialog />
                <delete-item-dialog />
              </v-toolbar>
            </template>
            <template #[`item.name`]="{ item }">
              <span v-if="item.itemType === 'Labour'"
                >{{ item.itemType }} ({{ item.workerType }})
              </span>
              <span v-else-if="item.itemType === 'Material'">{{
                item.name
              }}</span>
              <span v-else-if="item.itemType === 'Other'"
                >Other ({{ item.name }})</span
              >
            </template>
            <template #[`item.source`]="{ item }">
              <span v-if="countriesMap[item.source]">
                {{ countriesMap[item.source].name }}
              </span>
              <span v-else>
                {{ item.source }}
              </span>
            </template>
            <template #[`item.formId`]="{ item }">
              <span
                v-if="item.itemType === 'Material' && materialMap[item.formId]"
              >
                <span v-if="materialMap[item.formId].form === '..'">
                  {{ materialMap[item.formId].material }}
                </span>
                <span v-else>{{ materialMap[item.formId].form }}</span>
              </span>
              <span v-else-if="item.materialId === 'Other'">{{
                item.formId
              }}</span>
              <span v-else>--</span>
            </template>

            <template #[`item.materialId`]="{ item }">
              <span v-if="item.itemType === 'Material'">{{
                item.materialId
              }}</span>
              <span v-else>--</span>
            </template>

            <template #[`item.quantity`]="{ item }">
              <span>{{ item.quantity | formatNumber }}</span>
            </template>

            <template #[`item.unit`]="{ item }">
              <span>{{ UnitsRef[item.unit] || item.unit }}</span>
            </template>

            <template #[`item.unitCost`]="{ item }">
              <span>{{
                item.unitCost |
                  formatNumber({
                    minimumFractionDigits: 2,
                  })
              }}</span>
            </template>

            <template #[`item.totalCost`]="{ item }">
              <span>{{
                item.totalCost |
                  formatNumber({
                    minimumFractionDigits: 2,
                  })
              }}</span>
            </template>

            <template #[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    class="better-click mr-2 d-print-none"
                    small
                    v-on="on"
                    @click.stop="() => openEditItemDialog(item)"
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
                    class="better-click mr-2 d-print-none"
                    small
                    v-on="on"
                    @click.stop="() => duplicate(item)"
                  >
                    <v-icon small class="better-click">
                      $mdiContentCopy
                    </v-icon>
                  </v-btn>
                </template>
                <span>Duplicate</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    class="better-click mr-2 d-print-none"
                    small
                    v-on="on"
                    @click.stop="() => deleteItem(item)"
                  >
                    <v-icon small class="better-click"> $mdiDelete </v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </template>
            <template v-if="totalCost != 0" #foot>
              <tfoot>
                <tr>
                  <td colspan="1">Total</td>
                  <td colspan="6"></td>
                  <td colspan="1" class="text-right">
                    {{
                      totalCost |
                        formatNumber({
                          minimumFractionDigits: 2,
                        })
                    }}
                  </td>
                  <td colspan="1"></td>
                </tr>
                <tr>
                  <td colspan="1">Total per Shelter</td>
                  <td colspan="6"></td>
                  <td colspan="1" class="text-right">
                    {{
                      (totalCost / items_individual_shelter) |
                        formatNumber({
                          minimumFractionDigits: 2,
                        })
                    }}
                  </td>
                  <td colspan="1"></td>
                </tr>
              </tfoot>
            </template>
          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import DeleteItemDialog from "@/components/shelter_sustainability/billOfQuantities/DeleteItemDialog.vue";
import ItemDialog from "@/components/shelter_sustainability/billOfQuantities/ItemDialog.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { Item, Shelter, UnitsRef } from "@/store/ShelterInterface";
import { countriesMap } from "@/utils/countriesAsList";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterBillOfQuantitiesModule", [
      "items",
      "items_individual_shelter",
      "isItemDialogOpen",
    ]),
    ...mapGetters("SheltersMaterialModule", ["materialMap"]),
  },
  methods: {
    ...mapActions("ShelterBillOfQuantitiesModule", [
      "setItems",
      "setItemsIndividualShelter",
      "duplicate",
      "openNewItemDialog",
      "openEditItemDialog",
      "deleteItem",
    ]),
  },
  components: {
    DeleteItemDialog,
    ItemDialog,
    InfoTooltip,
  },
})
/** Project */
export default class Step3Materials extends Vue {
  @Prop({ type: [Object], required: true })
  shelter!: Shelter;
  items_individual_shelter!: number;
  items!: Item[];
  isItemDialogOpen!: boolean;
  setItems!: (items: Item[]) => void;
  setItemsIndividualShelter!: (v: number) => void;
  updateDoc!: (doc: Shelter) => void;
  duplicate!: (item: Item) => void;

  public get localShelter(): Shelter {
    return cloneDeep(this.shelter);
  }

  public set localShelter(newShelter: Shelter) {
    this.$emit("update:shelter", newShelter);
  }
  public individualShelterChange(value: string): void {
    const valueInteger = parseInt(value, 10);
    if (this.items_individual_shelter !== valueInteger) {
      this.setItemsIndividualShelter(valueInteger);
    }
  }
  public printFunction() {
    document.title = " ";
    try {
      // https://stackoverflow.com/questions/31171099/window-print-does-not-work-in-safari
      if (!document.execCommand("print", false, undefined)) {
        window.print();
      }
    } catch {
      window.print();
    }
  }

  readonly UnitsRef = UnitsRef;
  countriesMap = countriesMap;
  infoTooltipText = infoTooltipText;
  headers = [
    {
      text: "Name",
      align: "start",
      sortable: false,
      value: "name",
    },
    { text: "Origin", value: "source" },
    { text: "Material", value: "materialId" },
    { text: "Form", value: "formId" },
    { text: "Quantity", value: "quantity", align: "right", sortable: false },
    { text: "Unit", value: "unit", sortable: false },
    {
      text: "Unit cost (USD)",
      value: "unitCost",
      align: "right",
      sortable: false,
    },
    {
      text: "Item cost (USD)",
      value: "totalCost",
      align: "right",
      sortable: false,
    },
    {
      text: "",
      class: "d-print-none",
      cellClass: "d-print-none",
      value: "actions",
      sortable: false,
      width: "140px",
    },
  ];

  public submitForm(): void {
    this.$set(this.localShelter, "items", this.items);
    this.$set(
      this.localShelter,
      "items_individual_shelter",
      this.items_individual_shelter
    );
    this.localShelter = Object.assign({}, this.localShelter);
  }

  public autoSubmit(): void {
    this.$store.subscribe((mutation) => {
      const shouldUpdate = [
        "ShelterBillOfQuantitiesModule/ADD_ITEM",
        "ShelterBillOfQuantitiesModule/DELETE_ITEM",
        "ShelterBillOfQuantitiesModule/DUPLICATE_ITEM",
        "ShelterBillOfQuantitiesModule/UPDATE_ITEM",
        "ShelterBillOfQuantitiesModule/SET_ITEMS_INDIVIDUAL_SHELTER",
      ];
      if (shouldUpdate.includes(mutation.type)) {
        this.submitForm();
      }
    });
  }

  public get totalCost(): number {
    return this.items.reduce((acc: number, item: Item) => {
      return acc + item.totalCost;
    }, 0);
  }

  created(): void {
    this.autoSubmit();
  }
}
</script>

<style lang="scss">
.shelter__boq tfoot {
  font-weight: bold;
}

@media print {
  @page {
    size: landscape;
  }
  .elevation-1 > .v-data-table__wrapper > table > thead > tr > th,
  .elevation-1 > .v-data-table__wrapper > table > tbody > tr > td,
  .elevation-1 > .v-data-table__wrapper > table > tfoot > tr > td {
    height: 20px;
    font-size: 6pt;
  }
  .boq-custom-title {
    padding-bottom: 0px;
    padding-top: 0px;
  }
  // https://stackoverflow.com/questions/274149/repeat-table-headers-in-print-mode
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
    break-inside: auto;
  }
}
</style>
