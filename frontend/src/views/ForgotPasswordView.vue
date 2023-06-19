<template>
  <v-container class="login" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm9 md6 lg5>
        Forgot password form
        <!-- <login-component /> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
// import LoginComponent from "../components/LoginComponent.vue";

export default Vue.extend({
  name: "ForgotPasswordView",
  // components: {
  //   LoginComponent,
  // },
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },
});
</script>
