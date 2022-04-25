<template>
  <v-footer class="custom-footer-logo" :light="false">
    <v-sheet
      class="mx-auto px-4"
      max-width="170"
      min-width="150"
      v-for="(logo, $key) in logos"
      :key="$key"
    >
      <a :href="logo.urlDescription" target="_blank">
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
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppLogo extends Vue {
  logos = [
    {
      imgPath: "/app_logo_new/geneva_tech_hub.png",
      urlDescription:
        "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
    },
    {
      imgPath: "/app_logo_new/Logo_UNHCR.png",
      urlDescription:
        "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
    },
    {
      imgPath: "/app_logo_new/sdc_2.png",
      urlDescription:
        "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
    },

    {
      imgPath: "/app_logo_new/EPFL.png",
      urlDescription: "https://epfl.ch",
      height: "30px",
    },
    {
      imgPath: "/app_logo_new/EssentialTech_Logo_5.png",
      urlDescription: "https://essentialtech.center/hth/",
    },
    {
      imgPath: "/app_logo_new/gnasounougroup1.jpg",
      urlDescription: "https://www.epfl.ch/labs/bpe/",
    },
    {
      imgPath: "/app_logo_new/SLL-LOGO-SQUARE-RVB.png",
      urlDescription: "https://www.smartlivinglab.ch/fr/",
      height: "60px",
    },
    {
      imgPath: "/app_logo_new/Logo_FAR.jpg",
      urlDescription: "https://www.epfl.ch/labs/far/",
      height: "60px",
    },
    {
      imgPath: "/app_logo_new/enac-it4r.png",
      urlDescription: "https://enac-it4r.epfl.ch/",
    },
  ];
}
</script>

<style lang="scss" scoped>
.v-footer.custom-footer-logo.v-sheet.theme--light {
  background-color: white;

  border-top: 1px solid #f5f5f5;
}
</style>
