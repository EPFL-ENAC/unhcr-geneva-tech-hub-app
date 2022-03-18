<template>
  <v-container>
    <v-row v-if="$user('isLoggedOut')">
      <v-col>
        <v-alert type="warning"> You are not logged in </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="$user('isLoggedIn')">
      <v-col v-for="app in apps" :key="app.title">
        <v-hover v-slot="{ hover }">
          <v-card
            class="mx-auto d-flex flex-column"
            outlined
            min-height="250px"
            max-width="500px"
            :elevation="hover ? 12 : 2"
            :class="{ 'on-hover': hover }"
            :to="{ name: app.to }"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">UNHCR</div>
                <v-list-item-title class="text-h5 mb-1">
                  {{ app.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ app.description }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="80">
                <v-img v-if="app.logoImg" :src="app.logoImg"></v-img>
                <v-icon v-if="app.logoIcon" color="black" x-large>
                  {{ app.logoIcon }}
                </v-icon>
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions class="d-flex justify-end">
              <v-btn outlined rounded text :to="{ name: app.to }">
                Access
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppList extends Vue {
  readonly apps: {
    title: string;
    to: string;
    logoImg?: string;
    logoIcon?: string;
    description?: string;
  }[] = [
    {
      title: "Green House Gaz",
      to: "GreenHouseGaz",
      logoImg: "/app_logo/ghg.png",
    },
    {
      title: "Shelter Sustainability",
      to: "ShelterSustainability",
      logoImg: "/app_logo/shelter.png",

      description:
        "A tool supporting comparative assessments of environmental impacts, technical performance, habitability and affordability of shelter designs used in humanitarian relief operations. ",
    },
    {
      title: "Energy",
      to: "Energy",
      logoIcon: "mdi-flash",
    },
  ];
}
</script>

<style lang="scss" scoped>
.v-card {
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}

// .v-card:not(.on-hover) {
//   opacity: 0.8;
//  }
</style>
