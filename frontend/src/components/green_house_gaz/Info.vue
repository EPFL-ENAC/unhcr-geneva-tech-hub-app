<template>
  <v-form
    :readonly="!$can('edit', localProject)"
    @submit.prevent="() => submitForm(localProject)"
  >
    <v-container fluid v-if="project.users">
      <!-- <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">Info</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col>
          <v-card elevation="2" rounded>
            <v-card-title>
              <h3 class="baseline-title">Information</h3>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="localProject.name"
                name="name"
                label="Camp name"
                type="text"
                required
                :rules="textRules"
              />
              <v-select
                tabindex="2"
                v-model="localProject.country_code"
                :items="countriesRef"
                item-value="code"
                item-text="name"
                label="Select country"
              >
                <template v-slot:item="slotProps">
                  <div
                    class="d-flex justify-space-between"
                    style="width: 300px"
                  >
                    <span> {{ slotProps.item.emoji }} </span>
                    {{ slotProps.item.name }}
                  </div>
                </template>
              </v-select>
            </v-card-text>
            <v-card-actions> </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { GreenHouseGaz } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import Countries from "@/utils/countriesAsList";
import getFlagEmoji from "@/utils/flagEmoji";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgModule", ["updateDoc"]),
  },
})
/** ProjectItem */
export default class GhgInfo extends Vue {
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  project!: GreenHouseGaz;
  user!: CouchUser;
  localProject = {} as GreenHouseGaz;

  countriesRef = Countries.map((country) => ({
    ...country,
    emoji: getFlagEmoji(country.code),
  }));

  textRules = [
    (v: string): boolean | string => !!v || `is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `should have a length >= 1`,
  ];

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
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
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
