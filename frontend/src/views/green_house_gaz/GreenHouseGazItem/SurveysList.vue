<template>
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
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Survey
            </v-btn>
          </template>
          <v-card>
            <v-form @submit.prevent="save">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
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
                <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Confirm deletion of this survey?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="survey-list__actions">
        <router-link
          :to="{
            name: 'GreenHouseGazItemSurveyId',
            params: { surveyId: encodeURIComponent(item.name) },
          }"
        >
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </router-link>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgItemModule", ["updateDoc"]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;
  user!: CouchUser;

  headersSurvey = [
    { text: "description", value: "name" },
    { text: "created_at", value: "created_at" },
    { text: "Actions", value: "actions", sortable: false },
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

  editItem(item: Survey): void {
    this.editedIndex = this.localProject.surveys.indexOf(item);
    // create a local copy
    this.editedItem = Object.assign({}, item) as Survey;
    this.dialog = true;
  }

  deleteItem(item: Survey): void {
    this.editedIndex = this.localProject.surveys.indexOf(item);
    this.editedItem = Object.assign({}, item) as Survey;
    this.dialogDelete = true;
  }

  async deleteItemConfirm(): Promise<void> {
    this.localProject.surveys.splice(this.editedIndex, 1);
    await this.submitForm(this.localProject);
    await this.closeDelete();
  }

  async close(): Promise<void> {
    this.dialog = false;
    await this.$nextTick();
    this.editedItem = this.newDefaultItem();
    this.editedIndex = -1;
  }

  async closeDelete(): Promise<void> {
    this.dialogDelete = false;
    await this.$nextTick();
    this.editedItem = this.newDefaultItem();
    this.editedIndex = -1;
  }

  async save(): Promise<void> {
    if (this.editedIndex > -1) {
      Object.assign(
        this.localProject.surveys[this.editedIndex],
        this.editedItem
      );
    } else {
      this.localProject.surveys.push(this.editedItem);
    }
    const createdName = this.editedItem.name;
    // createdName will be country_site_year_month_day
    await this.submitForm(this.localProject);
    await this.close();
    // TODO: should check unicity of name
    await this.$router.push({
      name: "GreenHouseGazItemSurveyId",
      params: { surveyId: encodeURIComponent(createdName) },
    });
  }

  public get formTitle(): string {
    return this.editedIndex === -1 ? "New Survey" : "Edit Survey";
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
      const shouldUpdate = ["GhgItemModule/SET_PROJECT"];
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

<style lang="scss" scoped>
.survey-list__actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
