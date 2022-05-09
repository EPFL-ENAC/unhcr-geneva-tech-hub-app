<template>
  <v-form v-if="localShelter.habitability">
    <component
      :is="habitabilityForm.type"
      :form="habitabilityForm"
      :value="localShelter.habitability"
      @input="(v) => update(v)"
    ></component>
  </v-form>
</template>

<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
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

  public get localShelter(): Shelter {
    return cloneDeep(this.shelter);
  }

  public set localShelter(newShelter: Shelter) {
    this.$emit("update:shelter", newShelter);
  }

  public updateFormInput(): void {
    this.localShelter = Object.assign({}, this.localShelter);
  }

  get habitability(): Score {
    return this.localShelter.habitability;
  }
  public async update(value: Score): Promise<void> {
    this.localShelter.habitability = value;
    this.updateFormInput();
  }

  habitabilityForm = habitabilityForm;
}
</script>
