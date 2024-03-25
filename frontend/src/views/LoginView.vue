<template>
  <v-container class="login" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm9 md6 lg5>
        <login-component />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import LoginComponent from "@/components/LoginComponent.vue";
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "LoginView",
  components: {
    LoginComponent,
  },
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },
});
</script>
