<template>
  <v-container fluid>
    <survey-item-title :title-key="title" :disabled="cookingDisabled" />
    <baseline-endline-wrapper
      v-if="!cookingDisabled"
      v-model="localForm"
      :headers="headers"
      :diff-dimension="diffDimension"
      :compute-item="computeItem"
      :name="name"
    />
  </v-container>
</template>

<script lang="ts">
import BaselineEndlineWrapper from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/surveyTableHeader";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";

import { ReferenceItemInterface } from "@/store/GhgReferenceModule";

import { GreenHouseGaz } from "@/store/GhgInterface";
import { GHGfNRB } from "@/store/GHGReferencefNRB";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

import {
  diffDimension,
  EnergyLightingItemInput,
  EnergyLightingItemResults,
  EnergyLightingSurvey,
  generateComputeItem,
  headers,
} from "@/components/green_house_gaz/energy/Lighting";
import { CountryIrradianceKeys } from "@/components/green_house_gaz/energy/solarInputs";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project", "project_REF_GRD"]),
    ...mapGetters("GHGReferencefNRB", ["items"]),
  },
})
export default class Cooking extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: EnergyLightingSurvey;

  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: CountryIrradianceKeys;

  project!: GreenHouseGaz;
  project_REF_GRD!: ReferenceItemInterface;
  diffDimension = diffDimension;
  name = "lighting";

  public get title(): string {
    return this.titleKey;
  }
  public get localForm(): EnergyLightingSurvey {
    return this.form;
  }

  public set localForm(value: EnergyLightingSurvey) {
    this.$emit("update:form", value);
  }
  public get cookingDisabled(): boolean {
    return this.project.population === undefined;
  }

  public get computeItem(): (
    localItemInput: EnergyLightingItemInput,
    ghgMapRef: ItemReferencesMap
  ) => EnergyLightingItemResults {
    return generateComputeItem(
      this.countryCode,
      this.project.totalHH,
      this.items, // being GHGReferencefNRB
      this.project_REF_GRD
    );
  }
  // should be a getter so it may be reactive for fuelTypes
  public get headers(): SurveyTableHeader[] {
    return headers(
      this.countryCode,
      this.project?.solar,
      this.project?.pp_per_hh
    );
  }

  items!: GHGfNRB[];
}
</script>
