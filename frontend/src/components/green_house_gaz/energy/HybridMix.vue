<template>
  <div class="content-wrapper">
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        :value="facility.dieselLiters"
        type="number"
        required
        :rules="rules"
        :min="0"
        label="Litres of diesel used"
        @input="changeDieselLiters"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        :value="facility.gridPower"
        type="number"
        required
        :rules="rules"
        :min="0"
        label="kWh used (national grid)"
        @input="changeGridPower"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        :value="facility.renewablePower"
        type="number"
        required
        :rules="rules"
        :min="0"
        label="kWh used (renewable sources)"
        @input="changeRenewablePower"
      />
    </v-col>
  </div>
</template>
<script lang="ts">
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NationalGrid extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  rules: Rule[] = [checkRequired];
  public changeDieselLiters(value: string): void {
    const dieselLiters: number = parseFloat(value || "0");
    this.$emit("update:facility", { ...this.facility, dieselLiters });
  }
  public changeGridPower(value: string): void {
    const gridPower: number = parseFloat(value || "0");
    this.$emit("update:facility", { ...this.facility, gridPower });
  }
  public changeRenewablePower(value: string): void {
    const renewablePower: number = parseFloat(value || "0");
    this.$emit("update:facility", { ...this.facility, renewablePower });
  }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: contents;
}
</style>
