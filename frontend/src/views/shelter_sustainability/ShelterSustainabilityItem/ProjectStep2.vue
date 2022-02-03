<template>
  <v-container>
    <v-main>
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
    </v-main>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
/** Project */
export default class Step2 extends Vue {}
</script>
