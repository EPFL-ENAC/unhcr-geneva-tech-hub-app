<template>
  <v-container fluid class="shelter__boq">
    <v-row>
      <v-col class="d-flex">
        <h2 class="text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
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
              <v-toolbar flat>
                <v-toolbar-title>Items</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
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
                {{ materialMap[item.formId].form }}
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

            <template #[`item.unitCost`]="{ item }">
              <span>{{ item.unitCost | formatNumber(2, 2) }}</span>
            </template>

            <template #[`item.totalCost`]="{ item }">
              <span>{{ item.totalCost | formatNumber(2, 2) }}</span>
            </template>

            <template #[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    class="better-click mr-2"
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
                    class="better-click mr-2"
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
                    class="better-click mr-2"
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
                    {{ totalCost | formatNumber(2, 2) }}
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
import { Item, Shelter } from "@/store/ShelterInterface";
import { countriesMap } from "@/utils/countriesAsList";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterBillOfQuantitiesModule", [
      "items",
      "isItemDialogOpen",
    ]),
    ...mapGetters("SheltersMaterialModule", ["materialMap"]),
  },
  methods: {
    ...mapActions("ShelterBillOfQuantitiesModule", [
      "setItems",
      "duplicate",
      "openNewItemDialog",
      "openEditItemDialog",
      "deleteItem",
    ]),
    ...mapActions("SheltersMaterialModule", [
      "syncDB",
      "getAllDocs",
      "closeDB",
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

  public get localShelter(): Shelter {
    return cloneDeep(this.shelter);
  }

  public set localShelter(newShelter: Shelter) {
    this.$emit("update:shelter", newShelter);
  }

  items!: Item[];
  isItemDialogOpen!: boolean;
  setItems!: (items: Item[]) => void;
  updateDoc!: (doc: Shelter) => void;
  duplicate!: (item: Item) => void;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<null>;

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
    { text: "Unit", value: "unit" },
    { text: "Quantity", value: "quantity", align: "right" },
    { text: "Unit cost (USD)", value: "unitCost", align: "right" },
    { text: "Total cost (USD)", value: "totalCost", align: "right" },
    { text: "", value: "actions", sortable: false, width: "140px" },
  ];

  public submitForm(): void {
    this.$set(this.localShelter, "items", this.items);
    this.localShelter = Object.assign({}, this.localShelter);
  }

  public autoSubmit(): void {
    this.$store.subscribe((mutation) => {
      const shouldUpdate = [
        "ShelterBillOfQuantitiesModule/ADD_ITEM",
        "ShelterBillOfQuantitiesModule/DELETE_ITEM",
        "ShelterBillOfQuantitiesModule/DUPLICATE_ITEM",
        "ShelterBillOfQuantitiesModule/UPDATE_ITEM",
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

  mounted(): void {
    this.syncDB();
    this.getAllDocs();
  }
  destroyed(): void {
    this.closeDB();
  }
}
</script>

<style lang="scss" scoped>
.shelter__boq tfoot {
  font-weight: bold;
}
</style>
