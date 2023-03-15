<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid>
      <v-row>
        <v-col cols="11" class="group-title">
          <component
            :is="`h${depth + 2}`"
            :class="`text-h${depth + 4} project-shelter__h${
              depth + 3
            }  font-weight-medium`"
            >{{ form.title }}</component
          >
        </v-col>
        <v-col cols="1" class="d-flex justify-end align-center d-print-none">
          <v-btn icon @click="toggle">
            <v-icon :class="{ 'chevron-rotate': !expandPanel }"
              >$mdiChevronDown</v-icon
            >
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-show="expandPanel" class="d-print-none">
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-expand-transition>
        <v-row v-show="expandPanel">
          <v-col cols="12" class="pt-0">
            <v-expansion-panels
              accordion
              :focusable="false"
              class="checkbox-group-panels"
            >
              <v-expansion-panel
                v-for="(child, $index) in form.children"
                :key="$index"
                :readonly="!child.description"
                class="unhcr-expansion-panel"
              >
                <v-expansion-panel-header :hide-actions="!child.description">
                  <v-checkbox
                    :input-value="checkbox[child._id]"
                    :disabled="child.disabled || checkbox[child._id + 'na']"
                    hide-details
                    @mousedown.stop.prevent
                    @click.stop.prevent
                    @change="(v) => updateValue(child._id, v)"
                  >
                    <template #label>
                      {{ child.label }}
                    </template>
                  </v-checkbox>

                  <v-checkbox
                    class="unhcr-checkbox-group-non-applicable__checkbox"
                    :input-value="checkbox[child._id + 'na']"
                    :disabled="child.disabled"
                    hide-details
                    @mousedown.stop.prevent
                    @click.stop.prevent
                    @change="
                      (v) => {
                        updateValue(child._id + 'na', v, child._id);
                      }
                    "
                  >
                    <template #label>
                      <span
                        class="unhcr-checkbox-group-non-applicable__checkbox__label"
                        >not applicable
                      </span>
                    </template>
                  </v-checkbox>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-if="!!child.description">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p v-html="child.description"></p>
                  <p
                    v-if="!child.disabled"
                    class="d-flex justify-between align-center"
                  ></p>
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
      newValue[input._id] = oldValue[input._id] !== undefined;
      newValue[input._id + "na"] = oldValue[input._id + "na"] !== undefined;
    });
    return newValue;
  }

  updateValue(updatedKey: string, updatedValue: boolean, extended = ""): void {
    const newValue = Object.entries(this.checkbox).reduce(
      (acc, [currentKey, previousValue]) => {
        // if updatedKey match current key, we need to update with updatedValue
        // else we keep the previous value
        const child = this.form.children?.find(
          (el: ShelterFormChild) => el._id === currentKey
        ) as ShelterFormInput;
        // no extended!
        const isCheckedValue =
          currentKey === updatedKey ? updatedValue : previousValue;
        acc[currentKey] = isCheckedValue ? child?.score ?? 0 : undefined;
        if (currentKey === extended) {
          acc[currentKey] = undefined;
        }
        return acc;
      },
      {} as Score
    );
    this.$emit("input", newValue);
  }
}

type CheckboxScore = Record<string, boolean>;
</script>

<style lang="scss">
.unhcr-expansion-panel {
  .v-expansion-panel-header {
    display: grid;
    grid-auto-columns: 1;
    grid-auto-flow: column;
    grid-template-columns: auto max-content min-content;
    .v-input--selection-controls {
      // margin-top: 0px;
      // padding-top: 0px;
      width: 100%;
    }
    .unhcr-checkbox-group-non-applicable__checkbox {
      margin-top: 0px;
      padding-top: 0px;
      .v-input__control {
        .v-input__slot {
          flex-direction: row-reverse;
          .v-label {
            flex-direction: row-reverse;
          }
        }
      }
    }
  }
}
.unhcr-checkbox-group-non-applicable__checkbox__label {
  margin-right: 4px;
}

@media print {
  @page {
    size: portrait;
  }
  .checkbox-group-panels {
    z-index: auto;
  }
  .unhcr-expansion-panel {
    .v-expansion-panel-header {
      min-height: 24px;
      padding: 0;
      // margin: 0;
      .v-input--selection-controls {
        margin-top: 0px;
        padding-top: 0px;
        width: 100%;
      }
      .v-input__control {
        .v-input__slot {
          padding: 0;
          margin: 0;
          .v-label {
            font-size: 8px;
          }
        }
      }
      .v-expansion-panel-header__icon {
        display: none;
      }
    }
  }
  .group-title {
    padding-bottom: 0px;
    .project-shelter__h4 {
      font-size: 0.8rem !important;
      line-height: 1rem;
    }
    .project-shelter__h5 {
      font-size: 0.7rem !important;
      line-height: 0.9rem;
    }
  }
}
</style>
