<template>
  <v-container fluid>
    <v-tabs v-model="tab" background-color="primary">
      <v-tab v-for="item in menuItems" :key="item.tab">
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in menuItems" :key="item.tab">
        <v-card flat>
          <v-card-text>{{ item.content }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
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
  readonly menuItems: MenuSurveyItem[] = [
    { tab: "Cooking", content: "cookingContent" },
    { tab: "Lighting", content: "LightingContent" },
    { tab: "Pumping", content: "PumpingContent" },
    { tab: "Facilities", content: "FacilitiesContent" },
  ];
  tab = 3;
}

interface MenuSurveyItem {
  tab: string;
  content: string;
}
</script>
