<!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
<script setup lang="ts">
interface Props {
  text: string;
  configs?: tableTextWithIcon[];
}

export interface tableTextWithIcon {
  description: string;
  fill: string;
  icon?: string;
  text?: string;
}

defineProps<Props>();
</script>

<template>
  <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
  <div class="d-flex justify-left align-center">
    <span class="d-flex justify-left align-center" v-html="text"></span>
    <span v-for="config in configs" :key="config.icon" class="ml-2">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <template v-if="config.icon">
            <v-icon
              style="cursor: pointer"
              v-bind="attrs"
              :color="config.fill"
              v-on="on"
            >
              {{ config.icon }}</v-icon
            >
          </template>
          <template v-else>
            <span
              style="cursor: pointer"
              class="font-italic font-weight-light"
              v-bind="attrs"
              v-on="on"
            >
              {{ config.text }}
            </span>
          </template>
        </template>

        <span>{{ config.description }}</span>
      </v-tooltip>
    </span>
  </div>
</template>
