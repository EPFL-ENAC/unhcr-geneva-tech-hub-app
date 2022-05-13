<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <v-row>
      <v-col :cols="4">
        <v-card elevation="2">
          <v-card-title><h1>Baseline</h1></v-card-title>
          <v-card-text>
            <div v-for="washInput in washInputs" :key="washInput.code">
              <v-text-field
                v-if="washInput.type === 'number'"
                v-model="washForm.baseline.inputs[washInput.code]"
                :label="washInput.description"
                hide-spin-buttons
                type="number"
                :disabled="washInput.disabled"
                @change="(e) => updateWashForm(e, 'baseline textfield')"
              ></v-text-field>
              <v-select
                v-if="washInput.type === 'select'"
                v-model="washForm.baseline.inputs[washInput.code]"
                :items="washInput.items"
                :label="washInput.description"
                :disabled="washInput.disabled"
                @change="(e) => updateWashForm(e, 'baseline select')"
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
                  hide-spin-buttons
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
                hide-spin-buttons
                type="number"
                :disabled="washInput.disabled"
                @change="(e) => updateWashForm(e, 'Endline select')"
              ></v-text-field>
              <v-select
                v-if="washInput.type === 'select'"
                v-model="washForm.endline.inputs[washInput.code]"
                hide-spin-buttons
                :items="washInput.items"
                :label="washInput.description"
                :disabled="washInput.disabled"
                @change="(e) => updateWashForm(e, 'Endline select')"
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
                    washForm.endline.resultsBalance[washBalanceResult.code] > 0,
                  'wash-negative':
                    washBalanceResult.code === 'CO2_WSH_TRB_PER' &&
                    washForm.endline.resultsBalance[washBalanceResult.code] < 0,
                }"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import {
  GreenHouseGaz,
  WashTruckingItemBalance,
  WashTruckingItemInputs,
  WashTruckingItemResults,
  WashTruckingSurvey,
} from "@/store/GhgInterface";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  components: {
    SurveyItemTitle,
  },
})
export default class Trucking extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop([Object, Array])
  readonly form: WashTruckingSurvey | undefined;

  project!: GreenHouseGaz;

  public get title(): string {
    return this.titleKey;
  }
  public get washForm(): WashTruckingSurvey {
    return this.form || this.generateNewWashForm();
  }

  public set washForm(newForm: WashTruckingSurvey) {
    this.$emit("update:form", newForm);
  }
  public updateWashForm(): void {
    this.washForm.baseline.results = this.computeResults(
      this.washForm.baseline.inputs
    );
    this.washForm.endline.results = this.computeResults(
      this.washForm.endline.inputs
    );
    this.washForm.endline.resultsBalance = this.computeBalance();
    this.washForm = Object.assign({}, this.washForm);
  }

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

  private computeResults(
    washInput: WashTruckingItemInputs
  ): WashTruckingItemResults {
    const REF_WSH_D = 0.25213; //	Need reference cf with cara@epfl.ch
    const res = {} as WashTruckingItemResults;
    res.TR_NUM = Math.ceil(washInput.WACL / washInput.TR_VOL);
    res.TR_DIST = res.TR_NUM * washInput.TOT_WS * 2;
    res.CO2_WSH_TRB = (REF_WSH_D * res.TR_DIST) / 1000;
    return res;
  }

  private computeBalance(): WashTruckingItemBalance {
    const res = {} as WashTruckingItemBalance;
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
</script>

<style lang="scss" scoped>
::v-deep .theme--light.v-input--is-disabled input {
  color: black;
}
::v-deep .wash-negative.theme--light.v-input--is-disabled input {
  color: green;
}
::v-deep .wash-positive.theme--light.v-input--is-disabled input {
  color: red;
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
