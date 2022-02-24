<template>
  <v-container fluid>
    <v-row>
      <v-col> Step 2 WASH </v-col>
    </v-row>
        <v-row>
      <v-col>
        <v-footer>
          <router-link :to="{ name: 'GreenHouseGazStep1' }"
            ><v-btn> go to: Step 1 Energy</v-btn></router-link
          >

          <router-link :to="{ name: 'GreenHouseGazStep3' }"
            ><v-btn> go to: Step 3 Offset</v-btn></router-link
          >
        </v-footer>
      </v-col>
    </v-row>
  </v-container>
</template>
