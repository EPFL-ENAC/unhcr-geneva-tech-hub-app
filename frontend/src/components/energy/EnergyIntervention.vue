<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @save="save"
  >
    <template v-slot:append>
      <v-row>
        <v-spacer></v-spacer>
        <v-col class="col-auto">
          <v-btn color="primary" @click="addDiffusion">
            <v-icon left>mdi-plus</v-icon>
            Add Diffusion Intervention
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="selectedIndexes" multiple>
            <v-expansion-panel
              v-for="(interventionItem, index) in module.interventions"
              :key="index"
            >
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <v-checkbox
                    hide-details="auto"
                    :input-value="open"
                    :label="interventionItem.name"
                    readonly
                  ></v-checkbox>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <form-item-component
                      v-for="item in formItems"
                      :key="item.key"
                      v-model="interventionItem[item.key]"
                      v-bind="item"
                    ></form-item-component>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn @click="deleteDuffusion(index)">
                      <v-icon left>mdi-delete</v-icon>
                      Delete
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>
  </energy-form>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
  SelectOption,
} from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import {
  CookingFuel,
  CookingStove,
  CookingStoveId,
  CookingTechnologyIntervention,
  InterventionModule,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { getCookingFuel, getCurrentYear } from "@/utils/energy";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    FormItemComponent,
    EnergyForm,
  },
  computed: {
    ...mapState("energy", ["cookingFuels", "cookingStoves"]),
  },
})
export default class EnergyIntervention extends EnergyFormMixin<InterventionModule> {
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];

  module: InterventionModule = this.defaultModule;

  get defaultModule(): InterventionModule {
    const currentYear = getCurrentYear();
    return {
      interventions: [
        {
          type: "cooking-technology",
          name: "Diffusion of LPG",
          selected: false,
          yearStart: currentYear,
          yearEnd: currentYear,
          newStoveId: "lpg",
          oldStoveIds: [],
          count: 0,
          categories: [],
          cost: 0,
          donnorSubsidy: 0,
        },
      ],
    };
  }

  get formItems(): FormItem<keyof CookingTechnologyIntervention>[] {
    return [
      {
        type: "text",
        key: "name",
        label: "Name",
      },
      {
        type: "select",
        key: "newStoveId",
        label: "New technology",
        options: this.stoveIdOptions,
      } as FormItem<keyof CookingTechnologyIntervention, CookingStoveId>,
      {
        type: "number",
        key: "yearStart",
        label: "Starting year of the diffusion",
      },
      {
        type: "number",
        key: "yearEnd",
        label: "Ending year of the diffusion",
      },
      {
        type: "select",
        key: "oldStoveIds",
        label: "Technologies to replace",
        options: this.stoveIdOptions,
        multiple: true,
      } as FormItem<keyof CookingTechnologyIntervention, CookingStoveId>,
      {
        type: "number",
        key: "count",
        label: "Number of cookstoves per year",
      },
      {
        type: "select",
        key: "categories",
        label: "Target socio-economic categories",
        options: this.categoryOptions,
        multiple: true,
      } as FormItem<keyof CookingTechnologyIntervention, SocioEconomicCategory>,
      {
        type: "number",
        key: "cost",
        label: "Total cost per year",
      },
      {
        type: "number",
        key: "donnorSubsidy",
        label: "Share of subsidies by the donnor",
      },
    ];
  }

  get stoveIdOptions(): SelectOption<CookingStoveId>[] {
    return this.cookingStoves.map((stove) => ({
      text: `${stove.name} - ${getCookingFuel(this.cookingFuels, stove).name}`,
      value: stove._id,
    }));
  }

  get categoryOptions(): SelectOption<SocioEconomicCategory>[] {
    return socioEconomicCategories.map((cat) => ({
      text: this.$t("energy." + cat).toString(),
      value: cat,
    }));
  }

  get selectedIndexes(): number[] {
    return this.module.interventions.flatMap((intervention, index) =>
      intervention.selected ? [index] : []
    );
  }

  set selectedIndexes(value: number[]) {
    const indexes = new Set(value);
    this.module.interventions.forEach(
      (intervention, index) => (intervention.selected = indexes.has(index))
    );
  }

  addDiffusion(): void {
    const currentYear = getCurrentYear();
    this.module.interventions.push({
      type: "cooking-technology",
      name: "Diffusion of new technology",
      selected: false,
      yearStart: currentYear,
      yearEnd: currentYear,
      newStoveId: "lpg",
      oldStoveIds: [],
      count: 0,
      categories: [],
      cost: 0,
      donnorSubsidy: 0,
    });
  }

  deleteDuffusion(index: number): void {
    this.module.interventions.splice(index, 1);
  }
}
</script>
