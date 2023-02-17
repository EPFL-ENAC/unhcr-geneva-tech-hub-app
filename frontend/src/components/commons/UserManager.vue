<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ attrs, on }">
      <slot :attrs="attrs" :on="on">
        <v-btn v-bind="attrs" icon v-on="on">
          <v-icon>$mdiAccountMultiple</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title>Users</v-card-title>
      <v-card-subtitle>
        <v-alert type="warning"
          >You can only add app users or UNHCR users if you know their 'sub' id
          <br />
          Adding username@unhcr.org won't work unless it's been registered by a
          developper with a specific password
        </v-alert>
      </v-card-subtitle>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(item, index) in users" :key="index">
            <v-list-item-content>
              <v-list-item-title>
                {{ item?.name ?? item }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action
              v-if="$can('edit', { users }) && item !== username"
            >
              <v-btn icon @click="removeUser(index)">
                <v-icon>$mdiDelete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-form v-if="$can('edit', { users })" ref="form" @submit="submit">
          <v-text-field
            v-model="userName"
            append-outer-icon="$mdiPlus"
            hide-details="auto"
            label="Username or UNHCR sub"
            :rules="rules"
            @click:append-outer="addUser"
          >
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">
          <v-icon left>$mdiClose</v-icon>
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { checkUserExists } from "@/plugins/user";
import { CouchUser } from "@/store/UserModule";
import { checkRequired, Rule } from "@/utils/rules";

import { VForm } from "@/utils/vuetify";
import "vue-class-component/hooks";
import { Component, Ref, VModel, Vue, Watch } from "vue-property-decorator";

@Component
export default class UserManager extends Vue {
  readonly username = this.$userName();

  @VModel({ type: Array as () => (string | CouchUser)[] })
  users!: (string | CouchUser)[];

  userName = "";
  dialog = false;

  @Ref()
  readonly form: VForm | undefined;

  get rules(): (Rule | unknown)[] {
    // TODO: add check UNHCR to circumvent the problem
    // WARNING: if username is for instance testtss@unhcr.org it will match real unhcr users
    // but because we can only add couchdb USER, we should probably add a warning for unhcr users
    // saying that they cannot add unhcr users
    return [checkRequired, checkUserExists(this.users)];
  }

  @Watch("dialog")
  onDialogChanged(): void {
    this.form?.reset();
  }

  private onChange(): void {
    this.$emit("change");
  }

  addUser(): void {
    if (this.form?.validate()) {
      this.users.push({ name: this.userName });
      this.userName = "";
      this.form.reset();
      this.onChange();
    }
  }

  removeUser(index: number): void {
    this.users.splice(index, 1);
    this.onChange();
  }

  submit(event: Event): void {
    event.preventDefault();
    this.addUser();
  }

  close(): void {
    this.dialog = false;
  }
}
</script>

<style scoped>
.v-input__append-outer {
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
