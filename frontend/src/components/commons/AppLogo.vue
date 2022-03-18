<template>
  <v-footer class="custom-footer-logo" :light="false">
    <v-sheet
      class="mx-auto"
      max-width="250"
      v-for="(logo, $key) in logos"
      :key="$key"
    >
      <a :href="logo.urlDescription" target="_blank">
        <v-img height="100" contain :src="logo.imgPath"></v-img>
      </a>
    </v-sheet>
  </v-footer>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppLogo extends Vue {
  logos = [
    {
      imgPath: "/app_logo_new/EssentialTech_Logo_3.png",
      urlDescription: "https://essentialtech.center/hth/",
    },
    {
      imgPath: "/app_logo_new/logo 1.png",
      urlDescription:
        "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
    },
    {
      imgPath: "/app_logo_new/SLL-LOGO-SQUARE-RVB.png",
      urlDescription: "https://www.smartlivinglab.ch/fr/",
    },
    {
      imgPath: "/app_logo_new/Logo_FAR.jpg",
      urlDescription: "https://www.epfl.ch/labs/far/",
    },
    {
      imgPath: "/app_logo_new/enac-it4r.png",
      urlDescription: "https://it4r.super.site/",
    },
    // "/app_logo_new/logo 2.png",
    // "/app_logo_new/Logo_UNHCR.svg",
    // "/app_logo_new/Swiss Agency for Development and Cooperation (SDC) card.jpeg",
  ];
}
</script>

<style lang="scss" scoped>
.v-footer.custom-footer-logo.v-sheet.theme--light {
  background-color: white;

  border-top: 1px solid #f5f5f5;
}
</style>
