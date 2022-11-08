<template>
  <div style="display: contents">
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        :value="facility.dieselLiters"
        type="number"
        required
        :rules="rules"
        :min="0"
        :disabled="facility.disableDieselLiters"
        label="Total litres of diesel used"
        @input="changeDieselLiters"
      />
    </v-col>
    <v-col cols="12">
      <v-row>
        <!-- flex + align-items: center; -->
        <v-col class="d-flex align-center">
          I don't know Total of Litres used
        </v-col>
        <v-col>
          <!--     margin: 0px; padding: 0px; -->
          <v-simple-checkbox
            :value="facility.disableDieselLiters"
            class="pa-0 ma-0"
            hide-details
            @input="resetDieselLiters"
          >
          </v-simple-checkbox>
        </v-col>
      </v-row>
      <v-row v-if="facility.disableDieselLiters">
        <v-col>
          <v-text-field
            :value="facility.generatorSize"
            type="number"
            required
            :rules="rules"
            :min="0"
            label="generator size (kW)"
            @input="changeGeneratorSize"
          />
        </v-col>
        <v-col>
          <v-text-field
            :value="facility.operatingHours"
            type="number"
            required
            :rules="rules"
            :min="0"
            label="operating hours (hrs/yr)"
            @input="changeOperatingHours"
        /></v-col>
        <v-col>
          <v-text-field
            :value="facility.generatorLoad"
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
  </div>
</template>
<script lang="ts">
import { computeLitresDiesel } from "@/components/green_house_gaz/energy/computeCO2cost";
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
})
export default class DieselGenerators extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  ghgMapRef!: ItemReferencesMap;

  rules: Rule[] = [checkRequired];

  public changeDieselLiters(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const dieselLiters: number = parseFloat(value || "0");
    this.$emit("update:facility", { ...this.facility, dieselLiters });
  }

  public changeGeneratorSize(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");
    this.$emit("update:facility", {
      ...this.facility,
      generatorSize: _temp,
      dieselLiters: computeLitresDiesel(
        _temp,
        this.facility.operatingHours,
        this.facility.generatorLoad
      ),
    });
  }
  public changeOperatingHours(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");

    this.$emit("update:facility", {
      ...this.facility,
      operatingHours: _temp,
      dieselLiters: computeLitresDiesel(
        this.facility.generatorSize,
        _temp,
        this.facility.generatorLoad
      ),
    });
  }
  public changeGeneratorLoad(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");

    this.$emit("update:facility", {
      ...this.facility,
      generatorLoad: _temp,
      dieselLiters: computeLitresDiesel(
        this.facility.generatorSize,
        this.facility.operatingHours,
        _temp
      ),
    });
  }

  public resetDieselLiters(value: boolean): void {
    if (value) {
      this.$emit("update:facility", {
        ...this.facility,
        dieselLiters: 0,
        disableDieselLiters: true,
      });
    } else {
      this.$emit("update:facility", {
        ...this.facility,
        generatorSize: 0,
        operatingHours: 0,
        disableDieselLiters: false,
      });
    }
  }
}
</script>
