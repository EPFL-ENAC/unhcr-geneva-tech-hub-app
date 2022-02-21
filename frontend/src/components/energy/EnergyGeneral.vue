<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col v-bind="colBind">
          <v-text-field
            v-model="module.year"
            label="Year of the data"
            hide-details="auto"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col v-bind="colBind">
          <v-text-field
            v-model="module.name"
            label="Name of the camp"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-bind="colBind">
          <v-text-field
            v-model="module.locationLatitude"
            label="Latitude of the camp [Decimal Degrees]"
            hide-details="auto"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col v-bind="colBind">
          <v-text-field
            v-model="module.locationLongitude"
            label="Longitude of the camp [Decimal Degrees]"
            hide-details="auto"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-bind="colBind">
          <v-select
            v-model="module.temporary"
            :items="temporaryItems"
            label="Is the camp temporary?"
            hide-details="auto"
          ></v-select>
        </v-col>
        <v-col v-bind="colBind">
          <v-text-field
            v-if="module.temporary"
            v-model="module.expirationYear"
            label="In case of temporary camp, in what year will it be removed?"
            hide-details="auto"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :disabled="saveDisabled" @click="save">
        <v-icon left>mdi-check</v-icon>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { GeneralModule } from "@/models/energyModel";
import { SelectItemObject } from "@/utils/vuetify";
import _ from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class EnergyGeneral extends Vue {
  readonly colBind = {
    cols: 12,
    sm: 6,
    md: 4,
    lg: 3,
    xl: 2,
  };
  readonly temporaryItems: SelectItemObject<string, boolean>[] = [
    { text: "Yes, temporary", value: true },
    { text: "No, permanent", value: false },
  ];

  @Prop({ type: Object as () => GeneralModule })
  readonly initialModule: GeneralModule | undefined;

  module: GeneralModule = EnergyGeneral.getDefaultModule();

  get saveDisabled(): boolean {
    return _.isEqual(this.initialModule, this.module);
  }

  static getDefaultModule(): GeneralModule {
    const currentYear = new Date().getFullYear();
    return {
      year: currentYear,
      name: "",
      locationLatitude: 0,
      locationLongitude: 0,
      temporary: false,
      expirationYear: currentYear,
      electricityCompanyName: "",
      publicGridConnection: false,
      publicGridDomesticRate: 0,
      publicGridDistance: 0,
    };
  }

  @Watch("initialModule")
  onInitialModuleChanged(): void {
    if (this.initialModule) {
      this.module = _.cloneDeep(this.initialModule);
    }
  }

  save(): void {
    this.$emit("save", this.module);
  }
}
</script>
