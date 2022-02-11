<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <component :is="`h${depth + 2}`" :class="`text-h${depth+3} project-shelter__h${depth+3}  font-weight-medium`">{{ form.title }}</component>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-spacer />

    <v-form @submit.prevent="() => submitForm(value)">
      <v-row v-for="(child, $index) in form.children" :key="$index">
        <v-col>
          <v-sheet elevation="2" rounded>
            <component
              :form="child"
              :value="value[child._id]"
              @input="(v) => update(child._id, v)"
              :is="child.type"
              :depth="depth + 1"
            ></component>
          </v-sheet>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
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
    depth: {
      type: Number,
      default: 0,
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
