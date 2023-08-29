<template>
  <v-form v-if="habitability" :disabled="loading">
    <component
      :is="ShelterFormType[habitabilityForm.type]"
      :disabled="loading"
      :loading="loading"
      :form="habitabilityForm"
      :value="habitability"
      :result="localShelter.habitability_score_real"
      @input="(v) => update(v)"
    ></component>
  </v-form>
</template>

<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import {
  ShelterForm,
  ShelterFormChild,
  ShelterFormInput,
  ShelterFormType,
} from "@/components/shelter_sustainability/ShelterForm";
import { Score, Shelter } from "@/store/ShelterInterface";
import { areDoorsBiggerThan90cm } from "@/store/ShelterModuleUtils";
import habitabilityForm from "@/views/shelter_sustainability/ShelterSustainabilityItem/habitabilityForm";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    FormGroup,
  },
})
/** Project */
export default class Step7 extends Vue {
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

  public isShelterForm(obj: any): obj is ShelterForm {
    return obj.children !== undefined;
  }

  public isShelterFormInput(obj: any): obj is ShelterFormInput {
    return obj.score !== undefined;
  }

  public forceNonApplicable(form: ShelterFormChild, habitability: Score): void {
    if (this.isShelterForm(form)) {
      form?.children?.forEach((child: ShelterFormChild) => {
        if (this.isShelterForm(child) && child?.children) {
          this.forceNonApplicable(child, habitability);
        }
        if (child.nonApplicable && this.isShelterFormInput(child)) {
          habitability[child._id + "na"] = child?.score ?? 0;
          habitability[child._id] = undefined; // -1; // to say that it is unchecked; undefined is uncompleted
        }
      });
    }
  }

  public ensureDynamicHabitability(
    form: ShelterFormChild,
    habitability: Score
  ): void {
    if (this.isShelterForm(form)) {
      form?.children?.forEach((child: ShelterFormChild) => {
        if (this.isShelterForm(child) && child?.children) {
          this.ensureDynamicHabitability(child, habitability);
        }

        if (child._id === "input12") {
          habitability[child._id] =
            this.localShelter.technical_performance.input_3b_6;
        }

        if (child._id === "input13") {
          habitability[child._id] =
            this.localShelter.technical_performance.input_3b_7;
        }
        if (child._id === "input5") {
          this.localShelter.habitability.input5 = areDoorsBiggerThan90cm(
            this.localShelter.geometry
          );
        }
      });
    }
  }

  get habitability(): Score {
    // force non applicable in getter...
    const a = this.localShelter.habitability;
    this.forceNonApplicable(habitabilityForm, a);
    this.ensureDynamicHabitability(habitabilityForm, a);
    return a;
  }

  public async update(value: Score): Promise<void> {
    this.localShelter.habitability = value;
    // TODO: add for loading here!
    this.updateFormInput();
  }

  habitabilityForm = habitabilityForm;
}
</script>
