<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="formValid" @submit="login">
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
import { login } from "@/utils/couchdb";
import { AxiosError } from "axios";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class LoginComponent extends Vue {
  formValid = false;
  username = "";
  password = "";
  error = "";

  login(event: Event): void {
    event.preventDefault();
    this.error = "";
    login(this.username, this.password)
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
