<template>
  <v-card>
    <v-card-text>
      <v-row v-for="(rowItem, index) in formItems" :key="index">
        <template v-for="(item, index) in rowItem">
          <v-col
            v-if="!item.hidden"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <form-item-component
              v-model="module[item.key]"
              :label="item.label"
              :type="item.type"
              :options="item.options"
            ></form-item-component>
          </v-col>
        </template>
      </v-row>
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
import FormItemComponent, {
  FormItem,
} from "@/components/commons/FormItemComponent.vue";
import { GeneralModule } from "@/models/energyModel";
import { cloneDeep, isEqual } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyGeneral extends Vue {
  @Prop({ type: Object as () => GeneralModule })
  readonly initialModule: GeneralModule | undefined;

  module: GeneralModule = EnergyGeneral.getDefaultModule();

  get formItems(): FormItem[][] {
    return [
      [
        {
          type: "number",
          key: "year",
          label: "Year of the data",
        },
        {
          type: "text",
          key: "name",
          label: "Name of the camp",
        },
      ],
      [
        {
          type: "number",
          key: "locationLatitude",
          label: "Latitude of the camp [Decimal Degrees]",
        },
        {
          type: "number",
          key: "locationLongitude",
          label: "Longitude of the camp [Decimal Degrees]",
        },
      ],
      [
        {
          type: "boolean",
          key: "temporary",
          label: "Is the camp temporary?",
          options: {
            true: "Yes, temporary",
            false: "No, permanent",
          },
        },
        {
          type: "number",
          key: "expirationYear",
          label: "In case of temporary camp, in what year will it be removed?",
          hidden: !this.module.temporary,
        },
      ],
    ];
  }

  get saveDisabled(): boolean {
    return isEqual(this.initialModule, this.module);
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
      this.module = cloneDeep(this.initialModule);
    }
  }

  save(): void {
    this.$emit("save", this.module);
  }
}
</script>
