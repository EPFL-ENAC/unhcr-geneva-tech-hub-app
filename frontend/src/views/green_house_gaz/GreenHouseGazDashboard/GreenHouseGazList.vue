<template>
  <v-expansion-panels v-model="panel" accordion>
    <v-expansion-panel
      v-for="(country, keyIndex) in countries"
      :key="`${country.key[0]}${keyIndex}`"
    >
      <v-expansion-panel-header>
        <div v-if="countriesMap[country.key[0]]" class="panel-header">
          <span>
            {{ countriesMap[country.key[0]].name }}
          </span>
          <span>
            <country-flag :country="country.key[0]" size="small" />
          </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
          v-if="country.value"
          :headers="tableHeaders"
          :items="country.value"
          :single-expand="singleExpand"
          :expanded.sync="expanded[`${country.key[0]}${keyIndex}`]"
          item-key="siteId"
          show-expand
          hide-default-footer
          :items-per-page="-1"
          hide-default-header
          :item-class="rowClasses"
          @click:row="(item, event) => clickSite(item, keyIndex, event)"
        >
          <template #[`item.siteName`]="slotProps">
            {{ slotProps.value }}
            <span :title="slotProps.item.siteId"
              >({{ (slotProps.item.siteId + "").substr(0, 8) }})</span
            >
          </template>
          <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <survey-list :site="item.siteId" :country-code="country.key[0]" />
            </td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import SurveyList from "@/components/green_house_gaz/SurveysList.vue";
import { Country, GreenHouseGaz } from "@/store/GhgInterface";
import { countries as Countries, countriesMap } from "@/utils/countriesAsList";
import { Component, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["countries"]),
  },
  components: {
    SurveyList,
  },
})
/** ProjectList */
export default class ProjectList extends Vue {
  countries!: [];
  setup = 0;
  singleExpand = true;
  expanded: ExpandedObject = {};

  readonly tableHeaders: DataTableHeader[] = [
    { text: "Site", value: "siteName" },
    { text: "", value: "data-table-expand", align: "end", sortable: false },
  ];

  countriesMap = countriesMap;

  countriesList = Countries;

  public rowClasses(): string {
    return "site-row-pointer";
  }

  private setCountry(country: Country): void {
    let hash = "";
    if (this.$route.hash !== `#${country.key[0]}`) {
      hash = country.key[0];
    }
    this.$router.push({ hash });
  }

  private unsetCountry(): void {
    const hash = "";
    this.$router.push({ hash });
  }

  public get panel(): number {
    const hash = this.$route.hash;
    const cleanedHash = hash.substring(1);
    const index = Object.values(this.countries)
      .map((x: Country) => x.key[0])
      .findIndex((x) => x === cleanedHash);
    return index;
  }

  public set panel(value: number) {
    if (value !== undefined) {
      const country = this.countries[value];
      this.setCountry(country);
    } else {
      this.unsetCountry();
    }
  }

  public clickSite(
    item: GreenHouseGaz,
    keyIndex: number,
    event: EventClickRow
  ): void {
    if (this.expanded) {
      const accessKey = `${item.countryCode}${keyIndex}`;
      let currentExpandedArray = this.expanded[accessKey] ?? [];
      if (event.isExpanded) {
        const index = currentExpandedArray.findIndex((i) => i === item);
        currentExpandedArray.splice(index, 1);
      } else {
        currentExpandedArray = [item]; // instead of push. to avoid multi expanded
      }

      this.$set(this.expanded, accessKey, currentExpandedArray);
    }
  }
}

type ExpandedObject = Record<string, GreenHouseGaz[]>;
interface EventClickRow extends Event {
  isExpanded: boolean;
}
</script>

<style scoped lang="scss">
.v-data-table
  ::v-deep
  .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content {
  box-shadow: none;
}
::v-deep .site-row-pointer {
  cursor: pointer;
  outline: none;
}
</style>
