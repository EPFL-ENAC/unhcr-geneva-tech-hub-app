<template>
  <v-card flat>
    <v-card-text v-if="items">
      <v-data-table
        :headers="headers"
        :items="items"
        hide-default-footer
        :items-per-page="-1"
      >
        <template #[`item.value`]="props">
          <span>{{ props.item.value | formatNumber }}</span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { ReferenceItemInterface } from "@/store/GhgReferenceModule";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["items"]),
    ...mapGetters(["referenceDataDrawer"]),
  },
  methods: {
    ...mapActions("GhgReferenceModule", [
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

  mounted(): void {
    this.syncDB();
    this.getAllDocs();
  }

  destroyed(): void {
    this.closeDB();
  }

  public get headers(): HeaderInterface[] {
    return [
      {
        text: "description",
        align: "start",
        sortable: false,
        value: "description",
      },
      { text: "value", value: "value" },
      { text: "source", value: "source" },
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
