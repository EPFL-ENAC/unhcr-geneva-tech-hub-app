<template>
  <v-sheet elevation="2" rounded>
    <h4 class="text-h4 pa-4 font-weight-medium">{{ form.title }}</h4>
    <v-divider />

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels accordion :focusable="false">
            <v-expansion-panel
              :readonly="!input.description"
              v-for="(input, $index) in form.inputs"
              :key="$index"
            >
              <v-expansion-panel-header :hide-actions="!input.description">
                <v-checkbox
                  :input-value="checkbox[input._id]"
                  @mousedown.stop.prevent
                  @click.stop.prevent
                  @change="(v) => updateValue(input._id, v)"
                  hide-details
                >
                  <template v-slot:label>
                    {{ input.label }}
                  </template>
                </v-checkbox>
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="!!input.description">
                {{ input.description }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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
    // return Object.entries(this.value ?? {}).reduce((acc, [key, value]) => {
    //   acc[key] = !!value;
    //   return acc;
    // }, {} as Record<string, boolean>);

    const newValue = {} as Record<string, boolean>;
    const oldValue = this.value ?? {};
    // reset all previous values
    this.form.inputs.forEach((input) => {
      newValue[input._id] = !!oldValue[input._id];
    });
    return newValue;
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
