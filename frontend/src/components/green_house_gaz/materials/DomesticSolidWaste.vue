<template>
  <v-container fluid>
    <survey-item-title :title-key="title" :disabled="formDisabled" />
    <v-row class="d-flex align-center">
      <v-col :cols="4">
        <v-text-field
          id="email"
          :value="localForm?.generationKg ?? 0"
          autocomplete="generation-kg-per-capita-per-day"
          outlined
          label="generation-kg-per-capita-per-day"
          persistent-placeholder
          required
          suffix="kg"
          type="number"
          width="100"
          name="generation-kg-per-capita-per-day"
          @change="updateGenerationKg"
        />
      </v-col>
      <v-col class="d-flex align-center">
        <a :href="domesticSolidWasteHref" target="blank"
          >Example Waste Composition and Generation for Refugee Camps</a
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

import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

import {
  diffDimension,
  generateComputeItem,
  headers,
  MaterialSolidWasteItemInput,
  MaterialSolidWasteItemResults,
  MaterialSolidWasteSurvey,
} from "@/components/green_house_gaz/materials/DomesticSolidWaste";

@Component({
  components: {
    SurveyItemTitle,
    BaselineEndlineWrapper,
  },
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
})
export default class Cooking extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop({ type: [Object, Array] })
  readonly form!: MaterialSolidWasteSurvey;

  @Prop([Object, Array])
  readonly survey: Survey | undefined;

  project!: GreenHouseGaz;
  diffDimension = diffDimension;
  name = "solid waste";

  domesticSolidWasteHref =
    "https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-07-10T130208Z/SolidWaste_Specifications_v4.xlsx - RefugeeWasteExamples.pdf";

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

  public updateGenerationKg(value: string) {
    this.localForm.generationKg = parseFloat(value);
    this.$emit("update:form", this.localForm);
  }

  public get computeItem(): (
    localItemInput: MaterialSolidWasteItemInput,
    ghgMapRef: ItemReferencesMap
  ) => MaterialSolidWasteItemResults {
    return generateComputeItem(this.project.totalHH);
  }
  // should be a getter so it may be reactive for fuelTypes
  public get headers(): SurveyTableHeader[] {
    return headers(this.project.pp_per_hh);
  }
}
</script>
