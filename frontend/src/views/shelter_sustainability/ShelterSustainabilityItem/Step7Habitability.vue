<template>
  <v-form v-if="habitability">
    <component
      :is="ShelterFormType[habitabilityForm.type]"
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
  ShelterFormType,
} from "@/components/shelter_sustainability/ShelterForm";
import { Score, Shelter } from "@/store/ShelterInterface";
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

  public forceNonApplicable(form: ShelterFormChild, habitability: Score): void {
    if (this.isShelterForm(form)) {
      form?.children?.forEach((child: ShelterFormChild) => {
        if (this.isShelterForm(child) && child?.children) {
          this.forceNonApplicable(child, habitability);
        }
        if (child.nonApplicable) {
          habitability[child._id + "na"] = true;
          habitability[child._id] = undefined; // -1; // to say that it is unchecked; undefined is uncompleted
        }
      });
    }
  }

  get habitability(): Score {
    // force non applicable in getter...
    const a = this.localShelter.habitability;
    this.forceNonApplicable(habitabilityForm, a);
    return a;
  }

  public async update(value: Score): Promise<void> {
    this.localShelter.habitability = value;
    // debugger;
    // TODO: add for loading here!
    this.updateFormInput();
  }

  habitabilityForm = habitabilityForm;
}
</script>
