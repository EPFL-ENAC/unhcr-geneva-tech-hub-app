<template>
  <v-container class="fill-height" fluid>
    <v-dialog v-model="workflowDialog" max-width="900">
      <v-card>
        <v-card-title>
          <h2>Welcome to the UNHCR TSS Energy Planning Tool</h2>
        </v-card-title>
        <v-form v-model="workflowForm">
          <v-card-text>
            <v-row>
              <v-col :cols="6">
                <v-row>
                  <v-col>
                    <v-icon>$mdiAccountHardHat</v-icon>
                    <b>Specialists</b> should create template projects, with
                    necessary details and range to facilitate future assessments
                    at a given site.
                  </v-col>
                </v-row>
              </v-col>
              <v-col :cols="6">
                <v-row>
                  <v-col>
                    <b>General users</b> should start from a pre-filled
                    template.
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="6">
                <v-row>
                  <v-col class="d-flex justify-center">
                    <v-btn dark color="primary" @click="continueAsSpecalist">
                      Continue as specialist
                      <v-icon>$mdiAccountHardHat</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col :cols="6">
                <v-row>
                  <v-col class="d-flex justify-center">
                    <v-btn color="primary" dark @click="continueAsUser">
                      Continue as general user
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAsUser" max-width="900">
      <v-card>
        <v-card-title>
          <h2>General user</h2>
        </v-card-title>
        <v-card-text>
          The simplest way to create a new project is to Duplicate
          (<v-icon>$mdiContentCopy</v-icon>) an existing Template.

          <p class="c-primary">
            The templates created by specialists appear in Blue.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="dialogAsUser = false"
            >Get started</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAsSpecalist" max-width="900">
      <v-card>
        <v-card-title>
          <h2>Specialist</h2>
        </v-card-title>
        <v-card-text>
          <div>
            Add project by clicking on
            <v-btn color="primary" text>
              <v-icon left>$mdiPlusBox</v-icon>
              Add Project
            </v-btn>
          </div>

          <p>
            Make sure to check the “Template” when creating assessment
            pre-filled for general users
            <v-checkbox hide-details="auto" label="Template"></v-checkbox>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="dialogAsSpecalist = false"
            >Get started</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row class="fill-height">
      <v-col cols="6">
        <v-row>
          <v-col>
            <v-btn
              class="float-right"
              color="primary"
              :disabled="username === 'guest'"
              text
              @click="createDialog = true"
            >
              <v-icon left>$mdiPlusBox</v-icon>
              Add Project
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-expansion-panels v-model="expandedIndexes" multiple>
              <v-expansion-panel v-for="group in groups" :key="group.name">
                <v-expansion-panel-header>
                  <h3>
                    {{ group.name }}
                    <country-flag :country="group.countryCode" size="small" />
                  </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list nav>
                    <v-list-item-group>
                      <v-list-item
                        v-for="item in group.sites"
                        :key="item._id"
                        @click="openSite(item._id)"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            :class="{
                              'c-primary': item.isTemplate,
                            }"
                          >
                            {{ item.name }}
                            <v-tooltip v-if="item.isTemplate" bottom>
                              <template #activator="{ on, attrs }">
                                <v-icon
                                  :class="{
                                    'c-primary': item.isTemplate,
                                  }"
                                  v-bind="attrs"
                                  class="ma-1"
                                  v-on="on"
                                >
                                  $mdiAccountHardHat
                                </v-icon>
                              </template>
                              <span>Template</span>
                            </v-tooltip>
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action class="flex-row align-center">
                          <v-tooltip bottom>
                            <template #activator="{ on, attrs }">
                              <v-btn
                                v-bind="attrs"
                                icon
                                v-on="on"
                                @click="
                                  $event.stopPropagation();
                                  copySite(item);
                                "
                              >
                                <v-icon>$mdiContentCopy</v-icon>
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
                                v-on="on"
                                @click="
                                  $event.stopPropagation();
                                  deleteSite(item);
                                "
                              >
                                <v-icon>$mdiDelete</v-icon>
                              </v-btn>
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6">
        <energy-map :markers="markers"></energy-map>
      </v-col>
    </v-row>
    <v-dialog v-model="createDialog" max-width="256">
      <v-card>
        <v-form
          v-model="formValid"
          @submit.prevent="
            createDialog = false;
            createSite();
          "
        >
          <v-card-text>
            <form-item-component
              v-for="item in formItems"
              :key="item.key"
              v-model="newSiteProp[item.key]"
              v-bind="item"
            ></form-item-component>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :disabled="!formValid" type="submit" text>
              <v-icon left>$mdiPlusBox</v-icon>
              Create
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
  </v-container>
</template>

<script lang="ts">
import ConfirmDialog from "@/components/commons/ConfirmDialog.vue";
import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import EnergyMap from "@/components/energy/EnergyMap.vue";
import { ExistingDocument } from "@/models/couchdbModel";
import { GeneralModule, ProjectDocument } from "@/models/energyModel";
import { energy } from "@/utils/apps";
import { SyncDatabase } from "@/utils/couchdb";
import { chain, cloneDeep, groupBy } from "lodash";
import "vue-class-component/hooks";
import { Component, Ref, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  components: {
    ConfirmDialog,
    EnergyMap,
    FormItemComponent,
  },
  computed: {
    ...mapState("energy", ["sites", "sitesDatabase"]),
  },
})
export default class EnergyHome extends Vue {
  sites!: ExistingDocument<ProjectDocument>[];
  sitesDatabase!: SyncDatabase<ProjectDocument>;
  title = energy.title;
  loading = false;
  createDialog = false;
  formValid = false;
  newSiteProp: NewSiteProp = {};
  expandedIndexes: number[] = [0];

  workflowDialog = true;
  workflowForm = false;
  dialogAsSpecalist = false;
  dialogAsUser = false;

  public continueAsSpecalist(): void {
    this.dialogAsSpecalist = true;
    this.workflowDialog = false;
  }
  public continueAsUser(): void {
    this.dialogAsUser = true;
    this.workflowDialog = false;
  }
  get formItems(): FormItem<keyof NewSiteProp>[] {
    return [
      {
        type: "combobox",
        key: "siteName",
        label: "Site Name",
        options: this.groups.map((group) => group.name).sort(),
      },
      {
        type: "text",
        key: "projectName",
        label: "Project Name",
      },
    ];
  }

  get username(): string {
    return this.$userName();
  }

  get groups(): Group[] {
    return chain(groupBy(this.sites, (site) => site.siteName ?? "No Site"))
      .entries()
      .sortBy(([key]) => key)
      .map(([key, value]) => {
        const countryCode = chain(value)
          .map((doc) => doc.modules.general?.countryCode)
          .countBy()
          .entries()
          .maxBy(([, count]) => count)
          .value()[0] as string;
        return {
          name: key,
          countryCode: countryCode === "undefined" ? "" : countryCode,
          sites: value,
        };
      })
      .value();
  }

  get markers(): (number | undefined | GeneralModule)[][] {
    return chain(this.sites)
      .map((site) => site.modules.general)
      .filter((general): general is GeneralModule => !!general)
      .map(
        (general) =>
          [general.locationLatitude, general.locationLongitude] as [
            number,
            number
          ]
      )
      .uniq()
      .value();
  }

  @Ref()
  readonly confirmDialog!: ConfirmDialog;

  openSite(documentId: string): void {
    this.$router.push({ path: `sites/${documentId}`, append: true });
  }

  createSite(): void {
    this.applyAsync(
      this.sitesDatabase.remoteDB
        .post({
          name: this.newSiteProp.projectName ?? "",
          siteName: this.newSiteProp.siteName ?? "",
          users: [this.username],
          modules: {},
        })
        .then(() => {
          const index = this.groups.findIndex(
            (group) => group.name === this.newSiteProp.siteName
          );
          if (index >= 0) {
            this.expandedIndexes = [index];
          }
          this.newSiteProp = {};
        })
    );
  }

  copySite(document: ExistingDocument<ProjectDocument>): void {
    this.applyAsync(
      this.sitesDatabase.remoteDB.post({
        name: `${document.name} - copy`,
        siteName: document.siteName ?? document.modules.general?.name,
        users: [this.username],
        modules: cloneDeep(document.modules),
      })
    );
  }

  deleteSite(document: ExistingDocument<ProjectDocument>): void {
    this.confirmDialog
      .open(`Are you sure to delete "${document.name}" ?`)
      .then((confirmed) => {
        if (confirmed) {
          this.applyAsync(this.sitesDatabase.remoteDB.remove(document));
        }
      });
  }

  applyAsync<T>(promise: Promise<T>): void {
    this.loading = true;
    promise
      .catch((reason) => {
        this.$store.dispatch("notifyUser", reason.message ?? reason);
        console.error(reason);
      })
      .finally(() => (this.loading = false));
  }
}

interface Group {
  name: string;
  countryCode: string;
  sites: ExistingDocument<ProjectDocument>[];
}

interface NewSiteProp {
  siteName?: string;
  projectName?: string;
}
</script>

<style scoped lang="scss">
.c-primary {
  color: var(--c-unhcr);
}
</style>
