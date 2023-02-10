<template>
  <v-container fluid>
    <v-row
      v-if="form.title"
      :class="{
        'v-tabs fixed-tabs-bar d-flex d-print-none v-tabs--centered v-tabs--grow theme--light':
          depth == 0,
      }"
    >
      <v-col :cols="depth > 0 ? 11 : 12" class="d-flex v-tabs-bar">
        <component
          :is="`h${depth + 2}`"
          :class="`text-h${depth + 4} project__h${
            depth + 3
          }  font-weight-medium`"
          >{{ form.title }}</component
        >

        <info-tooltip v-if="infoTooltipText[$route.name] && depth === 0">
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
        <span
          v-if="result"
          :class="`text-h${depth + 5} project__h${
            depth + 3
          }  font-weight-medium`"
        >
          ({{ result }})
        </span>
      </v-col>
      <v-col v-if="depth > 0" cols="1" class="d-flex justify-end align-center">
        <v-btn icon @click="toggle">
          <v-icon :class="{ 'chevron-rotate': !showSubPanel }"
            >$mdiChevronDown</v-icon
          >
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-form v-show="showSubPanel">
        <v-row>
          <v-col>
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-spacer />
        <v-row v-for="(child, $index) in form.children" :key="$index">
          <v-col>
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
  form!: ShelterForm;

  showSubPanel = true;
  infoTooltipText = infoTooltipText;
  public toggle(): void {
    this.showSubPanel = !this.showSubPanel;
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
</style>
