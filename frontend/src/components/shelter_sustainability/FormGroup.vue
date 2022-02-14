<template>
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
      <v-col class="d-flex justify-end align-center" v-if="depth > 0">
        <v-btn icon @click="toggle">
          <v-icon :class="{ 'chevron-rotate': !show }">mdi-chevron-down</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-form v-show="show">
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
                :form="child"
                :value="value[child._id]"
                @input="(v) => update(child._id, v)"
                :is="child.type"
                :depth="depth + 1"
              ></component>
            </v-sheet>
          </v-col>
        </v-row>
      </v-form>
    </v-expand-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ShelterPerformance, Score } from "@/store/ShelterInterface";
import ShelterForm from "@/components/shelter_sustainability/ShelterForm";
import CheckboxGroup from "@/components/shelter_sustainability/CheckboxGroup.vue";
import RadioGroup from "@/components/shelter_sustainability/RadioGroup.vue";

@Component({
  components: {
    RadioGroup,
    CheckboxGroup,
  },
  props: {
    form: {
      type: Object as () => ShelterForm,
    },
    value: {
      type: Object as () => ShelterPerformance,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
})
/** FormGroup */
export default class FormGroup extends Vue {
  value!: ShelterPerformance;
  form!: ShelterForm;

  show = true;
  public toggle() {
    this.show = !this.show;
  }
  public update(formId: string, value: Score) {
    this.value[formId] = value;
    this.$emit("input", this.value);
  }
}
</script>

<style lang="scss" scoped>
.chevron-rotate {
  transform: rotate(180deg);
}
</style>
