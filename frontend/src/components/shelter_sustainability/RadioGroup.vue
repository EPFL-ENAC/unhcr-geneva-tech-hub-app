<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid>
      <v-row>
        <v-col>
          <component
            :is="`h${depth + 2}`"
            :class="`text-h${depth + 3} project-shelter__h${
              depth + 3
            }  font-weight-medium`"
            >{{ form.title }}</component
          >
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <v-btn icon @click="toggle">
            <v-icon :class="{ 'chevron-rotate': !show }"
              >mdi-chevron-down</v-icon
            >
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-show="show">
        <v-divider />
      </v-row>
      <v-expand-transition>
        <v-row v-show="show">
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
      </v-expand-transition>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import ShelterForm from "./ShelterForm";
import { Component, Vue } from "vue-property-decorator";
import { Score } from "@/store/ShelterInterface";
import { ShelterFormInput } from "@/components/shelter_sustainability/ShelterForm";

type ScoreBoolean = Record<string, boolean>;
@Component({
  props: {
    form: {
      type: Object as () => ShelterForm,
    },
    value: {
      type: Object as () => Score,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
})
/** RadioGroup */
export default class RadioGroup extends Vue {
  value!: Score;
  form!: ShelterForm;
  show = true;

  public toggle(): void {
    this.show = !this.show;
  }

  get checkbox(): ScoreBoolean {
    // transform a Score structure in boolean
    const oldValue = this.value ?? ({} as Score);
    // reset all previous values
    if (this.form.inputs) {
      return this.form.inputs
        .map((input) => input._id)
        .reduce((acc, _id) => {
          acc[_id] = !!oldValue[_id];
          return acc;
        }, {} as ScoreBoolean);
    }
    return {} as ScoreBoolean;
  }

  updateValue(updatedKey: string, updatedValue: boolean): void {
    const newValue = Object.entries(this.checkbox).reduce(
      (acc: Score, [key]) => {
        // we reset old values also
        const isChecked = key === updatedKey ? updatedValue : 0;
        if (this.form.inputs) {
          const lookup = this.form.inputs.find(
            (el: ShelterFormInput): boolean => el._id === key
          );
          acc[key] = isChecked ? lookup?.score ?? 0 : 0;
        }
        return acc;
      },
      {} as Score
    );
    this.$emit("input", newValue);
  }
}
</script>
