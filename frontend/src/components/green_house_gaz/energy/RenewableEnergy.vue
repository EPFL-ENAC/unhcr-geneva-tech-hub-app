<template>
  <v-col cols="12" sm="6" md="6">
    <v-text-field
      :value="facility.renewableKiloWattInstalled"
      type="number"
      required
      :rules="rules"
      :min="0"
      label="Total kW of solar installed"
      @input="changeRenewablePower"
    />
    <v-text-field
      :value="facility.renewablePower"
      :disabled="!authorizedReverse"
      suffix="kWh/yr"
      label="Total kWh/yr produced (estimated)"
      @input="changeRenewableKiloWattInstalled"
    />
  </v-col>
</template>
<script lang="ts">
import { countryIrradianceKeys } from "@/components/green_house_gaz/energy/computeCO2cost";
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  computeKWHPerYearPerCountry,
  computeKWInstalledWithKwhPerYearPerCountry,
} from "./computeCO2cost";

@Component
export default class RenewableEnergy extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;
  @Prop({ type: String, required: true, default: "" })
  readonly countryCode!: countryIrradianceKeys;
  @Prop({ type: String, required: true, default: "" })
  readonly irradiance!: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly authorizedReverse!: boolean;

  rules: Rule[] = [checkRequired];

  public get localFacility(): Facility {
    return this.facility;
  }

  public set localFacility(value: Facility) {
    this.$emit("update:facility", value);
  }
  public changeRenewableKiloWattInstalled(value: string): void {
    const _temp: number = parseFloat(value || "0");
    const change = {
      ...this.localFacility,
      renewablePower: _temp,
    };
    change.renewableKiloWattInstalled =
      computeKWInstalledWithKwhPerYearPerCountry(
        _temp,
        this.countryCode,
        this.irradiance
      );
    this.localFacility = change;
  }
  public changeRenewablePower(value: string): void {
    const _temp: number = parseFloat(value || "0");

    const change = {
      ...this.localFacility,
      renewableKiloWattInstalled: _temp,
    };
    change.renewablePower = computeKWHPerYearPerCountry(
      _temp,
      this.countryCode,
      this.irradiance
    );
    this.localFacility = change;
  }
}
</script>
