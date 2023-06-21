<template>
  <v-container class="login" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm9 md6 lg5>
        <forgot-password-component />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import ForgotPasswordComponent from "../components/ForgotPasswordComponent.vue";

export default Vue.extend({
  name: "ForgotPasswordView",
  components: {
    ForgotPasswordComponent,
  },
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },
});
</script>
