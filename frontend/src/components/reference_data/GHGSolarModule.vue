<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>
          Longterm daily average of solar hours per country (Source: Solar
          Global Atlas) (Note: This value is used when the site global
          horizontal irradiation is not known.)
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
            :items-per-page="-1"
          >
            <template #[`item.c`]="props">
              <span :title="props.item.c"
                >{{
                  props.item.c |
                    formatNumber({
                      maximumFractionDigits: 3,
                    })
                }}
                hrs/day
              </span>
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
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";
import { countriesMap } from "@/utils/countriesAsList";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceSolarModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  methods: {
    ...mapActions("GhgReferenceSolarModule", [
      "syncDB",
      "getAllDocs",
      "updateDoc",
      "closeDB",
    ]),
  },
})
export default class Energy extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<ReferenceItemInterface>;
  items!: ReferenceItemInterface[];
  countriesMap = countriesMap;
  mounted(): void {
    this.syncDB();
    this.getAllDocs();
  }

  destroyed(): void {
    this.closeDB();
  }

  public get headers(): HeaderInterface[] {
    return [
      { text: "_id", value: "_id" },
      {
        text: "Solar average",
        align: "start",
        sortable: false,
        value: "c",
      },
    ];
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}
</script>

<style></style>
