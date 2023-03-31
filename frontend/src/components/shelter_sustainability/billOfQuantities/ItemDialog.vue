<template>
  <v-dialog :value="isItemDialogOpen" max-width="550px" @input="setEditDialog">
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
                  :items="materialsWithoutOther"
                  label="Material"
                  item-text="text"
                  item-value="value"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                  @input="resetLocalItemFormId"
                >
                  <template #label>
                    <div
                      v-if="localItem.materialId === 'Other'"
                      class="v-select__selection v-select__selections"
                    >
                      Other
                    </div>
                    <div v-else>Material</div>
                  </template>
                  <template #append-item>
                    <v-divider class="mb-2"></v-divider>
                    <v-list-item
                      ripple
                      :class="`${
                        localItem.materialId === 'Other'
                          ? ' v-list-item primary--text v-list-item--active v-list-item--link theme--light v-list-item--highlighted'
                          : ''
                      }`"
                      @mousedown.prevent
                      @click="toggleOtherMaterial"
                    >
                      <v-list-item-content> Other </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
              <v-col
                v-if="localItem.materialId !== 'Other'"
                cols="12"
                sm="6"
                md="6"
              >
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
                >
                  <template #label>
                    <div
                      v-if="localItem.formId === 'Other'"
                      class="v-select__selection v-select__selections"
                    >
                      Other
                    </div>
                    <div v-else>Form</div>
                  </template>
                  <template #append-item>
                    <v-divider class="mb-2"></v-divider>
                    <v-list-item
                      ripple
                      :class="`${
                        localItem.formId === 'Other'
                          ? ' v-list-item primary--text v-list-item--active v-list-item--link theme--light v-list-item--highlighted'
                          : ''
                      }`"
                      @mousedown.prevent
                      @click="toggleOtherForm"
                    >
                      <v-list-item-content> Other </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
              <v-col
                v-if="localItem.materialId === 'Other'"
                cols="12"
                sm="6"
                md="6"
              >
                <v-text-field
                  v-model="localItem.formId"
                  :disabled="!localItem.materialId"
                  :items="currentMaterialForms"
                  :label="`${
                    localItem.materialId == 'Other' ? 'Material' : 'Form'
                  } name`"
                  item-text="form"
                  item-value="_id"
                  name="type"
                  type="string"
                  required
                  :rules="rules"
                  @change="resetUnitAndQuantity"
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
                  <template #item="{ item }">
                    {{ UnitsRef[item] || item }}
                  </template>
                  <template #selection="{ item }">
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
                  v-else-if="
                    !shapeItem.conditionKey ||
                    (shapeItem.conditionKey &&
                      localItem[shapeItem.conditionKey] ===
                        shapeItem.conditionValue)
                  "
                  v-model="localItem[shapeItem.key]"
                  v-bind="shapeItem"
                  :messages="
                    shapeItem.suffix_hint ? [shapeItem.suffix_hint] : []
                  "
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
import { ShelterTransport } from "@/store/ShelterTransport";
import { iso3166_2_to_3 } from "@/utils/iso3166";
import { VForm } from "@/utils/vuetify";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

const { default: SheltersTransportModule } = await import(
  /* webpackPrefetch: true */ /* webpackChunkName: "reference-shelter-transports-vuex" */
  "@/store/SheltersTransportModule"
);
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
      "closeEditDialog",
      "setEditDialog",
      "setItem",
    ]),
    ...mapActions("SheltersTransportModule", ["getDoc"]),
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
  $refs!: {
    form: VForm;
  };
  materials!: string[];
  materialForms!: Record<string, ShelterMaterial[]>;
  materialMap!: Record<string, ShelterMaterial>;
  localItem: Item = {} as Item;
  shelter!: Shelter;

  getDoc!: (id: string) => Promise<ShelterTransport>;

  formValid = false;
  itemTypes = ["Material", "Labour"];
  labourUnits = ["Hour", "Day", "Lump sum"];
  otherUnits = otherUnits;
  workerTypes = ["Skilled", "Unskilled"];

  rules = [(v: string): boolean | string => !!v || `Required`];

  public get title(): string {
    return this.editedIndex === -1 ? "New item" : "Edit item";
  }

  readonly pluralRules = new Intl.PluralRules("en-US");
  readonly UnitsRef = UnitsRef;

  public get materialsWithoutOther(): string[] {
    return this.materials.filter((el: string) => el != "Other");
  }
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
    if (this.localItem.itemType === "Material") {
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
    return [];
  }
  public get itemUnitsDisabled(): boolean {
    if (this.localItem.itemType === "Material") {
      const item = this.localItem as Material;
      // find the good condition to show when  && item.materialId !== "Other"
      return !item.formId && item.materialId !== "Other";
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
    // exception when materialId is Other.
    if (this.currentItem?._id === "OTH_") {
      return materialsInputs["OTHER"] ?? [];
    }
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

    if (shelter === undefined) {
      throw new Error(
        "shelter transport country could not be found in reference database"
      );
    }
    return local ? shelter.t : shelter.o;
  }
  public get currentItem(): ShelterMaterial | undefined {
    if (this.localItem.itemType === "Material") {
      const item = this.localItem as Material;
      if (item.materialId === "Other") {
        return this.materialMap["OTH_"];
      } else {
        if (item.formId) {
          return this.materialMap[item.formId];
        }
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
      if (item.materialId === "Other") {
        // if other we don't want anything else
        return "OTHER";
        // return item.unit as FormTypeMaterial;
      }
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
      const { quantity, formId, unit, unitCost, materialId } = this
        .localItem as Material;
      let { embodied_carbon, embodied_water } = this.localItem as Material;

      const newValue = cloneDeep(this.localItem) as Material;
      if (formId && quantity && unit) {
        let material;
        if (materialId === "Other") {
          material = this.materialMap["OTH_"];
        } else {
          material = this.materialMap[formId];
        }

        const { density, local } = material;
        // special case of when Other is the materialId
        if (!embodied_carbon) {
          embodied_carbon = material.embodied_carbon;
        }
        if (!embodied_water) {
          embodied_water = material.embodied_water;
        }
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

        // if special case of materialId equal to Other
        // retrieve embodied carbon from
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
            let country_src_dst_embodied_carbon: number | string = "n.a.";
            if (src !== undefined && dst !== undefined) {
              const request_id = `${src}_${dst}`;
              country_src_dst_embodied_carbon =
                await this.getTransportFactorForMaterial(request_id, local);
              newValue.embodiedCarbonTransport =
                weight * country_src_dst_embodied_carbon;
            } else {
              newValue.embodiedCarbonTransport =
                country_src_dst_embodied_carbon;
            }
          }
        } catch (e) {
          console.error(e);
        }
        if (typeof newValue.embodiedCarbonTransport === "number") {
          newValue.embodiedCarbonTotal =
            newValue.embodiedCarbonProduction +
            newValue.embodiedCarbonTransport;
        } else {
          newValue.embodiedCarbonTotal = newValue.embodiedCarbonProduction;
        }
        // overide env performance if embodied_carbon is undefined
        if (
          materialId === "Other" &&
          (embodied_carbon === 0 || newValue.unit !== "KG")
        ) {
          newValue.embodiedCarbonTotal = 0;
          newValue.embodiedCarbonTransport = 0;
        }
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
      return result.filter((el: ShelterMaterial) => el.form != "Other");
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
    }
    // set default country
    this.localItem.source = this.shelter.location_country;
    this.validate();
  }

  public toggleOtherMaterial(): void {
    if (this.localItem.itemType === "Material") {
      const localMaterial = this.localItem as Material;
      localMaterial.materialId = "Other";
      this.localItem = localMaterial;
      this.resetLocalItemFormId();
    }
  }

  public toggleOtherForm(): void {
    if (this.localItem.itemType === "Material") {
      const localMaterial = this.localItem as Material;
      localMaterial.formId = "Other";
      this.localItem = localMaterial;
      this.resetUnitAndQuantity();
    }
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
  created() {
    this.syncLocalItem();
  }

  beforeCreate() {
    this.$store.registerModule(
      "SheltersTransportModule",
      SheltersTransportModule
    );
  }
  beforeDestroy() {
    this.$store.unregisterModule("SheltersTransportModule");
  }
}
</script>

<style lang="scss">
label > span:nth-child(1) {
  font-size: 0.7rem;
}
</style>
