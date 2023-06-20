<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary" class="justify-center d-flex">
      <v-toolbar-title data-cy="loginWelcome"
        >Confirm registration</v-toolbar-title
      >
    </v-toolbar>
    <v-row>
      <v-col>
        <v-alert v-if="!token" type="warning"
          >token is missing or expired</v-alert
        >
        <v-form
          v-if="!token"
          v-model="formValid"
          :disabled="loading"
          @submit.prevent="forgotPassword"
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
        <v-form
          v-else
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
              :to="{ name: 'ForgotPassword' }"
              >Send reset password email</v-btn
            >
            <v-btn
              block
              :disabled="!formValid"
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
    ...mapActions("UserModule", ["confirmPasswordCouchdb"]),
  },
})
export default class ResetPasswordComponent extends Vue {
  formValid = false;
  username = ""; // shoudl be an email
  password = "";
  error = "";
  minLength = 8;
  maxLength = 24;
  showReset = false;
  loading = false;

  passwordSecretToggle = true;
  confirmPasswordCouchdb!: (doc: PasswordWithToken) => AxiosPromise;

  public get passwordInputType(): string {
    return this.passwordSecretToggle ? "password" : "text";
  }
  public togglePassword(): void {
    this.passwordSecretToggle = !this.passwordSecretToggle;
  }

  public get destinationRouteName(): string {
    const currentRouteName = this.$router.currentRoute.name as string;
    // TODO: check again
    return currentRouteName === "Register" ? "Apps" : currentRouteName;
  }

  public get token(): string {
    const searchParams = new URLSearchParams(
      window.location.search.substring(1)
    );
    return searchParams.get("token") || "";
  }
  confirmPassword(): void {
    this.error = "";
    if (this.token === "") {
      // show reset password link button
      this.showReset = true;
      this.username = "";
      this.password = "";
      // window.location.search = ""; // deactivate the search token
      this.$router.push({ name: this.$route.name as string, params: {} });
      throw new Error("Reset password link has expired");
    }
    this.confirmPasswordCouchdb({
      password: this.password,
      token: this.token,
    })
      .then(() => {
        if (this.$route.name !== this.destinationRouteName) {
          this.$router.push({ name: this.destinationRouteName });
        }
      })
      .catch((error: AxiosError) => {
        // if token is not valid anymore change to showReset
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

  async created(): Promise<void> {
    // verify token here.
    console.log("created");
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
