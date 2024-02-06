<template>
  <v-container fluid>
    <survey-item-title :title-key="title" :disabled="formDisabled" />
    <v-row class="d-flex align-center">
      <v-col :cols="4">
        <v-text-field
          id="email"
          :value="localForm?.generationGram ?? 0"
          autocomplete="generation-kg-per-capita-per-day"
          outlined
          label="Generation rate (kg/cap/day)"
          persistent-placeholder
          required
          suffix="kg/cap/day"
          type="number"
          width="100"
          name="generation-kg-per-capita-per-day"
          @change="updateGenerationGram"
          @keydown.enter.prevent="
            () => updateGenerationGram(localForm?.generationGram ?? 0)
          "
        />
      </v-col>
      <v-col class="d-flex align-center">
        <a :href="domesticSolidWasteHref" target="blank"
          >Example Waste Composition and Generation for Displacement Contexts</a
        >
      </v-col>
    </v-row>
    <baseline-endline-wrapper
      v-if="!formDisabled"
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

import ComputeGenericFormSurveyMixin from "@/components/green_house_gaz/generic/ComputeGenericFormSurveyMixin.vue";
import { env } from "@/config";
import { GreenHouseGaz } from "@/store/GhgInterface";
import "vue-class-component/hooks";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";

import {
  diffDimension,
  generateComputeItem,
  headers,
  MaterialSolidWasteItemInput,
  MaterialSolidWasteItemResults,
  MaterialSolidWasteItemResultsBalance,
  MaterialSolidWasteSurvey,
} from "@/components/green_house_gaz/wash/DomesticSolidWaste";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },

  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
})
export default class Cooking extends Mixins(ComputeGenericFormSurveyMixin) {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: MaterialSolidWasteSurvey;

  ghgMapRef!: ItemReferencesMap;
  project!: GreenHouseGaz;
  diffDimension = diffDimension;
  name = "solid waste";

  domesticSolidWasteHref = `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/RefugeeWasteExamples-2023-11-15.pdf`;

  public get title(): string {
    return this.titleKey;
  }
  public get localForm(): MaterialSolidWasteSurvey {
    return this.form;
  }

  public set localForm(value: MaterialSolidWasteSurvey) {
    this.$emit("update:form", value);
  }

  public get formDisabled(): boolean {
    return this.project.population === undefined;
  }

  public updateGenerationGram(value: string) {
    // If the form is not defined, set it to an empty object.
    if (this.localForm === undefined) {
      this.localForm = {
        baseline: {
          items: [],
          results: {
            totalCO2Emission: 0,
            changeInEmission: 0,
          } as MaterialSolidWasteItemResults,
        },
        endline: {
          items: [],
          results: {
            totalCO2Emission: 0,
            changeInEmission: 0,
          } as MaterialSolidWasteItemResultsBalance,
        },
        generationGram: parseFloat(value),
      };
    } else {
      this.localForm.generationGram = parseFloat(value);
    }

    this.localForm = this.updateGenericFormSurvey(
      this.localForm,
      this.diffDimension as string,
      this.headers,
      this.computeItem,
      this.ghgMapRef
    ) as any;

    this.$emit("update:form", this.localForm);
  }

  public get computeItem(): (
    localItemInput: MaterialSolidWasteItemInput,
    ghgMapRef: ItemReferencesMap
  ) => MaterialSolidWasteItemResults {
    return generateComputeItem(
      this.project.population,
      this.localForm?.generationGram ?? 0,
      this.project.countryCode
    );
  }
  // should be a getter so it may be reactive for fuelTypes
  public get headers(): SurveyTableHeader[] {
    return headers();
  }
}
</script>
