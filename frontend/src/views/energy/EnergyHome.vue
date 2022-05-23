<template>
  <v-container class="fill-height" fluid>
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
              <v-icon left>mdi-plus-box</v-icon>
              Add Project
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-expansion-panels v-model="expandedIndexes" multiple>
              <v-expansion-panel v-for="group in groups" :key="group.name">
                <v-expansion-panel-header>
                  <h3>{{ group.name }} {{ group.emoji }}</h3>
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
                          <v-list-item-title>
                            {{ item.name }}
                            <v-tooltip v-if="item.isTemplate" bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon v-bind="attrs" class="ma-1" v-on="on">
                                  mdi-account-hard-hat
                                </v-icon>
                              </template>
                              <span>Template</span>
                            </v-tooltip>
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action class="flex-row align-center">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                v-bind="attrs"
                                icon
                                v-on="on"
                                @click="
                                  $event.stopPropagation();
                                  copySite(item);
                                "
                              >
                                <v-icon>mdi-content-copy</v-icon>
                              </v-btn>
                            </template>
                            <span>Copy</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                v-bind="attrs"
                                icon
                                v-on="on"
                                @click="
                                  $event.stopPropagation();
                                  deleteSite(item);
                                "
                              >
                                <v-icon>mdi-delete</v-icon>
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
              <v-icon left>mdi-plus-box</v-icon>
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
import getFlagEmoji from "@/utils/flagEmoji";
import { LatLngExpression } from "leaflet";
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
          emoji: getFlagEmoji(countryCode === "undefined" ? "" : countryCode),
          sites: value,
        };
      })
      .value();
  }

  get markers(): LatLngExpression[] {
    return chain(this.sites)
      .map((site) => site.modules.general)
      .filter((general): general is GeneralModule => !!general)
      .map(
        (general) =>
          [
            general.locationLatitude,
            general.locationLongitude,
          ] as LatLngExpression
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
  emoji: string;
  sites: ExistingDocument<ProjectDocument>[];
}

interface NewSiteProp {
  siteName?: string;
  projectName?: string;
}
</script>
