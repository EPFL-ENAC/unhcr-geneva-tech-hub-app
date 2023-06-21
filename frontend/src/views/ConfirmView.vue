<template>
  <v-container class="login" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm9 md6 lg5>
        <confirm-user-component />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import ConfirmUserComponent from "../components/ConfirmUserComponent.vue";

export default Vue.extend({
  name: "ConfirmView",
  components: {
    ConfirmUserComponent,
  },
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },
});
</script>
