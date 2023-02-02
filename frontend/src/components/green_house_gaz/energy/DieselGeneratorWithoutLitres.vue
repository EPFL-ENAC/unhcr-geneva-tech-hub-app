<template>
  <v-col cols="12">
    <v-row>
      <!-- flex + align-items: center; -->
      <v-col class="d-flex align-center">
        {{ selectText }}
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
        >
          <template #prepend>
            <info-tooltip> read from nameplate </info-tooltip>
          </template>
        </v-text-field>
      </v-col>
      <v-col :cols="12">
        <v-text-field
          :value="localFacility.operatingHours"
          type="number"
          required
          :rules="rules"
          :min="0"
          label="operating hours (hrs/week)"
          @input="changeOperatingHours"
        >
          <template #prepend>
            <info-tooltip>
              from daily log and application will extrapolate this information
              to be annual
            </info-tooltip>
          </template>
        </v-text-field></v-col
      >
      <v-col :cols="12">
        <v-text-field
          :value="localFacility.generatorLoad"
          required
          :rules="rules"
          suffix="%"
          type="number"
          min="0"
          max="100"
          step="10"
          label="generator load (percentage)"
          @input="changeGeneratorLoad"
        >
          <template #prepend>
            <info-tooltip>
              default average load of 60% per year will be used if not
              overwritten
            </info-tooltip>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-col>
</template>
<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { computeLitresDiesel } from "@/components/green_house_gaz/energy/computeCO2cost";
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    InfoTooltip,
  },
})
export default class DieselGenerators extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  @Prop({
    type: String,
    required: false,
    default: "I don't know total litres of diesel used",
  })
  selectText!: string;

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
    const change = {
      ...this.localFacility,
      generatorSize: _temp,
    };
    change.dieselLiters = computeLitresDiesel(change);
    this.localFacility = change;
  }
  public changeOperatingHours(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");

    const change = {
      ...this.localFacility,
      operatingHours: _temp,
    };
    change.dieselLiters = computeLitresDiesel(change);
    this.localFacility = change;
  }
  public changeGeneratorLoad(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");

    const change = {
      ...this.localFacility,
      generatorLoad: _temp,
    };
    change.dieselLiters = computeLitresDiesel(change);
    this.localFacility = change;
  }

  public resetDieselLiters(value: boolean): void {
    if (value) {
      this.localFacility = {
        ...this.localFacility,
        dieselLiters: 0,
        generatorLoad: 60,
        disableDieselLiters: true,
      };
    } else {
      this.localFacility = {
        ...this.localFacility,
        generatorSize: 0,
        operatingHours: 0,
        dieselLiters: 0,
        generatorLoad: 60,
        disableDieselLiters: false,
      };
    }
  }
}
</script>
