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
  </v-card>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgDefaultValuesModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  components: {
    InfoTooltip,
  },
})
export default class DefaultValues extends Vue {
  items!: ReferenceItemInterface[];

  public get filteredItems(): ReferenceItemInterface[] {
    return this.items.filter((item: ReferenceItemInterface) => {
      return (
        item?.subcat?.includes(this.selectedTab.toLocaleLowerCase()) ?? false
      );
    });
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
    { icon: "$mdiStove", text: "Cooking", to: "Cooking" },
    {
      icon: "$mdiLightbulb",
      text: "Lighting",
      to: "Lighting",
    },
    { text: "Water Supply", to: "Water-Supply", icon: "$mdiWaterPump" },
    // {
    //   text: "Domestic solid waste",
    //   to: this.DomesticSolidWaste,
    //   icon: "$mdiTrashCanOutline",
    // },
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
}
</script>

<style></style>
