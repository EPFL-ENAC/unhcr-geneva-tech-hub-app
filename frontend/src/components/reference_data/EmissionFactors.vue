<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-data-table :headers="headers" :items="items" dense>
        <template #[`item.value`]="props">
          <span :title="props.item._id">{{
            props.item.value | formatNumberGhg
          }}</span>
        </template>
        <template #[`item.source`]="props">
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
          <span v-if="props.item.source">
            <a :href="props.item.source" target="_blank">{{
              props.item.source
            }}</a>
          </span>
        </template>
      </v-data-table>
    </v-card-text>
    <GHGMixedBiowaste />
    <GHGMixedNonBiowaste />
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
