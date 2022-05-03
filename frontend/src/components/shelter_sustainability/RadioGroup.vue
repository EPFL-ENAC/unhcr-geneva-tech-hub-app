<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid>
      <v-row v-if="form.title">
        <v-col>
          <component
            :is="`h${depth + 2}`"
            :class="`text-h${depth + 4} project-shelter__h${
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
                v-for="(child, $index) in form.children"
                :key="$index"
                :readonly="!child.description"
              >
                <v-expansion-panel-header :hide-actions="!child.description">
                  <v-checkbox
                    :input-value="checkbox[child._id]"
                    hide-details
                    @mousedown.stop.prevent
                    @click.stop.prevent
                    @change="(v) => updateValue(child._id, v)"
                  >
                    <template v-slot:label>
                      {{ child.label }}
                    </template>
                  </v-checkbox>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-if="!!child.description">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p v-html="child.description"></p>
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
import {
  ShelterForm,
  ShelterFormChild,
  ShelterFormInput,
} from "@/components/shelter_sustainability/ShelterForm";
import { Score } from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";

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
    if (this.form.children) {
      return this.form.children
        .map((child) => child._id)
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
        if (this.form.children) {
          const lookup = this.form.children.find(
            (el: ShelterFormChild): boolean => el._id === key
          ) as ShelterFormInput;
          acc[key] = isChecked ? lookup.score ?? 0 : 0;
        }
        return acc;
      },
      {} as Score
    );
    this.$emit("input", newValue);
  }
}
</script>
