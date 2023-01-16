<template>
  <v-container fluid>
    <header class="justify-space-between align-center d-none d-print-flex">
      <h2 class="font-weight-bold primary--text text-h2">
        Shelter and Sustainability
      </h2>
      <!-- / + logo + hr blue + project name -->
      <!-- d-none d-lg-block d-print-block -->
      <figure>
        <img
          :src="unhcr_logo.imgPath"
          :height="unhcr_logo.height || '100px'"
          alt="UNHCR LOGO"
        />
      </figure>
    </header>
    <hr
      class="d-none d-print-flex font-weight-bold justify-space-between align-center primary my-4"
    />
    <router-view />
  </v-container>
</template>

<script setup>
import { unhcr_logo } from "@/components/commons/logos";
</script>
