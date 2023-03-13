<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Welcome!</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="formValid" @submit.prevent="loginCouchdb">
      <v-card-text v-show="showForm">
        <v-text-field
          id="username"
          v-model="username"
          autocomplete="username"
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
        <v-btn v-show="!showForm" @click="loginGuest">Guest user</v-btn>
        <v-btn
          v-show="!showForm"
          :disabled="!formValid"
          @click="showForm = true"
        >
          Registered user
        </v-btn>
        <v-btn v-show="showForm" @click="showForm = false">Cancel</v-btn>
        <v-btn v-show="showForm" type="submit" color="primary">Login</v-btn>
        <v-btn v-show="!showForm" color="primary" @click="loginUnhcr"
          >UNHCR user</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { UserCouchCredentials } from "@/store/UserModule";
import { AxiosError, AxiosPromise } from "axios";
import getPkce from "oauth-pkce";
import { v4 as uuidv4 } from "uuid";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

import { logoutCookie } from "@/utils/couchdb";
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
      "verifyCode",
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
  showForm = false;
  login!: (doc: UserCouchCredentials) => AxiosPromise;
  loginAsGuest!: () => AxiosPromise;
  loginToken!: ({ token }: Record<string, string | boolean>) => AxiosPromise;
  verifyCode!: ({
    code,
    code_verifier,
  }: Record<string, string>) => AxiosPromise;

  public tokenFlow(token: string): Promise<void> {
    return this.loginToken({ token })
      .then(() => {
        // push to current route if not current route
        if (this.$route.name !== this.destinationRouteName) {
          this.$router.push({ name: this.destinationRouteName });
        }
      })
      .catch((error: Error) => {
        if (this.jwtPattern.test(token)) {
          this.error = `${error} AND Invalid token: ${token}`;
        } else {
          this.error = `Invalid token format or other: ${error}`;
        }
      });
  }

  async created(): Promise<void> {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get("id_token");
    // todo : maybe broadcast an event
    if (idToken) {
      await logoutCookie();
      // implicit flow (DEPRECATED)
      this.tokenFlow(idToken);
    }

    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    const code_verifier = sessionStorage.getItem("verifier");
    if (code && code_verifier) {
      // code flow with PKCE (new authorization mode 6th march 2022)
      await logoutCookie();
      const response = await this.verifyCode({ code, code_verifier });
      this.tokenFlow(response.data.id_token);
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
  async loginUnhcr(): Promise<void> {
    interface PKCE {
      verifier: string;
      challenge: string;
    }
    const { verifier, challenge } = await new Promise<PKCE>((resolve, reject) =>
      getPkce(43, (error, { verifier, challenge }) => {
        if (!error) {
          resolve({ verifier, challenge });
        }
        reject(error);
      })
    );
    sessionStorage.setItem("verifier", verifier);
    sessionStorage.setItem("challenge", challenge);
    const url: URL = new URL(
      `https://login.microsoftonline.com/${process.env.VUE_APP_AUTH_TENANT_ID}/oauth2/v2.0/authorize`
    );
    url.searchParams.append("client_id", process.env.VUE_APP_AUTH_CLIENT_ID);
    url.searchParams.append("nonce", uuidv4());
    // url.searchParams.append("response_type", "id_token"); for implicit flow
    url.searchParams.append("response_type", "code");
    url.searchParams.append("response_mode", "query"); // web_message ?

    const state = uuidv4();
    url.searchParams.append("state", state);
    sessionStorage.setItem("state", state);
    url.searchParams.append("scope", "openid email profile offline_access");

    url.searchParams.append("code_challenge", challenge);
    url.searchParams.append("code_challenge_method", "S256");
    const suffix = window.location.hostname === "localhost" ? "" : "/auth";
    url.searchParams.append("redirect_uri", window.location.origin + suffix);

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
