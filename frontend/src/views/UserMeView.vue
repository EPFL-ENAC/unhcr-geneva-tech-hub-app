<template>
  <v-container class="login" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm9 md6 lg5>
        User view
        <ul v-if="$userIs('Guest')">
          <li>Is not authenticated: behave as authenticated guest user</li>
          <li>
            Roles:
            {{
              $userIs("Admin") ? "admin" : $userIs("Guest") ? "guest" : "user"
            }}
          </li>
          <li>Name: {{ user.name }}</li>
          <li>Authentication mode: CouchDB cookie though cookie is empty</li>
        </ul>

        <ul v-else>
          <li>Is authenticated</li>
          <li>
            Roles:
            {{
              $userIs("Admin") ? "admin" : $userIs("Guest") ? "guest" : "user"
            }}
          </li>
          <li>Name: {{ user.name }}</li>
          <li>
            Authentication mode:
            {{ $userIs("Azure") ? "AD" : "CouchDB cookie" }}
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "UserMeView",
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },
});
</script>
