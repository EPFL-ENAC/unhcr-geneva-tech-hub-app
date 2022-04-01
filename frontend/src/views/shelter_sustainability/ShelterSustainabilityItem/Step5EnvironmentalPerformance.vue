<template>
  <v-form
    :readonly="!$can('edit', shelter)"
    v-if="shelter"
    @submit.prevent="() => submitForm(shelter)"
  >
    <v-container fluid>
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Environmental Performance
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-sheet elevation="2" rounded v-if="shelter">
            <v-container fluid>
              <v-row>
                <v-col class="about-first-column d-flex justify-center" lg="12">
                  <v-data-table
                    :headers="headers"
                    :items="items"
                    :single-expand="singleExpand"
                    :expanded.sync="expanded"
                    item-key="material"
                    hide-default-footer
                    @click:row="
                      (item, slot) =>
                        item.items && slot.expand(!slot.isExpanded)
                    "
                  >
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length">
                        <v-data-table
                          hide-default-footer
                          hide-default-header
                          :headers="headersSubItems"
                          :items="item.items"
                        >
                          <template v-slot:item.formId="{ item }">
                            <span>{{ materialMap[item.formId].form }}</span>
                          </template>
                        </v-data-table>
                      </td>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { EnvPerf, Shelter } from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
    ...mapGetters("GhgReferenceModule", ["materialMap"]),
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  singleExpand = true;
  expanded = [];

  get items(): EnvPerf[] {
    const res = cloneDeep(this.shelter.envPerfItems) as EnvPerf[];
    if (this.shelter?.totalEnvPerf) {
      res.push(this.shelter?.totalEnvPerf);
    }
    return res;
  }
  public get headers(): HeaderInterface[] {
    return [
      { text: "Material", value: "material", sortable: false },
      { text: "Weight", value: "weight", sortable: false },
      {
        text: "embodied_carbon_production",
        value: "embodied_carbon_production",
        sortable: false,
      },
      {
        text: "embodied_carbon_transport",
        value: "embodied_carbon_transport",
        sortable: false,
      },
      {
        text: "embodied_carbon_total",
        value: "embodied_carbon_total",
        sortable: false,
      },
      { text: "embodied_water", value: "embodied_water", sortable: false },
      { text: "unit_cost", value: "unit_cost", sortable: false },
      { text: "total_cost", value: "total_cost", sortable: false },
    ];
  }

  public get headersSubItems(): HeaderInterface[] {
    return [
      { text: "Form", value: "formId", sortable: false },
      { text: "Weight", value: "weight", sortable: false },
      {
        text: "embodied_carbon_production",
        value: "embodiedCarbon",
        sortable: false,
      },
      {
        text: "embodied_carbon_transport",
        value: "embodiedCarbonTransport",
        sortable: false,
      },
      {
        text: "embodied_carbon_total",
        value: "embodied_carbon_total",
        sortable: false,
      },
      { text: "embodied_water", value: "embodiedWater", sortable: false },
      { text: "unit_cost", value: "unitCost", sortable: false },
      { text: "total_cost", value: "totalCost", sortable: false },
    ];
  }

  descriptions = [
    {
      materialId: "Aluminium",
      description:
        "Aluminium production involves relatively larges amounts of mineral bauxite mining/extraction, which is associated with larges amounts of unused residues (Greenspec, 2022 [https://www.greenspec.co.uk/building-design/aluminium-production-environmental-impact/]). Primary mining areas for bauxite are Australia, China, Brazil and India. Primary production of aluminium is highly energy intensive - requiring around 211 GJ per tonne of aluminium,  compared to 22.7GJ per tonne for steel (CSIRO, 2021 [https://publications.csiro.au/rpr/download?pid=csiro:EP12183&dsid=DS3]). However, around a third of all aluminium production globally comes from reuse of scrap from manufacturing and from recycling (IEA, 2022 [https://www.iea.org/reports/aluminium]).",
    },
    {
      materialId: "Bamboo",
      description:
        "Bamboo is widely associated with less harmful environmental impacts in comparison with other structural framing materials such as timber or steel. However, total quantities of bamboo use should be taken into account with regard to numbers of shelters to be provided. Poorly managed bamboo extraction can contribute to erosion (WWF, 2016 [Building Material Selection - An environmental guide]. Bamboo has relatively short harvest cycles of around 4-6 years. Bamboo growth is associated with extensive irrigation, however bamboo plantations typically rely on rainfall in tropical climates.",
    },
    {
      materialId: "Bitumen",
      description:
        "Bitumen production derives from distillation of crude oil, hence it is associated with depletion of fossil fuels and minerals. However, shelter construction would typically use relatively low amounts of bitumen in waterproofing applications.",
    },
    {
      materialId: "Canvas",
      description:
        " Polycotton	Canvas and polycotton production derives from cotton cultivation, which is associated with high water use for irrigation and extensive use of pesticides (US Dept of Agriculture, 2020 [U.S. Department of Agriculture (2020a) 2019 Agricultural chemical use survey: cotton. NASS Highlights. No. 2020-3.]. Polycotton contains polyester, which uses less water in production compared to natural fibres, though invovles relatively energy intensive production - around 125MJ per kg (Muthu, S.S., 2020. Assessing the environmental impact of textiles and the clothing supply chain. Woodhead publishing.)",
    },
    { materialId: "Cardboard", description: " paper	.." },
    {
      materialId: "Cement",
      description:
        "Cement production involves extensive limestone and shale quarrying. Cement production is typically concentrated near limestone sources. More than half of global cement production occurs in China (IEA, 2022 [https://www.iea.org/reports/cement]). Clinker production - a principal component of cement production - is energy intensive, involving around 3.5GJ of energy per tonne of clinker (IEA, 2022 [https://www.iea.org/reports/cement]).",
    },
    {
      materialId: "Clay",
      description:
        "Clay is a specific type of fine-grained soil. Sourcing of clay in large quantities from suitable sites can contribute to erosion and alter local hydrological conditions (WWF, 2016 [Building Material Selection - An environmental guide]). Fired clay brick and tile production involves baking filns that may use wood or waste such as discarded car tires that contributes to deforestation and air pollution. In some countries (inc., Afghanistan, Burma, China, India, Nepal and Pakistan), clay brick production is associated with indentured labour (US Dept of Labour, 2022 [https://www.dol.gov/agencies/ilab/reports/child-labor/list-of-products-print])",
    },
    {
      materialId: "Concrete",
      description:
        "Concrete production typically involves cement, sand, stone aggregate and water. Cement production involves production of clinker, which is energy intensive, involving around 3.5GJ of energy per tonne of clinker (IEA, 2022 [https://www.iea.org/reports/cement]). Poorly managed quarrying of sand and stone aggregates can contribute to erosion and loss of agricultural land  (WWF, 2016 [Building Material Selection - An environmental guide]). Movement of bulk materials for concrete entails transportation-related envrionmental impacts. Concrete production, including mixing and curing, involves significant water use. Casting yards for concrete blocks and other precast concrete can cause daust, noise and silt problems (WWF, 2016 [Building Material Selection - An environmental guide]).",
    },
    {
      materialId: "Earth",
      description:
        " soil, mud	Soil for construction purposes includes clay and other classes of soil. Soil quarrying in general can contribute to erosion and loss of agricultural land (WWF, 2016 [Building Material Selection - An environmental guide]). Clay is a specific type of fine-grained soil. Sourcing of clay in large quantities from suitable sites can contribute to erosion and alter local hydrological conditions (WWF, 2016 [Building Material Selection - An environmental guide]). Fired clay brick and tile production involves baking filns that may use wood or waste such as discarded car tires that contributes to deforestation and air pollution. In some countries (inc., Afghanistan, Burma, China, India, Nepal and Pakistan), clay brick production is associated with indentured labour (US Dept of Labour, 2022 [https://www.dol.gov/agencies/ilab/reports/child-labor/list-of-products-print])",
    },
    {
      materialId: "Glass",
      description:
        "Glass production is energy intensive (reflected in embodied energy of glass around 15.9 MJ/kg (Atkins, C., 2009. Sustainability of glass in construction. Sustainability of Construction Materials, Woodhead Publishing)",
    },
    { materialId: "Grass, straw", description: ".." },
    { materialId: "Gypsum", description: ".." },
    { materialId: "Hemp", description: ".." },
    { materialId: "Lime", description: ".." },
    {
      materialId: "Plastic",
      description:
        " polymer	Plastics (polymers) are generally associated with negative environmental impacts in disposal. Polymers such as polycarbonate, polyethylene (HDPE and LDPE) and polyvinylchloride (PVC) do not readily decompose under natural conditions. Plastic tarpaulins are commonly made from polyethylene (HDPE and/or LDPE) or polyester, which do not readily degrade under natural conditions.",
    },
    { materialId: "Rubber", description: ".." },
    {
      materialId: "Sand",
      description:
        "Sand sourced through poorly managed quarrying can contribute to erosion and loss of agricultural land (WWF, 2016 [Building Material Selection - An environmental guide])",
    },
    {
      materialId: "Steel",
      description:
        "Steel production is energy intensive, with energy in production of around 18GJ/tonne (GeenSpec, 2022 [https://www.greenspec.co.uk/building-design/steel-products-and-environmental-impact/]). However, steel is readily recycled - scrap-based production, which is considerably less energy intensive, accounts for around 20% of global steel production (IEA, 2022 [https://www.iea.org/reports/iron-and-steel]).",
    },
    { materialId: "Steel, brass fixture, fixing", description: ".." },
    {
      materialId: "Stone",
      description:
        "Stone quarrying, including stone aggregates, can contribute to erosion and loss of agricultural land  (WWF, 2016 [Building Material Selection - An environmental guide]). Movement of bulk materials such as stone and aggregates entails transportation-related envrionmental impacts.",
    },
    {
      materialId: "Timber",
      description:
        "Timber use in construction can contribute to deforestation and associated erosion and loss of natural habitats. Poorly managed timber plantations can cause land degradation and loss of biodiversity (WWF, 2016 [Building Material Selection - An environmental guide]). ",
    },
  ];
}

interface HeaderInterface {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}
</script>
