<template>
  <v-form v-if="localShelter.technical_performance">
    <component
      :is="technicalPerformanceForm.type"
      :form="technicalPerformanceForm"
      :value="localShelter.technical_performance"
      :result="localShelter.technical_performance_score_real"
      @input="(v) => update(v)"
    ></component>
  </v-form>
</template>

<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import { Score, Shelter } from "@/store/ShelterInterface";
import technicalPerformanceForm from "@/views/shelter_sustainability/ShelterSustainabilityItem/technicalPerformanceForm";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    FormGroup,
  },
})
/** Project */
export default class Step6 extends Vue {
  @Prop({ type: [Object], required: true })
  shelter!: Shelter;

  public get localShelter(): Shelter {
    return cloneDeep(this.shelter);
  }

  public set localShelter(newShelter: Shelter) {
    this.$emit("update:shelter", newShelter);
  }

  public updateFormInput(): void {
    this.localShelter = Object.assign({}, this.localShelter);
  }

  get technical_performance(): Score {
    return this.localShelter.technical_performance;
  }
  public async update(value: Score): Promise<void> {
    this.localShelter.technical_performance = value;

    // update habitability, because it should be done like this (defined in the specs)
    this.localShelter.habitability.input12 =
      this.technical_performance.input_3b_6;
    this.localShelter.habitability.input13 =
      this.technical_performance.input_3b_7;
    this.updateFormInput();
  }

  technicalPerformanceForm = technicalPerformanceForm;
}
</script>
