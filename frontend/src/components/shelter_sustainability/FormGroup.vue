<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid>
      <v-row>
        <v-col>
          <!-- <h2 class="project-shelter__header text-h2">{{ form.title }}</h2> -->
           <h3 class="text-h4 font-weight-medium">{{ form.title }}</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-spacer />
      <v-form @submit.prevent="() => submitForm(value)">
        <v-row v-for="(input, $index) in form.inputs" :key="$index">
          <v-col>
            <radio-group
              :form="input"
              :value="value[input._id]"
              @input="(v) => update(input._id, v)"
              v-if="input.type === 'radioGroup'"
            ></radio-group>
            <checkbox-group
              :form="input"
              :value="value[input._id]"
              @input="(v) => update(input._id, v)"
              v-else-if="input.type === 'checkboxGroup'"
            ></checkbox-group>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ShelterPerformance, Score } from "@/store/ShelterInterface";
import ShelterForm from "@/components/shelter_sustainability/ShelterForm";
import CheckboxGroup from "@/components/shelter_sustainability/CheckboxGroup.vue";
import RadioGroup from "@/components/shelter_sustainability/RadioGroup.vue";

@Component({
  components: {
    RadioGroup,
    CheckboxGroup,
  },
  props: {
    form: {
      type: Object as () => ShelterForm,
    },
    value: {
      type: Object as () => ShelterPerformance,
    },
  },
})
/** FormGroup */
export default class FormGroup extends Vue {
  value!: ShelterPerformance;
  form!: ShelterForm;

  public update(formId: string, value: Score) {
    this.value[formId] = value;
    this.$emit("input", this.value);
  }
}
</script>
