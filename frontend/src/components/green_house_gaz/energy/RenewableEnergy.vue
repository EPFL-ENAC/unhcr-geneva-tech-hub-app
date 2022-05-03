<template>
  <v-col cols="12" sm="6" md="6">
    <v-text-field
      :value="facility.renewablePower"
      type="number"
      required
      :rules="rules"
      :min="0"
      label="Total kWh consumed this year"
      @input="changeRenewablePower"
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

  rules: Rule[] = [checkRequired];
  public changeRenewablePower(value: string): void {
    const renewablePower: number = parseFloat(value || "0");
    this.$emit("update:facility", { ...this.facility, renewablePower });
  }
}
</script>
