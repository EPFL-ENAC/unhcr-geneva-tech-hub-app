<template>
  <v-container fluid>
    <v-tabs v-model="tab">
      <v-tab>
        <v-icon left> mdi-briefcase </v-icon>
        About
      </v-tab>
      <v-tab>
        <v-icon left> mdi-account </v-icon>
        Users
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-row>
            <v-col :cols="6">
              <v-form
                :readonly="!$can('edit', localProject)"
                @submit.prevent="() => submitForm(localProject)"
              >
                <v-sheet>
                  <v-text-field
                    v-model="localProject.name"
                    name="name"
                    label="Camp name"
                    type="text"
                    required
                    :rules="textRules"
                  />
                  <v-select
                    tabindex="2"
                    v-model="localProject.country_code"
                    :items="countriesRef"
                    item-value="code"
                    item-text="name"
                    label="Select country"
                  >
                    <template v-slot:item="slotProps">
                      <div
                        class="d-flex justify-space-between"
                        style="width: 300px"
                      >
                        <span> {{ slotProps.item.emoji }} </span>
                        {{ slotProps.item.name }}
                      </div>
                    </template>
                  </v-select>
                  <v-divider />
                </v-sheet>
              </v-form>
            </v-col>
            <v-col :cols="6">
              <v-row>
                <v-col>
                  <router-link
                    :to="{
                      name: 'GreenHouseGazCompareSurveys',
                      params: { surveyId: encodeURIComponent('survey-a') },
                    }"
                  >
                    <v-btn>compare survey 'survey-a'</v-btn>
                  </router-link>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <router-link
                    :to="{
                      name: 'GreenHouseGazCompareSurveys',
                      params: { surveyId: encodeURIComponent('survey-b') },
                    }"
                  >
                    <v-btn>compare survey 'survey-b'</v-btn>
                  </router-link>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <router-link :to="{ name: 'GreenHouseGazSurvey' }">
                    <v-btn>add new survey</v-btn>
                  </router-link>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-row>
            <v-col>
              <v-sheet elevation="2" rounded v-if="$can('edit', localProject)">
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
                          user.name === userEmail ||
                          localProject.users.length === 1
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
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-footer>
          <!-- TODO add form with submit.prevent -->
          <v-row v-if="$can('edit', localProject)">
            <v-col class="d-flex justify-end">
              <v-btn type="submit"> Save changes </v-btn>
            </v-col>
          </v-row>
        </v-footer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GreenHouseGaz } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import Countries from "@/views/green_house_gaz/countriesAsList.min.js";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgItemModule", [
      "getDoc",
      "updateDoc",
      "syncDB",
      "closeDB",
    ]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  updateDoc!: (doc: GreenHouseGaz) => void;

  project!: GreenHouseGaz;
  user!: CouchUser;

  public getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  // todo store in js outstide directly ?
  countriesRef = Countries.map((country) => ({
    ...country,
    emoji: this.getFlagEmoji(country.code),
  }));

  countriesMap = Countries.reduce((acc, country) => {
    acc[country.code] = { ...country, emoji: this.getFlagEmoji(country.code) };
    return acc;
  }, {} as Record<string, Record<string, string>>);

  newUser = "";

  addUserValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  tab = 0;

  localProject = {} as GreenHouseGaz;

  textRules = [
    (v: string): boolean | string => !!v || `is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `should have a length >= 1`,
  ];

  public setLocalShelter(): void {
    if (!this.project) {
      this.localProject = {} as GreenHouseGaz;
    } else {
      this.localProject = cloneDeep(this.project);
    }
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgItemModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter();
      }
    });
  }

  created(): void {
    this.syncLocalShelter();
  }

  mounted(): void {
    this.syncDB();
    this.getDoc(decodeURIComponent(this.$route.params.id));
  }
  destroyed(): void {
    console.log("DESTROYED view shelter item, closing DB");
    this.closeDB();
  }

  public addUser(value: string): void {
    console.log("add new user", value, this.tab);
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

  public submitForm(value: GreenHouseGaz): void {
    console.log("setter shelter", value, this.tab);
    if (value.name !== "") {
      this.updateDoc(value);
    } else {
      console.error("please fill the new Name");
    }
  }
}
</script>

<style lang="scss" scoped></style>
