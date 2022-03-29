<template>
  <v-dialog :value="isItemDialogOpen" @input="setEditDialog" max-width="500px">
    <!-- Not necessary     :readonly="!$can('edit', shelter)"  -->
    <v-form
      ref="form"
      :lazy-validation="false"
      v-model="formValid"
      @submit.prevent="() => saveItem(localItem)"
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
                  v-model="localItem.unitCost"
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
                  @input="onFormSelect"
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
                <!-- If Lump Sum then quantity is disabled for the user and default is 1 -->
                <v-text-field
                  v-model.number="localItem.quantity"
                  @input="onQuantityChange"
                  type="number"
                  label="Quantity"
                  required
                  suffix="Kg"
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="localItem.unitCost"
                  type="number"
                  suffix="$"
                  label="Unit cost"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <!-- Spec will be below with rebar length width diameter etc  -->
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
import {
  Item,
  Material,
  MaterialReferenceData,
  Units,
} from "@/store/ShelterInterface";
import { VForm } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterBillOfQuantitiesModule", [
      "isItemDialogOpen",
      "editedItem",
      "editedIndex",
    ]),
    ...mapGetters("GhgReferenceModule", [
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
      "closeEditDialog",
      "setEditDialog",
      "setItem",
    ]),
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
  setItemToDefaultLabour!: () => void;
  setItemToDefaultMaterial!: () => void;
  $refs!: {
    form: VForm;
  };
  materials!: string[];
  materialForms!: Record<string, MaterialReferenceData[]>;
  materialMap!: Record<string, MaterialReferenceData>;
  localItem: Item = {} as Item;

  formValid = false;
  itemTypes = ["Labour", "Material"];
  labourUnits = ["Hour", "Day", "Lump sum"];
  workerTypes = ["Skilled", "Unskilled"];

  rules = [(v: string): boolean | string => !!v || `field is required`];

  public get title(): string {
    return this.editedIndex === -1 ? "New item" : "Edit item";
  }
  public onFormSelect(): void {
    this.computeEmbodied();
  }

  public onQuantityChange(): void {
    this.computeEmbodied();
  }

  public computeEmbodied(): void {
    const { quantity, formId, unit } = this.localItem as Material;
    if (formId && quantity) {
      const { embodied_carbon, embodied_water, density } =
        this.materialMap[formId];

      // maybe use dimensions instead of quantity... but later
      let weight = 0;
      if (unit === Units.KG) {
        weight = quantity;
      } else {
        const volume = 0; // TODO : fixme with form functions
        weight = density * volume;
      }
      const newValue = this.localItem as Material;
      newValue.embodiedCarbon = weight * embodied_carbon;
      newValue.embodiedWater = weight * embodied_water;
      this.localItem = newValue;
    }
  }

  private isMaterial(object: unknown): object is Material {
    return (
      Object.prototype.hasOwnProperty.call(object, "materialId") &&
      Object.prototype.hasOwnProperty.call(object, "formId")
    );
  }

  public get currentMaterialForms(): MaterialReferenceData[] {
    if (this.isMaterial(this.editedItem) && this.editedItem.materialId) {
      return this.materialForms[this.editedItem.materialId];
    }
    return [] as MaterialReferenceData[];
  }

  public resetLocalItemFormId(): void {
    const clone = cloneDeep(this.localItem) as Material;
    clone.formId = undefined;
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
    }
    this.setLocalItem();
    this.validate();
  }

  @Watch("localItem", { deep: true })
  onLocalItemChange(newValue: Item): void {
    if (newValue) {
      this.setItem(newValue);
    }
  }

  private setLocalItem() {
    this.localItem = cloneDeep(this.editedItem);
  }

  mounted(): void {
    this.setLocalItem();
  }
}
</script>

<style></style>
