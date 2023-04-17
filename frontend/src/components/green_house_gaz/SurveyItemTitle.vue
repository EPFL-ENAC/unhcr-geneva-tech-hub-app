<template>
  <v-container v-if="titleKey" fluid>
    <v-row>
      <v-col class="d-flex">
        <h2 class="text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[titleKey].title }}
        </h2>
        <info-tooltip>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="infoTooltipText[titleKey].text"></p>
        </info-tooltip>
      </v-col>
    </v-row>
    <v-row v-if="disabled">
      <v-col>
        <v-tooltip bottom>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span> {{ disabledText }} </span>
          <template #activator="{ on }">
            <v-alert type="warning" v-on="on">
              <i> <span v-text="disabledTitle"></span></i>
            </v-alert>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row v-if="!infoTooltipText[titleKey].ready">
      <v-col>
        <v-alert type="warning">
          <i
            ><v-icon>$mdiWrench</v-icon> This module of the Assessment Tool is
            under development</i
          >
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/green_house_gaz/infoTooltipText";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "SurveyItemTitle",
  components: {
    InfoTooltip,
  },
})
export default class SurveyItemTitle extends Vue {
  @Prop({ type: String, default: "", required: true })
  readonly titleKey!: string;
  @Prop({
    type: String,
    default:
      "This module is disabled because some fields are missing in 'Information Tab'",
    required: false,
  })
  readonly disabledText!: string;

  @Prop({
    type: String,
    default: "This module is disabled",

    required: false,
  })
  readonly disabledTitle!: string;

  @Prop({ type: Boolean, default: false, required: false })
  readonly disabled!: boolean;

  infoTooltipText = infoTooltipText;
}
</script>

<style></style>
