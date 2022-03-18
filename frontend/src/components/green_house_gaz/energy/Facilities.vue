<template>
  <div>
    <h2>Inputs</h2>
    <v-card flat>
      <v-card-text>
        <v-text-field label="Total facilities" v-model.number="toto.TOTFAC">
        </v-text-field>
        <v-divider />
        <v-text-field
          v-for="facilityInput in facilitiesInput"
          :key="facilityInput.code"
          v-model.number="toto"
          min="1"
          max="100"
          :label="facilityInput.description"
          type="number"
          :disabled="facilityInput.disabled"
          suffix="%"
        ></v-text-field>
        <v-divider />
        <h2>Results</h2>
        <ul>
          <li>diesel tCO2/year: {{ computeFacility.SUR_DIES_CO2 }}</li>
          <li>grid tCO2/year: {{ computeFacility.SUR_GRD_CO2 }}</li>
          <li>hybrid tCO2/year: {{ computeFacility.SUR_HYB_CO2 }}</li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Facilities extends Vue {
  toto = {};

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
