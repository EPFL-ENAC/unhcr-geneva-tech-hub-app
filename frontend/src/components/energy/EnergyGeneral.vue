<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    @save="save"
  >
    <template v-slot>
      <v-row>
        <v-col cols="6">
          <h2>General</h2>
          <energy-form-row
            v-model="module"
            :items="generalItems"
          ></energy-form-row>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <energy-map :markers="[latLng]" :zoom="4"></energy-map>
        </v-col>
      </v-row>
      <v-row>
        <v-divider></v-divider>
      </v-row>
      <v-row>
        <v-col cols="6">
          <h2>Electricity</h2>
          <energy-form-row
            v-model="module"
            :items="electricityItems"
          ></energy-form-row>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <h2>Shelters Types</h2>
          <energy-form-row
            v-model="module"
            :items="shelterItems"
          ></energy-form-row>
        </v-col>
      </v-row>
      <v-row>
        <v-divider></v-divider>
      </v-row>
      <v-row>
        <v-col cols="6">
          <h2>Environment</h2>
          <energy-form-row
            v-model="module"
            :items="environmentItems"
          ></energy-form-row>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-row>
            <v-col>
              <h2>Population</h2>
              <energy-form-row
                v-model="module"
                :items="populationItems"
              ></energy-form-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h3>Quality of Life Levels</h3>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th v-for="item in socioEconomicCategories" :key="item">
                        {{ $t(`energy.${item}`) }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in categoryFormItems" :key="item.key">
                      <td
                        v-for="category in socioEconomicCategories"
                        :key="category"
                      >
                        <form-item-component
                          v-model="module.categories[category][item.key]"
                          v-bind="item"
                        ></form-item-component>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </energy-form>
</template>

<script lang="ts">
import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import EnergyFormRow from "@/components/energy/EnergyFormRow.vue";
import EnergyMap from "@/components/energy/EnergyMap.vue";
import {
  AreaPerPerson,
  FarApartHouses,
  GeneralCategory,
  GeneralModule,
  Integration,
  socioEconomicCategories,
  SocioEconomicCategory,
  Topography,
  VacantSpaceInside,
  vacantSpaceOutside,
  WoodLandscape,
} from "@/models/energyModel";
import { getCurrentYear } from "@/utils/energy";
import { checkSum } from "@/utils/rules";
import { LatLngExpression } from "leaflet";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyForm,
    EnergyFormRow,
    EnergyMap,
    FormItemComponent,
  },
})
export default class EnergyGeneral extends EnergyFormMixin<GeneralModule> {
  readonly socioEconomicCategories = socioEconomicCategories;

  module: GeneralModule = this.emptyModule;

  get categoryProportions(): number[] {
    return Object.values(this.module.categories).map((item) => item.proportion);
  }

  get shelterProportions(): number[] {
    return [this.module.shelterTemporary, this.module.shelterPermanent];
  }

  get shelterTemporaryProportions(): number[] {
    return [
      this.module.shelterTemporaryTent,
      this.module.shelterTemporarySheeting,
      this.module.shelterTemporaryKit,
    ];
  }

  get shelterPermanentProportions(): number[] {
    return [
      this.module.shelterPermanentContainer,
      this.module.shelterPermanentPrefabricated,
      this.module.shelterPermanentRhu,
    ];
  }

  get categoryFormItems(): FormItem<keyof GeneralCategory>[] {
    return [
      {
        type: "number",
        key: "proportion",
        label: "Proportion",
        subtype: "percent",
        rules: [checkSum(this.categoryProportions, 1, 2, "100%")],
      },
      {
        type: "number",
        key: "cookingHours",
        label: "Cooking TIme",
        unit: "h",
      },
      {
        type: "number",
        key: "annualIncome",
        label: "Annual Income by Household",
        unit: "$",
      },
    ];
  }

  get emptyModule(): GeneralModule {
    const currentYear = getCurrentYear();
    return {
      name: "",
      yearStart: currentYear,
      yearEnd: currentYear + 10,
      locationLatitude: 0,
      locationLongitude: 0,
      temporary: false,
      expirationYear: currentYear,
      publicGridConnection: false,
      shelterTemporary: 0.5,
      shelterTemporaryTent: 0.3,
      shelterTemporarySheeting: 0.3,
      shelterTemporaryKit: 0.4,
      shelterPermanent: 0.5,
      shelterPermanentContainer: 0.3,
      shelterPermanentPrefabricated: 0.3,
      shelterPermanentRhu: 0.4,
      electricalSafetyCompliance: 0,
      annualLocalWindMinimum: 0,
      annualLocalWindAverage: 0,
      annualLocalWindMaximum: 0,
      totalPopulation: 0,
      familiesCount: 0,
      currency: "",
      exchangeRateUsd: 1,
      businessShare: 0,
      farApartHouses: "few",
      areaPerPerson: "-29",
      vacantSpaceInside: "no",
      woodLandscape: "rain",
      topography: "flat",
      vacantSpaceOutside: "no",
      woodCarbonation: 0,
      woodDensity: 0,
      categories: Object.fromEntries<GeneralCategory>(
        socioEconomicCategories.map((item) => [
          item,
          {
            proportion: 0.2,
            cookingHours: 0,
            annualIncome: 0,
          },
        ])
      ) as Record<SocioEconomicCategory, GeneralCategory>,
    };
  }

  get latLng(): LatLngExpression {
    return [this.module.locationLatitude, this.module.locationLongitude];
  }

  get generalItems(): FormItem<keyof GeneralModule>[][] {
    return [
      [
        {
          type: "country",
          key: "countryCode",
          label: "Country",
        },
        {
          type: "number",
          key: "locationLatitude",
          label: "Latitude of the site",
          unit: "Decimal Degrees",
          min: -90,
          max: 90,
        },
        {
          type: "number",
          key: "locationLongitude",
          label: "Longitude of the site",
          unit: "Decimal Degrees",
          min: -180,
          max: 180,
        },
      ],
      [
        {
          type: "number",
          key: "yearStart",
          label: "Starting Year",
        },
        {
          type: "number",
          key: "yearEnd",
          label: "Ending Year ",
        },
        {
          type: "text",
          key: "currency",
          label: "National currency",
        },
        {
          type: "number",
          key: "exchangeRateUsd",
          label: "Exchange rate with the US dollar",
          unit: `${this.module.currency} = 1 USD`,
        },
      ],
      [
        {
          type: "boolean",
          key: "temporary",
          label: "Is the site temporary?",
          options: {
            true: "Yes, temporary",
            false: "No, permanent",
          },
        },
        {
          type: "number",
          key: "expirationYear",
          label: "In what year will it be removed?",
          hidden: !this.module.temporary,
        },
        {
          type: "select",
          key: "integration",
          label: "In what extent is it integrated with the host community?",
          options: [
            {
              text: "Well integrated",
              value: "well",
            },
            {
              text: "Moderatly integrated",
              value: "moderately",
            },
            {
              text: "Badly integrated",
              value: "badly",
            },
          ],
          hidden: this.module.temporary,
        } as FormItem<keyof GeneralModule, Integration>,
        {
          type: "number",
          subtype: "percent",
          key: "businessShare",
          label: "What share of households operate a business in their house?",
        },
      ],
    ];
  }

  get electricityItems(): FormItem<keyof GeneralModule>[][] {
    return [
      [
        {
          type: "text",
          key: "electricityCompanyName",
          label: "Electricity company name",
          optional: true,
        },
        {
          type: "boolean",
          key: "publicGridConnection",
          label: "Connected to the public grid",
        },
        {
          type: "number",
          key: "publicGridDomesticRate",
          label: "Domestic customers rate",
          unit: `${this.module.currency}/kWh`,
          hidden: !this.module.publicGridConnection,
        },
        {
          type: "number",
          key: "publicGridDistance",
          label: "How far is the site from the public grid?",
          unit: "m",
          hidden: !this.module.publicGridConnection,
        },
        {
          type: "boolean",
          key: "networkExtension",
          label: "Does electricity company envisages to extend its network?",
          hidden: this.module.publicGridConnection,
          optional: true,
        },
      ],
      [
        {
          type: "number",
          subtype: "percent",
          key: "electricalSafetyCompliance",
          label:
            "What proportion of shelters are in compliance with the electrical safety codes?",
        },
      ],
    ];
  }

  get shelterItems(): FormItem<keyof GeneralModule>[][] {
    const checkShelter = checkSum(this.shelterProportions, 1, 2, "100%");
    const checkShelterTemporary = checkSum(
      this.shelterTemporaryProportions,
      1,
      2,
      "100%"
    );
    const checkShelterPermanent = checkSum(
      this.shelterPermanentProportions,
      1,
      2,
      "100%"
    );
    return [
      [
        {
          type: "number",
          subtype: "percent",
          key: "shelterTemporary",
          label: "Temporary and transitional shelters proportion",
          rules: [checkShelter],
        },
        {
          type: "number",
          subtype: "percent",
          key: "shelterTemporaryTent",
          label: "Tents proportion",
          hidden: this.module.shelterTemporary === 0,
          rules: [checkShelterTemporary],
        },
        {
          type: "number",
          subtype: "percent",
          key: "shelterTemporarySheeting",
          label: "Plastic sheeting proportion",
          hidden: this.module.shelterTemporary === 0,
          rules: [checkShelterTemporary],
        },
        {
          type: "number",
          subtype: "percent",
          key: "shelterTemporaryKit",
          label: "Self construction with shelter kits proportion",
          hidden: this.module.shelterTemporary === 0,
          rules: [checkShelterTemporary],
        },
      ],
      [
        {
          type: "number",
          subtype: "percent",
          key: "shelterPermanent",
          label: "Permanent shelters proportion",
          rules: [checkShelter],
        },
        {
          type: "number",
          subtype: "percent",
          key: "shelterPermanentContainer",
          label: "Containers proportion",
          hidden: this.module.shelterPermanent === 0,
          rules: [checkShelterPermanent],
        },
        {
          type: "number",
          subtype: "percent",
          key: "shelterPermanentPrefabricated",
          label: "Prefabricated proportion",
          hidden: this.module.shelterPermanent === 0,
          rules: [checkShelterPermanent],
        },
        {
          type: "number",
          subtype: "percent",
          key: "shelterPermanentRhu",
          label: "RHU refugee housing unit ( prefabricated IKEA) proportion",
          hidden: this.module.shelterPermanent === 0,
          rules: [checkShelterPermanent],
        },
      ],
    ];
  }

  get environmentItems(): FormItem<keyof GeneralModule>[][] {
    return [
      [
        {
          type: "number",
          key: "annualLocalWindMinimum",
          label: "Annual minimal local wind velocity",
          unit: "km/h",
        },
        {
          type: "number",
          key: "annualLocalWindAverage",
          label: "Annual average local wind velocity",
          unit: "km/h",
        },
        {
          type: "number",
          key: "annualLocalWindMaximum",
          label: "Annual maximum local wind velocity",
          unit: "km/h",
        },
      ],
      [
        {
          type: "select",
          key: "farApartHouses",
          label: "How far apart are living spaces?",
          options: [
            {
              text: "A few",
              value: "few",
            },
            {
              text: "3 to 6",
              value: "3-6",
            },
            {
              text: "6 to 12",
              value: "6-12",
            },
            {
              text: "12 to 20",
              value: "12-20",
            },
            {
              text: "20 +",
              value: "20+",
            },
          ],
          unit: "m",
        } as FormItem<keyof GeneralModule, FarApartHouses>,
        {
          type: "select",
          key: "areaPerPerson",
          label: "Average site area per person",
          options: [
            {
              text: "29 or less",
              value: "-29",
            },
            {
              text: "20 to 34",
              value: "30-34",
            },
            {
              text: "35 to 44",
              value: "35-44",
            },
            {
              text: "45 or more",
              value: "45+",
            },
          ],
        } as FormItem<keyof GeneralModule, AreaPerPerson>,
        {
          type: "select",
          key: "vacantSpaceInside",
          label: "Available vacant inside site spaces",
          options: [
            {
              text: "No Space",
              value: "no",
            },
            {
              text: "Space equal to housing 10 families",
              value: "10",
            },
            {
              text: "Space equal to housing 50 families",
              value: "50",
            },
            {
              text: "Space equal to housing 100 families",
              value: "100",
            },
            {
              text: "Space equal to housing 250 families",
              value: "250",
            },
            {
              text: "Space equal to housing 500 families",
              value: "500",
            },
            {
              text: "Space equal to housing 1000+ families",
              value: "1000+",
            },
          ],
        } as FormItem<keyof GeneralModule, VacantSpaceInside>,
        {
          type: "select",
          key: "vacantSpaceOutside",
          label: "Available vacant outside site spaces",
          options: [
            {
              text: "No Space",
              value: "no",
            },
            {
              text: "Little Space",
              value: "little",
            },
            {
              text: "Medium Space",
              value: "medium",
            },
            {
              text: "Lots of Space",
              value: "lots",
            },
          ],
        } as FormItem<keyof GeneralModule, vacantSpaceOutside>,
      ],
      [
        {
          type: "select",
          key: "woodLandscape",
          label: "Overall landscape of the area",
          options: [
            {
              text: "Evergreen forest / rain forest",
              value: "rain",
            },
            {
              text: "Forest-savanna (Mosaic)",
              value: "forest-savanna",
            },
            {
              text: "Deciduous forest",
              value: "deciduous",
            },
            {
              text: "Sparse forest (woodland)",
              value: "woodland",
            },
            {
              text: "Shrubland",
              value: "shrubland",
            },
            {
              text: "Grassland / savannah",
              value: "grassland-savannah",
            },
          ],
        } as FormItem<keyof GeneralModule, WoodLandscape>,
        {
          type: "select",
          key: "topography",
          label: "What does the topography outside of the site look like?",
          options: [
            {
              text: "Flat",
              value: "flat",
            },
            {
              text: "Hilly",
              value: "hilly",
            },
            {
              text: "Valley",
              value: "valley",
            },
          ],
        } as FormItem<keyof GeneralModule, Topography>,
      ],
      [
        {
          type: "number",
          key: "woodCarbonation",
          label: "Carbonation yield of wood to charcoal",
          subtype: "percent",
        },
        {
          type: "number",
          key: "woodDensity",
          label: "Plantations biomass growth per hectare per year",
          unit: "kg/ha",
        },
      ],
    ];
  }

  get populationItems(): FormItem<keyof GeneralModule>[][] {
    return [
      [
        {
          type: "number",
          key: "totalPopulation",
          label: "Total population of the site",
        },
        {
          type: "number",
          key: "familiesCount",
          label: "How many families are in the site?",
        },
      ],
    ];
  }
}
</script>

<style lang="scss" scoped>
.leaflet-container {
  z-index: 0;
}
</style>
