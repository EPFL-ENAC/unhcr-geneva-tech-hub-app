<template>
  <v-container class="project-list">
    <v-row>
      <v-col>
        <h1 style="display: flex; justify-content: center">Camps</h1>
      </v-col>
      <v-col>
        <h1 style="display: flex; justify-content: center">New Camp</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row v-for="project in projects" :key="project._id">
          <v-col>
            <v-card
              :to="{
                name: 'GreenHouseGazEdit',
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
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("GhgListModule", ["projects"]),
  },

  methods: {
    ...mapActions("GhgListModule", [
      "addDoc",
      "removeDoc",
      "syncDB",
      "getDB",
      "closeDB",
    ]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  newName = "";
  projects!: [];
  addDoc!: (name: string) => null;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getDB!: () => Promise<null>;

  createProjectFormValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  public submitForm(): void {
    if (this.newName !== "") {
      this.addDoc(this.newName);
      this.newName = "";
    } else {
      console.error("please fill the new Name");
    }
  }

  mounted(): void {
    this.syncDB();
    this.getDB();
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
