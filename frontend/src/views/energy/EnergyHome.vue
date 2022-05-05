<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ title }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="group in groups" :key="group.name">
            <v-expansion-panel-header>
              {{ group.name }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <h2>
                Templates
                <v-btn color="primary" icon @click="createTemplate(group.name)">
                  <v-icon>mdi-plus-box</v-icon>
                </v-btn>
              </h2>
              <v-list nav>
                <v-list-item-group>
                  <v-list-item
                    v-for="item in group.templates"
                    :key="item._id"
                    @click="openTemplate(item)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ getName(item) }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action class="flex-row">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            color="primary"
                            icon
                            @click="
                              $event.stopPropagation();
                              createSite(item);
                            "
                          >
                            <v-icon>mdi-plus-box</v-icon>
                          </v-btn>
                        </template>
                        <span>New site from template</span>
                      </v-tooltip>
                      <v-btn
                        icon
                        @click="
                          $event.stopPropagation();
                          deleteTemplate(item);
                        "
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <h2>Sites</h2>
              <v-list nav>
                <v-list-item-group>
                  <v-list-item
                    v-for="item in group.sites"
                    :key="item._id"
                    @click="openSite(item)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ getName(item) }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
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
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="primary" icon v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { ExistingDocument } from "@/models/couchdbModel";
import { ProjectDocument } from "@/models/energyModel";
import { energy } from "@/utils/apps";
import { SyncDatabase } from "@/utils/couchdb";
import { chain, cloneDeep, groupBy } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState("energy", [
      "sites",
      "sitesDatabase",
      "templates",
      "templatesDatabase",
    ]),
  },
})
export default class EnergyHome extends Vue {
  sites!: ExistingDocument<ProjectDocument>[];
  sitesDatabase!: SyncDatabase<ProjectDocument>;
  templates!: ExistingDocument<ProjectDocument>[];
  templatesDatabase!: SyncDatabase<ProjectDocument>;
  title = energy.title;
  loading = false;
  // TODO global snackbar
  snackbar = false;
  snackbarText = "";

  get groups(): Group[] {
    const groupedTemplates = groupBy(
      this.templates,
      (template) => template.name
    );
    const groupedSites = groupBy(this.sites, (site) => site.name);
    const names: string[] = chain([
      ...Object.keys(groupedTemplates),
      ...Object.keys(groupedSites),
    ])
      .uniq()
      .sort()
      .value();
    return names.map((name) => ({
      name: name,
      templates: groupedTemplates[name] ?? [],
      sites: groupedSites[name] ?? [],
    }));
  }

  getName(document: ExistingDocument<ProjectDocument>): string {
    return document.modules.general?.name ?? document.name;
  }

  openTemplate(document: ExistingDocument<ProjectDocument>): void {
    this.$router.push({ path: `templates/${document._id}`, append: true });
  }

  openSite(document: ExistingDocument<ProjectDocument>): void {
    this.$router.push({ path: `sites/${document._id}`, append: true });
  }

  createTemplate(name: string): void {
    const username = this.$userName();
    this.applyAsync(
      this.templatesDatabase.remoteDB.post({
        name: name,
        users: [username],
        modules: {},
      })
    );
  }

  createSite(templateDocument: ExistingDocument<ProjectDocument>): void {
    const username = this.$userName();
    this.applyAsync(
      this.sitesDatabase.remoteDB.post({
        name: templateDocument.name,
        users: [username],
        modules: cloneDeep(templateDocument.modules),
      })
    );
  }

  deleteTemplate(document: ExistingDocument<ProjectDocument>): void {
    this.applyAsync(this.templatesDatabase.remoteDB.remove(document));
  }

  deleteSite(document: ExistingDocument<ProjectDocument>): void {
    this.applyAsync(this.sitesDatabase.remoteDB.remove(document));
  }

  applyAsync<T>(promise: Promise<T>): void {
    this.loading = true;
    promise
      .catch((reason) => {
        this.snackbarText = reason.message ?? reason;
        this.snackbar = true;
        console.error(reason);
      })
      .finally(() => (this.loading = false));
  }
}

interface Group {
  name: string;
  templates: ExistingDocument<ProjectDocument>[];
  sites: ExistingDocument<ProjectDocument>[];
}
</script>
