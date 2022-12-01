<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- Will show stats -->
        <v-alert type="warning">
          <i
            ><v-icon>$mdiWrench</v-icon> This module of the Shelter Tool is
            under development</i
          >
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
/** ProjectList */
export default class ShelterSustainabilityOverview extends Vue {
  newName = "";
}
</script>

<style scoped lang="scss"></style>
