<template>
  <v-col cols="12" sm="6" md="6">
    <v-text-field
      :value="facility.dieselLiters"
      type="number"
      required
      :rules="rules"
      :min="0"
      label="Litres of diesel used per year"
      @input="changeDieselLiters"
    />
  </v-col>
</template>
<script lang="ts">
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DieselGenerators extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  rules: Rule[] = [checkRequired];
  public changeDieselLiters(value: string): void {
    const dieselLiters: number = parseFloat(value || "0");
    this.$emit("update:facility", { ...this.facility, dieselLiters });
  }
}
</script>
