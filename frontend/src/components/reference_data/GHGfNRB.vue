<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col> fNRB per country <a target="_blank" src="https://cdm.unfccc.int/DNA/fNRB/index.html">cdm.unfccc.int </a> </v-col>
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
