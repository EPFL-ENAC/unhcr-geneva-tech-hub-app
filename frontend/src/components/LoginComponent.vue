<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Welcome!</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="formValid" @submit.prevent="submitLoginForm">
      <v-card-text>
        <v-text-field
          outlined
          v-model="username"
          label="Login"
          prepend-icon="mdi-account"
          placeholder=" "
          persistent-placeholder
          required
          type="text"
        />
        <v-text-field
          outlined
          v-model="password"
          label="Password"
          placeholder=" "
          persistent-placeholder
          prepend-icon="mdi-lock"
          required
          hide-details="true"
          type="password"
        />
        <span class="error--text">{{ error }}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!formValid"
          @click="submitLoginAsGuest"
        >
          Login as guest
        </v-btn>
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
    ...mapActions("UserModule", ["login", "loginAsGuest", "logout"]),
  },
})
export default class LoginComponent extends Vue {
  formValid = false;
  username = "";
  password = "";
  error = "";
  login!: (doc: UserCouchCredentials) => AxiosPromise;
  loginAsGuest!: () => AxiosPromise;

  public get destinationRouteName(): string {
    const currentRouteName = this.$router.currentRoute.name as string;
    return currentRouteName === "Login" ? "Apps" : currentRouteName;
  }
  submitLoginAsGuest(): void {
    this.username = "";
    this.password = ""; // to show visually the change

    this.loginAsGuest().then(() => {
      this.$router.push({ name: this.destinationRouteName });
    });
  }
  submitLoginForm(): void {
    this.error = "";
    const { username, password } = this;
    this.login({ username, password })
      .then(() => {
        this.$router.push({ name: this.destinationRouteName });
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
