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
                </v-sheet>
              </v-form>
            </v-col>
            <v-col :cols="6">
              <v-data-table
                :headers="headersSurvey"
                :items="localProject.surveys"
                sort-by="created_at"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Surveys</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                      <template v-slot:activator="{ on, attrs }">
                        <router-link :to="{ name: 'GreenHouseGazSurvey' }">
                    <v-btn
                          color="primary"
                          dark
                          class="mb-2"
                          v-bind="attrs"
                          v-on="on"
                        >
                          New Survey
                        </v-btn>
                  </router-link>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                  v-model="editedItem.name"
                                  label="Survey description"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">
                            Cancel
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="save">
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                      <v-card>
                        <v-card-title class="text-h5"
                          >Are you sure you want to delete this
                          survey?</v-card-title
                        >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="closeDelete"
                            >Cancel</v-btn
                          >
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="deleteItemConfirm"
                            >OK</v-btn
                          >
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>

                   <template v-slot:item.actions="{ item }">
                    
                    <router-link
                    :to="{
                      name: 'GreenHouseGazCompareSurveys',
                      params: { surveyId: encodeURIComponent(item.name) },
                    }"
                  >
                    <v-icon
                      small
                      class="mr-2"
                      @click="editItem(item)"
                    >
                      mdi-pencil
                    </v-icon>
                  </router-link>
                    <v-icon
                      small
                      @click="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
              </v-data-table>
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
          <v-row>
            <v-col class="d-flex justify-end align-center">
              <v-btn type="submit" :disabled="!$can('edit', localProject)">
                Save changes
              </v-btn>
              <span v-if="!$can('edit', localProject)" class="mx-auto">
                readonly mode
              </span>
            </v-col>
          </v-row>
        </v-footer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
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

  headersSurvey = [
    { text: "description", value: "name" },
    { text: "created_at", value: "created_at" },
    { text: 'Actions', value: 'actions', sortable: false }
  ];
  dialog = false;
  dialogDelete = false;
  editedIndex = -1;
  private newDefaultItem(): Survey {
    return {
      name: "",
      created_at: new Date().toISOString(),
    } as Survey;
  }
  editedItem = this.newDefaultItem();

  editItem(item: Survey):void {
    this.editedIndex = this.localProject.surveys.indexOf(item);
    // create a local copy
    this.editedItem = Object.assign({}, item) as Survey;
    this.dialog = true;
  }

  deleteItem(item: Survey):void {
    this.editedIndex = this.localProject.surveys.indexOf(item);
    this.editedItem = Object.assign({}, item) as Survey;
    this.dialogDelete = true;
  }

  deleteItemConfirm():void {
    this.localProject.surveys.splice(this.editedIndex, 1);
    this.closeDelete();
  }

  close():void {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = this.newDefaultItem();
      this.editedIndex = -1;
    });
  }

  closeDelete():void {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = this.newDefaultItem();
      this.editedIndex = -1;
    });
  }

  save():void {
    if (this.editedIndex > -1) {
      Object.assign(this.localProject.surveys[this.editedIndex], this.editedItem);
    } else {
      this.localProject.surveys.push(this.editedItem);
    }
    this.submitForm(this.localProject);
    this.close();
  }

  public get formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
  };

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
