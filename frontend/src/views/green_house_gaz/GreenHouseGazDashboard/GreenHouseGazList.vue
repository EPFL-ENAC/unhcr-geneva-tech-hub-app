<template>
  <v-expansion-panels v-model="panel" accordion>
    <v-expansion-panel
      v-for="(country, keyIndex) in countries"
      :key="`${country.key}${keyIndex}`"
    >
      <v-expansion-panel-header>
        <div v-if="countriesMap[country.key]" class="panel-header">
          <span>
            {{ countriesMap[country.key].name }}
          </span>
          <span>
            {{ countriesMap[country.key].emoji }}
          </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
          v-if="country.value"
          :headers="tableHeaders"
          :items="country.value"
          :single-expand="singleExpand"
          :expanded.sync="expanded[`${country.key}${keyIndex}`]"
          item-key="name"
          show-expand
          hide-default-footer
          :items-per-page="-1"
          hide-default-header
          :item-class="rowClasses"
          @click:row="(item, event) => clickSite(item, keyIndex, event)"
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <survey-list :site="item.id" :country-code="country.key" />
            </td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import SurveyList from "@/components/green_house_gaz/SurveysList.vue";
import { Country, Site } from "@/store/GhgInterface";
import { countries as Countries, countriesMap } from "@/utils/countriesAsList";
import flagEmoji from "@/utils/flagEmoji";
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
    { text: "Site", value: "name" },
    { text: "", value: "data-table-expand", align: "end", sortable: false },
  ];

  countriesMap = countriesMap;

  countriesList = Countries;

  public rowClasses(): string {
    return "site-row-pointer";
  }

  public getFlagEmoji = flagEmoji;
  private setCountry(country: Country): void {
    let hash = "";
    if (this.$route.hash !== `#${country.key}`) {
      hash = country.key;
    }
    this.$router.push({ hash });
  }

  private unsetCountry(): void {
    let hash = "";
    this.$router.push({ hash });
  }

  public get panel(): number {
    const hash = this.$route.hash;
    const cleanedHash = hash.substring(1);
    const index = Object.values(this.countries)
      .map((x: Country) => x.key)
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

  public clickSite(item: Site, keyIndex: number, event: EventClickRow): void {
    if (this.expanded) {
      const accessKey = `${item.country_code}${keyIndex}`;
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

type ExpandedObject = Record<string, Site[]>;
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
