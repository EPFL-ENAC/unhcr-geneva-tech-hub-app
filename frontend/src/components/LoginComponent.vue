<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary" class="justify-center d-flex">
      <v-toolbar-title data-cy="loginWelcome">Login</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col>
        <v-form v-model="formValid" @submit.prevent="loginCouchdb">
          <v-card-text>
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
              name="password"
              autocomplete="current-password"
              label="Password"
              placeholder=" "
              persistent-placeholder
              prepend-icon="$mdiLock"
              :append-icon="passwordSecretToggle ? '$mdiEye' : '$mdiEyeOff'"
              :type="passwordInputType"
              required
              hide-details="true"
              @click:append="togglePassword"
            />
            <span class="error--text">{{ error }}</span>
          </v-card-text>
          <v-card-actions
            class="justify-center d-flex flex-column pa-4"
            style="margin-left: 33px; gap: 1rem"
          >
            <v-btn block type="submit" color="#006fa0" style="color: white"
              >Login</v-btn
            >
            <div>
              <v-btn
                text
                data-cy="unhcr-user-login"
                color="primary"
                :to="{ name: 'ForgotPassword' }"
                >Forgot password ?</v-btn
              >
            </div>
          </v-card-actions>
        </v-form>
      </v-col>
      <v-col>
        <v-form v-model="formValid" @submit.prevent="loginCouchdb">
          <v-card-actions
            class="justify-center d-flex flex-column pa-4"
            style="gap: 2rem"
          >
            <v-btn
              block
              class="mt-2"
              data-cy="unhcr-user-login"
              color="primary"
              @click="loginUnhcr"
              >UNHCR Login</v-btn
            >
            <v-btn block data-cy="guest-user-login" @click="loginGuest"
              >Guest Login (read only)</v-btn
            >
            <div class="d-flex flex-column">
              Don't have an account ?
              <v-btn
                text
                data-cy="unhcr-user-login"
                color="primary"
                :to="{ name: 'Register' }"
                >Register</v-btn
              >
            </div>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
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
  readonly jwtPattern =
    /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\\+\\/=]*)$/;

  formValid = false;
  username = "";
  password = "";
  error = "";
  showForm = false;
  login!: (doc: UserCouchCredentials) => AxiosPromise;
  logout!: () => AxiosPromise;
  loginAsGuest!: () => AxiosPromise;

  passwordSecretToggle = true;

  public get passwordInputType(): string {
    return this.passwordSecretToggle ? "password" : "text";
  }

  public togglePassword(): void {
    this.passwordSecretToggle = !this.passwordSecretToggle;
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
    await window.authModule.login("loginRedirect");
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
        throw error;
      });
  }
}
</script>
