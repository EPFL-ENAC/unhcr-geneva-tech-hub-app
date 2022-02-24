<template>
  <v-container fluid>
    <v-row>
      <router-link :to="{ name: 'GreenHouseGazEdit', params: $route.params }">
        <v-btn> go back to camp view</v-btn>
      </router-link>
    </v-row>
    <v-row>
      <v-col>
        Compare surveys {{ decodeURIComponent($route.params.surveyId) }}
      </v-col>
    </v-row>
  </v-container>
</template>
