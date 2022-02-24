<template>
  <v-container fluid>
    <v-row>
      <v-col> Step 1 Energy Survey </v-col>
    </v-row>

    <v-row>
      <v-col> Step 1.a Energy Cooking </v-col>
    </v-row>

    <v-row>
      <v-col> Step 1.b Energy Lighting </v-col>
    </v-row>

    <v-row>
      <v-col> Step 1.c Energy Pumping </v-col>
    </v-row>
    <v-row>
      <v-col> <v-select></v-select> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-footer>
          <router-link :to="{ name: 'GreenHouseGazStep2' }"
            ><v-btn> go to: Step 2 WASH</v-btn></router-link
          >
        </v-footer>
      </v-col>
    </v-row>
  </v-container>
</template>
