<template>
  <v-sheet elevation="2" rounded>
    <h2>{{ form.title }}</h2>
    <v-divider />

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-checkbox
            v-for="(input, $index) in form.inputs"
            :input-value="checkbox[input._id]"
            @change="(v) => updateValue(input._id, v)"
            :key="$index"
            hide-details
          >
            <template v-slot:label>
              <v-row>
                <v-col cols="10">{{ input.label }}</v-col>
                <v-col cols="2">
                  <v-expansion-panels v-if="input.description">
                    <v-expansion-panel>
                      <v-expansion-panel-header>?</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        {{ input.description }}
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-container>
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
/** CheckboxGroup */
export default class CheckboxGroup extends Vue {
  value!: Record<string, number>;
  form!: ShelterForm;

  get checkbox(): Record<string, boolean> {
    return Object.entries(this.value).reduce((acc, [key, value]) => {
      acc[key] = !!value;
      return acc;
    }, {} as Record<string, boolean>);
  }

  updateValue(updatedKey: string, updatedValue: boolean) {
    const newValue = Object.entries(this.checkbox).reduce(
      (acc, [key, value]) => {
        const isChecked = key === updatedKey ? updatedValue : value;
        acc[key] = isChecked
          ? this.form.inputs.find((el) => el._id === key)?.score ?? 0
          : 0;
        return acc;
      },
      {} as Record<string, number>
    );
    this.$emit("input", newValue);
  }
}
</script>
