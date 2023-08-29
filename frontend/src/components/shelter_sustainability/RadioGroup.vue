<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid>
      <v-row v-if="form._id">
        <v-col cols="8" class="group-title">
          <component
            :is="`h${depth + 2}`"
            v-if="form._id"
            :class="`project-shelter__h${depth + 3}  font-weight-medium text-h${
              depth + 4
            } `"
            >{{ form.title }}</component
          >
        </v-col>
        <v-col
          cols="2"
          class="d-flex align-center justify-end font-italic font-weight-light grey--text"
        >
          <span v-if="completed" class="mr-4">
            <v-icon class="green--text text--lighten-3">$mdiCheck</v-icon>
            complete</span
          >
          <span v-else class="mr-4">
            <v-icon class="red--text text--lighten-3">$mdiClose</v-icon>
            incomplete</span
          >
        </v-col>
        <v-col cols="2" class="d-print-none d-flex justify-end align-center">
          <v-checkbox
            class="unhcr-checkbox-group-non-applicable__checkbox"
            :input-value="checkbox[form._id + 'na']"
            :disabled="form.disabled"
            hide-details
            @mousedown.stop.prevent
            @click.stop.prevent
            @change="
              (v) => {
                updateValue(form._id + 'na', v);
              }
            "
          >
            <template #label>
              <span class="unhcr-checkbox-group-non-applicable__checkbox__label"
                >not applicable
              </span>
            </template>
          </v-checkbox>
          <v-btn icon @click="toggle">
            <v-icon :class="{ 'chevron-rotate': !show }"
              >$mdiChevronDown</v-icon
            >
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-show="show" class="d-print-none">
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-expand-transition>
        <v-row v-show="show">
          <v-col cols="12" class="pt-0">
            <v-expansion-panels
              class="checkbox-group-panels"
              accordion
              :focusable="false"
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
                    :disabled="child.disabled || checkbox[form._id + 'na']"
                    hide-details
                    :indeterminate="checkbox[child._id] === undefined"
                    @mousedown.stop.prevent
                    @click.stop.prevent
                    @change="(v) => updateValue(child._id, v)"
                  >
                    <template #label>
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

type ScoreBoolean = Record<string, boolean | undefined>;
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

  public getProperValueOfId(key: string, oldValue: Score): boolean | undefined {
    let result;
    if (Object.prototype.hasOwnProperty.call(oldValue, key)) {
      const old = oldValue?.[key] === undefined ? undefined : oldValue?.[key];
      if (typeof old === "number") {
        result = old >= 0;
      }
      if (typeof old === "boolean") {
        result = old;
      }
    } else {
      result = undefined;
    }
    return result;
  }
  // represents the value of the checkbox group by having the id of the checkbox as key and the value as boolean
  get checkbox(): ScoreBoolean {
    const newValue = {} as ScoreBoolean;
    const oldValue = this.value ?? {};
    this.form.children?.forEach((input) => {
      newValue[input._id] = this.getProperValueOfId(input._id, oldValue);
      newValue[input._id + "na"] = undefined;
    });

    newValue[this.form._id] = this.getProperValueOfId(this.form._id, oldValue);
    newValue[this.form._id + "na"] = this.getProperValueOfId(
      this.form._id + "na",
      oldValue
    );
    return newValue;
  }

  public isShelterFormInput(obj: any): obj is ShelterFormInput {
    return obj.score !== undefined;
  }

  get completed(): boolean {
    if (this.checkbox[this.form._id + "na"] === true) {
      return true;
    }
    const result = this.form.children?.find((input) => {
      if (
        this.isShelterFormInput(input) &&
        ((this.checkbox?.[input._id] ?? -1) as number) >= 0
      ) {
        return true;
      }
    });
    return result !== undefined;
  }

  get highestScore(): number {
    let highestScore = 0;
    this.form.children?.forEach((child) => {
      if (this.isShelterFormInput(child) && child.score > highestScore) {
        highestScore = child.score;
      }
    });
    return highestScore;
  }

  updateValue(updatedKey: string, updatedValue: boolean): void {
    const newValue = this.value ?? {};
    const child = this.form.children?.find(
      (el: ShelterFormChild) => el._id === updatedKey
    ) as ShelterFormInput;

    this.form.children.forEach((el: ShelterFormChild): void => {
      newValue[el._id] = undefined;
    });
    // highest score for
    // reset every other field!
    if (updatedKey !== this.form._id + "na") {
      if (updatedValue) {
        newValue[updatedKey] = child?.score ?? 0;
      } else {
        newValue[updatedKey] = undefined;
      }
    } else {
      newValue[updatedKey] = updatedValue ? this.highestScore : undefined;
    }
    this.$emit("input", newValue);
  }
}
</script>

<style lang="scss" scoped>
.unhcr-expansion-panel {
  ::v-deep .v-expansion-panel-header {
    display: grid;
    grid-auto-columns: 1;
    grid-auto-flow: column;
    grid-template-columns: auto max-content min-content;
    .v-input--selection-controls {
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
    ::v-deep .v-expansion-panel-header {
      min-height: 24px;
      padding: 0;
      .v-input--selection-controls {
        margin-top: 0px;
        padding-top: 0px;
        width: 100%;
      }
      .v-input__control {
        .v-input__slot {
          padding: 0;
          margin: 0;
          .v-input--selection-controls__input {
            height: 10px;
            width: 10px;
            padding: 0px;
          }
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
