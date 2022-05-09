<template>
  <v-container v-if="titleKey" fluid>
    <v-row>
      <v-col>
        <h2 class="text-h4 project-shelter__h3 font-weight-medium">
          {{ infoTooltipText[titleKey].title }}
        </h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="col-auto d-flex align-center">
        <info-tooltip>
          {{ infoTooltipText[titleKey].text }}
        </info-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        NOTE: This module of the Assessment Tool is under development
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

  infoTooltipText = infoTooltipText;
}
</script>

<style></style>
