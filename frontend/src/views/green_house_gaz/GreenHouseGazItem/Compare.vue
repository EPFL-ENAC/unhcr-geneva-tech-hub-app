<template>
  <v-container>
    <v-row>
      <v-col :cols="6">
        <v-select
          tabindex="0"
          v-model="base"
          :items="['2022', '2021', '2020']"
          label="baseline"
        >
        </v-select>
      </v-col>
      <v-col :cols="6">
        <v-select
          tabindex="1"
          v-model="next"
          :items="['2022', '2021', '2020']"
          label="projected"
        >
        </v-select>
      </v-col>
    </v-row>
    <!-- <v-row> -->
    <!-- <v-col cols="12">
        <v-img class="d-flex justify-center" src="/ghg/compare.png"></v-img>
      </v-col> -->
    <!-- <v-col :cols="6">graph 0 Facilities</v-col>
      <v-col :cols="6">graph 1 WASH</v-col>
      <v-col :cols="6">graph 2 Shelter and Site</v-col>
      <v-col :cols="6">graph 3 Sequestration</v-col> -->
    <!-- </v-row> -->
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
/** ProjectItem */
export default class CompareItem extends Vue {
  base = "2020";
  next = "2022";
}
</script>

<style></style>
