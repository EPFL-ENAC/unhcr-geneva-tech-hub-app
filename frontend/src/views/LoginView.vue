<template>
  <v-container class="login" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <login-component />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoginComponent from "../components/LoginComponent.vue";

export default Vue.extend({
  name: "LoginView",

  components: {
    LoginComponent,
  },
});
</script>
