<template>
  <v-container fluid v-if="localProject.users">
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Energy - Facilities
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row v-if="localSurvey">
        <v-col :cols="4" :lg="4" :md="6" :sm="12">
          <v-card flat>
            <v-card-title><h2>Configuration</h2></v-card-title>
            <v-card-text
              v-for="(config, $key) in facilitiesConfiguration"
              :key="$key"
            >
              <h4>{{ config.title }}</h4>
              <v-divider />
              <v-text-field
                v-for="(configInput, $configInputKey) in config.inputs"
                :key="`${$configInputKey}${$key}`"
                v-model.number="
                  localSurvey.energy.facilities[configInput.destination][
                    configInput.code
                  ]
                "
                min="1"
                max="100"
                :label="configInput.description"
                type="number"
                :disabled="configInput.disabled"
                :suffix="configInput.suffix || ''"
              ></v-text-field>
              <v-divider />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4" :lg="4" :md="6" :sm="12">
          <v-card flat>
            <v-card-title><h2>Inputs</h2></v-card-title>
            <v-card-text>
              <v-text-field
                label="Total facilities"
                v-model.number="localSurvey.energy.facilities.inputs.TOTFAC"
              >
              </v-text-field>
              <v-divider />
              <v-text-field
                v-for="facilityInput in facilitiesInput"
                :key="facilityInput.code"
                v-model.number="
                  localSurvey.energy.facilities.inputs[facilityInput.code]
                "
                min="1"
                max="100"
                :label="facilityInput.description"
                type="number"
                :disabled="facilityInput.disabled"
                suffix="%"
              ></v-text-field>
              <v-divider />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4" :lg="4" :md="6" :sm="12">
          <v-card flat>
            <v-card-title><h2>Results</h2></v-card-title>
            <v-card-text>
              <v-simple-table>
                <thead>
                  <tr>
                    <th></th>
                    <th>No. of facilities</th>
                    <th>CO2 Emissions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>No. of facilities using diesel generators</td>
                    <td>
                      {{ localSurvey.energy.facilities.results.SUR_DIES_NUM }}
                    </td>
                    <td>
                      {{
                        localSurvey.energy.facilities.results.SUR_DIES_CO2
                          | formatNumber
                      }}
                      tCO2/year
                    </td>
                  </tr>
                  <tr>
                    <td>No. of facilities using national grid</td>
                    <td>
                      {{ localSurvey.energy.facilities.results.SUR_GRD_NUM }}
                    </td>
                    <td>
                      {{ localSurvey.energy.facilities.results.SUR_GRD_CO2 }}
                      tCO2/year
                    </td>
                  </tr>
                  <tr>
                    <td>No. of facilities using renewable energy</td>
                    <td>##</td>
                    <td>0 tCO2/year</td>
                  </tr>
                  <tr>
                    <td>No. of facilities using hybrid mix</td>
                    <td>
                      {{ localSurvey.energy.facilities.results.SUR_HYB_NUM }}
                    </td>
                    <td>
                      {{ localSurvey.energy.facilities.results.SUR_HYB_CO2 }}
                      tCO2/year
                    </td>
                  </tr>
                  <tr>
                    <td>No. of facilities not powered</td>
                    <td>##</td>
                    <td>## tCO2/year</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4"></v-col>
      </v-row>
      <v-row v-if="$can('edit', localProject)">
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import {
  EnergySurvey,
  GreenHouseGaz,
  GreenHouseGazReference,
  Survey,
} from "@/store/GhgInterface";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },
  methods: {
    ...mapActions("GhgItemModule", ["getDoc", "updateDoc"]),
  },
  filters: {
    formatNumber(n: number): string {
      return Intl.NumberFormat("en").format(n);
    },
  },
})
export default class Facilities extends Vue {
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;
  reference!: GreenHouseGazReference;

  configuration = {};
  localSurvey = {} as Survey;
  localSurveyIndex = -1;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  public get currentSurvey(): Survey | undefined {
    if (!this.project) {
      return undefined;
    }
    const foundSurvey = this.project.surveys.find(
      (el: Survey) => el.name === this.$route.params.surveyId
    );
    if (!foundSurvey) {
      throw new Error("Could not find matching survey");
    }
    return foundSurvey;
  }

  public setLocalProject(): void {
    if (!this.project) {
      this.localProject = {} as GreenHouseGaz;
    } else {
      this.localProject = cloneDeep(this.project);
    }

    const surveyId = decodeURIComponent(this.$route.params.surveyId);
    this.localSurveyIndex =
      this.localProject.surveys?.findIndex(
        (el: Survey) => el.name === surveyId
      ) ?? -1;
    this.localSurvey =
      this.localProject.surveys?.[this.localSurveyIndex] ?? ({} as Survey);
    if (!this.localSurvey.energy) {
      // this.localSurvey.energy = this.newEnergySurvey();
      this.$set(this.localSurvey, "energy", this.newEnergySurvey());
    }
  }

  public syncLocalProject(): void {
    // init function
    this.setLocalProject();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgItemModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalProject();
      }
    });
  }

  public created(): void {
    this.syncLocalProject();
  }

  public async submitForm(value: GreenHouseGaz): Promise<void> {
    if (value.name !== "") {
      value.surveys.splice(this.localSurveyIndex, 1, this.localSurvey);
      console.log(value);
      await this.updateDoc(value);
    } else {
      throw new Error("please fill the new Name");
    }
  }

  private newEnergySurvey(): EnergySurvey {
    // warning reference may not have been downloaded yet!
    // TODO: add safeguard
    const configuration = this.getDefaultConfiguration();
    return {
      facilities: {
        configuration,
        configurationComputed: {},
        inputs: {},
        inputsComputed: {},
        results: {},
      },
      cooking: {},
      lighting: {},
      pumping: {},
    };
  }

  readonly facilitiesInput = [
    {
      description: "Diesel generators only",
      code: "SUR_DIES",
      type: "percentage",
    },
    {
      description: "Facilities using national grid only",
      code: "SUR_GRD",
      type: "percentage",
    },
    {
      description: "Facilities using hybrid mix",
      code: "SUR_HYB",
      type: "percentage",
    },
    {
      description: "Facilities using renewable energy only",
      code: "SUR_RNW",
      type: "percentage",
      disabled: true,
    },
    {
      description: "Facilities not powered",
      code: "SUR_NP",
      type: "percentage",
      disabled: true,
    },
  ];

  readonly facilitiesConfiguration = [
    {
      title: "Facilities using diesel generators only",
      inputs: [
        {
          description: "DG power in kilowatt",
          code: "ECONF_PKW",
          destination: "configuration",
          type: "number",
        },
        {
          description: "Daily use time in h",
          code: "ECONF_DUSE",
          destination: "configuration",
          type: "number",
        },
        {
          description: "kWh/day/facility",
          disabled: true,
          code: "ECONF_KWD",
          destination: "configurationComputed",
          type: "number",
        },
        {
          disabled: true,
          destination: "configurationComputed",
          description: "Energy needed per year in kWh ",
          code: "ECONF_PYR",
          type: "number",
        },
        {
          description: "Efficiency of DG average kWh/liter",
          destination: "configuration",
          code: "ECONF_EFF",
          type: "number",
        },
        {
          destination: "configuration",
          description: "Estimated L/day/facility",
          code: "ECONF_LDF",
          type: "number",
        },
        {
          disabled: true,
          destination: "configurationComputed",
          description: "Liters of diesel used per year ",
          code: "ECONF_LITR",
          type: "number",
        },
        {
          disabled: true,
          destination: "configurationComputed",
          description: "Emissions per facility",
          code: "ECONF_DIES_EM",
          type: "number",
        },
      ],
    },
    {
      title: "Facilities using national grid only",
      inputs: [
        {
          description: "Estimated average Kwh/day/facility",
          type: "number",
          destination: "configuration",
          code: "",
        },
        {
          disabled: true,
          description: "Emissions per facility",
          destination: "configuration",
          type: "number",
          code: "",
        },
      ],
    },
    {
      title: "Facilities using hybrid mix",
      inputs: [
        {
          destination: "configuration",
          description: "Diesel generator",
          code: "",
          type: "percentage",
        },
        {
          destination: "configuration",
          description: "National grid",
          code: "",
          type: "percentage",
        },
        {
          destination: "configuration",
          description: "Renewable",
          code: "",
          type: "percentage",
        },
        {
          disabled: true,
          destination: "configurationComputed",
          description: "Emissions per day per facilitiy from diesel",
          code: "",
          type: "number",
        },
        {
          disabled: true,
          destination: "configurationComputed",
          description: "Emissions per day per facilitiy from grid",
          code: "",
          type: "number",
        },
        {
          disabled: true,
          destination: "configurationComputed",
          description: "Total Emissions per day per facility      ",
          code: "",
          type: "number",
        },
      ],
    },
  ];

  private getDefaultConfiguration(): Record<string, number> {
    let res = {} as Record<string, number>;

    const {
      REF_CONF_HYB_DP,
      REF_CONF_HYB_GP,
      REF_CONF_DGP,
      REF_CONF_DUSE,
      REF_CONF_KWHD,
      REF_CONF_EFF,
      REF_CONF_LDF,
      REF_DIES,
      REF_GRD,
    } = this.reference.energy;

    const iges_grid_2021 = this.reference.iges_grid_2021.find(
      (el) => el.country_code === this.localProject.country_code
    );
    REF_GRD.value = iges_grid_2021?.value || REF_GRD.value; // find REF_GRD per country
    /* for ECONF_DIES_EM */
    console.log(
      "iges",
      iges_grid_2021,
      this.reference.iges_grid_2021[0],
      REF_GRD
    );
    res.ECONF_PKW = REF_CONF_DGP.value; // DG power in kilowatt
    res.ECONF_DUSE = REF_CONF_DUSE.value; // Daily use time in h

    res.ECONF_EFF = REF_CONF_EFF.value; // Efficiency of DG average kWh/liter
    res.ECONF_LDF = REF_CONF_LDF.value; // Estimated L/day/facility;
    // res.ECONF_LITR = res.ECONF_LDF
    //   ? res.ECONF_LDF * 365
    //   : res.ECONF_PYR / res.ECONF_EFF; // Liters of diesel used per year
    // res.ECONF_LITR = res.ECONF_PYR / res.ECONF_EFF;
    /* endfor*/

    /** for ECONF_GRD_EM */
    res.ECONF_NKWD = REF_CONF_KWHD.value; // Estimated average Kwh/day/facility
    /* endfor */

    /** for ECONF_HYB_EMT */
    res.ECONF_HYB_D = REF_CONF_HYB_DP.value;
    res.ECONF_HYB_G = REF_CONF_HYB_GP.value;
    res.ECONF_HYB_KWD = REF_CONF_KWHD.value;
    res.ECONF_HYB_LDF = REF_CONF_LDF.value;
    // we're not using renewable cost...

    res.ECONF_HYB_EMG = res.ECONF_HYB_G * res.ECONF_HYB_KWD * REF_GRD.value; // Emissions per day per facilitiy from grid
    res.ECONF_HYB_EMD =
      res.ECONF_HYB_D * res.ECREF_CONF_HYB_GPONF_HYB_LDF * REF_DIES.value; // Emissions per day per facilitiy from diesel
    /* endfor */

    return res;
  }

  private getConfigurationComputed(
    configuration: Record<string, number>
  ): Record<string, number> {
    const res: Record<string, number> = {};
    try {
      const { REF_DIES, REF_GRD } = this.reference.energy;

      res.ECONF_KWD = configuration.ECONF_PKW * configuration.ECONF_DUSE; // kWh/day/facility /// TODO: SEEMS WRONG
      res.ECONF_PYR = res.ECONF_KWD * 365; // Energy needed per year in kWh
      res.ECONF_LITR = res.ECONF_PYR / configuration.ECONF_EFF;

      // variables used in final computation
      res.ECONF_DIES_EM = res.ECONF_LITR * REF_DIES.value; // Emissions per facility
      res.ECONF_GRD_EM = configuration.ECONF_NKWD * REF_GRD.value; // Emissions per day per facility
      res.ECONF_HYB_EMT = res.ECONF_HYB_EMG + res.ECONF_HYB_EMD; // Total emissions per day per facility
    } catch (e) {
      console.error(e);
    }
    return res;
  }

  @Watch("localSurvey.energy.facilities.configuration", { deep: true })
  public onConfigurationChange(newValue: Record<string, number>): void {
    if (newValue) {
      const configurationComputed = this.getConfigurationComputed(newValue);
      this.$set(
        this.localSurvey.energy.facilities,
        "configurationComputed",
        configurationComputed
      );
    }
  }

  @Watch("localSurvey.energy.facilities.configurationComputed", { deep: true })
  @Watch("localSurvey.energy.facilities.inputs", { deep: true })
  public onConfigurationComputedChange(newValue: Record<string, number>): void {
    if (newValue) {
      this.$set(
        this.localSurvey.energy.facilities,
        "results",
        this.getComputeFacility()
      );
    }
  }

  public getComputeFacility(): Record<string, number> {
    // const reference = this.reference;
    const { configurationComputed, inputs } =
      this.localSurvey.energy.facilities;
    let results = {} as Record<string, number>;
    try {
      const inputFormulas = {
        SUR_NP: function (): number {
          return 0;
        },
        SUR_RNW: function (): number {
          return 0;
        },
        SUR_DIES: function (): number {
          return (
            (configurationComputed.ECONF_DIES_EM * results.SUR_DIES_NUM) / 1000
          );
        },
        SUR_GRD: function (): number {
          return (
            (configurationComputed.ECONF_GRD_EM * results.SUR_GRD_NUM * 365) /
            1000
          );
        },
        SUR_HYB: function (): number {
          return (
            configurationComputed.ECONF_HYB_EMT * results.SUR_HYB_NUM * 365
          );
        },
      } as Record<string, () => number>;

      Object.keys(inputFormulas).forEach((key) => {
        results[`${key}_NUM`] = (inputs.TOTFAC * inputs[key]) / 100;
        results[`${key}_CO2`] = inputFormulas[key]();
      });
    } catch (e) {
      console.error(e);
    }
    return results;
  }
}
</script>

<style></style>
