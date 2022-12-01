<template>
  <v-container fluid>
    <v-tabs>
      <v-tab :to="{ name: 'ShelterSustainabilityList', query: $route.query }"
        >All shelters</v-tab
      >
      <v-tab :to="{ name: 'ShelterSustainabilityCompare', query: $route.query }"
        >Compare</v-tab
      >
      <v-tab
        :to="{ name: 'ShelterSustainabilityOverview', query: $route.query }"
        >Overview</v-tab
      >
    </v-tabs>
    <router-view />
  </v-container>
</template>
