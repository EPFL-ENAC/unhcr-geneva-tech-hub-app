<template>
  <div v-if="project && currentSurvey" class="fluid surveys-item">
    <header>
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
        <v-col class="col-auto">
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
      v-model="tabSelected"
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
              >
                <v-icon left>{{ subItem.icon }}</v-icon>
                {{ subItem.text }}
              </v-tab>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tab v-else :key="item.to" :href="`#${item.to}`">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-tab>
      </template>
    </v-tabs>
    <v-row>
      <v-col>
        <component
          :form.sync="currentSurvey[normedCategory][normedSubcategory]"
          @update:form="updateCurrentSurvey"
          :is="subcategory"
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
import CRI from "@/components/green_house_gaz/materials/CRI.vue";
import HHWaste from "@/components/green_house_gaz/materials/HHWaste.vue";
import Shelter from "@/components/green_house_gaz/materials/Shelter.vue";
import TreePlanting from "@/components/green_house_gaz/offset/TreePlanting.vue";
import Results from "@/components/green_house_gaz/Results.vue";
import Trucking from "@/components/green_house_gaz/wash/Trucking.vue";
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import getFlagEmoji from "@/utils/flagEmoji";
import getCountryName from "@/utils/getCountryName";
import { cloneDeep } from "lodash";
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
  },
})
/** ProjectList */
export default class SurveyList extends Vue {
  project!: GreenHouseGaz;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  readonly menuItems: MenuItem[] = [
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
    },
    {
      icon: "mdi-water",
      text: "WASH",
      to: "WASH",
      children: [
        { text: "Trucking", to: "Trucking", icon: "mdi-tanker-truck" },
      ],
    },
    {
      icon: "mdi-home",
      // text: "Shelter, Site and material",
      text: "Material",
      to: "Material-Shelter",
      children: [
        { text: "Shelter", to: "Shelter", icon: "mdi-home-group" },
        { text: "CRI", to: "CRI", icon: "mdi-wizard-hat" },
        { text: "HH waste", to: "HHWaste", icon: "mdi-toilet" },
      ],
    },
    {
      icon: "mdi-leaf",
      text: "Offset",
      to: "Offset-TreePlanting",
    },
    {
      icon: "mdi-newspaper-variant-outline",
      text: "Results",
      to: "Results-Results",
    },
  ];

  _tabSelected = "";

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
  public get tabSelected(): string {
    const tab = `${this.category}-${this.subcategory}`;
    return tab;
  }
  public set tabSelected(value: string) {
    if (value && value.split) {
      const [category, subcategory] = value.split("-");
      if (category && subcategory) {
        this.$router.push({ query: { category, subcategory } });
      }
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
    this.updateDoc(newProject);
  }

  public updateCurrentSurvey(): void {
    // force update via setter
    this.currentSurvey = Object.assign({}, this.currentSurvey);
  }

  public submitForm(value: GreenHouseGaz = this.project): void {
    if (value.name !== "") {
      this.updateDoc(value);
    } else {
      throw new Error("please fill the new Name");
    }
  }
}

interface MenuItem {
  text: string;
  icon: string;
  to: string;
  children?: MenuItem[];
}
</script>

<style scoped>
.surveys-item {
  width: 100%;
}
</style>
