<template>
  <v-container fluid v-if="shelter">
    <v-row>
      <v-col>
        <h2 class="text-h4 project-shelter__h3 font-weight-medium">
          Score Card
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-sheet elevation="2" rounded>
          <v-container fluid>
            <v-row>
              <v-col class="about-first-column d-flex justify-center" lg="12">
                {{ shelter.scorecard }}
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Shelter } from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
  },
})
/** Project */
export default class Step8ScoreCard extends Vue {
  shelter!: Shelter;
}
</script>
