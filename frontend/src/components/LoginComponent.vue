<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="formValid" @submit.prevent="submitLoginForm">
      <v-card-text>
        <v-text-field
          v-model="username"
          label="Login"
          prepend-icon="mdi-account"
          required
          type="text"
        />
        <v-text-field
          v-model="password"
          label="Password"
          prepend-icon="mdi-lock"
          required
          type="password"
        />
        <span class="error--text">{{ error }}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="!formValid" type="submit">
          Login
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { UserCouchCredentials } from "@/store/UserModule";
import { AxiosError, AxiosPromise } from "axios";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },

  methods: {
    ...mapActions("UserModule", ["login", "logout"]),
  },
})
export default class LoginComponent extends Vue {
  formValid = false;
  username = "";
  password = "";
  error = "";
  login!: (doc: UserCouchCredentials) => AxiosPromise;

  submitLoginForm(): void {
    this.error = "";
    const { username, password } = this;
    this.login({ username, password })
      .then(() => {
        this.$router.push("/apps");
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          case 401:
            this.error = "Invalid credentials";
            break;
          default:
            this.error = error.message;
        }
      });
  }
}
</script>
