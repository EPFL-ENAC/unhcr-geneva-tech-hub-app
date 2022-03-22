<template>
  <v-sheet elevation="2" rounded>
    <v-container fluid>
      <v-row
        v-for="(userEmail, $userKey) in localProject.users"
        :key="$userKey"
      >
        <v-col>{{ userEmail }}</v-col>
        <v-col>
          <v-btn
            @click="() => removeUser(userEmail)"
            :disabled="
              user.name === userEmail || localProject.users.length === 1
            "
            >remove user</v-btn
          ></v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <v-form @submit.prevent="addUser" v-model="addUserValid">
            <v-card class="mx-auto" max-width="344" outlined>
              <v-card-text>
                <v-text-field
                  tabindex="1"
                  v-model="newUser"
                  :rules="rules"
                  required
                  name="email"
                  label="Email"
                  type="text"
                />
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  outlined
                  rounded
                  text
                  type="submit"
                  tabindex="2"
                  :disabled="!addUserValid"
                >
                  New User
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { GreenHouseGaz } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgModule", ["updateDoc"]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  project!: GreenHouseGaz;
  user!: CouchUser;
  localProject = {
    users: [] as string[],
  } as GreenHouseGaz;
  newUser = "";

  addUserValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  public addUser(): void {
    this.localProject.users.push(this.newUser);
    this.newUser = "";
    this.submitForm(this.localProject);
  }

  public removeUser(value: string): void {
    if (value === this.user.name) {
      throw new Error("cannot remove yourself from the list");
    }
    const indexToRemove = this.localProject.users.findIndex(
      (el: string): boolean => el === value
    );
    this.localProject.users.splice(indexToRemove, 1);
    this.submitForm(this.localProject);
  }

  public async submitForm(value: GreenHouseGaz): Promise<void> {
    if (value.name !== "") {
      await this.updateDoc(value);
    } else {
      throw new Error("please fill the new Name");
    }
  }

  public setLocalShelter(project: GreenHouseGaz): void {
    this.localProject = project ? cloneDeep(project) : ({} as GreenHouseGaz);
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter(this.project);

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter(mutation.payload);
      }
    });
  }

  created(): void {
    this.syncLocalShelter();
  }
}
</script>

<style></style>
