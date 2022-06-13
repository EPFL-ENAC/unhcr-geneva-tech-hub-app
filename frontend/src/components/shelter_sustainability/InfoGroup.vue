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
            >{{ info.id }}</component
          >
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
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-html="info.description"></p>
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
  },
})
/** InfoGroup */
export default class InfoGroup extends Vue {
  info!: Record<string, string>;

  expandPanel = true;

  public toggle(): void {
    this.expandPanel = !this.expandPanel;
  }
}

interface Info {
  id: string;
  description: string;
}
</script>
