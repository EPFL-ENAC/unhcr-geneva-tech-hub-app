<template>
  <v-list nav>
    <v-list-item-group>
      <v-list-item
        v-for="item in projects"
        :key="item._id"
        @click="clickItem(item)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import { EnergyProjectDocument } from "@/models/energyModel";
import { SyncDatabase } from "@/utils/couchdb";
import PouchDB from "pouchdb";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class EnergyProjectList extends Vue {
  @Prop({ type: Object as () => SyncDatabase<EnergyProjectDocument> })
  readonly database!: SyncDatabase<EnergyProjectDocument>;

  projects: EnergyProjectDocument[] = [];
  changes?: PouchDB.Core.Changes<EnergyProjectDocument>;

  created(): void {
    this.updateProjects();

    this.changes = this.database.onChange(() => {
      this.updateProjects();
    });
  }

  destroyed(): void {
    this.changes?.cancel();
  }

  updateProjects(): void {
    this.database.getAllDocuments().then((documents) => {
      this.projects = documents;
    });
  }

  clickItem(project: EnergyProjectDocument): void {
    this.$router.push({ path: project._id, append: true });
  }
}
</script>
