<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary" class="justify-center d-flex">
      <v-toolbar-title data-cy="loginWelcome">Register</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col>
        <v-form v-if="showRegistrationComplete">
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            Registration email has been sent
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
        <v-form v-else v-model="formValid" @submit.prevent="registerCouchdb">
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
              block
              type="submit"
              :disabled="!formValid"
              color="#006fa0"
              style="color: white"
              >Create account</v-btn
            >
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
    ...mapActions("UserModule", ["register"]),
  },
})
export default class RegisterComponent extends Vue {
  formValid = true;
  username = ""; // shoudl be an email
  password = "";
  confirmPassword = "";
  error = "";
  minLength = 8;
  maxLength = 24;
  showReset = false;
  showRegistrationComplete = false;

  passwordSecretToggle = true;
  register!: (doc: UserCouchCredentials) => AxiosPromise;

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
    // TODO: check again
    return currentRouteName === "Register" ? "Login" : currentRouteName;
  }
  registerCouchdb(): void {
    this.error = "";
    const { username, password } = this;
    this.register({ username, password })
      .then(() => {
        // if (this.$route.name !== this.destinationRouteName) {
        //   this.$router.push({ name: this.destinationRouteName });
        // }
        this.showRegistrationComplete = true;
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

  userExist(): void {
    // userAlready exist/
    // for security reason don't inform the user the email already exist
    console.log("check");
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
