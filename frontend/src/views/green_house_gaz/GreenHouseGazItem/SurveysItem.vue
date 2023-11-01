<template>
  <div v-if="project && currentProject" class="fluid surveys-item">
    <header v-if="currentProject && currentProject.siteName" class="ma-5">
      <v-row>
        <v-col>
          <h2 class="d-flex">
            <span
              v-if="currentProject && currentProject.countryCode !== undefined"
              class="mx-4 mt-n1"
            >
              <country-flag :country="currentProject.countryCode" />
            </span>
            <span>
              {{ currentProjectCountryName }}, {{ currentProject.siteName }} ({{
                (currentProject.siteId + "").substr(0, 8)
              }}),
              {{ currentProject.description }}
              {{
                $can("edit", {
                  users: currentProject.users,
                  reference: currentProject.reference,
                })
                  ? ""
                  : "(Read only)"
              }}
            </span>
          </h2>
        </v-col>
        <v-col class="col-auto">
          <user-manager
            v-model="currentProject.users"
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
          <template #activator="{ attrs, on }">
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
        <v-container v-if="currentProject && currentProject.users" fluid>
          <!-- add !$can to put readonly mode for guest (but for now we want the
            user to be able to edit the field but not 'SAVE' them to the server) <v-form :readonly="isReadOnly"> -->
          <v-form class="surveys-item__form">
            <component
              :is="subcategory"
              v-if="subcategory"
              :disabled="moduleDisabled"
              :form.sync="localFormSurvey"
              :title-key="currentKeyTitle"
              :survey="currentProject"
              :country-code="currentProject && currentProject.countryCode"
            />
            <component
              :is="category"
              v-else
              :disabled="moduleDisabled"
              :readonly="isReadOnly"
              :survey.sync="currentProject"
            />
          </v-form>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import UserManager from "@/components/commons/UserManager.vue";
import Cooking from "@/components/green_house_gaz/energy/Cooking.vue";
import Facilities from "@/components/green_house_gaz/energy/Facilities.vue";
import Lighting from "@/components/green_house_gaz/energy/Lighting.vue";
import Info from "@/components/green_house_gaz/Info.vue";
// import CRI from "@/components/green_house_gaz/materials/CRI.vue";
import DomesticSolidWaste from "@/components/green_house_gaz/materials/DomesticSolidWaste.vue";
// import Shelter from "@/components/green_house_gaz/materials/Shelter.vue";
import TreePlanting from "@/components/green_house_gaz/offset/TreePlanting.vue";
import Results from "@/components/green_house_gaz/Results.vue";
import WaterSupply from "@/components/green_house_gaz/wash/WaterSupply.vue";

import { infoTooltipText } from "@/components/green_house_gaz/infoTooltipText";
import {
  GenericFormSurvey,
  GreenHouseGaz,
  newSurveyForm,
  SurveyForms,
  SurveyItem,
  SurveyKey,
  SurveyResult,
  SurveySubcategory,
} from "@/store/GhgInterface";
import getCountryName from "@/utils/getCountryName";
import { cloneDeep, isEqual } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgModule", ["updateDoc", "updateLocalStore"]),
  },
  components: {
    Cooking,
    Facilities,
    Lighting,
    // CRI,
    DomesticSolidWaste,
    // Shelter,
    WaterSupply,
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
  updateLocalStore!: (doc: GreenHouseGaz) => Promise<void>;

  readonly menuItems: MenuItem[] = [
    {
      to: "Info",
      text: "Information",
      icon: "$mdiInformation",
    },
    {
      children: [
        {
          icon: "$mdiHospitalBuilding",
          text: "Facilities",
          to: "Facilities",
        },
        { icon: "$mdiStove", text: "Cooking", to: "Cooking" },
        {
          icon: "$mdiLightbulb",
          text: "Lighting",
          to: "Lighting",
        },
      ],
      icon: "$mdiLightningBolt",
      text: "Energy",
      to: "Energy",
      redirect: "Energy-Facilities",
    },
    {
      icon: "$mdiWater",
      text: "WASH",
      to: "WASH",
      redirect: "WASH-WaterSupply",
      children: [
        { text: "Water Supply", to: "WaterSupply", icon: "$mdiWaterPump" },
      ],
    },
    {
      icon: "$mdiHome",
      // text: "Shelter, Site and material",
      text: "Material",
      to: "Material",
      redirect: "Material-DomesticSolidWaste",
      children: [
        {
          text: "Domestic solid waste",
          to: "DomesticSolidWaste",
          icon: "$mdiTrashCanOutline",
        },
      ],
    },
    {
      icon: "$mdiNewspaperVariantOutline",
      text: "Results",
      to: "Results",
      // redirect: "Results-Results",
    },
  ];

  public get category(): string {
    return (this.$route.query.category as string) ?? "";
  }

  public get normedCategory(): SurveyKey {
    return this.category?.toLowerCase() as SurveyKey;
  }

  public get subcategory(): string {
    return (this.$route.query.subcategory as string) ?? "";
  }

  public get normedSubcategory(): SurveySubcategory {
    return this.subcategory.toLowerCase() as SurveySubcategory;
  }

  public get currentKeyTitle(): string {
    return `${this.category}-${this.subcategory}`;
  }

  public get moduleDisabled(): boolean {
    if (this.currentKeyTitle) {
      return infoTooltipText[this.currentKeyTitle]?.disabled ?? false;
    }
    return false;
  }

  public get localFormSurvey():
    | GenericFormSurvey<SurveyItem, SurveyResult, SurveyItem, SurveyResult>
    | undefined {
    const category = this.currentProject?.[this.normedCategory];
    const subcategory =
      category?.[this.normedSubcategory as keyof typeof category];
    return subcategory;
  }

  public set localFormSurvey(
    value:
      | GenericFormSurvey<SurveyItem, SurveyResult, SurveyItem, SurveyResult>
      | undefined
  ) {
    if (value === undefined) {
      throw new Error("value is undefined");
    } else {
      if (
        this.currentProject !== undefined &&
        this.normedCategory &&
        this.normedSubcategory &&
        this.currentProject[this.normedCategory as keyof SurveyForms]
      ) {
        const normedCategory = this.normedCategory as keyof SurveyForms;
        this.currentProject[normedCategory][
          this.normedSubcategory as keyof SurveyForms[typeof normedCategory]
        ] = value as never;
        this.currentProject = { ...this.currentProject }; // force call to setter currentProject
      }
    }
  }

  public get isReadOnly(): boolean {
    return !this.$can("edit", {
      users: this.project.users,
      reference: this.currentProject?.reference,
    });
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
      const [category, subcategory] = name.split("-");
      query = { category, subcategory };
    }
    if (typeof value === "string") {
      const [category, subcategory] = value.split("-");
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

  public get currentProjectCountryName(): string {
    if (this.project?.countryCode) {
      return getCountryName(this.project.countryCode);
    }
    return "";
  }

  public get currentProjectId(): string {
    return decodeURIComponent(this.$route.params.surveyId);
  }

  public get currentProject(): GreenHouseGaz | undefined {
    if (this.project) {
      const result = cloneDeep(this.project);
      // ensure at least first level
      return { ...newSurveyForm(), ...result };
    }
    return undefined;
  }

  public set currentProject(newProject: GreenHouseGaz | undefined) {
    // let newProject = cloneDeep(this.project);
    // update array of survey and then submit!
    if (newProject) {
      newProject.updated_at = new Date().toISOString();
      newProject.updated_by = this.$user().name ?? "user with no name";
    }
    this.submitForm(newProject);
  }

  public submitForm(value: GreenHouseGaz = this.project): void {
    if (!this.isReadOnly) {
      if (value.siteName !== "") {
        this.updateDoc(value);
      } else {
        throw new Error("please fill the new Name");
      }
    } else {
      this.$store.dispatch("notifyUser", {
        message: "You're on read only mode",
        type: "info",
      });
      this.updateLocalStore(value);
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
