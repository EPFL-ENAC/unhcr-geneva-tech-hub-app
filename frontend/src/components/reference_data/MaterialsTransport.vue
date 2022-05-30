<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col>
          <p>
            A simplified calculation of transport-related embodied carbon is
            provided to require only input of material source country. Two
            categories of materials are addressed in transport distance
            calculations: local materials and non-local materials. Local
            materials are those that, due to material weight and composition,
            are usually source locally:
          </p>
          <ul>
            <li>brick (fired and unfired)</li>
            <li>earth/soil (for roofs and plaster)</li>
            <li>grass/straw</li>
            <li>sand</li>
            <li>stone block and stone aggregate.</li>
          </ul>

          <p>
            These materials are assuemd to be produced and used domestically.
            Transport distance is calculated as a function of the country land
            area:
          </p>

          <ul>
            <li>Distance = 51.37 x log(Land area) - 448.36___<b>(1)</b></li>
          </ul>

          <br />
          For non-local materials, the country of production and use may be the
          same or different. Where the country of production and of use are the
          same, transport distance is calculated as a function of country land
          area:
          <ul>
            <li>Distance = 61.05 x log(Land area) - 500.04 ___<b>(2)</b></li>
          </ul>

          <p>
            For non-local materials where the country of production and the
            country of use are different, transport distances are calculated in
            five stages:
          </p>

          <ol>
            <li>
              distance from production site to production national capital,
              calculated as a function of source country land area using
              equation <b>(2)</b>;
            </li>
            <li>
              distance from production national capital to production national
              port, taken from the CERDI Sea Distances database (<a
                target="_blank"
                href="https://ferdi.fr/en/indicators/the-cerdi-seadistance-database"
                >the-cerdi-seadistance-database</a
              >);
            </li>
            <li>
              from production national port to use national port, taken from the
              CERDI Sea Distances database (<a
                target="_blank"
                href="https://ferdi.fr/en/indicators/the-cerdi-seadistance-database"
              >
                the-cerdi-seadistance-database </a
              >);
            </li>
            <li>
              from use national port to use national capital, taken from the
              CERDI Sea Distances database (<a
                target="_blank"
                href="https://ferdi.fr/en/indicators/the-cerdi-seadistance-database"
              >
                the-cerdi-seadistance-database </a
              >);
            </li>
            <li>
              from use national capital to use site, calculated as a function of
              source country land area using equation <b>(2)</b>.
            </li>
          </ol>

          <p>
            For land-locked countries, the CERDI Sea Distances database provides
            the road transport distance to the nearest international port. Where
            the road distance between two national capitals is shorter than the
            port-port sea distance, road distance is used in-lieu of sea
            distance. Embodied carbon factors are calculated from transport
            distances from IPCC data (Simms et al., 2014), as the median value
            of mode-of-transport-specific ranges. Two modes of transport are
            assumed:
          </p>

          <ol>
            <li>
              For road transport, Heavy Duty Vehicle (HDV) -Medium: low value =
              0.17 kgCO2/tonne-km, high value = 0.25 kgCO2/tonne-km, mid value =
              0.21 kgCO2/tonne-km;
            </li>
            <li>
              For sea transport, Container Ship - Ocean: low value = 0.01
              kgCO2/tonne-km, high value = 0.025 kgCO2/tonne-km, mid value =
              0.0175 kgCO2/tonne-km
            </li>
          </ol>
        </v-col>
      </v-row>
      <v-data-table :headers="headers" :items="items">
        <template v-slot:[`item.source`]="slotProps">
          {{ getText(slotProps.item._id.split("_")[0]) }}
          <country-flag
            :country="slotProps.item._id.split('_')[0]"
            size="small"
          />
        </template>
        <template v-slot:[`item.destination`]="{ item }">
          {{ getText(item._id.split("_")[1]) }}
          <country-flag :country="item._id.split('_')[1]" size="small" />
        </template>

        <template v-slot:[`item.t`]="props">
          <span>{{ props.item.t | formatNumber }}</span>
        </template>
        <template v-slot:[`item.o`]="props">
          <span>{{ props.item.o | formatNumber }}</span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { countriesMap } from "@/utils/countriesAsList";
import { iso3166_3_to_2 } from "@/utils/iso3166";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("SheltersTransportModule", ["items", "item", "itemsLength"]),
  },
  methods: {
    ...mapActions("SheltersTransportModule", ["getAllDocs"]),
  },
})
export default class MaterialsTransport extends Vue {
  getAllDocs!: () => Promise<null>;
  iso3166_3_to_2 = iso3166_3_to_2;
  countriesMap = countriesMap;
  mounted(): void {
    this.getAllDocs();
  }

  public getSourceCountry(key: string): Record<string, string> {
    const [source, destination] = key.split("_");
    return { source, destination };
  }
  public getText(isoCode3: keyof typeof iso3166_3_to_2): string {
    if (iso3166_3_to_2[isoCode3] && countriesMap[iso3166_3_to_2[isoCode3]]) {
      const local = countriesMap[iso3166_3_to_2[isoCode3]];
      return `${local.name}`;
    }
    return isoCode3;
  }

  public get headers(): HeaderInterface[] {
    // _id: string; // 'AAA_BBB' source country (AAA) / destination country (BBB)
    // in iso3166 3 letters
    // t: number; // Transport   embodied carbon  kgCO2/kg (i.e. local materials)
    // o: number; // Transport   embodied carbon  kgCO2/kg (all others materials)
    return [
      { text: "Source country", value: "source", sortable: false },
      { text: "Destination country", value: "destination", sortable: false },
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
