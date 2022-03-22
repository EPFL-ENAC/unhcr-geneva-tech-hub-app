<template>
  <div>
    <v-data-table
      :headers="headersSurvey"
      :items="localProject.surveys"
      sort-by="created_at"
      hide-default-footer
    >
      <template v-slot:top>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
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
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="survey-list__actions">
          <router-link
            :to="{
              name: 'GreenHouseGazItemSurveyId',
              params: {
                country: encodeURIComponent(localProject.country_code),
                site: encodeURIComponent(localProject.name),
                surveyId: encodeURIComponent(item.name),
              },
              query: {
                category: 'Energy',
                subcategory: 'Facilities',
              },
            }"
          >
            <v-icon small class="mr-2"> mdi-pencil </v-icon>
          </router-link>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import { SyncDatabase } from "@/utils/couchdb";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgModule", [
      "updateDoc",
      "getDoc",
      "syncDB",
      "hasDB",
      "closeDB",
    ]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  @Prop(String)
  readonly site: string | undefined;
  @Prop(String)
  readonly countryCode: string | undefined;

  syncDB!: () => null;
  hasDB!: () => Promise<SyncDatabase<GreenHouseGaz> | null>;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  project!: GreenHouseGaz;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  localProject = {} as GreenHouseGaz;
  user!: CouchUser;

  headersSurvey = [
    { text: "description", value: "name" },
    { text: "created_at", value: "created_at" },
    { text: "Actions", value: "actions", sortable: false, align: "end" },
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

  // editItem(item: Survey): void {
  //   this.editedIndex = this.localProject.surveys.indexOf(item);
  //   // create a local copy
  //   this.editedItem = Object.assign({}, item) as Survey;
  //   this.dialog = true;
  // }

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

  closeDelete(): void {
    this.dialogDelete = false;
    this.$nextTick().then(() => {
      this.editedItem = this.newDefaultItem();
      this.editedIndex = -1;
    });
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
    return this.editedIndex === -1 ? "New assessment" : "Edit assessment";
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

  mounted(): void {
    this.syncDB();
    if (this.site) {
      console.log("get doc from mounted");
      this.getDoc(this.site);
    }
  }
  // TODO: avoid double request in mounted and watch find a way

  // watch site and trigger retrieve
  @Watch("site", { immediate: true })
  onSiteChange(newValue: string): void {
    this.hasDB().then((db: SyncDatabase<GreenHouseGaz> | null) => {
      if (db && newValue) {
        console.log("on site change", newValue);
        console.log("get doc from watch");
        this.getDoc(newValue);
      }
    });
  }
  destroyed(): void {
    this.closeDB();
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