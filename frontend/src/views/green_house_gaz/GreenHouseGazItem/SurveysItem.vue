<template>
  <div v-if="project && currentSurvey" class="fluid surveys-item">
    <header class="ma-5">
      <v-row>
        <v-col>
          <h2>
            {{ currentProjectEmoji }} {{ currentProjectCountryName }},
            {{ project.name }},
            {{ currentSurvey.name }}
          </h2>
        </v-col>
        <v-col class="col-auto">
          <user-manager
            v-model="project.users"
            @change="submitForm"
          ></user-manager>
        </v-col>
      </v-row>
    </header>
    <v-tabs
      v-model="tabSelected"
      class="fixed-tabs-bar"
      centered
      background-color="white"
      grow
      :show-arrows="true"
      elevation="2"
      hide-slider
    >
      <template v-for="(item, $itemIndex) in menuItems">
        <v-divider
          v-if="!item.text"
          :key="item.toilet"
          class="mx-2"
          vertical
        ></v-divider>
        <v-menu
          v-else-if="item.children"
          :key="`${$itemIndex}`"
          offset-y
          open-on-hover
        >
          <template v-slot:activator="{ attrs, on }">
            <v-tab :key="`${$itemIndex}`" v-bind="attrs" v-on="on">
              <v-icon left>{{ item.icon }}</v-icon>
              {{ item.text }}
            </v-tab>
          </template>
          <v-list>
            <v-list-item
              v-for="(subItem, $subItemIndex) in item.children"
              :key="subItem.to"
            >
              <v-tab
                :key="`${$itemIndex}${$subItemIndex}`"
                :href="`#${item.to}-${subItem.to}`"
                :class="{ 'v-tab--active': subcategory === subItem.to }"
              >
                <v-icon left>{{ subItem.icon }}</v-icon>
                {{ subItem.text }}
              </v-tab>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tab v-else :key="item.to">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-tab>
      </template>
    </v-tabs>
    <v-row>
      <v-col>
        <component
          :is="subcategory"
          v-if="subcategory"
          :form.sync="currentSurvey[normedCategory][normedSubcategory]"
          @update:form="updateCurrentSurvey"
        />
        <component
          :is="category"
          v-else
          :survey.sync="currentSurvey"
          @update:survey="updateCurrentSurvey"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import UserManager from "@/components/commons/UserManager.vue";
import Cooking from "@/components/green_house_gaz/energy/Cooking.vue";
import Facilities from "@/components/green_house_gaz/energy/Facilities.vue";
import Lighting from "@/components/green_house_gaz/energy/Lighting.vue";
import Pumping from "@/components/green_house_gaz/energy/Pumping.vue";
import Info from "@/components/green_house_gaz/Info.vue";
import CRI from "@/components/green_house_gaz/materials/CRI.vue";
import HHWaste from "@/components/green_house_gaz/materials/HHWaste.vue";
import Shelter from "@/components/green_house_gaz/materials/Shelter.vue";
import Results from "@/components/green_house_gaz/Results.vue";
import TreePlanting from "@/components/green_house_gaz/TreePlanting.vue";
import Trucking from "@/components/green_house_gaz/wash/Trucking.vue";
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import getFlagEmoji from "@/utils/flagEmoji";
import getCountryName from "@/utils/getCountryName";
import { cloneDeep, isEqual } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgModule", ["updateDoc"]),
  },
  components: {
    Cooking,
    Facilities,
    Lighting,
    Pumping,
    CRI,
    HHWaste,
    Shelter,
    Trucking,
    TreePlanting,
    Results,
    UserManager,
    Info,
  },
})
/** ProjectList */
export default class SurveyList extends Vue {
  project!: GreenHouseGaz;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  readonly menuItems: MenuItem[] = [
    {
      to: "Info",
      text: "Information",
      icon: "mdi-information",
    },
    {
      children: [
        {
          icon: "mdi-shower",
          text: "Facilities",
          to: "Facilities",
        },
        { icon: "mdi-stove", text: "Cooking", to: "cooking" },
        {
          icon: "mdi-lightbulb",
          text: "Lighting",
          to: "lighting",
        },
        {
          icon: "mdi-water-pump",
          text: "Pumping",
          to: "pumping",
        },
      ],
      icon: "mdi-lightning-bolt",
      text: "Energy",
      to: "Energy",
      redirect: "Energy-Facilities",
    },
    {
      icon: "mdi-water",
      text: "WASH",
      to: "WASH",
      redirect: "WASH-Trucking",
      children: [
        { text: "Trucking", to: "Trucking", icon: "mdi-tanker-truck" },
      ],
    },
    {
      icon: "mdi-home",
      // text: "Shelter, Site and material",
      text: "Material",
      to: "Material",
      redirect: "Material-Shelter",
      children: [
        { text: "Shelter", to: "Shelter", icon: "mdi-home-group" },
        { text: "CRI", to: "CRI", icon: "mdi-wizard-hat" },
        { text: "HH waste", to: "HHWaste", icon: "mdi-toilet" },
      ],
    },
    {
      icon: "mdi-leaf",
      text: "Offset",
      to: "Offset",
      redirect: "Offset-TreePlanting",
    },
    {
      icon: "mdi-newspaper-variant-outline",
      text: "Results",
      to: "Results",
      // redirect: "Results-Results",
    },
  ];

  public get category(): string {
    return (this.$route.query.category as string) ?? "";
  }

  public get normedCategory(): string {
    return this.category.toLowerCase();
  }

  public get subcategory(): string {
    return (this.$route.query.subcategory as string) ?? "";
  }

  public get normedSubcategory(): string {
    return this.subcategory.toLowerCase();
  }
  public get tabSelected(): string | number {
    const tabIndex = this.menuItems.findIndex((value: MenuItem) => {
      const [category] = value.to.split("-");
      return category === this.category;
    });
    return tabIndex;
  }
  public set tabSelected(value: string | number) {
    // Warning should not push to current route if same path!
    const currentRouteQuery = this.$router.currentRoute.query as Record<
      string,
      string
    >;
    let query;
    if (typeof value === "number") {
      const name = this.menuItems[value].redirect || this.menuItems[value].to;
      let [category, subcategory] = name.split("-");
      query = { category, subcategory };
    }
    if (typeof value === "string") {
      let [category, subcategory] = value.split("-");
      if (category && subcategory) {
        query = { category, subcategory };
      } else if (category) {
        query = { category };
      }
    }

    if (!isEqual(currentRouteQuery, query)) {
      this.$router.push({ query });
    }
  }

  public get currentProjectEmoji(): string {
    if (this.project?.country_code) {
      return getFlagEmoji(this.project.country_code);
    }
    return "";
  }

  public get currentProjectCountryName(): string {
    if (this.project?.country_code) {
      return getCountryName(this.project.country_code);
    }
    return "";
  }

  public get currentSurveyId(): string {
    return decodeURIComponent(this.$route.params.surveyId);
  }

  public get currentSurveyIndex(): number {
    return (
      this.project.surveys?.findIndex(
        (el: Survey) => el.name === this.currentSurveyId
      ) ?? -1
    );
  }

  public get currentSurvey(): Survey | undefined {
    if (this.project?.surveys) {
      const result = cloneDeep(
        this.project.surveys?.[this.currentSurveyIndex] ?? ({} as Survey)
      );
      // ensure at least first level
      result.wash = result.wash || {};
      result.energy = result.energy || {};
      result.material = result.material || {};
      result.offset = result.offset || {};
      return result;
    }
    return undefined;
  }

  public set currentSurvey(survey: Survey | undefined) {
    const newProject = cloneDeep(this.project);
    // update array of survey and then submit!
    if (survey) {
      newProject.surveys.splice(this.currentSurveyIndex, 1, survey);
    } else {
      // in case of undefined remove survey
      newProject.surveys.splice(this.currentSurveyIndex, 1);
    }
    this.submitForm(newProject);
  }

  public updateCurrentSurvey(): void {
    // force update via setter
    this.currentSurvey = Object.assign({}, this.currentSurvey);
  }

  public submitForm(value: GreenHouseGaz = this.project): void {
    if (this.$can("edit", value)) {
      if (value.name !== "") {
        this.updateDoc(value);
      } else {
        throw new Error("please fill the new Name");
      }
    } else {
      console.log("you don't have the proper rights");
    }
  }
}

interface MenuItem {
  text: string;
  icon: string;
  to: string;
  redirect?: string;
  children?: MenuItem[];
}
</script>

<style scoped>
.surveys-item {
  width: 100%;
}
</style>
