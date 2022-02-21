<template>
  <v-container fluid>
    <v-row>
      <v-col> GreenHouseGazEditView: Edit project </v-col>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <router-link
            :to="{
              name: 'GreenHouseGazCompareSurveys',
              params: { surveyId: encodeURIComponent('survey-a') },
            }"
            >compare survey 'survey-a'
          </router-link>
        </v-row>
        <v-row>
          <router-link :to="{ name: 'GreenHouseGazSurvey' }"
            >add new survey
          </router-link>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
