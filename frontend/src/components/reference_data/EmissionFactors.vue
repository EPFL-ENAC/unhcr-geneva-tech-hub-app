<!-- eslint-disable vue/no-v-html -->
<template>
  <v-card flat>
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
      <template v-for="item in menuItems">
        <v-tab :key="item.to" @click.stop.prevent="">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-tab>
      </template>
    </v-tabs>
    <v-card-text v-if="filteredItems">
      <v-card-title v-if="selectedTitle">
        <h2 class="text-h6 font-weight-medium" v-html="selectedTitle"></h2>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        dense
        disable-pagination
        hide-default-footer
      >
        <template #[`item.value`]="props">
          <span :title="props.item._id">{{
            props.item.value | formatNumberGhgRef
          }}</span>
        </template>
        <template #[`item.source`]="props">
          <span v-if="props.item.source">
            <template
              v-if="
                typeof props.item.source === 'object' &&
                props.item.source.length
              "
            >
              <ul>
                <ol v-for="(source, $key) in props.item.source" :key="$key">
                  <a :href="source" target="_blank">{{ source }}</a>
                </ol>
              </ul>
            </template>
            <template v-else>
              <a :href="props.item.source" target="_blank">{{
                props.item.source
              }}</a>
            </template>
          </span>
          <info-tooltip
            v-if="props.item.ref"
            v-bind="{
              'open-on-click': true,
              'open-on-focus': true,
              'open-on-hover': true,
              'close-delay': 0,
            }"
          >
            <span>
              {{ props.item.ref }}
            </span>
          </info-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <div v-if="DomesticSolidWaste === selectedTab">
      <GHGMixedBiowaste />
      <GHGMixedNonBiowaste />
    </div>
  </v-card>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import GHGMixedBiowaste from "@/components/reference_data/GHGMixedBiowaste.vue";
import GHGMixedNonBiowaste from "@/components/reference_data/GHGMixedNonBiowaste.vue";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  components: {
    InfoTooltip,
    GHGMixedBiowaste,
    GHGMixedNonBiowaste,
  },
})
export default class EmissionFactors extends Vue {
  items!: ReferenceItemInterface[];

  public get filteredItems(): ReferenceItemInterface[] {
    return this.items.filter((item: ReferenceItemInterface) => {
      return (
        item?.subcat?.includes(this.selectedTab.toLocaleLowerCase()) ?? false
      );
    });
  }

  public get selectedTitle(): string | undefined {
    return this.menuItems.find((item) => item.to === this.selectedTab)?.title;
  }

  public get headers(): HeaderInterface[] {
    return [
      {
        text: "description",
        align: "start",
        sortable: true,
        value: "description",
        width: "500px",
      },
      { text: "value", value: "value", width: "100px" },
      { text: "source", value: "source" },
    ];
  }

  readonly DomesticSolidWaste = "waste";
  readonly menuItems: MenuItem[] = [
    {
      icon: "$mdiHospitalBuilding",
      text: "Facilities",
      to: "Facilities",
    },
    {
      icon: "$mdiStove",
      text: "Cooking",
      to: "Cooking",
      title: `The default values of consumption assume the energy demand for cooking is met by the primary cooking solution. The default value for firewood consumption was used to calculate other fuels' consumption together with the net calorific value (NCV) and the cookstove efficiency (except for biogas and piped natural gas). Except where otherwise indicated, the values for NCV and assumed cookstove efficiency were taken from the following links respectively:
<a href="https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/2_Volume2/V2_1_Ch1_Introduction.pdf" target="_blank">here</a> and <a href="https://cfpub.epa.gov/si/si_public_record_report.cfm?Lab=NRMRL&dirEntryId=339679 target="_blank" >here</a>. Details on the calculations and assumptions are available in the User's Manual.
`,
    },
    {
      icon: "$mdiLightbulb",
      text: "Lighting",
      to: "Lighting",
      title: `Default values for fuel consumption were calculated assuming 3.9 hours/day as the lighting demand (Source: <a href="https://doi.org/10.1016/j.deveng.2020.100056" target="_blank">doi: 10.1016/j.deveng.2020.100056</a>).`,
    },
    { text: "Water Supply", to: "Water-Supply", icon: "$mdiWaterPump" },
    {
      text: "Domestic solid waste",
      to: this.DomesticSolidWaste,
      icon: "$mdiTrashCanOutline",
    },
  ];

  @Watch("$route", { immediate: true, deep: true })
  onRouteChanged(newRoute: Route): void {
    if (newRoute.hash.includes("reference-data")) {
      const tabName = newRoute.hash.split("_")[2];
      const tabIndex = this.menuItems.findIndex((item) => item.to === tabName);
      if (tabIndex !== -1) {
        this.selectedTab = tabName;
      }
    }
  }
  selectedTab = this.menuItems[0].to;

  public get tabSelected(): string | number {
    const tabIndex = this.menuItems.findIndex((value: MenuItem) => {
      return value.to === this.selectedTab;
    });
    return tabIndex;
  }
  public set tabSelected(value: string | number) {
    this.selectedTab = this.menuItems[value as number].to;
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
  width?: string;
}

interface MenuItem {
  text: string;
  icon: string;
  to: string;
  redirect?: string;
  children?: MenuItem[];
  title?: string;
}
</script>

<style></style>
