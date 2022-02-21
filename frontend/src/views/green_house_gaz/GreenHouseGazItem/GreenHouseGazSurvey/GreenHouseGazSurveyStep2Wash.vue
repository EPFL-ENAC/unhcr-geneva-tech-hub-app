<template>
  <v-container fluid>
    <v-row>
      <v-col> Step 2 WASH </v-col>
    </v-row>
    <v-row>
      <v-col>
        <router-link :to="{ name: 'GreenHouseGazStep1' }"
          >got to: Step 1 Energy</router-link
        >
      </v-col>
      <v-col>
        <router-link :to="{ name: 'GreenHouseGazStep3' }"
          >got to: Step 3 Offset</router-link
        >
      </v-col>
    </v-row>
  </v-container>
</template>
