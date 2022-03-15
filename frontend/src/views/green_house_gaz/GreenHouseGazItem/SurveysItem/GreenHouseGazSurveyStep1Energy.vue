<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="item in menuItems" :key="item.tab">
        <v-card elevation="2" class="mx-auto" max-width="344">
          <v-form
            :readonly="!$can('edit', localProject)"
            @submit.prevent="() => submitForm(localProject)"
          >
            <v-card-title>
              <v-icon left>{{ item.icon }}</v-icon>
              {{ item.tab }}
            </v-card-title>
            <v-card-text>
              <h2>Inputs</h2>
              <v-divider />
              <h2>Results</h2>
              <v-divider />
            </v-card-text>
            <v-card-actions>
              <v-footer>
                <v-row>
                  <v-col class="d-flex justify-end align-center">
                    <v-btn
                      type="submit"
                      :disabled="!$can('edit', localProject)"
                    >
                      Save changes
                    </v-btn>
                    <span v-if="!$can('edit', localProject)" class="mx-auto">
                      readonly mode
                    </span>
                  </v-col>
                </v-row>
              </v-footer>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!--     
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-tabs v-model="tab" background-color="primary">
        <v-tab v-for="item in menuItems" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-text-field
                label="Total facilities"
                v-model.number="localSurvey.energy.facilities.TOTFAC"
              >
              </v-text-field>
              <v-divider />
              <v-text-field
                v-for="facilityInput in facilitiesInput"
                :key="facilityInput.code"
                v-model.number="
                  localSurvey.energy.facilities[facilityInput.code]
                "
                min="1"
                max="100"
                :label="facilityInput.description"
                type="number"
                :disabled="facilityInput.disabled"
                suffix="%"
              ></v-text-field>
              <v-divider />
              {{ computeFacility }}
              ---- <br />
              {{ configuration }}
              <v-divider />
              <ul>
                <li>diesel tCO2/year: {{ computeFacility.SUR_DIES_CO2 }}</li>
                <li>grid tCO2/year: {{ computeFacility.SUR_GRD_CO2 }}</li>
                <li>hybrid tCO2/year: {{ computeFacility.SUR_HYB_CO2 }}</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text> Cooking </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text> Lighting </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text> Pumping </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <v-row>
        <v-col>
          <v-footer>
            <v-row>
              <v-col class="d-flex justify-end align-center">
                <v-btn type="submit" :disabled="!$can('edit', localProject)">
                  Save changes
                </v-btn>
                <span v-if="!$can('edit', localProject)" class="mx-auto">
                  readonly mode
                </span>
              </v-col>
            </v-row>
          </v-footer>
        </v-col>
      </v-row>
    </v-form> -->
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
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },

  methods: {
    ...mapActions("GhgItemModule", ["updateDoc"]),
  },
})
/** ProjectList */
export default class Step1Energy extends Vue {
  readonly menuItems: MenuSurveyItem[] = [
    { icon: "mdi-shower", tab: "Facilities", content: "FacilitiesContent" },
    { icon: "mdi-stove", tab: "Cooking", content: "cookingContent" },
    { icon: "mdi-lightbulb", tab: "Lighting", content: "LightingContent" },
    { icon: "mdi-water-pump", tab: "Pumping", content: "PumpingContent" },
  ];
  tab = 0;
  reference!: GreenHouseGazReference;

  configuration = {};

  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;
  localSurvey = {} as Survey;
  localSurveyIndex = -1;

  readonly facilitiesInput = [
    {
      description: "Using diesel generators only",
      code: "SUR_DIES",
      type: "percentage",
    },
    {
      description: "Using national grid only",
      code: "SUR_GRD",
      type: "percentage",
    },
    { description: "hybrid", code: "SUR_HYB", type: "percentage" },
    {
      description: "Using renewable energy only",
      code: "SUR_RNW",
      type: "percentage",
      disabled: true,
    },
    {
      description: "not powered",
      code: "SUR_NP",
      type: "percentage",
      disabled: true,
    },
  ];

  private computeConfiguration(): Record<string, number> {
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
    res.ECONF_KWD = REF_CONF_KWHD.value || res.ECONF_PKW * res.ECONF_DUSE; // kWh/day/facility /// TODO: SEEMS WRONG
    res.ECONF_PYR = res.ECONF_KWD * 365; // Energy needed per year in kWh
    res.ECONF_EFF = REF_CONF_EFF.value; // Efficiency of DG average kWh/liter
    res.ECONF_LDF = REF_CONF_LDF.value; // Estimated L/day/facility;
    // res.ECONF_LITR = res.ECONF_LDF
    //   ? res.ECONF_LDF * 365
    //   : res.ECONF_PYR / res.ECONF_EFF; // Liters of diesel used per year
    res.ECONF_LITR = res.ECONF_PYR / res.ECONF_EFF;
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

    // variables used in final computation
    res.ECONF_DIES_EM = res.ECONF_LITR * REF_DIES.value; // Emissions per facility
    res.ECONF_GRD_EM = res.ECONF_NKWD * REF_GRD.value; // Emissions per day per facility
    res.ECONF_HYB_EMT = res.ECONF_HYB_EMG + res.ECONF_HYB_EMD; // Total emissions per day per facility
    return res;
  }
  public get computeFacility(): Record<string, number> {
    const reference = this.reference;

    let facilities = { ...this.localSurvey.energy.facilities };
    if (reference?.energy) {
      this.configuration = this.computeConfiguration();
      console.log(this.configuration);
      const localConf = this.configuration as Record<string, number>;
      const inputFormulas = {
        SUR_NP: function () {
          return 0;
        },
        SUR_RNW: function () {
          return 0;
        },
        SUR_DIES: function (facilities: Record<string, number>) {
          // debugger;
          return (localConf.ECONF_DIES_EM * facilities.SUR_DIES_NUM) / 1000;
        },
        SUR_GRD: function (facilities: Record<string, number>) {
          // debugger;
          return (localConf.ECONF_GRD_EM * facilities.SUR_GRD_NUM * 365) / 1000;
        },
        SUR_HYB: function (facilities: Record<string, number>) {
          // debugger;
          return localConf.ECONF_HYB_EMT * facilities.SUR_HYB_NUM * 365;
        },
      } as Record<string, (facilities: Record<string, number>) => number>;

      Object.keys(inputFormulas).forEach((key) => {
        facilities[`${key}_NUM`] = (facilities.TOTFAC * facilities[key]) / 100;
        facilities[`${key}_CO2`] = inputFormulas[key](facilities);
      });
    }

    return facilities;
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
    return {
      facilities: {},
      cooking: {},
      lighting: {},
      pumping: {},
    };
  }
  public setLocalShelter(project: GreenHouseGaz): void {
    this.localProject = project ? cloneDeep(project) : ({} as GreenHouseGaz);

    const surveyId = decodeURIComponent(this.$route.params.surveyId);
    this.localSurveyIndex =
      this.localProject.surveys?.findIndex(
        (el: Survey) => el.name === surveyId
      ) ?? -1;
    this.localSurvey =
      this.localProject.surveys?.[this.localSurveyIndex] ?? ({} as Survey);
    if (!this.localSurvey.energy) {
      this.localSurvey.energy = this.newEnergySurvey();
    }
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter(this.project);

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgItemModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter(mutation.payload);
      }
    });
  }

  created(): void {
    this.syncLocalShelter();
  }
}

interface MenuSurveyItem {
  tab: string;
  content: string;
  icon: string;
}
</script>
