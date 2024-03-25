<template>
  <v-form v-if="localShelter.technical_performance" :disabled="loading">
    <component
      :is="ShelterFormType[technicalPerformanceForm.type]"
      :form="technicalPerformanceForm"
      :disabled="loading"
      :loading="loading"
      :value="localShelter.technical_performance"
      :result="localShelter.technical_performance_score_real"
      @input="(v) => update(v)"
    ></component>
  </v-form>
</template>
<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import { ShelterFormType } from "@/components/shelter_sustainability/ShelterForm";
import { Score, Shelter } from "@/store/ShelterInterface";
import {
  updateHabitability,
  updateTechnicalPerformance,
} from "@/store/ShelterModuleUtils";
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

  @Prop({ type: [Boolean], required: false, default: false })
  loading!: boolean;
  ShelterFormType = ShelterFormType;
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
    this.localShelter = updateHabitability(this.localShelter);
    this.updateFormInput();
  }

  mounted(): void {
    this.localShelter = updateTechnicalPerformance(this.localShelter);
    this.localShelter = updateHabitability(this.localShelter);
  }

  technicalPerformanceForm = technicalPerformanceForm;
}
</script>
