<template>
  <v-card flat>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="itemsLength"
      >
        <template v-slot:top="{ pagination, options, updateOptions }">
          <v-data-footer
            :pagination="pagination"
            :options="options"
            @update:options="updateOptions"
            :items-per-page-options="[5, 10, 20, 100]"
            items-per-page-text="$vuetify.dataTable.itemsPerPageText"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { GreenHouseGazReference } from "@/store/GhgInterface";
import { Paginate } from "@/store/SheltersTransportModule";
import { cloneDeep } from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

interface Options {
  page: number;
  itemsPerPage?: number;
}

@Component({
  computed: {
    ...mapGetters("SheltersTransportModule", [
      "items",
      "item",
      "paginate",
      "itemsLength",
    ]),
  },
  methods: {
    ...mapActions("SheltersTransportModule", [
      "syncDB",
      "getAllDocs",
      "closeDB",
      "changePaginate",
    ]),
  },
})
export default class MaterialsTransport extends Vue {
  syncDB!: () => null;
  closeDB!: () => Promise<null>;
  getAllDocs!: () => Promise<null>;
  changePaginate!: (paginate: Paginate) => Promise<null>;

  paginate!: Paginate;

  reference!: GreenHouseGazReference;
  localPagination = {} as Paginate;

  get options(): Options {
    const { limit, skip } = this.localPagination;

    return {
      page: ((skip ?? 0) + limit) / limit,
      itemsPerPage: limit,
    };
  }

  set options(newValue: Options) {
    const { page, itemsPerPage } = newValue;
    this.localPagination = {
      limit: newValue.itemsPerPage ?? 0,
      skip: (itemsPerPage ?? 0) * page - (itemsPerPage ?? 0),
    };
  }

  @Watch("localPagination", { deep: true })
  public onPaginateChange(newValue: Paginate): void {
    this.changePaginate(newValue);
  }

  public setLocalPaginate(): void {
    if (!this.paginate) {
      return;
    }
    this.localPagination = cloneDeep(this.paginate);
  }

  public syncLocalPaginate(): void {
    // init function
    this.setLocalPaginate();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["SheltersTransportModule/SET_PAGINATE"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalPaginate();
      }
    });
  }

  public created(): void {
    this.syncLocalPaginate();
  }

  mounted(): void {
    this.syncDB();
    this.getAllDocs();
  }

  destroyed(): void {
    this.closeDB().then(() => {
      console.log("DESTROYED view reference list, closing DB");
    });
  }

  public get headers(): HeaderInterface[] {
    //     _id: string; // 'AAA_BBB' source country (AAA) / destination country (BBB) in iso3166 3 letters
    // t: number; // Transport   embodied carbon  kgCO2/kg (i.e. local materials)
    // o: number; // Transport   embodied carbon  kgCO2/kg (all others materials)
    return [
      { text: "Source country", value: "_id", sortable: false },
      { text: "Destination country", value: "_id", sortable: false },
      {
        text: "Transport embodied carbon  kgCO2/kg (i.e. local materials)",
        value: "t",
      },
      {
        text: "Transport   embodied carbon  kgCO2/kg (all others materials)",
        value: "o",
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
