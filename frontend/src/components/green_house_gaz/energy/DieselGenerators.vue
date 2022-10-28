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
          I don't know Total of Liters used
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
      </v-row>
    </v-col>
  </div>
</template>
<script lang="ts">
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
    const dieselLiters =
      _temp * this.facility.operatingHours * this.ghgMapRef?.REF_DIES_GEN.value;
    this.$emit("update:facility", {
      ...this.facility,
      generatorSize: _temp,
      dieselLiters,
    });
  }
  public changeOperatingHours(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const _temp: number = parseFloat(value || "0");
    const dieselLiters =
      _temp * this.facility.generatorSize * this.ghgMapRef?.REF_DIES_GEN.value;
    this.$emit("update:facility", {
      ...this.facility,
      operatingHours: _temp,
      dieselLiters,
    });
  }

  public resetDieselLiters(value: boolean): void {
    console.log(value);
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
