<template>
  <v-dialog v-model="dialog" max-width="256">
    <template v-slot:activator="{ attrs, on }">
      <slot :attrs="attrs" :on="on">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title>Users</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(item, index) in users" :key="item">
            <v-list-item-content>
              <v-list-item-title>
                {{ item }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="isMember && item !== username">
              <v-btn icon @click="removeUser(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-form v-if="isMember" ref="form" @submit="submit">
          <v-text-field
            v-model="user"
            append-outer-icon="mdi-plus"
            hide-details="auto"
            label="Username"
            :rules="rules"
            @click:append-outer="addUser"
          >
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">
          <v-icon left>mdi-close</v-icon>
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { checkExists, checkRequired, Rule } from "@/utils/rules";
import { VForm } from "@/utils/vuetify";
import "vue-class-component/hooks";
import { Component, Ref, VModel, Vue, Watch } from "vue-property-decorator";

@Component
export default class UserManager extends Vue {
  readonly username = this.$userName();

  @VModel({ type: Array as () => string[] })
  users!: string[];

  user = "";
  dialog = false;

  @Ref()
  readonly form: VForm | undefined;

  get isMember(): boolean {
    return this.users.includes(this.username);
  }

  get rules(): Rule[] {
    return [checkRequired, checkExists(this.users)];
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
      this.users.push(this.user);
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
