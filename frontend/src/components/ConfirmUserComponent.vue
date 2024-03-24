<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary" class="justify-center d-flex">
      <v-toolbar-title data-cy="loginWelcome"
        >Confirm registration</v-toolbar-title
      >
    </v-toolbar>
    <v-row v-if="showSuccessMessage">
      <v-col>
        <v-form v-model="formValid">
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            An email confirming that your registration is complete has been
            sent, please check your inbox.
            <p>You can now proceed to login</p>
          </v-card-text>
          <v-card-actions
            class="justify-center d-flex flex-column pa-4"
            style="margin-left: 33px; gap: 1rem"
          >
            <v-btn
              block
              :disabled="!formValid"
              type="submit"
              color="#006fa0"
              style="color: white"
              :to="{ name: 'Login' }"
              >Login</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-col></v-row
    >

    <v-row v-else-if="showReset">
      <v-col>
        <v-alert type="warning">token is missing or expired</v-alert>
        <v-form
          v-model="formValid"
          :disabled="loading"
          @submit.prevent="sendConfirmation"
        >
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            <v-text-field
              id="email"
              v-model="username"
              autocomplete="email"
              outlined
              label="Email"
              prepend-icon="$mdiAccount"
              placeholder=" "
              persistent-placeholder
              required
              type="email"
              name="email"
            />
            <span class="error--text">{{ error }}</span>
          </v-card-text>
          <v-card-actions
            class="justify-center d-flex flex-column pa-4"
            style="margin-left: 33px; gap: 1rem"
          >
            <v-btn
              block
              :disabled="!formValid"
              type="submit"
              :loading="loading"
              color="#006fa0"
              style="color: white"
              >Send confirmation email again</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
    <v-row v-else-if="showConfirmationEmail">
      <v-col>
        <v-form>
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            Confirmation email has been sent
          </v-card-text>
          <v-card-actions
            class="justify-center d-flex flex-column pa-4"
            style="margin-left: 33px; gap: 1rem"
          >
            <v-btn
              block
              :to="{ name: 'Login' }"
              color="#006fa0"
              style="color: white"
              >Go back</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-form
          v-model="formValid"
          :disabled="!token"
          @submit.prevent="confirmPassword"
        >
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            <v-text-field
              id="current-password"
              v-model="password"
              outlined
              name="current-password"
              label="Confirm password"
              autocomplete="new-password"
              placeholder=" "
              persistent-placeholder
              prepend-icon="$mdiLock"
              :append-icon="passwordSecretToggle ? '$mdiEye' : '$mdiEyeOff'"
              :type="passwordInputType"
              :rules="[required, min6]"
              :counter="maxLength"
              :minlength="minLength"
              required
              @click:append="togglePassword"
            />
            <span class="error--text">{{ error }}</span>
          </v-card-text>
          <v-card-actions
            class="justify-center d-flex flex-column pa-4"
            style="margin-left: 33px; gap: 1rem"
          >
            <v-btn
              v-if="showReset"
              text
              data-cy="unhcr-user-login"
              color="primary"
              :to="{ name: 'Register' }"
              >Register again</v-btn
            >
            <v-btn
              block
              :disabled="!formValid"
              :loading="loading"
              type="submit"
              color="#006fa0"
              style="color: white"
              >Confirm password</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { PasswordWithToken } from "@/store/UserModule";

import { AxiosError, AxiosPromise } from "axios";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },

  methods: {
    ...mapActions("UserModule", [
      "confirmPasswordCouchdb",
      "sendConfirmCouchdb",
    ]),
  },
})
export default class ResetPasswordComponent extends Vue {
  formValid = false;
  username = ""; // shoudl be an email
  password = "";
  error = "";
  minLength = 8;
  maxLength = 24;
  loading = false;
  tokenHasExpired = false;
  showSuccessMessage = false;
  showConfirmationEmail = false;

  passwordSecretToggle = true;
  confirmPasswordCouchdb!: (doc: PasswordWithToken) => AxiosPromise;
  sendConfirmCouchdb!: (doc: Record<string, string>) => AxiosPromise;

  public get passwordInputType(): string {
    return this.passwordSecretToggle ? "password" : "text";
  }
  public togglePassword(): void {
    this.passwordSecretToggle = !this.passwordSecretToggle;
  }

  public get destinationRouteName(): string {
    const currentRouteName = this.$router.currentRoute.name as string;
    return currentRouteName === "Register" ? "Apps" : currentRouteName;
  }

  public get token(): string {
    const searchParams = new URLSearchParams(
      window.location.search.substring(1)
    );
    return searchParams.get("token") || "";
  }

  public get showReset(): boolean {
    return (
      (this.token === "" || this.tokenHasExpired) && !this.showConfirmationEmail
    );
  }

  triggerExpire(): void {
    this.tokenHasExpired = true;
    this.username = "";
    this.password = "";
    // window.location.search = ""; // deactivate the search token
    this.$router.push({ name: this.$route.name as string, params: {} });
    throw new Error("Confirm password link has expired");
  }

  confirmPassword(): void {
    this.error = "";
    this.loading = true;
    if (this.token === "") {
      // show reset password link button
      this.triggerExpire();
    }
    this.confirmPasswordCouchdb({
      password: this.password,
      token: this.token,
    })
      .then(() => {
        this.showSuccessMessage = true; // success
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          case 401:
            this.error = "Password does not match, try again or register again";
            error.response.statusText = `${error.response.statusText}:  ${this.error}`;
            break;
          case 410:
            this.triggerExpire();
            break;
          default:
            this.error = error.response?.statusText ?? error.message;
        }
        throw error;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  sendConfirmation(): void {
    //localhost:8080/confirm?token=f9c70267-83c2-44af-83df-63aecabc67edcGllcnJlLmd1aWxiZXJ0QGVwZmwuY2g%3D
    this.error = "";
    this.loading = true;
    this.sendConfirmCouchdb({
      name: this.username,
    })
      .then(() => {
        this.showSuccessMessage = false;
        this.showConfirmationEmail = true; // success
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          default:
            this.error = error.response?.statusText ?? error.message;
        }
        throw error;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  required(value: string) {
    if (value) {
      return true;
    } else {
      return "This field is required.";
    }
  }
  min6(value: string) {
    if (value.length >= this.minLength) {
      return true;
    } else {
      return `Password should have more than ${this.minLength} characters.`;
    }
  }
}
</script>
