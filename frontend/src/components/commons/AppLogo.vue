<template>
  <v-footer>
    <v-card
      class="mx-auto"
      max-width="344"
      outlined
      v-for="(path, $key) in logos"
      :key="$key"
    >
      <v-img height="100" contain :src="path"></v-img>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppLogo extends Vue {
  logos = [
    "/app_logo_new/EssentialTech_Logo_3.png",
    "/app_logo_new/logo 1.png",
    "/app_logo_new/SLL-LOGO-SQUARE-RVB.png",
    "/app_logo_new/Logo_FAR.jpg",
    // "/app_logo_new/logo 2.png",
    // "/app_logo_new/Logo_UNHCR.svg",
    // "/app_logo_new/Swiss Agency for Development and Cooperation (SDC) card.jpeg",
  ];
}
</script>

<style></style>
