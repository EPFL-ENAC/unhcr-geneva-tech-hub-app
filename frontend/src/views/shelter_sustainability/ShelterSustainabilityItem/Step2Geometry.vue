<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="project-shelter__header">Geometry</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-divider></v-divider>
    </v-row>
    <v-spacer />
    <v-row>
      <v-col>
        <v-img
          :alt="squared - house"
          src="/houses/square_house.png"
          width="140px"
        />
      </v-col>
      <v-col>
        <v-img
          :alt="squared - house"
          src="/houses/square_house.png"
          width="140px"
        />
      </v-col>
      <v-col>
        <v-img
          :alt="squared - house"
          src="/houses/square_house.png"
          width="140px"
        />
      </v-col>
      <v-col>
        <v-img
          :alt="squared - house"
          src="/houses/square_house.png"
          width="140px"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
/** Project */
export default class Step2 extends Vue {}
</script>
