<template>
  <v-container class="project-list">
    <v-row>
      <v-col>
        <h1 style="display: flex; justify-content: center">Shelters</h1>
      </v-col>
      <v-col>
        <h1 style="display: flex; justify-content: center">New Shelter</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row v-for="project in projects" :key="project._id">
          <v-col>
            <v-card
              :to="{
                name: 'ShelterSustainabilityEdit',
                params: { id: encodeURIComponent(project._id) },
              }"
              class="mx-auto project"
              max-width="344"
              hover
              outlined
              :class="{
                'project--editable': $can('edit', project),
                'project--readonly': !$can('edit', project),
              }"
            >
              <v-card-title>
                {{ project.name }}
              </v-card-title>
              <v-card-text>
                <span>{{ project.location_name }}</span>
              </v-card-text>
              <v-card-actions class="d-flex flex-row justify-end">
                <v-btn
                  v-if="$can('delete', project)"
                  outlined
                  rounded
                  @click.once.prevent.stop="() => removeDoc(project._id)"
                >
                  Delete project
                </v-btn>
                <div v-else class="project__hidden-child">
                  <span v-if="$can('edit', project)">edit</span>
                  <span v-else>read</span>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-form @submit.prevent="submitForm" v-model="createProjectFormValid">
          <v-card class="mx-auto" max-width="344" outlined>
            <v-card-text>
              <v-text-field
                tabindex="1"
                v-model="newName"
                :rules="rules"
                required
                name="name"
                label="Name"
                type="text"
              />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                outlined
                rounded
                text
                type="submit"
                tabindex="2"
                :disabled="!createProjectFormValid"
              >
                New shelter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Shelter } from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("ShelterModule", ["shelters", "db"]),
  },

  methods: {
    ...mapActions("ShelterModule", [
      "addDoc",
      "removeDoc",
      "syncDB",
      "getShelters",
      "closeDB",
    ]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  newName = "";
  shelters!: [];
  addDoc!: (name: string) => Promise<null>;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getShelters!: () => Promise<null>;
  db!: SyncDatabase<Shelter> | null;

  createProjectFormValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  public get projects(): Record<string, string | number>[] {
    return this.shelters;
  }
  public submitForm(): void {
    if (this.newName !== "") {
      this.addDoc(this.newName).then(() => {
        this.$router.push({
          name: "ShelterSustainabilityEdit",
          params: { id: encodeURIComponent(this.newName) },
        });
      });
    } else {
      console.error("please fill the new Name");
    }
  }

  mounted(): void {
    this.syncDB();
    this.getShelters();

    this.db?.onChange(this.getShelters);
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view shelter list, closing DB");
    });
  }
}
</script>

<style lang="scss" scoped>
// https://css-tricks.com/using-sass-control-scope-bem-naming/
.project {
  $self: &;
  // background-color: blue;

  &--editable {
    // background-color: yellow;
    &:hover {
      // background-color: red;
      color: #444;
    }
  }

  &--readonly {
    // background-color: yellow;
    color: #999;
    &:hover {
      // background-color: red;
      color: inherit;
    }
  }

  #{ $self }__hidden-child {
    visibility: hidden;
    color: #ccc;
  }

  &:hover {
    // background-color: green;
    #{ $self }__hidden-child {
      visibility: visible;
    }
  }
}
</style>
