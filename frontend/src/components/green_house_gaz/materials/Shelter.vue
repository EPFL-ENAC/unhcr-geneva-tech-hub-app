<template>
  <v-container fluid v-if="localProject.users">
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Material - Shelter
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
            <v-card-text> add item </v-card-text>
            <v-divider />
            <v-card flat>
              <v-card-title><h2>Results</h2></v-card-title>
              <v-card-text> </v-card-text>
            </v-card>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card elevation="2">
            <v-card-title> <h1>Endline</h1></v-card-title>
            <v-card-text> add item </v-card-text>
            <v-divider />
            <v-card flat>
              <v-card-title><h2>Results</h2></v-card-title>
              <v-card-text> </v-card-text>
            </v-card>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card elevation="2">
            <v-card-title><h1>Balance</h1></v-card-title>
            <v-card-text> </v-card-text>
            <v-divider />
            <v-card outlined>
              <v-card-text>
                <v-text-field
                  v-for="balanceFormInput in balanceFormInputs"
                  :key="balanceFormInput.code"
                  :value="
                    shelterForm.endline.resultsBalance[balanceFormInput.code]
                      | formatNumber
                  "
                  :label="balanceFormInput.description"
                  :disabled="balanceFormInput.disabled"
                  :suffix="balanceFormInput.suffix"
                  :class="{
                    'wash-positive':
                      balanceFormInput.code === 'SH_BAL_CO2' &&
                      shelterForm.endline.resultsBalance[
                        balanceFormInput.code
                      ] > 0,
                    'wash-negative':
                      balanceFormInput.code === 'SH_BAL_CO2' &&
                      shelterForm.endline.resultsBalance[
                        balanceFormInput.code
                      ] < 0,
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
  MaterialShelterSurvey,
  MaterialShelterSurveyBalance,
  Survey,
} from "@/store/GhgInterface";
import { Material } from "@/store/ShelterInterface";
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

  shelterForm = this.generateNewShelterForm();
  localSurvey = {} as Survey;
  localSurveyIndex = -1;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  private generateNewShelterForm(): MaterialShelterSurvey {
    return {
      baseline: {
        inputs: [],
        results: [],
      },
      endline: {
        inputs: [],
        results: [],
        resultsBalance: {
          SH_BAL_MAT: 0,
          SH_BAL_CO2: 0,
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
    const materialForm = this.localSurvey.material;
    const shelter = materialForm?.shelter ?? {};
    const shelterDefined = Object.keys(shelter).length !== 0;
    if (!shelterDefined) {
      this.$set(this.localSurvey, "material", {
        shelter: this.generateNewShelterForm(),
      });
    }

    this.shelterForm = cloneDeep(this.localSurvey.material.shelter);
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
      // BEWARE: works because only one field
      this.$set(this.localSurvey, "material", {
        shelter: this.shelterForm,
      });
      value.surveys.splice(this.localSurveyIndex, 1, this.localSurvey);
      await this.updateDoc(value);
    } else {
      throw new Error("please fill the new Name");
    }
  }

  public created(): void {
    this.syncLocalProject();
  }

  private computeResults(washInput: Material[]): Material[] {
    console.log(washInput);
    const res = [] as Material[];
    return res;
  }

  private computeBalance(): MaterialShelterSurveyBalance {
    const res = {} as MaterialShelterSurveyBalance;
    const endlineResTotal = 10;
    const baselineResTotal = 13;
    res.SH_BAL_MAT = endlineResTotal - baselineResTotal;
    res.SH_BAL_CO2 = endlineResTotal - baselineResTotal;
    return res;
  }

  @Watch("shelterForm.baseline.inputs", { deep: true, immediate: true })
  public onBaselineChange(newValue: Material[]): void {
    if (newValue) {
      this.shelterForm.baseline.results = this.computeResults(newValue);
    }
  }

  @Watch("shelterForm.endline.inputs", { deep: true, immediate: true })
  public onEndline(newValue: Material[]): void {
    if (newValue) {
      this.shelterForm.endline.results = this.computeResults(newValue);
      this.shelterForm.endline.resultsBalance = this.computeBalance();
    }
  }

  readonly balanceFormInputs = [
    {
      description: "Difference in material used",
      code: "SH_BAL_MAT",
      type: "number",
      disabled: true,
    },
    {
      description: "Difference in CO2 Emissions",
      code: "SH_BAL_CO2",
      type: "number",
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
