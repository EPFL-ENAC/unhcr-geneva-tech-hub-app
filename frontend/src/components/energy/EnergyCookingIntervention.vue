<template>
  <v-row>
    <v-col cols="12">
      <v-card height="100%">
        <v-card-title>
          Energy substitution
          <v-spacer></v-spacer>
          <v-btn class="float-right" color="primary" text @click="addDiffusion">
            <v-icon left>mdi-plus-box</v-icon>
            New intervention
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels multiple>
            <v-expansion-panel
              v-for="(interventionItem, index) in module.interventions"
              :key="index"
            >
              <v-expansion-panel-header>
                <span>
                  <v-btn
                    icon
                    @click="
                      $event.stopPropagation();
                      interventionItem.selected = !interventionItem.selected;
                    "
                  >
                    <v-icon v-if="interventionItem.selected" color="primary">
                      mdi-checkbox-marked
                    </v-icon>
                    <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
                  </v-btn>
                </span>
                <span>{{ interventionItem.name }}</span>
                <span>
                  <v-btn
                    icon
                    @click="
                      $event.stopPropagation();
                      deleteDuffusion(index);
                    "
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <form-item-component
                  v-for="item in formItems"
                  :key="item.key"
                  v-model="interventionItem[item.key]"
                  v-bind="item"
                ></form-item-component>
                <form-item-component
                  v-for="item in subsidiesFormItems"
                  :key="item.key"
                  v-model="interventionItem.subsidies[item.key]"
                  v-bind="item"
                ></form-item-component>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card height="100%">
        <v-card-title>
          Energy efficiency improvement
          <v-spacer></v-spacer>
          <v-btn
            class="float-right"
            color="primary"
            text
            @click="addEfficiency"
          >
            <v-icon left>mdi-plus-box</v-icon>
            New intervention
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels multiple>
            <v-expansion-panel
              v-for="(interventionItem, index) in efficiencyInterventions"
              :key="index"
            >
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <v-row>
                    <v-col cols="auto">
                      <!-- todo: remove disabled when implemented -->
                      <v-checkbox
                        hide-details="auto"
                        :input-value="open"
                        :label="interventionItem.name"
                        :readonly="true"
                        :disabled="true"
                        :value="false"
                        @click.stop.prevent
                      ></v-checkbox>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" class="d-flex align-center">
                      <v-btn icon @click="deleteEfficiency(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card height="100%">
        <v-card-title>
          Cash-based interventions
          <v-spacer></v-spacer>
          <v-btn class="float-right" color="primary" text @click="addCash">
            <v-icon left>mdi-plus-box</v-icon>
            New intervention
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels multiple>
            <v-expansion-panel
              v-for="(interventionItem, index) in cashInterventions"
              :key="index"
            >
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <v-row>
                    <v-col cols="auto">
                      <v-form :disabled="true">
                        <v-checkbox
                          hide-details="auto"
                          :input-value="open"
                          :label="interventionItem.name"
                          :readonly="true"
                          :disabled="true"
                          :value="false"
                          @click.stop.prevent
                        ></v-checkbox>
                      </v-form>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" class="d-flex align-center">
                      <v-btn icon @click="deleteCash(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { FormItem, SelectOption } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import {
  CookingFuel,
  CookingStove,
  CookingStoveId,
  CookingTechnologyIntervention,
  HouseholdCookingModule,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { getCookingFuel, getCurrentYear } from "@/utils/energy";
import "vue-class-component/hooks";
import { Component, VModel, Vue } from "vue-property-decorator";
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
export default class EnergyCookingIntervention extends Vue {
  cookingFuels!: CookingFuel[];
  cookingStoves!: CookingStove[];

  @VModel({ type: Object as () => HouseholdCookingModule })
  module!: HouseholdCookingModule;

  // TODO remove and group types of intervention
  efficiencyInterventions: {
    name: string;
  }[] = [];
  cashInterventions: {
    name: string;
  }[] = [];

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
        label: "Target quality of life levels",
        options: this.categoryOptions,
        multiple: true,
      } as FormItem<keyof CookingTechnologyIntervention, SocioEconomicCategory>,
      {
        type: "number",
        key: "cost",
        label: "Total cost per year",
        unit: "$",
      },
    ];
  }

  get subsidiesFormItems(): FormItem<SocioEconomicCategory>[] {
    return socioEconomicCategories.map((cat) => ({
      type: "number",
      key: cat,
      label: `Share of subsidies by the donor for ${this.$t(`energy.${cat}`)}`,
    }));
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
      subsidies: Object.fromEntries(
        socioEconomicCategories.map((cat) => [cat, 0])
      ) as Record<SocioEconomicCategory, number>,
    });
  }

  deleteDuffusion(index: number): void {
    this.module.interventions.splice(index, 1);
  }

  addEfficiency(): void {
    this.efficiencyInterventions.push({
      name: "New efficiency improvement",
    });
  }

  deleteEfficiency(index: number): void {
    this.efficiencyInterventions.splice(index, 1);
  }

  addCash(): void {
    this.cashInterventions.push({
      name: "New cash-based intervention",
    });
  }

  deleteCash(index: number): void {
    this.cashInterventions.splice(index, 1);
  }
}
</script>
