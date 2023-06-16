<template>
  <v-container fluid :class="`group-col-container__h${depth + 3}`">
    <v-row
      v-if="form.title"
      :class="{
        'unhcr-form-group v-tabs fixed-tabs-bar d-flex v-tabs--centered v-tabs--grow theme--light':
          depth == 0,
      }"
    >
      <v-col :cols="depth > 0 ? 11 : 12" class="d-flex v-tabs-bar align-center">
        <component
          :is="`h${depth + 2}`"
          :class="`project-shelter__h${depth + 3}  font-weight-medium text-h${
            depth + 4
          } `"
          >{{ form.title }}</component
        >

        <info-tooltip v-if="infoTooltipText[$route.name] && depth === 0">
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
        <span
          v-if="result"
          :class="`project-shelter__h${depth + 3}  font-weight-medium text-h${
            depth + 5
          } `"
        >
          &nbsp;({{ result }})
        </span>

        <v-spacer />
        <v-col v-if="depth == 0" class="col-auto d-flex align-center">
          <span class="mr-4">{{ form.title }} completed ?</span>
          <v-switch
            :value="value.completed"
            @change="(v) => updateFormInput('completed', v)"
          ></v-switch>
          <info-tooltip>
            Toggle switch to mark {{  form.title }} as completed
          </info-tooltip>
        </v-col>
      </v-col>
      <v-col
        v-if="depth > 0"
        cols="1"
        class="d-print-none d-flex justify-end align-center"
      >
        <v-btn icon @click="toggle">
          <v-icon :class="{ 'chevron-rotate': !showSubPanel }"
            >$mdiChevronDown</v-icon
          >
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-form v-show="showSubPanel" class="col">
        <v-row class="d-print-none">
          <v-col>
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-spacer />
        <v-row v-for="(child, $index) in form.children" :key="$index">
          <v-col class="group-col-container">
            <v-sheet elevation="2" rounded>
              <component
                :is="child.type"
                :form="child"
                :value="value"
                :depth="depth + 1"
                @input="(v) => update(v)"
              ></component>
            </v-sheet>
          </v-col>
        </v-row>
      </v-form>
    </v-expand-transition>
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import CheckboxGroup from "@/components/shelter_sustainability/CheckboxGroup.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import RadioGroup from "@/components/shelter_sustainability/RadioGroup.vue";
import { ShelterForm } from "@/components/shelter_sustainability/ShelterForm";
import { Score } from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "FormGroup",
  components: {
    RadioGroup,
    CheckboxGroup,
    InfoTooltip,
  },
  props: {
    form: {
      type: Object as () => ShelterForm,
      default: { title: "" },
    },
    value: {
      type: Object as () => Score,
    },
    result: {
      type: String,
      default: "",
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
})
/** FormGroup */
export default class FormGroup extends Vue {
  value!: Score;
  completed!: boolean;
  form!: ShelterForm;

  showSubPanel = true;
  infoTooltipText = infoTooltipText;
  public toggle(): void {
    this.showSubPanel = !this.showSubPanel;
  }

  public updateFormInput(field: string, v: boolean): void {
    const newValue = { ...this.value, [field]: v };
    this.$emit("input", newValue);
  }

  // Avoid mutating a prop directly since the value will be overwritten whenever
  // the parent component re-renders.
  // Instead, use a data or computed property based on the prop's value.
  // Prop being mutated: "value"
  public update(value: Score): void {
    const newValue = { ...this.value, ...value };
    this.$emit("input", newValue);
  }
}
</script>

<style lang="scss" scoped>
.chevron-rotate {
  transform: rotate(180deg);
}
@media print {
  @page {
    size: portrait;
  }
  .group-col-container {
    padding: 0 !important;
    page-break-before: auto;
    page-break-inside: avoid;
    .elevation-2 {
      box-shadow: none !important;
    }
  }
  .group-col-container__h3 {
    page-break-before: auto;
    page-break-inside: avoid;
  }
  .project-shelter__h3 {
    font-size: 0.9rem !important;
    line-height: 1.1rem;
  }
  .project-shelter__h4 {
    font-size: 0.8rem !important;
    line-height: 1rem;
  }
  .project-shelter__h5 {
    font-size: 0.7rem !important;
    line-height: 0.9rem;
  }
  .unhcr-form-group {
    position: inherit;
    position: inherit;
    height: 53px;
    padding-left: 11px;
    page-break-before: always;
    page-break-inside: avoid;
    .v-tabs-bar {
      padding-left: 0px;
      // padding-top: 0;
      padding-bottom: 0;
      // height: 2.1rem;
    }
  }
}
</style>
