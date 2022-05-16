<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ title }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-expansion-panels mandatory multiple>
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
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action class="flex-row">
                      <v-btn
                        icon
                        @click="
                          $event.stopPropagation();
                          copySite(item);
                        "
                      >
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        @click="
                          $event.stopPropagation();
                          deleteSite(item);
                        "
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <br />
        <v-card>
          <v-form v-model="formValid" @submit.prevent="createSite">
            <v-card-text>
              <form-item-component
                v-for="item in formItems"
                :key="item.key"
                v-model="newSiteProp[item.key]"
                v-bind="item"
              ></form-item-component>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" :disabled="!formValid" icon type="submit">
                <v-icon>mdi-plus-box</v-icon>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="6">
        <energy-map aspect-ratio="1" :markers="markers"></energy-map>
      </v-col>
    </v-row>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
  </v-container>
</template>

<script lang="ts">
import ConfirmDialog from "@/components/commons/ConfirmDialog.vue";
import FormItemComponent, {
  FormItem,
} from "@/components/commons/FormItemComponent.vue";
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
  formValid = false;
  newSiteProp: NewSiteProp = {};

  get formItems(): FormItem<keyof NewSiteProp>[] {
    return [
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
    return chain(
      groupBy(this.sites, (site) => site.modules.general?.name ?? "No Site")
    )
      .entries()
      .sortBy(([key]) => key)
      .map(([key, value]) => {
        const countryCode = value[0].modules.general?.countryCode ?? "";
        return {
          name: key,
          emoji: getFlagEmoji(countryCode),
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
          users: [this.username],
          modules: {},
        })
        .then((response) => {
          this.openSite(response.id);
        })
    );
  }

  copySite(document: ExistingDocument<ProjectDocument>): void {
    this.applyAsync(
      this.sitesDatabase.remoteDB.post({
        name: `${document.name} - copy`,
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
  projectName?: string;
}
</script>
