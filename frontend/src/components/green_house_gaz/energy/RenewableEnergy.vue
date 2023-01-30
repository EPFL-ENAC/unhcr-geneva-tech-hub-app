<template>
  <v-col cols="12" sm="6" md="6">
    <v-text-field
      :value="facility.renewablePower"
      type="number"
      required
      :rules="rules"
      :min="0"
      label="Total kW of solar installed"
      @input="changeRenewablePower"
    />
    <v-text-field
      :value="4455"
      disabled
      suffix="kWh/yr"
      label="Total kWh/yr produced (estimated)"
    />
  </v-col>
</template>
<script lang="ts">
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class RenewableEnergy extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  // TODO: finish link with database
  rules: Rule[] = [checkRequired];
  public changeRenewablePower(value: string): void {
    const renewablePower: number = parseFloat(value || "0");
    this.$emit("update:facility", { ...this.facility, renewablePower });
  }
}
</script>
