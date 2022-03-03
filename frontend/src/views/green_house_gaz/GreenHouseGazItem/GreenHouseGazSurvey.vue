<template>
  <v-container fluid>
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
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("GhgListModule", ["countries"]),
  },

  methods: {
    ...mapActions("GhgListModule", [
      "syncDB",
      "getCountries",
      "addDoc",
      "closeDB",
    ]),
  },
})
/** ProjectList */
export default class SurveyList extends Vue {
  readonly menuItems: MenuItem[] = [
    { text: "Energy", to: "GreenHouseGazStep1" },
    { text: "Wash", to: "GreenHouseGazStep2" },
    { text: "Offset", to: "GreenHouseGazStep3" },
  ];
}

interface MenuItem {
  text: string;
  to: string;
  children?: MenuItem[];
}
</script>
