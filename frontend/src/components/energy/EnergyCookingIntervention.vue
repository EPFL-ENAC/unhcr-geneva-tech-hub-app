<template>
  <v-row>
    <v-col cols="12">
      <energy-cooking-intervention-item
        v-model="module.substitutionInterventions"
        :form-items="technologyFormItems"
        :default-item="technologyDefaultItem"
      >
        <template #title>
          Energy substitution
          <info-tooltip>
            Through an energy substitution, a conventional or improved
            technology of the reference system is replaced by a clean or
            specific technology including solar cookers.
          </info-tooltip>
        </template>
      </energy-cooking-intervention-item>
    </v-col>
    <v-col cols="12">
      <energy-cooking-intervention-item
        v-model="module.efficiencyInterventions"
        :form-items="technologyFormItems"
        :default-item="technologyDefaultItem"
      >
        <template #title>
          Energy efficiency improvement
          <info-tooltip>
            With this type of basic intervention, a conventional technology of
            the reference system is replaced by an improved one that uses the
            same fuel but with an improved efficiency.
          </info-tooltip>
        </template>
      </energy-cooking-intervention-item>
    </v-col>
    <v-col cols="12">
      <energy-cooking-intervention-item
        v-model="module.cashInterventions"
        :form-items="cashFormItems"
        :default-item="cashDefaultItem"
      >
        <template #title>
          Cash-based interventions
          <info-tooltip>
            The aim is to provide poor households with subsidies to improve
            their energy cost affordability.
          </info-tooltip>
        </template>
      </energy-cooking-intervention-item>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { FormItem, SelectOption } from "@/components/commons/FormItem";
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import EnergyCookingInterventionItem from "@/components/energy/EnergyCookingInterventionItem.vue";
import {
  CookingCashIntervention,
  CookingFuel,
  CookingStove,
  CookingStoveId,
  CookingTechnologyIntervention,
  GeneralModule,
  HouseholdCookingModule,
  ParentIntervention,
  socioEconomicCategories,
  SocioEconomicCategory,
} from "@/models/energyModel";
import { getCookingFuel, getCurrentYear } from "@/utils/energy";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    EnergyCookingInterventionItem,
    InfoTooltip,
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
  @Prop({ type: Object as () => GeneralModule })
  generalModule!: GeneralModule;

  get technologyDefaultItem(): CookingTechnologyIntervention {
    const currentYear = getCurrentYear();
    return {
      type: "cooking-technology",
      name: "New intervention",
      selected: false,
      yearStart: currentYear,
      yearEnd: currentYear,
      newStoveId: "lpg",
      oldStoveIds: [],
      categories: socioEconomicCategories,
      count: 0,
    };
  }

  get cashDefaultItem(): CookingCashIntervention {
    const currentYear = getCurrentYear();
    return {
      type: "cooking-cash",
      name: "New intervention",
      selected: false,
      yearStart: currentYear,
      yearEnd: currentYear,
      categories: socioEconomicCategories,
      costAffordability: 0,
    };
  }

  get formItems(): FormItem<keyof ParentIntervention>[] {
    return [
      {
        type: "text",
        key: "name",
        label: "Intervention name",
      },
      {
        type: "number",
        key: "yearStart",
        label: "First year of the intervention",
        min: this.generalModule.yearStart,
      },
      {
        type: "number",
        key: "yearEnd",
        label: "Last year of diffusion",
        max: this.generalModule.yearEnd,
      },
    ];
  }

  get technologyFormItems(): FormItem<keyof CookingTechnologyIntervention>[] {
    return [
      ...this.formItems,
      {
        type: "select",
        key: "newStoveId",
        label: "New cooker to diffuse",
        options: this.stoveIdOptions,
      } as FormItem<keyof CookingTechnologyIntervention, CookingStoveId>,
      {
        type: "select",
        key: "oldStoveIds",
        label: "Technologies to replace",
        options: this.stoveIdOptions,
        multiple: true,
      } as FormItem<keyof CookingTechnologyIntervention, CookingStoveId>,
      {
        type: "select",
        key: "categories",
        label: "Targeted quality of life levels",
        options: this.categoryOptions,
        multiple: true,
      } as FormItem<keyof CookingTechnologyIntervention, SocioEconomicCategory>,
      {
        type: "number",
        key: "count",
        label:
          "Objectives of number of conventional or improved cooking count per 10-household of each targeted QLL each intervention year",
        ratio: 10,
      },
    ];
  }

  get cashFormItems(): FormItem<keyof CookingCashIntervention>[] {
    return [
      ...this.formItems,
      {
        type: "select",
        key: "categories",
        label: "Targeted quality of life levels",
        options: this.categoryOptions,
        multiple: true,
      } as FormItem<keyof CookingCashIntervention, SocioEconomicCategory>,
      {
        type: "number",
        key: "costAffordability",
        label:
          "Objective of energy for cooking cost affordability of each targeted QLL each intervention year",
        subtype: "percent",
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
}
</script>
