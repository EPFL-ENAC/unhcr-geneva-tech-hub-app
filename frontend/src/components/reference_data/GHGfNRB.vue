<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col>
          fNRB (Fraction of non-renewable biomass) per country. Source:
          <a target="_blank" href="https://doi.org/10.1088/1748-9326/acb501"
            >fNRB (Fraction of non-renewable biomass)</a
          >
          <br />
          For the countries that are not listed in the database, the default
          value for fNRB is 30%.
          <br />The source for this value is this methodology tool:
          <a
            target="_blank"
            href="https://cdm.unfccc.int/methodologies/PAmethodologies/tools/am-tool-30-v1.pdf"
            >https://cdm.unfccc.int/methodologies/PAmethodologies/tools/am-tool-30-v1.pdf
          </a>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            dense
          >
            <template #[`item.value`]="props">
              <span :title="props.item.value"
                >{{
                  props.item.value |
                    formatNumberGhgRef({
                      style: "percent",
                    })
                }}
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
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GHGReferencefNRB", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
})
export default class Energy extends Vue {
  items!: ReferenceItemInterface[];
  countriesMap = countriesMap;

  search = "";
  public get headers(): HeaderInterface[] {
    return [
      { text: "Country", value: "_id" },
      {
        text: "fNRB",
        align: "start",
        sortable: false,
        value: "value",
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
