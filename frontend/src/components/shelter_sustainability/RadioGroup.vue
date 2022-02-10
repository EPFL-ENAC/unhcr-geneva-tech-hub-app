<template>
  <v-sheet elevation="2" rounded>
    <h2>{{ form.title }}</h2>
    <v-divider />
    <v-radio-group v-model="radio">
      <v-radio
        :value="input._id"
        v-for="(input, $index) in form.inputs"
        :key="$index"
      >
        <template v-slot:label>
          <div>{{ input.label }}</div>
        </template>
      </v-radio>
    </v-radio-group>

    <!-- <v-radio-group v-model="radioGroupFloor">
      <v-expansion-panels>
        <v-expansion-panel v-for="(input, $index) in form.inputs" :key="$index"
            :disabled="!input.description">
          <v-expansion-panel-header>
            <v-radio :value="$index">
              <template v-slot:label>
                <div>{{ input.label }}</div>
              </template>
            </v-radio>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ input.description }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-radio-group> -->
  </v-sheet>
</template>

<script lang="ts">
import ShelterForm from "./ShelterForm";
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    form: {
      type: Object as () => ShelterForm,
    },
    value: {
      type: Object as () => Record<string, number>,
    },
  },
})
/** RadioGroup */
export default class RadioGroup extends Vue {
  value!: Record<string, number>;
  form!: ShelterForm;

  get radio(): string {
    const [key] = Object.entries(this.value).find(
      ([_, _score]) => _score > 0
    ) ?? [""];
    return key;
  }
  set radio(value) {
    // make local copy of v-model value
    const newValue = this.value;
    // reset all previous values
    for (const [key] of Object.entries(newValue)) {
      newValue[key] = 0;
    }
    // update with newly found value
    newValue[value] =
      this.form.inputs.find((el) => el._id === value)?.score ?? 0;
    // emit
    this.$emit("input", newValue);
  }
}
</script>
