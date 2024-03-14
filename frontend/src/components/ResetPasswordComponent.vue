<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary" class="justify-center d-flex">
      <v-toolbar-title data-cy="loginWelcome">Reset password</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col v-if="showSuccessReset">
        <v-card-text class="">
          <span> An email confirming the reset is on its way </span>
          <v-btn
            class="mx-4"
            text
            data-cy="unhcr-user-login"
            color="primary"
            :to="{ name: 'Login' }"
            >Go back to Login again</v-btn
          >
        </v-card-text>
      </v-col>
      <v-col v-else>
        <v-alert v-if="showReset" type="warning"
          >token is missing or expired
          <v-btn
            class="mx-4"
            text
            data-cy="unhcr-user-login"
            color="primary"
            :to="{ name: 'ForgotPassword' }"
            >Try again</v-btn
          >
        </v-alert>
        <v-form
          v-model="formValid"
          :disabled="showReset"
          @submit.prevent="resetPasswordCouchdb"
        >
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            <v-text-field
              id="current-password"
              v-model="password"
              outlined
              name="current-password"
              label="Password"
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
            <v-text-field
              id="confirm-current-password"
              v-model="confirmPassword"
              outlined
              name="confirm-current-password"
              autocomplete="new-password"
              label="Confirm password"
              placeholder=" "
              persistent-placeholder
              :minlength="minLength"
              prepend-icon="$mdiLock"
              :append-icon="passwordSecretToggle ? '$mdiEye' : '$mdiEyeOff'"
              :type="confirmPasswordInputType"
              :rules="[required, min6, matchingPasswords]"
              :counter="maxLength"
              required
              @click:append="confirmTogglePassword"
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
              :to="{ name: 'ForgotPassword' }"
              >Send reset password email</v-btn
            >
            <v-btn
              block
              :loading="loading"
              :disabled="!formValid"
              type="submit"
              color="#006fa0"
              style="color: white"
              >Reset password</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { CredentialsWithToken } from "@/store/UserModule";

import { AxiosError, AxiosPromise } from "axios";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
  },

  methods: {
    ...mapActions("UserModule", ["resetPassword"]),
  },
})
export default class ResetPasswordComponent extends Vue {
  formValid = false;
  username = ""; // shoudl be an email
  password = "";
  confirmPassword = "";
  error = "";
  minLength = 8;
  maxLength = 24;
  tokenHasExpired = false;
  showSuccessReset = false;
  loading = false;

  passwordSecretToggle = true;
  resetPassword!: (doc: CredentialsWithToken) => AxiosPromise;

  public get passwordInputType(): string {
    return this.passwordSecretToggle ? "password" : "text";
  }
  public togglePassword(): void {
    this.passwordSecretToggle = !this.passwordSecretToggle;
  }

  confirmPasswordSecretToggle = true;

  public get confirmPasswordInputType(): string {
    return this.confirmPasswordSecretToggle ? "password" : "text";
  }
  public confirmTogglePassword(): void {
    this.confirmPasswordSecretToggle = !this.confirmPasswordSecretToggle;
  }

  public get destinationRouteName(): string {
    const currentRouteName = this.$router.currentRoute.name as string;
    return currentRouteName === "ResetPassword" ? "Login" : currentRouteName;
  }

  public get token(): string {
    const searchParams = new URLSearchParams(
      window.location.search.substring(1)
    );
    return searchParams.get("token") || "";
  }

  public get showReset(): boolean {
    return this.token === "" || this.tokenHasExpired;
  }

  triggerExpire(): void {
    this.tokenHasExpired = true;
    this.username = "";
    this.password = "";
    // window.location.search = ""; // deactivate the search token
    this.$router.push({ name: this.$route.name as string, params: {} });
    throw new Error("Reset password link has expired");
  }

  resetPasswordCouchdb(): void {
    this.error = "";
    this.loading = true;
    const { password } = this;
    if (this.token === "") {
      this.triggerExpire();
    }
    this.resetPassword({
      credentials: { password },
      token: this.token,
    })
      .then(() => {
        this.showSuccessReset = true;
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          case 401:
            this.error = "Password does not match, try again";
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
  matchingPasswords() {
    if (this.password === this.confirmPassword) {
      return true;
    } else {
      return "Passwords does not match.";
    }
  }
}
/*

 Register page with email + password

 -> we send an email with a confirm page
  -> on the confirm page: the user confirm the password
  -> and then go to the apps page


  Email confirmation template:

  You have requested access to the unhcr-tss apps. Please click on the link below to confirm registration:

  link: href


*/
</script>
