<template>
  <v-sheet elevation="2" rounded>
    <h4 class="text-h5 px-4 py-4 font-weight-medium">{{ form.title }}</h4>

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
import ShelterForm from './ShelterForm'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Score } from '@/store/ShelterInterface'
import { ShelterFormInput } from '@/components/shelter_sustainability/ShelterForm'

type ScoreBoolean = Record<string, boolean>
@Component({
  props: {
    form: {
      type: Object as () => ShelterForm,
    },
    value: {
      type: Object as () => Score,
    },
  },
})
/** RadioGroup */
export default class RadioGroup extends Vue {
  value!: Score
  form!: ShelterForm

  get checkbox(): ScoreBoolean {
    // transform a Score structure in boolean
    const oldValue = this.value ?? ({} as Score)
    // reset all previous values
    return this.form.inputs
      .map((input) => input._id)
      .reduce((acc, _id) => {
        acc[_id] = !!oldValue[_id];
        return acc;
      }, {} as ScoreBoolean)
  }

  updateValue(updatedKey: string, updatedValue: boolean) {
    const newValue = Object.entries(this.checkbox).reduce(
      (acc: Score, [key, value]) => {
        // we reset old values also
        const isChecked = key === updatedKey ? updatedValue : 0
        const lookup = this.form.inputs.find(
          (el: ShelterFormInput): boolean => el._id === key,
        )
        acc[key] = isChecked ? lookup?.score ?? 0 : 0

        return acc
      },
      {} as Score,
    )
    this.$emit('input', newValue)
  }
}
</script>
