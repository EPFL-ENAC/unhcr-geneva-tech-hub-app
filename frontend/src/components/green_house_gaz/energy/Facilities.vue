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
      <v-row>
        <v-col :cols="4">
          <v-card flat>
            <v-card-title><h2>Inputs</h2></v-card-title>
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
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card flat>
            <v-card-title><h2>Results</h2></v-card-title>
            <v-card-text>
              <ul>
                <li>diesel tCO2/year: {{ computeFacility.SUR_DIES_CO2 }}</li>
                <li>grid tCO2/year: {{ computeFacility.SUR_GRD_CO2 }}</li>
                <li>hybrid tCO2/year: {{ computeFacility.SUR_HYB_CO2 }}</li>
              </ul>
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
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },
  methods: {
    ...mapActions("GhgItemModule", ["getDoc", "updateDoc"]),
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
      this.localSurvey.energy = this.newEnergySurvey();
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
    return {
      facilities: {},
      cooking: {},
      lighting: {},
      pumping: {},
    };
  }

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

  public get computeFacility(): Record<string, number> {
    // const reference = this.reference;

    // let facilities = { ...this.localSurvey.energy.facilities };
    let facilities = {} as Record<string, number>;
    // if (reference?.energy) {
    //   this.configuration = this.computeConfiguration();
    //   console.log(this.configuration);
    //   const localConf = this.configuration as Record<string, number>;
    const inputFormulas = {
      SUR_NP: function (): number {
        return 0;
      },
      SUR_RNW: function (): number {
        return 0;
      },

      // SUR_DIES: function (facilities: Record<string, number>): number {
      SUR_DIES: function (): number {
        // debugger;
        return 0;
        // return (localConf.ECONF_DIES_EM * facilities.SUR_DIES_NUM) / 1000;
      },
      SUR_GRD: function (): number {
        // debugger;
        return 0;
        // return (localConf.ECONF_GRD_EM * facilities.SUR_GRD_NUM * 365) / 1000;
      },
      SUR_HYB: function (): number {
        // debugger;
        return 0;
        // return localConf.ECONF_HYB_EMT * facilities.SUR_HYB_NUM * 365;
      },
    } as Record<string, () => number>;

    Object.keys(inputFormulas).forEach((key) => {
      facilities[`${key}_NUM`] = 0; // (facilities.TOTFAC * facilities[key]) / 100;
      facilities[`${key}_CO2`] = 0; //inputFormulas[key](facilities);
    });
    // }

    return facilities;
  }
}
</script>

<style></style>
