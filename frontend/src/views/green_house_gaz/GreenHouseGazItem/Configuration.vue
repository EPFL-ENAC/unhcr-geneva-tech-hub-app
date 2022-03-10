<template>
  <div>Configuration</div>
</template>

<script lang="ts">
import { GreenHouseGaz } from "@/store/GhgInterface";
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
  user!: CouchUser;
  localProject = {} as GreenHouseGaz;

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

<style></style>
