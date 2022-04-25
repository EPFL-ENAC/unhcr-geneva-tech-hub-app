<template>
  <v-container fluid v-if="localProject.users">
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            WASH - TRUCKING
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
          <v-card elevation="2">
            <v-card-title><h1>Baseline</h1></v-card-title>
            <v-card-text>
              <div v-for="washInput in washInputs" :key="washInput.code">
                <v-text-field
                  v-if="washInput.type === 'number'"
                  v-model.number="washForm.baseline.inputs[washInput.code]"
                  :label="washInput.description"
                  type="number"
                  :disabled="washInput.disabled"
                ></v-text-field>
                <v-select
                  v-if="washInput.type === 'select'"
                  v-model="washForm.baseline.inputs[washInput.code]"
                  :items="washInput.items"
                  :label="washInput.description"
                  :disabled="washInput.disabled"
                >
                </v-select>
              </div>
            </v-card-text>
            <v-divider />
            <v-card flat>
              <v-card-title><h2>Results</h2></v-card-title>
              <v-card-text>
                <div v-for="washResult in washResults" :key="washResult.code">
                  <v-text-field
                    :value="
                      washForm.baseline.results[washResult.code] | formatNumber
                    "
                    :label="washResult.description"
                    :disabled="washResult.disabled"
                  ></v-text-field>
                </div>
              </v-card-text>
            </v-card>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card elevation="2">
            <v-card-title> <h1>Endline</h1></v-card-title>
            <v-card-text>
              <div v-for="washInput in washInputs" :key="washInput.code">
                <v-text-field
                  v-if="washInput.type === 'number'"
                  v-model.number="washForm.endline.inputs[washInput.code]"
                  :label="washInput.description"
                  type="number"
                  :disabled="washInput.disabled"
                ></v-text-field>
                <v-select
                  v-if="washInput.type === 'select'"
                  v-model="washForm.endline.inputs[washInput.code]"
                  :items="washInput.items"
                  :label="washInput.description"
                  :disabled="washInput.disabled"
                >
                </v-select>
              </div>
            </v-card-text>
            <v-divider />
            <v-card flat>
              <v-card-title><h2>Results</h2></v-card-title>
              <v-card-text>
                <v-text-field
                  v-for="washResult in washResults"
                  :key="washResult.code"
                  :value="
                    washForm.endline.results[washResult.code] | formatNumber
                  "
                  :label="washResult.description"
                  :disabled="washResult.disabled"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card elevation="2">
            <v-card-title><h1>Balance</h1></v-card-title>
            <v-card-text>
              <v-text-field
                v-for="washBalanceResult in washBalanceResultsPart1"
                :key="washBalanceResult.code"
                :value="
                  washForm.endline.resultsBalance[washBalanceResult.code]
                    | formatNumber
                "
                :label="washBalanceResult.description"
                :disabled="washBalanceResult.disabled"
                :suffix="washBalanceResult.suffix"
              ></v-text-field>
            </v-card-text>
            <v-divider />
            <v-card outlined>
              <v-card-text>
                <v-text-field
                  v-for="washBalanceResult in washBalanceResultsPart2"
                  :key="washBalanceResult.code"
                  :value="
                    washForm.endline.resultsBalance[washBalanceResult.code]
                      | formatNumber
                  "
                  :label="washBalanceResult.description"
                  :disabled="washBalanceResult.disabled"
                  :suffix="washBalanceResult.suffix"
                  :class="{
                    'wash-positive':
                      washBalanceResult.code === 'CO2_WSH_TRB_PER' &&
                      washForm.endline.resultsBalance[washBalanceResult.code] >
                        0,
                    'wash-negative':
                      washBalanceResult.code === 'CO2_WSH_TRB_PER' &&
                      washForm.endline.resultsBalance[washBalanceResult.code] <
                        0,
                  }"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-card>
        </v-col>
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
  GreenHouseGaz,
  Survey,
  WashTruckingSurvey,
} from "@/store/GhgInterface";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgModule", ["getDoc", "updateDoc"]),
  },
})
export default class WASH extends Vue {
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;

  washForm = this.generateNewWashForm();
  localSurvey = {} as Survey;
  localSurveyIndex = -1;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  private generateNewWashForm(): WashTruckingSurvey {
    return {
      baseline: {
        inputs: {
          US_TYP: "WATER",
          TOT_WS: 10000,
          WACL: 5,
          TR_VOL: 2.5,
          TR_TYP: "DIESEL",
        },
        results: {
          TR_NUM: 0,
          TR_DIST: 0,
          CO2_WSH_TRB: 0,
        },
      },
      endline: {
        inputs: {
          US_TYP: "WATER",
          TOT_WS: 10000,
          WACL: 5,
          TR_VOL: 2,
          TR_TYP: "DIESEL",
        },
        results: {
          TR_NUM: 0,
          TR_DIST: 0,
          CO2_WSH_TRB: 0,
        },
        resultsBalance: {
          TR_NUM_DIFF: 0,
          TR_DIST_DIFF: 0,
          CO2_WSH_TRB_DIFF: 0,
          CO2_WSH_TRB_PER: 0,
        },
      },
    };
  }

  public setLocalProject(): void {
    if (!this.project) {
      this.localProject = {} as GreenHouseGaz;
    } else {
      this.localProject = cloneDeep(this.project);
      // find current survey
      const surveyId = decodeURIComponent(this.$route.params.surveyId);
      this.localSurveyIndex =
        this.localProject.surveys?.findIndex(
          (el: Survey) => el.name === surveyId
        ) ?? -1;
      this.localSurvey =
        this.localProject.surveys?.[this.localSurveyIndex] ?? ({} as Survey);
      this.initWash();
    }
  }

  public initWash(): void {
    const washForm = this.localSurvey.wash;
    const trucking = washForm?.trucking ?? {};
    const truckingDefined = Object.keys(trucking).length !== 0;
    if (!truckingDefined) {
      this.$set(this.localSurvey, "wash", {
        trucking: this.generateNewWashForm(),
      });
    }

    this.washForm = cloneDeep(this.localSurvey.wash.trucking);
  }

  public syncLocalProject(): void {
    // init function
    this.setLocalProject();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalProject();
      }
    });
  }

  public async submitForm(value: GreenHouseGaz): Promise<void> {
    if (value.name !== "") {
      this.$set(this.localSurvey, "wash", {
        trucking: this.washForm,
      });
      value.surveys.splice(this.localSurveyIndex, 1, this.localSurvey);
      console.log(value);
      await this.updateDoc(value);
    } else {
      throw new Error("please fill the new Name");
    }
  }

  public created(): void {
    this.syncLocalProject();
  }

  private computeResults(washInput: WashInput): WashResult {
    const REF_WSH_D = 0.25213; //	Need reference cf with cara@epfl.ch
    const res = {} as WashResult;
    res.TR_NUM = Math.ceil(washInput.WACL / washInput.TR_VOL);
    res.TR_DIST = res.TR_NUM * washInput.TOT_WS * 2;
    res.CO2_WSH_TRB = (REF_WSH_D * res.TR_DIST) / 1000;
    return res;
  }

  private computeBalance(): WashBalanceResult {
    const res = {} as WashBalanceResult;
    const baselineRes = this.washForm.baseline.results;
    const endlineRes = this.washForm.endline.results;
    // ABSOLUTE (TR_NUM_B - TR_NUM_D) / TR_NUM_B
    // res.TR_NUM_DIFF = endlineRes.TR_NUM - baselineRes.TR_NUM;
    res.TR_NUM_DIFF =
      (Math.abs(baselineRes.TR_NUM - endlineRes.TR_NUM) / baselineRes.TR_NUM) *
      100;
    // ABSOLUTE (TR_DIST_B - TR_DIST_D) / TR_DIST_B
    // res.TR_DIST_DIFF = endlineRes.TR_DIST - baselineRes.TR_DIST;
    res.TR_DIST_DIFF =
      (Math.abs(baselineRes.TR_DIST - endlineRes.TR_DIST) /
        baselineRes.TR_DIST) *
      100;
    res.CO2_WSH_TRB_DIFF = endlineRes.CO2_WSH_TRB - baselineRes.CO2_WSH_TRB;
    res.CO2_WSH_TRB_PER =
      ((baselineRes.CO2_WSH_TRB - endlineRes.CO2_WSH_TRB) /
        baselineRes.CO2_WSH_TRB) *
      100;
    return res;
  }

  @Watch("washForm.baseline.inputs", { deep: true, immediate: true })
  public onBaselineChange(newValue: WashInput): void {
    if (newValue) {
      this.washForm.baseline.results = this.computeResults(newValue);
    }
  }

  @Watch("washForm.endline.inputs", { deep: true, immediate: true })
  public onEndline(newValue: WashInput): void {
    if (newValue) {
      this.washForm.endline.results = this.computeResults(newValue);
      this.washForm.endline.resultsBalance = this.computeBalance();
    }
  }

  // B is for Baseline
  // E is for endline
  readonly washInputs = [
    {
      description: "Trucking type",
      code: "US_TYP",
      type: "select",
      items: ["WATER", "WASTEWATER", "FAECAL SLUDGE"],
    },
    {
      description: "Distance between camp and water source",
      code: "TOT_WS",
      type: "number",
    },
    {
      description: "Total volume of water collected (m3)",
      code: "WACL",
      type: "number",
    },
    {
      description: "Volume of one water truck",
      code: "TR_VOL",
      type: "number",
    },
    {
      description: "Type of truck",
      code: "TR_TYP",
      type: "select",
      items: ["DIESEL"],
    },
  ];

  readonly washResults = [
    {
      description: "Approximate number of trucks used",
      code: "TR_NUM",
      type: "number",
      disabled: true,
    },
    {
      description: "Total distance travelled",
      code: "TR_DIST",
      type: "number",
      disabled: true,
    },
    {
      description: "Total CO2 Emissions for trucking type",
      code: "CO2_WSH_TRB",
      type: "number",
      disabled: true,
    },
  ];

  readonly washBalanceResultsPart1 = [
    {
      description: "Change in number of trucks used",
      code: "TR_NUM_DIFF",
      type: "percentage",
      suffix: "%",
      disabled: true,
    },
    {
      description: "Change in total distance travelled",
      code: "TR_DIST_DIFF",
      suffix: "%",
      type: "percentage",
      disabled: true,
    },
  ];

  readonly washBalanceResultsPart2 = [
    {
      description:
        "Total CO2 Produced(+) or Saved (-) (kg CO2eq per year / kg)",
      code: "CO2_WSH_TRB_DIFF",
      type: "number",
      disabled: true,
    },
    {
      description: "Percentage change (positive is increase)",
      code: "CO2_WSH_TRB_PER",
      type: "percentage",
      suffix: "%",
      disabled: true,
    },
  ];
}

interface WashInput {
  US_TYP: truckingType;
  TOT_WS: number;
  WACL: number;
  TR_VOL: number;
  TR_TYP: truckType;
}
type truckingType = "WATER" | "WASTEWATER" | "FAECAL SLUDGE";
type truckType = "DIESEL";

interface WashResult {
  TR_NUM: number;
  TR_DIST: number;
  CO2_WSH_TRB: number;
}
interface WashBalanceResult {
  TR_NUM_DIFF: number;
  TR_DIST_DIFF: number;
  CO2_WSH_TRB_DIFF: number;
  CO2_WSH_TRB_PER: number;
}
</script>

<style lang="scss" scoped>
::v-deep .theme--light.v-input--is-disabled input {
  color: black;
}
::v-deep .wash-negative.theme--light.v-input--is-disabled input {
  color: red;
}
::v-deep .wash-positive.theme--light.v-input--is-disabled input {
  color: green;
}

::v-deep.theme--light.v-sheet--outlined {
  border: 2px solid rgba(255, 0, 0, 0.9);
  .v-label {
    color: black;
    font-weight: 700;
    font-size: large;
  }
  input {
    font-size: larger;
  }
}
</style>
