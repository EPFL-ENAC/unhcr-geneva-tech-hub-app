<template>
  <v-container>
    <v-row>
      <v-col :cols="6">
        <v-select
          tabindex="0"
          v-model="base"
          :items="['march', 'july', 'august']"
          label="Select date"
        >
        </v-select>
      </v-col>
      <v-col :cols="6">
        <v-select
          tabindex="1"
          v-model="next"
          :items="['march', 'july', 'august']"
          label="Select date"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">graph 0 Facilities</v-col>
      <v-col :cols="6">graph 1 WASH</v-col>
      <v-col :cols="6">graph 2 Shelter and Site</v-col>
      <v-col :cols="6">graph 3 Sequestration</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
/** ProjectItem */
export default class CompareItem extends Vue {
  base = "ae";
  next = "ae";
}
</script>

<style></style>
