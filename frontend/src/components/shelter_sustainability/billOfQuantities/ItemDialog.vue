<template>
  <v-dialog :value="isItemDialogOpen" max-width="500px" @input="setEditDialog">
    <!-- Not necessary     :readonly="!$can('edit', shelter)"  -->
    <v-form
      ref="form"
      v-model="formValid"
      :lazy-validation="false"
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
                  v-model="localItem.itemType"
                  :items="itemTypes"
                  label="Item type"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                  @input="onItemTypeChange"
                />
              </v-col>
            </v-row>
            <v-row v-if="localItem.itemType === 'Labour'">
              <v-col cols="12">
                <v-select
                  v-model="localItem.workerType"
                  :items="workerTypes"
                  label="Work type"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                />
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
                  label="Source country"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  v-model="localItem.materialId"
                  :items="materials"
                  label="Material"
                  item-text="text"
                  item-value="value"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                  @input="resetLocalItemFormId"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  v-model="localItem.formId"
                  :disabled="!localItem.materialId"
                  :items="currentMaterialForms"
                  label="Form"
                  item-text="form"
                  item-value="_id"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                  @change="resetUnitAndQuantity"
                />
              </v-col>
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
            </v-row>
            <!-- Unit and Quantity for Labour/Material/Other-->
            <v-row v-if="localItem.itemType">
              <v-col v-if="!itemUnitsDisabled" cols="12" sm="6" md="6">
                <v-select
                  v-model="localItem.unit"
                  :disabled="itemUnitsDisabled"
                  :items="itemUnits"
                  label="Unit"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                  @change="onUnitChange"
                >
                  <template v-slot:item="{ item }">
                    {{ UnitsRef[item] || item }}
                  </template>
                  <template v-slot:selection="{ item }">
                    {{ UnitsRef[item] || item }}
                  </template>
                </v-select>
              </v-col>
              <v-col
                v-if="!itemUnitsDisabled && localItem.itemType !== 'Material'"
                cols="12"
                sm="6"
                md="6"
              >
                <!-- If Lump sum then quantity is disabled for the user and default is 1 -->
                <v-text-field
                  v-model.number="localItem.quantity"
                  type="number"
                  label="Quantity"
                  required
                  :disabled="itemQuantityDisabled"
                  :suffix="quantitySuffix"
                  :rules="rules"
                  @change="computeCost"
                ></v-text-field>
              </v-col>

              <!-- dynamic component for Material depending on currentFormula unit + shape -->
              <!-- <div v-if="localItem.itemType === 'Material' && shapeItems"> -->

              <v-col
                v-for="(shapeItem, $index) in shapeItems"
                v-else
                :key="$index"
                cols="6"
                xs="12"
              >
                <form-item-component
                  v-if="shapeItem.key === 'specification'"
                  v-model="localItem[shapeItem.key]"
                  v-bind="shapeItem"
                  :options="currentParameters"
                  @input="computeCost"
                />
                <form-item-component
                  v-else
                  v-model="localItem[shapeItem.key]"
                  v-bind="shapeItem"
                  :suffix="
                    shapeItem.key === 'quantity'
                      ? quantitySuffix
                      : shapeItem.suffix
                  "
                  @input="computeCost"
                />
              </v-col>
              <!-- </v-row> -->
              <!-- end of dynamic component -->
            </v-row>

            <!-- Unit cost and Item cost -->
            <v-row v-if="localItem.itemType && localItem.quantity">
              <v-col cols="6">
                <v-text-field
                  v-model.number="localItem.unitCost"
                  type="number"
                  suffix="$"
                  :label="`Unit cost per ${quantityUnitSuffix}`"
                  required
                  :rules="rules"
                  @input="computeCost"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <!-- for show only should not be changed depends on unitCost * quantity -->
                <v-text-field
                  :value="localItem.totalCost | formatNumber"
                  suffix="$"
                  :disabled="true"
                  label="Item cost"
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
import {
  FormItem,
  SelectOption,
  SelectValue,
} from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import {
  FormTypeMaterial,
  Item,
  Labour,
  Material,
  materialFunctions,
  materialsInputs,
  otherUnits,
  Shelter,
  UnitsMaterial,
  UnitsRef,
} from "@/store/ShelterInterface";
import { ShelterMaterial } from "@/store/SheltersMaterialModule";
import { ShelterTransport } from "@/store/SheltersTransportModule";
import { iso3166_2_to_3 } from "@/utils/iso3166";
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
    ...mapActions("SheltersTransportModule", ["getAllDocs", "getDoc"]),
  },
  components: {
    CountrySelect,
    FormItemComponent,
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

  getAllDocs!: () => Promise<ShelterTransport[]>;
  getDoc!: (id: string) => Promise<ShelterTransport>;

  formValid = false;
  itemTypes = ["Material", "Labour", "Other"];
  labourUnits = ["Hour", "Day", "Lump sum"];
  otherUnits = otherUnits;
  workerTypes = ["Skilled", "Unskilled"];

  rules = [(v: string): boolean | string => !!v || `Required`];

  public get title(): string {
    return this.editedIndex === -1 ? "New item" : "Edit item";
  }

  readonly pluralRules = new Intl.PluralRules("en-US");
  readonly UnitsRef = UnitsRef;
  private pluralize(count: number, singular: string, plural: string) {
    const grammaticalNumber = this.pluralRules.select(count);
    switch (grammaticalNumber) {
      case "one":
        return singular;
      case "other":
        return plural;
      default:
        throw new Error("Unknown: " + grammaticalNumber);
    }
  }

  public get quantitySuffix(): string {
    if (this.localItem.itemType === "Labour") {
      const item = this.localItem as Labour;
      if (item.unit) {
        return this.pluralize(
          this.localItem.quantity ?? 0,
          item.unit,
          item.unit + "s"
        );
      }
    }
    if (
      this.localItem.itemType === "Material" ||
      this.localItem.itemType === "Other"
    ) {
      const item = this.localItem as Material;
      const unitName = UnitsRef[item.unit as UnitsMaterial];
      if (item.unit === "PCE") {
        return this.pluralize(
          this.localItem.quantity ?? 0,
          unitName,
          unitName + "s"
        );
      }
      return unitName;
    }
    return "";
  }

  public get quantityUnitSuffix(): string {
    if (this.localItem.itemType === "Labour") {
      const item = this.localItem as Labour;
      if (item.unit) {
        return item.unit.toLowerCase();
      }
    }
    const item = this.localItem as Material;
    return UnitsRef[item.unit as UnitsMaterial].toLowerCase();
  }

  public get itemUnits(): string[] {
    if (this.localItem.itemType === "Labour") {
      return this.labourUnits;
    }

    if (this.localItem.itemType === "Material") {
      return this.currentItem?.units ?? [];
    }
    if (this.localItem.itemType === "Other") {
      return this.otherUnits;
    }
    return [];
  }
  public get itemUnitsDisabled(): boolean {
    if (this.localItem.itemType === "Material") {
      const item = this.localItem as Material;
      return !item.formId;
    }
    return false;
  }

  public get itemQuantityDisabled(): boolean {
    if (this.localItem.itemType === "Labour") {
      const item = this.localItem as Labour;
      return item.unit === "Lump sum";
    }
    if (this.localItem.itemType === "Material") {
      const item = this.localItem as Material;
      return !item.unit;
    }
    return false;
  }

  public get shapeItems(): FormItem[] {
    // depends on currentFormula
    if (this.currentFormula) {
      return materialsInputs[this.currentFormula] ?? [];
    }
    return [];
  }

  public onUnitChange(unit: string): void {
    if (unit === "Lump sum") {
      this.localItem.quantity = 1;
      this.$set(this.localItem, "quantity", 1);
    }
    this.computeCost();
  }

  public resetUnitAndQuantity(): void {
    delete this.localItem.quantity;
    delete this.localItem.unit;
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
    return local ? shelter.t : shelter.o;
  }
  public get currentItem(): ShelterMaterial | undefined {
    if (this.localItem.itemType === "Material") {
      const item = this.localItem as Material;
      if (item.formId) {
        return this.materialMap[item.formId];
      }
    }

    return undefined;
  }

  public get currentParameters(): SelectOption<SelectValue>[] {
    if (this.currentItem && this.currentItem.parameters) {
      const params = this.currentItem.parameters;
      return Object.keys(this.currentItem.parameters).reduce(
        (acc, key: string) => {
          acc.push({
            text: key,
            value: params[key],
          });
          return acc;
        },
        [] as SelectOption<SelectValue>[]
      );
    }
    return [];
  }

  public get currentFormula(): FormTypeMaterial | undefined {
    const special = ["M", "M2", "PCE"];
    if (this.localItem.itemType === "Material") {
      const item = this.localItem as Material;
      const { shape } = this.currentItem ?? { shape: "UNDEFINED" };
      if (item.formId && shape) {
        if (item.unit && special.indexOf(item.unit) !== -1) {
          return `${item.unit}_${shape}` as FormTypeMaterial;
        }
        return item.unit as FormTypeMaterial;
      }
    }

    return undefined;
  }

  public async computeCost(): Promise<void> {
    try {
      // side effect function: TODO: transform to pure function and move to utils
      const { quantity, formId, unit, unitCost } = this.localItem as Material;
      const newValue = cloneDeep(this.localItem) as Material;
      if (formId && quantity && unit) {
        const { embodied_carbon, embodied_water, density, local } =
          this.materialMap[formId];
        // compute real weight below
        let weight = 0;
        if (this.currentFormula) {
          const item = this.localItem as Material;
          let finalDensity = density;
          if (item.specification) {
            finalDensity = item.specification;
          }
          weight = materialFunctions[this.currentFormula](item, finalDensity);
        }
        newValue.weight = weight;

        newValue.embodiedCarbonProduction = weight * embodied_carbon;
        newValue.embodiedWater = weight * embodied_water;
        newValue.embodiedCarbonTransport = 0;
        try {
          if (newValue.source && this.shelter.location_country) {
            const src =
              iso3166_2_to_3[newValue.source as keyof typeof iso3166_2_to_3];
            const dst =
              iso3166_2_to_3[
                this.shelter.location_country as keyof typeof iso3166_2_to_3
              ];
            const request_id = `${src}_${dst}`;
            const country_src_dst_embodied_carbon =
              await this.getTransportFactorForMaterial(request_id, local);
            newValue.embodiedCarbonTransport =
              weight * country_src_dst_embodied_carbon;
          }
        } catch (e) {
          console.error(e);
        }
        newValue.embodiedCarbonTotal =
          newValue.embodiedCarbonProduction + newValue.embodiedCarbonTransport;
      }
      if (quantity && unitCost) {
        // compute totalCost
        newValue.totalCost = quantity * unitCost;
      } else {
        newValue.totalCost = 0;
      }
      this.localItem = newValue;
    } catch (e) {
      console.error(e);
    }
  }

  private isMaterial(object: unknown): object is Material {
    return (
      Object.prototype.hasOwnProperty.call(object, "materialId") &&
      Object.prototype.hasOwnProperty.call(object, "formId")
    );
  }

  public get currentMaterialForms(): ShelterMaterial[] {
    if (this.isMaterial(this.localItem) && this.localItem.materialId) {
      const result = cloneDeep(this.materialForms[this.localItem.materialId]);
      result.sort((a, b) => a.form.localeCompare(b.form));
      return result;
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
    this.getAllDocs();
  }
}
</script>

<style></style>
