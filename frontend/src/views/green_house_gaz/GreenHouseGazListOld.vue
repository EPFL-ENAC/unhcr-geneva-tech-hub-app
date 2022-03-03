<template>
  <v-container class="project-list">
    <v-row>
      <v-col>
        <h1 style="display: flex; justify-content: center">Countries</h1>
      </v-col>
      <v-col>
        <h1 style="display: flex; justify-content: center">New Camp</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row v-for="country in countries" :key="country._id">
          <v-col>
            <v-card
              :to="{
                name: 'GreenHouseGazEdit',
                params: { id: encodeURIComponent(country._id) },
              }"
              class="mx-auto project"
              max-width="344"
              hover
              outlined
              :class="{
                'project--editable': $can('edit', country),
                'project--readonly': !$can('edit', country),
              }"
            >
              <v-card-title>
                {{ country.key }}
              </v-card-title>
              <v-card-actions class="d-flex flex-row justify-end">
                <v-btn
                  v-if="$can('delete', country)"
                  outlined
                  rounded
                  @click.once.prevent.stop="() => removeDoc(country.key)"
                >
                  Delete country
                </v-btn>
                <div v-else class="project__hidden-child">
                  <span v-if="$can('edit', country)">edit</span>
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
              <!-- <v-text-field
                tabindex="1"
                v-model="newCountry"
                required
                name="country"
                label="Country"
                type="text"
              /> -->
              <v-select
                v-model="newCountry"
                :items="countriesCodedReference"
                label="Select country"
                item-text="name"
              >
                <template v-slot:item="slotProps">
                  <i :class="['mr-2', 'em', slotProps.item.flag]"></i>
                  {{ slotProps.item.name }}
                </template>
              </v-select>
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
                New camp
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
    ...mapState("GhgListModule", ["projects", "countries"]),
  },

  methods: {
    ...mapActions("GhgListModule", [
      "addDoc",
      "removeDoc",
      "syncDB",
      "getCountries",
      "closeDB",
    ]),
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  newName = "";
  newCountry = "";

  projects!: [];
  countries!: [];
  addDoc!: (obj: Record<string, string>) => null;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getCountries!: () => Promise<null>;

  createProjectFormValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
  ];

  public submitForm(): void {
    if (this.newName !== "") {
      this.addDoc({ name: this.newName, country: this.newCountry });
      this.newName = "";
    } else {
      console.error("please fill the new Name");
    }
  }

  mounted(): void {
    this.syncDB();
    this.getCountries();
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view shelter list, closing DB");
    });
  }

  countriesCodedReference = [
    {
      name: "Andorra",
      flag: "em-flag-ad",
    },
    {
      name: "Arab Emirates",
      flag: "em-flag-ae",
    },
    {
      name: "Afghanistan",
      flag: "em-flag-af",
    },
    {
      name: "Antigua & Barbuda",
      flag: "em-flag-ag",
    },
    {
      name: "Albania",
      flag: "em-flag-al",
    },
    {
      name: "Anguilla",
      flag: "em-flag-ai",
    },
    {
      name: "France",
      flag: "em-flag-ai",
    },
    {
      name: "Germany",
      flag: "em-flag-ai",
    },
  ];
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
