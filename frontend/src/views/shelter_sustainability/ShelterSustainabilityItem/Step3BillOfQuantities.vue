<template>
  <v-form
    :readonly="!$can('edit', localShelter)"
    v-if="localShelter"
    @submit.prevent="() => submitForm(localShelter)"
  >
    <v-container fluid>
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Items
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-sheet elevation="2" rounded v-if="localShelter">
            <!-- <v-container fluid>
              <v-row>
                <v-col> -->
            <v-data-table
              :headers="headers"
              :items="materials"
              sort-by="name"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Items</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        New item
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">New Item</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.name"
                                label="Item name"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.source"
                                label="Source (country)"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                :items="materialTypes"
                                label="Item type"
                                v-model="editedItem.type"
                                item-text="text"
                                item-value="value"
                                name="type"
                                type="string"
                                required
                              />
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                :disabled="!editedItem.type"
                                :items="materialFormPossible[editedItem.type]"
                                label="Item Form"
                                v-model="editedItem.form"
                                item-text="text"
                                item-value="value"
                                name="type"
                                type="string"
                                required
                              />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.unit"
                                label="Units"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model.number="editedItem.dimensions.PCE"
                                label="Pieces"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model.number="editedItem.dimensions.Length"
                                label="Length"
                                type="number"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save">
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >Are you sure you want to delete this
                        item?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <!-- /need to find something there. -->
              <!-- <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template> -->
              <!-- <template v-slot:no-data>
                <v-btn color="primary" @click="initialize"> Reset </v-btn>
              </template> -->
            </v-data-table>
            <!-- </v-col>
              </v-row>
            </v-container> -->
          </v-sheet>
        </v-col>
      </v-row>
      <v-row v-if="$can('edit', localShelter)">
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {
  Material,
  MaterialDimensions,
  materialsForm,
  OMaterial,
  Shelter,
  Units,
} from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterItemModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterItemModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  materialTypes = Object.keys(OMaterial).map((key) => ({
    value: key,
    text: OMaterial[key],
  }));

  materialFormPossible = materialsForm;
  dialog = false;
  dialogDelete = false;
  headers = [
    {
      text: "Name",
      align: "start",
      sortable: false,
      value: "name",
    },
    { text: "Source", value: "source" },
    { text: "Material", value: "type" },
    { text: "Form", value: "form" },
    { text: "Unit", value: "unit" },
    { text: "Dimensions", value: "dimensions", sortable: false },
  ];
  materials = [];
  editedIndex = -1;
  editedItem = {
    name: "",
    source: "",
    type: "",
    form: "",
    unit: Units.PCE,
    dimensions: { PCE: 3 } as MaterialDimensions,
  } as Material;

  defaultItem = {
    name: "",
    source: 0,
    type: 0,
    form: 0,
    unit: 0,
    dimensions: {},
  };

  localShelter = {} as Shelter;

  public setLocalShelter(): void {
    if (!this.shelter) {
      this.localShelter = {} as Shelter;
    } else {
      this.localShelter = cloneDeep(this.shelter);
    }
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["ShelterItemModule/SET_SHELTER"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter();
      }
    });
  }

  created(): void {
    this.syncLocalShelter();
  }

  public submitForm(value: Shelter): void {
    if (value.name !== "") {
      this.updateDoc(value);
    } else {
      console.error("please send a valid document");
    }
  }

  public editItem(item: Material): void {
    console.log("Edit item", item);
    // this.editedIndex = this.materials.indexOf(item);
    // this.editedItem = Object.assign({} as Material, item);
    this.dialog = true;
  }

  public deleteItem(item: Material): void {
    console.log(item);
    // this.editedIndex = this.materials.indexOf(item);
    // this.editedItem = Object.assign({}, item);
    // this.dialogDelete = true;
  }

  public deleteItemConfirm(): void {
    this.materials.splice(this.editedIndex, 1);
    this.closeDelete();
  }

  public close(): void {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({} as Material, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  public closeDelete(): void {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({} as Material, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  public save(): void {
    // if (this.editedIndex > -1) {
    //   Object.assign(this.materials[this.editedIndex], this.editedItem);
    // } else {
    //   this.materials.push(this.editedItem);
    // }
    console.log("SAVE");
    this.close();
  }
}
</script>
