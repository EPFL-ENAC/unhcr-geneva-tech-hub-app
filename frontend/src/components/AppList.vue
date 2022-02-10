<template>
  <v-container>
    <v-row>
      <v-col v-for="app in apps" :key="app.title">
        <v-card class="mx-auto" outlined min-height="250px" max-width="500px">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">UNHCR</div>
              <v-list-item-title class="text-h5 mb-1">
                {{ app.title }}
              </v-list-item-title>
              <v-list-item-subtitle
                >{{ app.description }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80" color="grey">
              <v-img :src="app.logo_img"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn
              outlined
              rounded
              text
              :to="{ name: 'ShelterSustainability' }"
            >
              Access
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AppList",
  data() {
    return {
      apps: [
        {
          title: "Green House Gaz",
          to: "GreenHouseGaz",
          logo_img: "/app_logo/ghg.png",
        },
        {
          title: "Shelter Sustainability",
          to: "ShelterSustainability",
          logo_img: "/app_logo/shelter.png",
          description:
            "A tool supporting comparative assessments of environmental impacts, technical performance, habitability and affordability of shelter designs used in humanitarian relief operations. ",
        },
        { title: "Energy", to: "", logo_img: "/app_logo/energy.png" },
      ],
    };
  },
});
</script>
