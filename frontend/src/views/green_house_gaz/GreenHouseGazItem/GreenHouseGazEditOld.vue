<template>
  <v-container fluid>
    <v-tabs v-model="tab">
      <v-tab>
        <v-icon left> mdi-briefcase </v-icon>
        Surveys
      </v-tab>
      <v-tab>
        <v-icon left> mdi-briefcase </v-icon>
        About
      </v-tab>
      <v-tab>
        <v-icon left> mdi-account </v-icon>
        Users
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-row>
            <v-col :cols="6">
            </v-col>
            <v-col :cols="6">
              
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-row>
            <v-col>
              
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-footer>
          <!-- TODO add form with submit.prevent -->
          <v-row>
            <v-col class="d-flex justify-end align-center">
              <v-btn type="submit" :disabled="!$can('edit', localProject)">
                Save changes
              </v-btn>
              <span v-if="!$can('edit', localProject)" class="mx-auto">
                readonly mode
              </span>
            </v-col>
          </v-row>
        </v-footer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import Countries from "@/views/green_house_gaz/countriesAsList.min.js";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgItemModule", [
      "getDoc",
      "updateDoc",
      "syncDB",
      "closeDB",
    ]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  public getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  // todo store in js outstide directly ?
  countriesRef = Countries.map((country) => ({
    ...country,
    emoji: this.getFlagEmoji(country.code),
  }));

  countriesMap = Countries.reduce((acc, country) => {
    acc[country.code] = { ...country, emoji: this.getFlagEmoji(country.code) };
    return acc;
  }, {} as Record<string, Record<string, string>>);


  tab = 0;

  localProject = {} as GreenHouseGaz;

  textRules = [
    (v: string): boolean | string => !!v || `is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `should have a length >= 1`,
  ];

  // public setLocalShelter(): void {
  //   if (!this.project) {
  //     this.localProject = {} as GreenHouseGaz;
  //   } else {
  //     this.localProject = cloneDeep(this.project);
  //   }
  // }

  // public syncLocalShelter(): void {
  //   // init function
  //   this.setLocalShelter();

  //   this.$store.subscribe((mutation) => {
  //     const shouldUpdate = ["GhgItemModule/SET_PROJECT"];
  //     if (shouldUpdate.includes(mutation.type)) {
  //       this.setLocalShelter();
  //     }
  //   });
  // }

  // created(): void {
  //   this.syncLocalShelter();
  // }

  mounted(): void {
    this.syncDB();
    this.getDoc(decodeURIComponent(this.$route.params.site));
  }
  destroyed(): void {
    console.log("DESTROYED view shelter item, closing DB");
    this.closeDB();
  }

  public async submitForm(value: GreenHouseGaz): Promise<void> {
    if (value.name !== "") {
      await this.updateDoc(value);
    } else {
      throw new Error("please fill the new Name");
    }
  }
}
</script>

<style lang="scss" scoped></style>
