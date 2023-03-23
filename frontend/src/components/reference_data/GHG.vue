<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-data-table :headers="headers" :items="items" dense>
        <template #[`item.value`]="props">
          <span :title="props.item._id">{{
            props.item.value |
              formatNumber({
                maximumFractionDigits: 3,
              })
          }}</span>
        </template>
        <template #[`item.source`]="props">
          <a :href="props.item.source" target="_blank">{{
            props.item.source
          }}</a>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
})
export default class Energy extends Vue {
  items!: ReferenceItemInterface[];

  public get headers(): HeaderInterface[] {
    return [
      {
        text: "description",
        align: "start",
        sortable: false,
        value: "description",
        width: "400px",
      },
      { text: "value", value: "value", width: "50px" },
      { text: "source", value: "source" },
    ];
  }
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
  width?: string;
}
</script>

<style></style>
