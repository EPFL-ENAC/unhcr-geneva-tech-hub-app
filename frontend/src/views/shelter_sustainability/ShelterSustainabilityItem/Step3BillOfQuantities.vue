<template>
  <v-form
    :readonly="!$can('edit', shelter)"
    v-if="shelter"
    @submit.prevent="() => submitForm()"
  >
    <v-container fluid>
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">Items</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-sheet elevation="2" rounded v-if="items">
            <!-- {{ items }} {{ isItemDialogOpen }} -->
            <v-data-table
              :headers="headers"
              :items="items"
              sort-by="name"
              class="elevation-1"
            >
              <template v-slot:top>
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
              <template v-slot:item.name="{ item }">
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
              <template v-slot:item.source="{ item }">
                <!-- todo default value for source for Labour/Other set to shelter default country  -->
                {{ item.source }}
              </template>
              <template v-slot:item.formId="{ item }">
                <!-- todo default value for source for Labour/Other set to shelter default country  -->
                <span v-if="item.itemType === 'Material'">{{
                  materialMap[item.formId].form
                }}</span>
                <span v-else>--</span>
              </template>

              <template v-slot:item.materialId="{ item }">
                <!-- todo default value for source for Labour/Other set to shelter default country  -->
                <span v-if="item.itemType === 'Material'">{{
                  item.materialId
                }}</span>
                <span v-else>--</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="openEditItemDialog(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="() => openDeleteDialog(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row v-if="$can('edit', shelter)">
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import DeleteItemDialog from "@/components/shelter_sustainability/billOfQuantities/DeleteItemDialog.vue";
import ItemDialog from "@/components/shelter_sustainability/billOfQuantities/ItemDialog.vue";
import { Item, Shelter } from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapGetters("ShelterBillOfQuantitiesModule", [
      "items",
      "isItemDialogOpen",
    ]),
    ...mapGetters("GhgReferenceModule", ["materialMap"]),
  },
  methods: {
    ...mapActions("ShelterModule", ["updateDoc"]),
    ...mapActions("ShelterBillOfQuantitiesModule", [
      "setItems",
      "openNewItemDialog",
      "openEditItemDialog",
      "openDeleteDialog",
    ]),
  },
  components: {
    DeleteItemDialog,
    ItemDialog,
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  items!: Item[];
  isItemDialogOpen!: boolean;
  setItems!: (items: Item[]) => void;
  updateDoc!: (doc: Shelter) => void;

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
    { text: "Quantity", value: "quantity" },
    { text: "Unit", value: "unit" },
    { text: "Unit cost", value: "unitCost" },
    { text: "Total cost", value: "totalCost" },
    { text: "", value: "actions", sortable: false },
  ];

  public submitForm(): void {
    const localShelter = cloneDeep(this.shelter);
    localShelter.items = this.items;
    this.updateDoc(localShelter);
  }
  // localItems is in the store

  public setLocalShelter(shelter: Shelter): void {
    this.setItems(cloneDeep(shelter?.items ?? []));
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter(this.shelter);

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["ShelterModule/SET_SHELTER"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter(mutation.payload);
      }
    });
  }

  created(): void {
    this.syncLocalShelter();
  }
}
</script>
