<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>Regional EF MIXED NON-BIOWASTE</v-col>
        <v-col>
          Emission factors per management practice (Gg CO2e/Gg waste)
          <info-tooltip
            v-bind="{
              'open-on-click': true,
              'open-on-focus': false,
              'open-on-hover': false,
              'close-delay': 1000,
            }"
          >
            <span class="info-tooltip">
              <a
                href="https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/5_Volume5/19R_V5_3_Ch03_SWDS.pdf"
                target="_blank"
              >
                https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/5_Volume5/19R_V5_3_Ch03_SWDS.pdf
              </a>
              <a
                href="https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/5_Volume5/19R_V5_5_Ch05_IOB.pdf"
                target="_blank"
              >
                https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/5_Volume5/19R_V5_5_Ch05_IOB.pdf
              </a>
            </span>
          </info-tooltip>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="headers" :items="items" dense>
            <template #[`item.region`]="props">
              <span>{{ props.item.region }} </span>
            </template>
            <template #[`item.MAN`]="props">
              <span :title="props.item.MAN">{{
                props.item.MAN | formatNumberGhgRef
              }}</span>
            </template>
            <template #[`item.BUR`]="props">
              <span :title="props.item.BUR">{{
                props.item.BUR | formatNumberGhgRef
              }}</span>
            </template>
            <template #[`item.PIT`]="props">
              <span :title="props.item.PIT">{{
                props.item.PIT | formatNumberGhgRef
              }}</span>
            </template>
            <template #[`item._id`]="props">
              <span :title="props.item._id"
                >{{ countriesMap?.[props.item._id]?.name ?? "default" }}
                <country-flag
                  v-if="props.item._id !== 'default'"
                  :country="props.item._id"
                  size="small"
                />
              </span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import RefNameKey from "@/assets/references/ghg_ref_name_key.json";
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { GHGReferenceNonBioWaste } from "@/store/GHGReferenceNonBioWasteModule";

import { countriesMap } from "@/utils/countriesAsList";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GHGReferenceNonBioWasteModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  components: {
    InfoTooltip,
  },
})
export default class MixedBiowaste extends Vue {
  items!: GHGReferenceNonBioWaste[];
  countriesMap = countriesMap;

  public get headers(): HeaderInterface[] {
    const subcatKey = RefNameKey as Record<string, string>;
    return [
      { text: "Country region", value: "region" },
      {
        text: subcatKey["PIT"],
        align: "start",
        tooltip:
          "https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/5_Volume5/19R_V5_3_Ch03_SWDS.pdf",
        sortable: false,
        value: "PIT",
      },
      {
        text: subcatKey["MAN"],
        align: "start",
        sortable: false,
        tooltip:
          "https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/5_Volume5/19R_V5_3_Ch03_SWDS.pdf",
        value: "MAN",
      },
      {
        tooltip:
          "https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/5_Volume5/19R_V5_5_Ch05_IOB.pdf",
        text: subcatKey["BUR"],
        align: "start",
        sortable: false,
        value: "BUR",
      },
    ];
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
  tooltip?: string;
}
</script>
