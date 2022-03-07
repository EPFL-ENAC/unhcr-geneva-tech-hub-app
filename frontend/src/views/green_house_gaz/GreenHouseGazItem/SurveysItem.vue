<template>
  <v-container fluid>
    <!-- {{ currentSurvey }} -->
    <v-tabs
      class="fixed-tabs-bar"
      centered
      background-color="white"
      grow
      :show-arrows="true"
      elevation="2"
    >
      <template v-for="item in menuItems">
        <v-tab :key="item.to" :to="{ name: item.to }">
          {{ item.text }}
        </v-tab>
      </template>
    </v-tabs>
    <v-row>
      <v-col>
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
  },
})
/** ProjectList */
export default class SurveyList extends Vue {
  project !: GreenHouseGaz;

  readonly menuItems: MenuItem[] = [
    { text: "Energy", to: "GreenHouseGazStep1" },
    { text: "Wash", to: "GreenHouseGazStep2" },
    { text: "Offset", to: "GreenHouseGazStep3" },
  ];

  public get currentSurvey(): Survey | undefined {
    if (!this.project) {
      return;
    } 
    const foundSurvey = this.project.surveys
      .find((el: Survey) => el.name === this.$route.params.surveyId);
    if (!foundSurvey) {
      throw new Error("Could not find matching survey");
    }
    return foundSurvey;
  }
}

interface MenuItem {
  text: string;
  to: string;
  children?: MenuItem[];
}
</script>
