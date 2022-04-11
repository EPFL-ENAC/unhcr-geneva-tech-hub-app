<template>
  <v-dialog :value="isItemDialogOpen" @input="setEditDialog" max-width="500px">
    <!-- Not necessary     :readonly="!$can('edit', shelter)"  -->
    <v-form
      ref="form"
      :lazy-validation="false"
      v-model="formValid"
      @submit.prevent="() => submitFn()"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  :items="itemTypes"
                  label="Item type"
                  v-model="localItem.itemType"
                  @input="onItemTypeChange"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                />
              </v-col>
            </v-row>
            <v-row v-if="localItem.itemType === 'Labour'">
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="workerTypes"
                  label="Work type"
                  v-model="localItem.workerType"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="labourUnits"
                  label="Unit"
                  v-model="localItem.unit"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <!-- If Lump Sum then quantity is disabled for the user and default is 1 -->
                <v-text-field
                  v-model.number="localItem.quantity"
                  type="number"
                  label="Quantity"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model.number="localItem.unitCost"
                  type="number"
                  suffix="$"
                  label="Unit cost"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- material form -->
            <v-row v-else-if="localItem.itemType === 'Material'">
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="localItem.name"
                  label="Item name"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <country-select
                  v-model="localItem.source"
                  required
                  :rules="rules"
                  label="Source (country)"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="materials"
                  label="Item type"
                  v-model="localItem.materialId"
                  @input="resetLocalItemFormId"
                  item-text="text"
                  item-value="value"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :disabled="!localItem.materialId"
                  :items="currentMaterialForms"
                  label="Item Form"
                  v-model="localItem.formId"
                  item-text="form"
                  item-value="_id"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4" v-show="false">
                <v-text-field
                  v-model="localItem.unit"
                  label="Units"
                  required
                  :rules="rules"
                  :disabled="true"
                ></v-text-field>
                <!-- temporary disabled of units -->
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model.number="localItem.quantity"
                  type="number"
                  label="Quantity"
                  required
                  suffix="Kg"
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model.number="localItem.unitCost"
                  type="number"
                  suffix="$"
                  label="Unit cost"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <!-- Spec will be below with rebar length width diameter etc  -->
            </v-row>

            <v-row v-else-if="localItem.itemType === 'Other'">
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="localItem.name"
                  label="Item name"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model.number="localItem.quantity"
                  type="number"
                  label="Quantity"
                  required
                  suffix="Pce"
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model.number="localItem.unitCost"
                  type="number"
                  suffix="$"
                  label="Unit cost"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            type="submit"
            :disabled="!formValid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
import { Item, Material, Shelter, Units } from "@/store/ShelterInterface";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import { ShelterTransport } from "@/store/SheltersTransportModule";
import iso3166 from "@/utils/iso3166";
import { VForm } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapGetters("ShelterBillOfQuantitiesModule", [
      "isItemDialogOpen",
      "editedItem",
      "editedIndex",
    ]),
    ...mapGetters("SheltersMaterialModule", [
      "items",
      "materials",
      "materialForms",
      "materialMap",
    ]),
  },
  methods: {
    ...mapActions("ShelterBillOfQuantitiesModule", [
      "saveItem",
      "setItem",
      "setItemToDefaultLabour",
      "setItemToDefaultMaterial",
      "setItemToDefaultOther",
      "closeEditDialog",
      "setEditDialog",
      "setItem",
    ]),
    ...mapActions("SheltersTransportModule", ["syncDB", "getDoc", "closeDB"]),
  },
  components: {
    CountrySelect,
  },
})
export default class DeleteItemDialog extends Vue {
  editedItem!: Item;
  editedIndex!: number;
  isItemDialogOpen!: boolean;
  setItem!: (item: Item) => void;
  saveItem!: (item: Item) => Promise<void>;
  setItemToDefaultLabour!: () => void;
  setItemToDefaultMaterial!: () => void;
  setItemToDefaultOther!: () => void;
  $refs!: {
    form: VForm;
  };
  materials!: string[];
  materialForms!: Record<string, ShelterMaterial[]>;
  materialMap!: Record<string, ShelterMaterial>;
  localItem: Item = {} as Item;
  shelter!: Shelter;

  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getDoc!: (id: string) => Promise<ShelterTransport>;

  formValid = false;
  itemTypes = ["Material", "Labour", "Other"];
  labourUnits = ["Hour", "Day", "Lump sum"];
  workerTypes = ["Skilled", "Unskilled"];

  rules = [(v: string): boolean | string => !!v || `field is required`];

  public get title(): string {
    return this.editedIndex === -1 ? "New item" : "Edit item";
  }
  public async submitFn(): Promise<void> {
    await this.computeCost();
    await this.saveItem(this.localItem);
  }

  public async getTransportFactorForMaterial(
    id: string,
    local: boolean
  ): Promise<number> {
    const shelter = await this.getDoc(id);
    console.log(id, local, shelter.t, shelter.o);
    return local ? shelter.t : shelter.o;
  }

  public async computeCost(): Promise<void> {
    // side effect function: TODO: transform to pure function and move to utils
    const { quantity, formId, unit, unitCost } = this.localItem as Material;
    const newValue = cloneDeep(this.localItem) as Material;
    if (formId && quantity && unit) {
      const { embodied_carbon, embodied_water, density, local } =
        this.materialMap[formId];

      // maybe use dimensions instead of quantity... but later
      let weight = 0;
      if (unit === Units.KG) {
        weight = quantity;
      } else {
        const volume = 0; // TODO : use form function to compute volume based on predefined format
        weight = density * volume;
      }
      newValue.weight = weight;

      newValue.embodiedCarbonProduction = weight * embodied_carbon;
      newValue.embodiedWater = weight * embodied_water;
      if (newValue.source && this.shelter.location_country) {
        const src = iso3166[newValue.source as string];
        const dst = iso3166[this.shelter.location_country];
        const request_id = `${src}_${dst}`;
        const country_src_dst_embodied_carbon =
          await this.getTransportFactorForMaterial(request_id, local);
        newValue.embodiedCarbonTransport =
          weight * country_src_dst_embodied_carbon;
      } else {
        newValue.embodiedCarbonTransport = -1; // should have a src and dst
      }
      newValue.embodiedCarbonTotal =
        newValue.embodiedCarbonProduction + newValue.embodiedCarbonTransport;
    }
    if (quantity && unitCost) {
      // compute totalCost
      newValue.totalCost = quantity * unitCost;
    }
    this.localItem = newValue;
  }

  private isMaterial(object: unknown): object is Material {
    return (
      Object.prototype.hasOwnProperty.call(object, "materialId") &&
      Object.prototype.hasOwnProperty.call(object, "formId")
    );
  }

  public get currentMaterialForms(): ShelterMaterial[] {
    if (this.isMaterial(this.localItem) && this.localItem.materialId) {
      return this.materialForms[this.localItem.materialId];
    }
    return [] as ShelterMaterial[];
  }

  public resetLocalItemFormId(): void {
    const clone = cloneDeep(this.localItem) as Material;
    clone.formId = "";
    this.localItem = clone;
    this.validate();
  }

  public validate(): void {
    this.$refs.form.validate();
  }
  public reset(): void {
    this.$refs.form.reset();
  }
  public resetValidation(): void {
    this.$refs.form.resetValidation();
  }

  onItemTypeChange(newValue: string): void {
    if (newValue === "Labour") {
      this.setItemToDefaultLabour();
    } else if (newValue === "Material") {
      this.setItemToDefaultMaterial();
    } else if (newValue === "Other") {
      this.setItemToDefaultOther();
    }
    // set default country
    this.localItem.source = this.shelter.location_country;
    this.validate();
  }

  private setLocalItem(value: Item) {
    if (value) {
      // thanks typescript
      this.localItem = cloneDeep(value);
    }
  }

  public syncLocalItem(): void {
    // init function
    this.setLocalItem(this.editedItem);

    this.$store.subscribe((mutation) => {
      const shouldUpdate = [
        "ShelterBillOfQuantitiesModule/SET_EDITED_ITEM",
        "ShelterBillOfQuantitiesModule/RESET_EDITED_ITEM",
      ];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalItem(this.editedItem);
      }
    });
  }

  created(): void {
    this.syncLocalItem();
  }

  mounted(): void {
    this.syncDB();
  }
  destroyed(): void {
    this.closeDB();
  }
}
</script>

<style></style>
