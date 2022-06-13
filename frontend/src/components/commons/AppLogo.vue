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
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppLogo extends Vue {
  logos = [
    {
      imgPath: "/app_logo_new/geneva_tech_hub.png",
      label: "geneva_tech_hub",
      urlDescription:
        "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
    },
    {
      imgPath: "/app_logo_new/Logo_UNHCR.png",
      label: "Logo_UNHCR",
      urlDescription:
        "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
    },
    {
      imgPath: "/app_logo_new/sdc_2.png",
      label: "geneva technical hub brochure",
      urlDescription:
        "https://www.unhcr.org/publications/brochures/6229f4184/geneva-technical-hub-brochure.html",
    },

    {
      imgPath: "/app_logo_new/EPFL.png",
      label: "EPFL",
      urlDescription: "https://epfl.ch",
      height: "30px",
    },
    {
      imgPath: "/app_logo_new/EssentialTech_Logo_5.png",
      label: "essential tech",
      urlDescription: "https://essentialtech.center/hth/",
    },
    {
      imgPath: "/app_logo_new/gnasounougroup1.jpg",
      label: "energy planning lab",
      urlDescription: "https://www.epfl.ch/labs/bpe/",
    },
    {
      imgPath: "/app_logo_new/SLL-LOGO-SQUARE-RVB.png",
      label: "smart living lab",
      urlDescription: "https://www.smartlivinglab.ch/fr/",
      height: "60px",
    },
    {
      imgPath: "/app_logo_new/Logo_FAR.webp",
      label: "FAR",
      urlDescription: "https://www.epfl.ch/labs/far/",
      height: "60px",
    },
    {
      imgPath: "/app_logo_new/enac-it4r.png",
      label: "enac-it4r",
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
