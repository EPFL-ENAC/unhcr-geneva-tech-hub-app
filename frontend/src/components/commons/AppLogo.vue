<template>
  <v-footer class="custom-footer-logo" :light="false">
    <div class="logos-container align-center">
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
    </div>
    <div class="logos-container align-center">
      <span>EPFL contributing labs and centers:</span>
      <v-sheet
        v-for="(logo, $key) in labLogos"
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
    </div>
  </v-footer>
</template>

<script lang="ts">
import { labLogos, logos } from "@/components/commons/logos";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppLogo extends Vue {
  logos = logos;
  labLogos = labLogos;
}
</script>

<style lang="scss" scoped>
.v-footer.custom-footer-logo.v-sheet.theme--light {
  background-color: white;

  border-top: 1px solid #f5f5f5;
}
.custom-footer-logo {
  display: flex;
  flex-direction: column;
}
.logos-container {
  display: flex;
  flex-direction: row;
}
</style>
