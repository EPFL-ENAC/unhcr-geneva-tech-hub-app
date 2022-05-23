<template>
  <div>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Confirm deletion of this assessment?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDuplicate" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Confirm copy of this assessment?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="duplicateItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headersSurvey"
      :items="localProject.surveys"
      sort-by="created_at"
      hide-default-footer
      :items-per-page="-1"
      :item-class="rowClasses"
      @click:row="handleClick"
    >
      <template v-slot:[`item.created_at`]="{ item }">
        {{ item.created_at | formatDate }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div v-if="$can('edit', localProject)" class="survey-list__actions">
          <!-- maybe everyone should be able to duplicate -->
          <v-icon
            class="better-click"
            small
            @click.stop="() => duplicateItem(item)"
          >
            mdi-content-copy
          </v-icon>
          <v-icon
            class="better-click"
            small
            @click.stop="() => deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { getNewName, updateMetaFields } from "@/store/documentUtils";
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
    { text: "Description", value: "name" },
    { text: "Creation date", value: "created_at" },
    { text: "Actions", value: "actions", sortable: false, align: "end" },
  ];

  dialog = false;
  dialogDelete = false;
  dialogDuplicate = false;
  editedIndex = -1;
  private newDefaultItem(): Survey {
    return {
      name: "",
      created_at: new Date().toISOString(),
    } as Survey;
  }
  editedItem = this.newDefaultItem();

  public rowClasses(): string {
    return "site-row-pointer";
  }

  handleClick(item: Survey): void {
    this.$router.push({
      name: "GreenHouseGazItemSurveyId",
      params: {
        country: encodeURIComponent(this.localProject.country_code),
        site: encodeURIComponent(this.localProject._id),
        surveyId: encodeURIComponent(item.name),
      },
      query: {
        category: "Info",
      },
    });
  }

  duplicateItem(item: Survey): void {
    this.editedIndex = this.localProject.surveys.indexOf(item);
    // get doc from database!
    // retrieve real document first (it's okay it's a survey)
    this.editedItem = cloneDeep(item) as Survey;
    this.dialogDuplicate = true;
  }

  async duplicateItemConfirm(): Promise<void> {
    this.editedItem = updateMetaFields(this.editedItem, this.user);
    this.editedItem.name = getNewName(this.editedItem.name);

    this.localProject.surveys.push(this.editedItem);
    await this.submitForm(this.localProject);
    await this.closeDialog();
  }

  deleteItem(item: Survey): void {
    this.editedIndex = this.localProject.surveys.indexOf(item);
    this.editedItem = Object.assign({}, item) as Survey;
    this.dialogDelete = true;
  }

  async deleteItemConfirm(): Promise<void> {
    this.localProject.surveys.splice(this.editedIndex, 1);
    await this.submitForm(this.localProject);
    await this.closeDialog();
  }

  closeDialog(): void {
    this.dialogDelete = false;
    this.dialogDuplicate = false;
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
    await this.submitForm(this.localProject);
    // TODO: should check unicity of name
    if (this.$route.name !== "GreenHouseGazItemSurveyId") {
      await this.$router.push({
        name: "GreenHouseGazItemSurveyId",
        params: { surveyId: encodeURIComponent(createdName) },
      });
    }
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
      this.getDoc(this.site);
    }
  }
  // TODO: avoid double request in mounted and watch find a way

  // watch site and trigger retrieve
  @Watch("site", { immediate: true })
  onSiteChange(newValue: string): void {
    this.hasDB().then((db: SyncDatabase<GreenHouseGaz> | null) => {
      if (db && newValue) {
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

::v-deep .site-row-pointer {
  cursor: pointer;
  outline: none;
}
.better-click {
  // so to increase clickable zone
  padding: 1em;
  margin: -1em;
}
</style>
