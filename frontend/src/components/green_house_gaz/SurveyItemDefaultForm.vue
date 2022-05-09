<template>
  <v-container fluid>
    <v-row>
      <v-col :cols="4">
        <v-card v-if="currentForm.baseline" flat>
          <v-card-title><h2>Inputs</h2></v-card-title>
          <v-card-text>
            <v-text-field
              v-model.number="currentForm.baseline.results.totalCO2Emission"
              label="Total baseline CO2 emissions (tCO2e/yr)"
              hide-spin-buttons
              type="number"
              @change="(e) => updateFormInput(e, 'baseline textfield')"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="4">
        <v-card v-if="currentForm.endline" flat>
          <v-card-title><h2>Results</h2></v-card-title>
          <v-card-text>
            <v-text-field
              v-model.number="currentForm.endline.results.totalCO2Emission"
              label="Total endline CO2 emissions (tCO2e/yr)"
              hide-spin-buttons
              type="number"
              @change="(e) => updateFormInput(e, 'baseline textfield')"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="4"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { FormSurvey } from "@/store/GhgInterface";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class SurveyItemDefaultForm extends Vue {
  @Prop([Object, Array])
  readonly form: FormSurvey | undefined;

  public get currentForm(): FormSurvey {
    return this.form || this.generateNewDefaultForm();
  }

  public set currentForm(newForm: FormSurvey) {
    this.$emit("update:form", newForm);
  }
  public updateFormInput(): void {
    this.currentForm.endline.results.changeInEmission = this.computeBalance();
    this.currentForm = Object.assign({}, this.currentForm);
  }

  public computeBalance(): number {
    return 0;
  }

  private generateNewDefaultForm(): FormSurvey {
    return {
      baseline: {
        inputs: [],
        results: {
          totalCO2Emission: 0,
        },
      },
      endline: {
        inputs: [],
        results: {
          totalCO2Emission: 0,
          changeInEmission: 0,
        },
      },
    };
  }
}
</script>

<style></style>
