<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary" class="justify-center d-flex">
      <v-toolbar-title data-cy="loginWelcome">Forgot password</v-toolbar-title>
    </v-toolbar>
    <v-row v-if="showMessage">
      <v-col>
        <v-form v-model="formValid">
          <v-card-text class="d-flex flex-column" style="gap: 1rem">
            An email allowing you to reset your password has been sent, please
            check your inbox.
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
              >Go back</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-form v-model="formValid" @submit.prevent="forgotPassword">
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
              :rules="emailRules"
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
              >Forgot password</v-btn
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
    ...mapActions("UserModule", ["forgotPasswordCouchdb"]),
  },
})
export default class ForgotPasswordComponent extends Vue {
  formValid = false;
  username = ""; // shoudl be an email
  error = "";
  showMessage = false;
  loading = false;

  passwordSecretToggle = true;
  forgotPasswordCouchdb!: (doc: UserCouchCredentials) => AxiosPromise;

  public get destinationRouteName(): string {
    const currentRouteName = this.$router.currentRoute.name as string;
    // TODO: check again
    return currentRouteName === "ForgotPassword" ? "Apps" : currentRouteName;
  }

  emailRules = [
    (v: string) =>
      (!!v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
      "E-mail must be valid",
  ];

  async forgotPassword(): Promise<void> {
    this.error = "";
    this.loading = true;
    await this.forgotPasswordCouchdb({
      username: this.username,
      password: "", // passthrough
    })
      .then(() => {
        this.showMessage = true;
      })
      .catch((error: AxiosError) => {
        debugger;
        switch (error.response?.status) {
          case 422:
            this.error = error.response?.statusText;
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

  async created(): Promise<void> {
    console.log("created");
  }
}
</script>
