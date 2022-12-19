<template>
  <div style="display: contents">
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        :value="localFacility.dieselLiters"
        type="number"
        required
        :rules="rules"
        :min="0"
        :disabled="localFacility.disableDieselLiters"
        label="Total litres of diesel used per year"
        @input="changeDieselLiters"
      />
    </v-col>
    <diesel-generator-without-litres :facility.sync="localFacility" />
  </div>
</template>
<script lang="ts">
import DieselGeneratorWithoutLitres from "@/components/green_house_gaz/energy/DieselGeneratorWithoutLitres.vue";
import { Facility } from "@/components/green_house_gaz/energy/Facility";
import { ItemReferencesMap } from "@/store/GhgReferenceModule";
import { checkRequired, Rule } from "@/utils/rules";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgReferenceModule", ["ghgMapRef"]),
  },
  components: {
    DieselGeneratorWithoutLitres,
  },
})
export default class DieselGenerators extends Vue {
  @Prop({ type: Object, required: true, default: () => ({}) })
  facility!: Facility;

  ghgMapRef!: ItemReferencesMap;

  rules: Rule[] = [checkRequired];

  public get localFacility(): Facility {
    return this.facility;
  }

  public set localFacility(value: Facility) {
    this.$emit("update:facility", value);
  }

  public changeDieselLiters(value: string): void {
    // we cast with parseFloat because the we use the @change and not the v-model number modifier
    const dieselLiters: number = parseFloat(value || "0");
    this.localFacility = { ...this.facility, dieselLiters };
  }
}
</script>
