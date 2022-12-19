<template>
  <div class="content-wrapper">
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        :value="localFacility.dieselLiters"
        type="number"
        required
        :rules="rules"
        :min="0"
        :disabled="localFacility.disableDieselLiters"
        label="Litres of diesel used per year"
        @input="changeDieselLiters"
      />
    </v-col>
    <diesel-generator-without-litres :facility.sync="localFacility" />
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        :value="localFacility.gridPower"
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
        :value="localFacility.renewablePower"
        type="number"
        required
        :rules="rules"
        :min="0"
        label="Total kW of solar installed per year"
        @input="changeRenewablePower"
      />
    </v-col>
  </div>
</template>
<script lang="ts">
import DieselGeneratorWithoutLitres from "@/components/green_house_gaz/energy/DieselGeneratorWithoutLitres.vue";
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    DieselGeneratorWithoutLitres,
  },
})
export default class NationalGrid extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  rules: Rule[] = [checkRequired];

  public get localFacility(): Facility {
    return this.facility;
  }

  public set localFacility(value: Facility) {
    this.$emit("update:facility", value);
  }

  public changeDieselLiters(value: string): void {
    const dieselLiters: number = parseFloat(value || "0");
    this.localFacility = { ...this.facility, dieselLiters };
  }
  public changeGridPower(value: string): void {
    const gridPower: number = parseFloat(value || "0");
    this.localFacility = { ...this.facility, gridPower };
  }
  public changeRenewablePower(value: string): void {
    const renewablePower: number = parseFloat(value || "0");
    this.localFacility = { ...this.facility, renewablePower };
  }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: contents;
}
</style>
