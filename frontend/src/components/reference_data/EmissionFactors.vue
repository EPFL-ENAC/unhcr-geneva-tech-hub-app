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
      <v-data-table :headers="headers" :items="filteredItems" dense>
        <template #[`item.value`]="props">
          <span :title="props.item._id">{{
            props.item.value | formatNumberGhgRef
          }}</span>
        </template>
        <template #[`item.source`]="props">
          <span v-if="props.item.source">
            <a :href="props.item.source" target="_blank">{{
              props.item.source
            }}</a>
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
import { Component, Vue } from "vue-property-decorator";
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
    {
      text: "Domestic solid waste",
      to: this.DomesticSolidWaste,
      icon: "$mdiTrashCanOutline",
    },
  ];
  selectedTab = this.menuItems[0].to;

  public get tabSelected(): string | number {
    const tabIndex = this.menuItems.findIndex((value: MenuItem) => {
      const [category] = value.to;
      return category === this.selectedTab;
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
