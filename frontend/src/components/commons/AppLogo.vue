<template>
  <v-footer class="custom-footer-logo" :light="false">
    <v-sheet
      v-for="(logo, $key) in logos"
      :key="$key"
      class="mx-auto px-4"
      max-width="170"
      min-width="150"
    >
      <a :href="logo.urlDescription" target="_blank" :aria-label="logo.label">
        <v-img
          :height="logo.height || '100px'"
          contain
          :src="logo.imgPath"
        ></v-img>
      </a>
    </v-sheet>
  </v-footer>
</template>

<script lang="ts">
import { logos } from "@/components/commons/logos";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppLogo extends Vue {
  logos = logos;
}
</script>

<style lang="scss" scoped>
.v-footer.custom-footer-logo.v-sheet.theme--light {
  background-color: white;

  border-top: 1px solid #f5f5f5;
}
</style>
