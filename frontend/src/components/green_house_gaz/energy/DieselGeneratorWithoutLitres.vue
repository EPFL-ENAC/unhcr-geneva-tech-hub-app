<template>
  <v-col cols="12">
    <v-row>
      <!-- flex + align-items: center; -->
      <v-col class="d-flex align-center">
        I don't know Total of Litres used
      </v-col>
      <v-col>
        <!--     margin: 0px; padding: 0px; -->
        <v-simple-checkbox
          :value="localFacility.disableDieselLiters"
          class="pa-0 ma-0"
          hide-details
          @input="resetDieselLiters"
        >
        </v-simple-checkbox>
      </v-col>
    </v-row>
    <v-row v-if="localFacility.disableDieselLiters">
      <v-col :cols="12">
        <v-text-field
          :value="localFacility.generatorSize"
          type="number"
          required
          :rules="rules"
          :min="0"
          label="generator size (kW)"
          @input="changeGeneratorSize"
        />
      </v-col>
      <v-col :cols="12">
        <v-text-field
          :value="localFacility.operatingHours"
          type="number"
          required
          :rules="rules"
          :min="0"
          label="operating hours (hrs/yr)"
          @input="changeOperatingHours"
      /></v-col>
      <v-col :cols="12">
        <v-text-field
          :value="localFacility.generatorLoad"
          type="number"
          suffix="%"
          required
          :rules="rules"
          min="0"
          max="100"
          step="10"
          label="generator load (percentage)"
          @input="changeGeneratorLoad"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
<script lang="ts">
import { computeLitresDiesel } from "@/components/green_house_gaz/energy/computeCO2cost";
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DieselGenerators extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  public get localFacility(): Facility {
    return this.facility;
  }

  public set localFacility(value: Facility) {
    this.$emit("update:facility", value);
  }

  rules: Rule[] = [checkRequired];

  public changeGeneratorSize(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");
    this.localFacility = {
      ...this.facility,
      generatorSize: _temp,
      dieselLiters: computeLitresDiesel(
        _temp,
        this.localFacility.operatingHours,
        this.localFacility.generatorLoad
      ),
    };
  }
  public changeOperatingHours(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");

    this.localFacility = {
      ...this.localFacility,
      operatingHours: _temp,
      dieselLiters: computeLitresDiesel(
        this.localFacility.generatorSize,
        _temp,
        this.localFacility.generatorLoad
      ),
    };
  }
  public changeGeneratorLoad(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");

    this.localFacility = {
      ...this.localFacility,
      generatorLoad: _temp,
      dieselLiters: computeLitresDiesel(
        this.localFacility.generatorSize,
        this.localFacility.operatingHours,
        _temp
      ),
    };
  }

  public resetDieselLiters(value: boolean): void {
    if (value) {
      this.localFacility = {
        ...this.localFacility,
        dieselLiters: 0,
        disableDieselLiters: true,
      };
    } else {
      this.localFacility = {
        ...this.localFacility,
        generatorSize: 0,
        operatingHours: 0,
        disableDieselLiters: false,
      };
    }
  }
}
</script>
