<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid>
      <v-row>
        <v-col cols="11">
          <component
            :is="`h${depth + 2}`"
            :class="`text-h${depth + 4} project-shelter__h${
              depth + 3
            }  font-weight-medium`"
            >{{ form.title }}</component
          >
        </v-col>
        <v-col cols="1" class="d-flex justify-end align-center">
          <v-btn icon @click="toggle">
            <v-icon :class="{ 'chevron-rotate': !expandPanel }"
              >mdi-chevron-down</v-icon
            >
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-show="expandPanel">
        <v-divider />
      </v-row>
      <v-expand-transition>
        <v-row v-show="expandPanel">
          <v-col cols="12">
            <v-expansion-panels accordion :focusable="false">
              <v-expansion-panel
                :readonly="!child.description"
                v-for="(child, $index) in form.children"
                :key="$index"
              >
                <v-expansion-panel-header :hide-actions="!child.description">
                  <v-checkbox
                    :input-value="checkbox[child._id]"
                    @mousedown.stop.prevent
                    @click.stop.prevent
                    @change="(v) => updateValue(child._id, v)"
                    hide-details
                  >
                    <template v-slot:label>
                      {{ child.label }}
                    </template>
                  </v-checkbox>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-if="!!child.description">
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
/** CheckboxGroup */
export default class CheckboxGroup extends Vue {
  value!: Score;
  form!: ShelterForm;

  expandPanel = true;

  public toggle(): void {
    this.expandPanel = !this.expandPanel;
  }

  get checkbox(): CheckboxScore {
    const newValue = {} as CheckboxScore;
    const oldValue = this.value ?? {};
    // reset all previous values
    this.form.children?.forEach((input) => {
      newValue[input._id] = !!oldValue[input._id];
    });
    return newValue;
  }

  updateValue(updatedKey: string, updatedValue: boolean): void {
    // this.form.inputs.forEach((input: ShelterFormInput) => {
    //   const isChecked = input._id === updatedKey ? updatedValue : this.value[];
    //   newValue[input._id] = isChecked ? input.score ?? 0;
    // })
    const newValue = Object.entries(this.checkbox).reduce(
      (acc, [key, value]) => {
        const isChecked = key === updatedKey ? updatedValue : value;
        const child = this.form.children?.find(
          (el: ShelterFormChild) => el._id === key
        ) as ShelterFormInput;
        acc[key] = isChecked ? child.score ?? 0 : 0;
        return acc;
      },
      {} as Score
    );
    this.$emit("input", newValue);
  }
}

type CheckboxScore = Record<string, boolean>;
</script>
