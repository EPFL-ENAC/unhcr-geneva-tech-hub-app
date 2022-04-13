<template>
  <div v-if="project && currentSurvey" class="fluid surveys-item">
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
      v-model="tabSelected"
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
        <component :is="$router.currentRoute.query.subcategory" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Cooking from "@/components/green_house_gaz/energy/Cooking.vue";
import Facilities from "@/components/green_house_gaz/energy/Facilities.vue";
import Lighting from "@/components/green_house_gaz/energy/Lighting.vue";
import Pumping from "@/components/green_house_gaz/energy/Pumping.vue";
import CRI from "@/components/green_house_gaz/materials/CRI.vue";
import HHWaste from "@/components/green_house_gaz/materials/HHWaste.vue";
import Shelter from "@/components/green_house_gaz/materials/Shelter.vue";
import TreePlanting from "@/components/green_house_gaz/offset/TreePlanting.vue";
import Results from "@/components/green_house_gaz/Results.vue";
// import Transport from "@/components/green_house_gaz/wash/Transport.vue";
// import Wastewater from "@/components/green_house_gaz/wash/Wastewater.vue";
// import Water from "@/components/green_house_gaz/wash/Water.vue";
import WASH from "@/components/green_house_gaz/wash/WASH.vue";
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import getFlagEmoji from "@/utils/flagEmoji";
import getCountryName from "@/utils/getCountryName";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  components: {
    Cooking,
    Facilities,
    Lighting,
    Pumping,
    CRI,
    HHWaste,
    Shelter,
    // Transport, // to remove old WASH
    // Water,// to remove old WASH
    // Wastewater,// to remove old WASH
    WASH,
    TreePlanting,
    Results,
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
      to: "Energy-Facilities",
    },
    {
      icon: "mdi-water",
      text: "WASH",
      to: "WASH-WASH",
      children: [{ text: "Trucking", to: "WASH", icon: "mdi-tanker-truck" }],
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
  public get tabSelected(): string {
    // return this._tabSelected;
    // return this.$route.query.toString();
    const category = this.$router.currentRoute.query.category as string;
    const subcategory = this.$router.currentRoute.query.subcategory as string;
    const tab = `${category}-${subcategory}`;
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

  public get currentSurvey(): Survey | undefined {
    if (this.project?.surveys) {
      return this.project.surveys.find(
        (el: Survey) => el.name === this.$route.params.surveyId
      );
    }
    return undefined;
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
