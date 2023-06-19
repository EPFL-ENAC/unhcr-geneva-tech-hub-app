<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary" class="justify-center d-flex">
      <v-toolbar-title data-cy="loginWelcome">Register</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col>
        <v-form v-model="formValid" @submit.prevent="registerCouchdb">
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            <!-- <v-text-field
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
            /> -->
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
            <!-- <v-text-field
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
            <v-text-field
              id="confirm-current-password"
              v-model="confirmPassword"
              outlined
              name="password"
              autocomplete="confirm-current-password"
              label="Confirm password"
              placeholder=" "
              persistent-placeholder
              prepend-icon="$mdiLock"
              :append-icon="passwordSecretToggle ? '$mdiEye' : '$mdiEyeOff'"
              :type="confirmPasswordInputType"
              required
              hide-details="true"
              @click:append="confirmTogglePassword"
            /> -->
            <span class="error--text">{{ error }}</span>
          </v-card-text>
          <v-card-actions
            class="justify-center d-flex flex-column pa-4"
            style="margin-left: 33px; gap: 1rem"
          >
            <v-btn block type="submit" color="#006fa0" style="color: white"
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
  formValid = false;
  username = ""; // shoudl be an email
  password = "";
  confirmPassword = "";
  error = "";

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
    return currentRouteName === "Register" ? "Apps" : currentRouteName;
  }
  registerCouchdb(): void {
    this.error = "";
    const { username, password } = this;
    this.register({ username, password })
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

  async created(): Promise<void> {
    console.log("created");
  }

  userExist(): void {
    // userAlready exist/
    // for security reason don't inform the user the email already exist
    console.log("check");
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
