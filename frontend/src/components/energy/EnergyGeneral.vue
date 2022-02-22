<template>
  <v-card>
    <v-card-text>
      <v-form ref="form" v-model="formValid" lazy-validation>
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
                v-bind="item"
              ></form-item-component>
            </v-col>
          </template>
        </v-row>
      </v-form>
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
import { VForm } from "@/utils/vuetify";
import { cloneDeep, isEqual } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyGeneral extends Vue {
  @Prop({ type: Object as () => GeneralModule })
  readonly initialModule: GeneralModule | undefined;
  @Ref()
  readonly form!: VForm;

  formValid = true;
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
          label: "Latitude of the camp",
          unit: "Decimal Degrees",
        },
        {
          type: "number",
          key: "locationLongitude",
          label: "Longitude of the camp",
          unit: "Decimal Degrees",
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
          label: "In what year will it be removed?",
          hidden: !this.module.temporary,
        },
        {
          type: "select",
          key: "integration",
          label: "In what extent is it integrated with the host community?",
          options: [
            {
              text: "Well integrated",
              value: "well",
            },
            {
              text: "Moderatly integrated",
              value: "moderately",
            },
            {
              text: "Badly integrated",
              value: "badly",
            },
          ],
          hidden: this.module.temporary,
        },
      ],
      [
        {
          type: "text",
          key: "electricityCompanyName",
          label: "Electricity company name",
        },
        {
          type: "boolean",
          key: "publicGridConnection",
          label: "Connected to the public grid",
        },
        {
          type: "number",
          key: "publicGridDomesticRate",
          label: "Domestic customers rate",
          unit: `${this.module.currency}/kWh`,
          hidden: !this.module.publicGridConnection,
        },
        {
          type: "number",
          key: "publicGridDistance",
          label: "How far is the camp from the public grid?",
          unit: "m",
          hidden: !this.module.publicGridConnection,
        },
        {
          type: "boolean",
          key: "networkExtension",
          label:
            "Does the electricity company envisage to extend its network in the framework of the electricity programme?",
          hidden: this.module.publicGridConnection,
        },
      ],
    ];
  }

  get saveDisabled(): boolean {
    return !this.formValid || isEqual(this.initialModule, this.module);
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

      currency: "",
    };
  }

  @Watch("initialModule")
  onInitialModuleChanged(): void {
    if (this.initialModule) {
      this.module = cloneDeep(this.initialModule);
    }
  }

  save(): void {
    if (this.form.validate()) {
      this.$emit("save", this.module);
    }
  }
}
</script>
