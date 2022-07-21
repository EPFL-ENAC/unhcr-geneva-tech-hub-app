<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Welcome!</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="formValid" @submit.prevent="loginCouchdb">
      <v-card-text>
        <v-text-field
          id="username"
          v-model="username"
          outlined
          label="Login"
          prepend-icon="$mdiAccount"
          placeholder=" "
          persistent-placeholder
          required
          type="text"
          name="username"
        />
        <v-text-field
          id="current-password"
          v-model="password"
          outlined
          name="current-password"
          autocomplete="current-password"
          label="Password"
          placeholder=" "
          persistent-placeholder
          prepend-icon="$mdiLock"
          required
          hide-details="true"
          type="password"
        />
        <span class="error--text">{{ error }}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="loginGuest">Login as guest</v-btn>
        <v-btn color="primary" text @click="loginUnhcr">UNHCR Login</v-btn>
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
import { v4 as uuidv4 } from "uuid";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },

  methods: {
    ...mapActions("UserModule", [
      "login",
      "loginAsGuest",
      "logout",
      "loginToken",
    ]),
  },
})
export default class LoginComponent extends Vue {
  readonly jwtPattern =
    /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\\+\\/=]*)$/;

  formValid = false;
  username = "";
  password = "";
  error = "";
  login!: (doc: UserCouchCredentials) => AxiosPromise;
  loginAsGuest!: () => AxiosPromise;
  loginToken!: (token: string) => AxiosPromise;

  created(): void {
    if (this.$route.hash) {
      const params = new URLSearchParams(this.$route.hash.substring(1));
      const idToken = params.get("id_token");
      if (idToken) {
        this.loginToken(idToken)
          .then(() => {
            // push to current route if not current route
            if (this.$route.name !== this.destinationRouteName) {
              this.$router.push({ name: this.destinationRouteName });
            }
          })
          .catch((error: Error) => {
            if (this.jwtPattern.test(idToken)) {
              this.error = `${error} AND Invalid token: ${idToken}`;
            } else {
              this.error = `Invalid token format or other: ${error}`;
            }
          });
      }
    }
  }

  public get destinationRouteName(): string {
    const currentRouteName = this.$router.currentRoute.name as string;
    return currentRouteName === "Login" ? "Apps" : currentRouteName;
  }
  loginGuest(): void {
    this.username = "";
    this.password = ""; // to show visually the change

    this.loginAsGuest().then(() => {
      if (this.$route.name !== this.destinationRouteName) {
        this.$router.push({ name: this.destinationRouteName });
      }
    });
  }
  loginUnhcr(): void {
    const url: URL = new URL(
      `https://login.microsoftonline.com/${process.env.VUE_APP_AUTH_TENANT_ID}/oauth2/v2.0/authorize`
    );
    url.searchParams.append("client_id", process.env.VUE_APP_AUTH_CLIENT_ID);
    url.searchParams.append("nonce", uuidv4());
    url.searchParams.append("response_type", "id_token");
    url.searchParams.append("scope", "openid email");
    window.location.href = url.href;
  }
  loginCouchdb(): void {
    this.error = "";
    const { username, password } = this;
    this.login({ username, password })
      .then(() => {
        if (this.$route.name !== this.destinationRouteName) {
          this.$router.push({ name: this.destinationRouteName });
        }
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
