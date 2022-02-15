<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="project-shelter__header">Score Card</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-divider></v-divider>
    </v-row>
    <v-spacer />
    <v-row>Habitability: {{ shelter.habitability_score }}</v-row>
    <v-row
      >Technical performance: {{ shelter.technical_performance_score }}
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState("ShelterItemModule", ["shelter"]),
  },
})
/** Project */
export default class ShelterSustainabilityScoreCardView extends Vue {}
</script>
