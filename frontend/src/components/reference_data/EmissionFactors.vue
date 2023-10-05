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
          <v-tooltip v-if="props.item.ref" right>
            <template #activator="{ on, attrs }">
              <a :href="props.item.source" target="_blank">{{
                props.item.source
              }}</a>
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>$mdiInformation</v-icon>
              </v-btn>
            </template>
            <span>{{ props.item.ref }}</span>
          </v-tooltip>
          <span v-else>
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
