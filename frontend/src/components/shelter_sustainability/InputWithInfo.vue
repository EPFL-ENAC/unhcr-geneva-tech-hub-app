<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid class="my-4">
      <v-row>
        <v-col cols="11">
          <v-select
            :value="value"
            :items="risks"
            :label="info.id"
            :hint="info.id"
            persistent-hint
            single-line
            @input="(v) => $emit('input', v)"
            @change="(v) => $emit('change', v)"
          />
        </v-col>
        <v-col cols="1" class="d-flex justify-end align-center">
          <v-btn icon @click="toggle">
            <v-icon :class="{ 'chevron-rotate': !expandPanel }"
              >$mdiChevronDown</v-icon
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
            {{ info.description }}
          </v-col>
        </v-row>
      </v-expand-transition>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    info: {
      type: Object as () => Info,
    },
    depth: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: "",
    },
  },
})
/** InputWithInfo */
export default class InputWithInfo extends Vue {
  info!: Record<string, string>;
  expandPanel = false;

  risks: string[] = ["low", "medium", "high"];
  public toggle(): void {
    this.expandPanel = !this.expandPanel;
  }
}

interface Info {
  id: string;
  description: string;
}
</script>
