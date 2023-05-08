<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
interface Props {
  text: string;
  configs?: tableTextWithIcon[];
}

export interface tableTextWithIcon {
  description: string;
  fill: string;
  icon: string;
}

const props = defineProps<Props>();
</script>

<template>
  <!-- eslint-disable vue/no-v-text-v-html-on-component -->
  <div class="d-flex justify-left align-center">
    <span class="d-flex justify-left align-center" v-html="text"></span>
    <span v-for="(config, key) in configs" :key="key">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" :color="config.fill" v-on="on">
            {{ config.icon }}</v-icon
          >
        </template>

        <span>{{ config.description }}</span>
      </v-tooltip>
    </span>
  </div>
</template>
