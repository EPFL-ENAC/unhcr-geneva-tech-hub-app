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
          >Confirm duplication of this assessment?</v-card-title
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
    <v-dialog v-model="dialogToggleReference" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Confirm that you want to&nbsp;
          <span v-if="editedItem.reference">unset</span>
          <span v-else>set</span> this assessment as reference?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="toggleItemAsReferenceConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headersSurvey"
      :items="siteAssessments"
      sort-by="created_at"
      hide-default-footer
      :items-per-page="-1"
      :item-class="rowClasses"
      :loading="siteAssessmentsLoading"
      @click:row="handleClick"
    >
      <template #[`item.created_at`]="{ item }">
        {{ item.created_at | formatDate }} {{ item.reference }}
      </template>
      <template #[`item.updated_at`]="{ item }">
        {{ item.updated_at | formatDate }}
      </template>
      <template #[`item.actions`]="{ item }">
        <div class="survey-list__actions">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-if="
                  $can('edit', {
                    users: item.users,
                  })
                "
                v-bind="attrs"
                icon
                class="better-click"
                small
                v-on="on"
                @click.stop="() => duplicateItem(item)"
              >
                <v-icon small class="better-click"> $mdiContentCopy </v-icon>
              </v-btn>
            </template>
            <span>Duplicate</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-if="$can('delete', item)"
                v-bind="attrs"
                icon
                small
                class="better-click"
                v-on="on"
                @click.stop="() => deleteItem(item)"
              >
                <v-icon small class="better-click"> $mdiDelete </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
          <!-- show reference only as admin ? -->
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-if="$can('admin', item)"
                v-bind="attrs"
                class="better-click"
                small
                icon
                v-on="on"
                @click.stop="() => toggleItemReferenceStatus(item)"
              >
                <v-icon v-if="item.reference" small class="better-click">
                  $mdiOctagram
                </v-icon>
                <v-icon v-else small class="better-click">
                  $mdiOctagramOutline
                </v-icon>
              </v-btn>
              <span v-else v-bind="attrs" v-on="on">
                <v-icon v-if="item.reference" small> $mdiOctagram </v-icon>
              </span>
            </template>
            <div v-if="$can('admin', item)">
              <span v-if="!item.reference">Set as reference</span>
              <span v-else>Unset as reference</span>
            </div>
            <div v-else>
              <span v-if="item.reference">Reference</span>
            </div>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { getNewName, updateMetaFields } from "@/store/documentUtils";
import { GreenHouseGaz } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import { SyncDatabase } from "@/utils/couchdb";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["siteAssessments", "siteAssessmentsLoading"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgModule", [
      "getDoc",
      "addDoc",
      "updateDoc",
      "getSite",
      "removeDoc",
      "syncDB",
      "hasDB",
      "closeDB",
    ]),
  },
})
/** SurveysList */
export default class SurveysList extends Vue {
  @Prop([String, Number])
  readonly site: number | string | undefined;
  @Prop(String)
  readonly countryCode: string | undefined;

  syncDB!: () => null;
  hasDB!: () => Promise<SyncDatabase<GreenHouseGaz> | null>;
  getSite!: (id: number | string) => null;
  removeDoc!: (id: string) => Promise<void>;
  closeDB!: () => null;
  siteAssessments!: GreenHouseGaz[];
  siteAssessmentsLoading!: boolean;
  getDoc!: (id: string) => Promise<GreenHouseGaz>;
  addDoc!: (doc: GreenHouseGaz) => Promise<void>;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  getSites!: () => Promise<null>;

  user!: CouchUser;

  headersSurvey = [
    { text: "Description", value: "description" },
    { text: "Created", value: "created_at" },
    { text: "Updated", value: "updated_at" },
    {
      text: "Actions",
      value: "actions",
      sortable: false,
      align: "end",
      width: "200px",
    },
  ];

  dialog = false;
  dialogDelete = false;
  dialogDuplicate = false;
  dialogToggleReference = false;
  editedIndex = -1;

  // TODO: fix that: it should not exist
  private newDefaultItem(): GreenHouseGaz {
    return {
      name: "",
      created_at: new Date().toISOString(),
    } as unknown as GreenHouseGaz;
  }
  editedItem = this.newDefaultItem();

  public rowClasses(): string {
    return "site-row-pointer";
  }

  handleClick(item: GreenHouseGaz): void {
    if (!item.siteId || !item.countryCode || !item.id) {
      if (!item.siteId) {
        throw new Error("site _id non existing");
      }
      if (!item.countryCode) {
        throw new Error("site countryCode non existing");
      }
      if (!item.id) {
        throw new Error("assessment id non existing");
      }
    }
    this.$router.push({
      name: "GreenHouseGazItemSurveyId",
      params: {
        country: encodeURIComponent(item.countryCode),
        site: encodeURIComponent(item.siteId),
        surveyId: encodeURIComponent(item.id),
      },
      query: {
        category: "Info",
      },
    });
  }

  duplicateItem(item: GreenHouseGaz): void {
    this.editedItem = cloneDeep(item) as GreenHouseGaz;
    this.dialogDuplicate = true;
  }

  async duplicateItemConfirm(): Promise<void> {
    let existingSite = await this.getDoc(this.editedItem.id);
    existingSite = updateMetaFields(existingSite, this.user);
    existingSite.description = getNewName(this.editedItem.description);
    existingSite.id = uuidv4();
    // we need to retrieve the full item, and then delete the id and create a new one ?
    delete existingSite._id;
    delete existingSite._rev;
    const response = await this.submitForm(existingSite);
    console.log(response);
    await this.closeDialog();
  }

  deleteItem(item: GreenHouseGaz): void {
    this.editedItem = Object.assign({}, item) as GreenHouseGaz;
    this.dialogDelete = true;
  }

  async deleteItemConfirm(): Promise<void> {
    await this.removeDoc(this.editedItem.id).then(() => {
      this.$store.dispatch("notifyUser", {
        type: "info",
        message: `successfuly removing site and its last assessment ${this.editedItem.description}`,
      });
    });
    await this.closeDialog();
  }

  toggleItemReferenceStatus(item: GreenHouseGaz): void {
    this.editedItem = Object.assign({}, item) as GreenHouseGaz;
    this.dialogToggleReference = true;
  }

  async toggleItemAsReferenceConfirm(): Promise<void> {
    const existingSite = await this.getDoc(this.editedItem.id);
    existingSite.reference = !existingSite.reference;

    await this.submitUpdateForm(existingSite);
    await this.closeDialog();
  }

  closeDialog(): void {
    this.dialogDelete = false;
    this.dialogDuplicate = false;
    this.dialogToggleReference = false;
    this.$nextTick().then(() => {
      this.editedItem = this.newDefaultItem();
      this.editedIndex = -1;
    });
  }

  public get formTitle(): string {
    return this.editedIndex === -1 ? "New assessment" : "Edit assessment";
  }

  public async submitForm(value: GreenHouseGaz): Promise<GreenHouseGaz | void> {
    if (value.description !== "") {
      return await this.addDoc(value);
    } else {
      throw new Error("please fill the description");
    }
  }

  public async submitUpdateForm(value: GreenHouseGaz): Promise<void> {
    if (value.description !== "") {
      await this.updateDoc(value);
    } else {
      throw new Error("please fill the description");
    }
  }

  // watch site and trigger retrieve
  @Watch("site", { immediate: true })
  onSiteChange(newValue: number): void {
    this.hasDB().then((db: SyncDatabase<GreenHouseGaz> | null) => {
      if (db && newValue) {
        this.getSite(newValue);
      }
    });
  }

  public listenToSetProjectAndRetrieveAssessments(): void {
    this.$store.subscribe((mutation) => {
      const shouldUpdate = [
        "GhgModule/NEW_ASSESSEMENT",
        "GhgModule/REMOVE_ASSESSEMENT",
        "GhgModule/UPDATE_ASSESSEMENT",
      ];
      if (shouldUpdate.includes(mutation.type) && this.site) {
        console.log("UPDATE ?", mutation.type);
        this.getSite(this.site);
      }
    });
  }

  mounted(): void {
    this.syncDB();
    this.listenToSetProjectAndRetrieveAssessments();
  }
  destroyed(): void {
    this.closeDB();
  }
}
</script>

<style lang="scss" scoped>
.survey-list__actions {
  display: grid;
  justify-content: flex-end;
  align-items: center;
  grid-template-columns: repeat(3, 22px);
}

::v-deep .site-row-pointer {
  cursor: pointer;
  outline: none;
}
.better-click {
  align-items: center;
  display: flex;
}
</style>
