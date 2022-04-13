<template>
  <v-row>
    <v-col class="about-first-column d-flex justify-center" lg="12">
      <v-responsive aspect-ratio="2.5" min-height="200">
        <v-chart autoresize :option="option" @click="click"></v-chart>
      </v-responsive>
    </v-col>
  </v-row>
</template>
