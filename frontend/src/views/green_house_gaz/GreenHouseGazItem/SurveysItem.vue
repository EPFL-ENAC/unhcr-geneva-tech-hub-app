<template>
  <v-container fluid v-if="project">
    <!-- {{ currentSurvey }} -->
    <header>
      <v-row>
        <v-col :cols="10">
          <h2>
            {{ currentProjectEmoji }} {{ currentProjectCountryName }},
            {{ project.name }},
            {{ currentSurvey.name }}
          </h2>
        </v-col>
        <v-col :cols="2">
          <span class="d-flex justify-end">
            <v-btn
              icon
              :to="{
                name: 'GreenHouseGazItem',
                params: {
                  country: encodeURIComponent(project.country_code),
                  site: encodeURIComponent(project.name),
                },
              }"
            >
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </span>
        </v-col>
      </v-row>
    </header>
    <v-tabs
      class="fixed-tabs-bar"
      centered
      background-color="white"
      grow
      :show-arrows="true"
      elevation="2"
    >
      <template v-for="item in menuItems">
        <v-tab :key="item.to" :to="{ name: item.to }">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-tab>
      </template>
    </v-tabs>
    <v-row>
      <v-col>
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import getFlagEmoji from "@/utils/flagEmoji";
import getCountryName from "@/utils/getCountryName";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

const REFERENCE_DOC_ID = "reference";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },
  methods: {
    ...mapActions("GhgItemModule", [
      "getDoc",
      "updateDoc",
      "syncDB",
      "closeDB",
    ]),
  },
  filters: {
    date: function (value: string) {
      if (!value) return "";
      value = value.toString();
      return value.substring(0, 4);
      // const locale = navigator?.languages?.[0] ?? navigator.language;
      // return new Intl.DateTimeFormat(locale).format(new Date(value));
    },
  },
})
/** ProjectList */
export default class SurveyList extends Vue {
  project!: GreenHouseGaz;
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getDoc!: (id: string) => Promise<null>;

  readonly menuItems: MenuItem[] = [
    { icon: "mdi-lightning-bolt", text: "Energy", to: "GreenHouseGazStep1" },
    { icon: "mdi-water", text: "Wash transport", to: "GreenHouseGazStep2" },
    {
      icon: "mdi-home",
      text: "Shelter, Site and material",
      to: "GreenHouseGazStep3",
    },
    { icon: "mdi-leaf", text: "Sequestration", to: "GreenHouseGazStep4" },
    {
      icon: "mdi-newspaper-variant-outline",
      text: "Results",
      to: "GreenHouseGazStep4",
    },
  ];

  public get currentProjectEmoji(): string {
    return getFlagEmoji(this.project.country_code);
  }

  public get currentProjectCountryName(): string {
    return getCountryName(this.project.country_code);
  }

  public get currentSurvey(): Survey | undefined {
    if (!this.project) {
      return undefined;
    }
    const foundSurvey = this.project.surveys.find(
      (el: Survey) => el.name === this.$route.params.surveyId
    );
    if (!foundSurvey) {
      throw new Error("Could not find matching survey");
    }
    return foundSurvey;
  }

  mounted(): void {
    this.syncDB();
    this.getDoc(REFERENCE_DOC_ID);
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view reference list, closing DB");
    });
  }
}

interface MenuItem {
  text: string;
  icon: string;
  to: string;
  children?: MenuItem[];
}
</script>
