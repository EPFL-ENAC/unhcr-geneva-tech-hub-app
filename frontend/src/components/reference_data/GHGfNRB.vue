<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-row>
        <v-col> fNRB per country </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="headers" :items="items" dense>
            <template #[`item.value`]="props">
              <span :title="props.item.value"
                >{{
                  props.item.value |
                    formatNumberGhg({
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
