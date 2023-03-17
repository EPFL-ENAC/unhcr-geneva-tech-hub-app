<template>
  <v-sheet elevation="2" rounded class="group-info-col-container">
    <v-container fluid>
      <v-row>
        <v-col cols="11" class="group-title">
          <component
            :is="`h${depth + 2}`"
            :class="`project-shelter__h${depth + 3}  font-weight-medium text-h${
              depth + 4
            }`"
            >{{ info.id }}</component
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
        <v-divider />
      </v-row>
      <v-expand-transition>
        <v-row v-show="expandPanel">
          <v-col cols="12">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p class="ma-0" v-html="info.description"></p>
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

<style lang="scss" scoped>
@media print {
  @page {
    size: auto;
  }
  .group-info-col-container {
    padding: 0 !important;
    page-break-before: auto;
    page-break-inside: avoid;
    box-shadow: none !important;
    font-size: 0.6rem;
    line-height: 0.7rem;
    .elevation-2 {
      box-shadow: none !important;
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
